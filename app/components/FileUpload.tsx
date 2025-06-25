"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
    onSuccess : (res : IKUploadResponse) => void 
    onProgress? : (progress : number) => void ;
    fileType ? : "image" | "video"
}

export default function FileUpload({onSuccess,onProgress,fileType} :FileUploadProps) {
    let [uploading,setUploading] = useState(false);
    let [error,setError] = useState<string | null>(null)

    const validateFile = (file : File)=>{
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError('Please Upload Video File')
                return false;
            }

            if(file.size > 100 * 1024 * 1024){
                setError("Video must be less than 100 MB")
                return false;
            }
        } else {
            let validTypes = ["image/png" , "image/jpeg","image/webP","image/jpg"]
            if(!validTypes.includes(file.type)){
                setError("please upload valid file type (jpg ,jpeg , png , webP)");
                return false;
            }

            if(file.size > 5 * 1024 * 1024){
                setError("please upload image file less than 5 MB")
                return false;
            }
        }
       return true;
       
    }

    const onError = (err : {message : string}) => {
        console.log("Error", err);
        setUploading(false);
        setError(err.message);
      };
      
      const handleSuccess = (response : IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false);
        setError(null);
        onSuccess(response)
      };
      
      const handleUploadProgress = (evt : ProgressEvent) => {
         if(evt.lengthComputable && onProgress){
            const percentComplete = (evt.loaded /evt.total) * 100 ;
            onProgress(Math.round(percentComplete))
         }
      };
      
      const handleUploadStart = () => {
          setUploading(true);
          setError(null)
      };
  return (
    <div className="App">
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleUploadProgress}
          onUploadStart={handleUploadStart}
          folder={fileType === "video" ? "/videos" : "/images"}
        />
        {
            uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4"/>
                    <span>uploading...</span>
                </div>
            )
        }
    </div>
  );
}