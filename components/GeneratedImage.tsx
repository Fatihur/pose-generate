import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface GeneratedImageProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ generatedImage, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500">
        <SpinnerIcon className="w-12 h-12 text-indigo-500" />
        <p className="mt-4 text-lg animate-pulse">AI is creating your masterpiece...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg w-full">
        <h3 className="font-bold text-lg">Generation Failed</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-full p-2 border bg-gray-100 rounded-lg">
           <img src={generatedImage} alt="Generated" className="w-full h-auto max-h-[450px] object-contain rounded-md" />
        </div>
        <a
          href={generatedImage}
          download="generated-pose.png"
          className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
        >
          <DownloadIcon />
          Download
        </a>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      <h3 className="text-xl font-semibold">Your Generated Image Will Appear Here</h3>
      <p className="mt-1">Upload a photo and select your desired options to begin.</p>
    </div>
  );
};

export default GeneratedImage;