import { DefaultSession } from "next-auth";
import { strict } from "node:assert";

declare module "next-auth" {
    interface Session {
        user : {
            id : string;
        } & DefaultSession["user"]
    }
}
