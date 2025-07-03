import { NextAuthOptions } from "next-auth";
import User from "@/models/User";
import { connectToDatabase } from "./db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google";



export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture, // this is the profile pic URL from Google
                };
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing Email or Password");
                }

                try {
                    await connectToDatabase();

                    let user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        throw new Error("Invalid Password");
                    }


                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    throw error;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user,profile }) {
            await connectToDatabase();

            // If user exists in token but not created in DB (Google login)
            if (user) {
                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    const newUser = new User({
                        email: user.email,
                        name : user.name,
                        username: user.email.split('@')[0], // or any logic
                        userProfileUrl: profile?.image?.includes("googleusercontent.com")? `${profile.image}=s96-c`: profile?.image || "",
                        password: "",                     
                    });

                await newUser.save();
                token.id = newUser._id.toString();
            } else {
                token.id = existingUser._id.toString();
            }
        }

            return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string;
        }
        return session;
    }
},
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
secret: process.env.NEXTAUTH_SECRET
}