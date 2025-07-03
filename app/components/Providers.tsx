"use client"
import { ImageKitProvider} from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import toast from "react-hot-toast";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

if (!urlEndpoint || !publicKey) {
  throw new Error("ImageKit environment variables are missing!");
}

export default function Providers({children} :{children : React.ReactNode}) {
    const authenticator = async () => {
        try {
          const response = await fetch("/api/imagekit-auth");
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
          }
      
          const data = await response.json();
          const { signature, expire, token } = data;
          return { signature, expire, token };
        } catch (error:any) {
          toast.error(error.message || "imagekit authentication request failed");
          throw new Error(`ImageKit Authentication request failed`);
        }
      };
  return (
    <SessionProvider>
      <ImageKitProvider 
      urlEndpoint={urlEndpoint} 
      publicKey={publicKey} 
      authenticator={authenticator}
      >
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
}