'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, X } from 'lucide-react';
import { clsx } from 'clsx';

interface VideoUploaderProps {
    onUpload: (file: File) => void;
    onClear: () => void;
    selectedFile: File | null;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onUpload, onClear, selectedFile }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            onUpload(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.webm', '.mov']
        },
        multiple: false
    });

    const clear = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        onClear();
    };

    if (selectedFile) {
        return (
            <div className="relative group border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 aspect-video flex items-center justify-center">
                {preview ? (
                    <video src={preview} className="w-full h-full object-contain" controls={false} muted loop autoPlay />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                        <Video className="w-12 h-12" />
                        <span className="text-sm">{selectedFile.name}</span>
                    </div>
                )}
                <button
                    onClick={clear}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500/50 rounded-full text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={clsx(
                "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer aspect-video",
                isDragActive ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-500"
            )}
        >
            <input {...getInputProps()} />
            <div className="p-4 bg-zinc-800/50 rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
            </div>
            <div className="text-center">
                <p className="text-lg font-medium text-zinc-200">
                    {isDragActive ? "Drop the video here" : "Drag & drop a video"}
                </p>
                <p className="text-sm mt-1">
                    MP4, WebM or MOV (max 100MB)
                </p>
            </div>
        </div>
    );
};
