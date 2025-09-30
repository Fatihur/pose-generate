
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
      <div className="flex flex-col items-center justify-center text-center text-gray-400">
        <SpinnerIcon className="w-12 h-12" />
        <p className="mt-4 text-lg animate-pulse">AI is creating your masterpiece...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
        <h3 className="font-bold text-lg">Generation Failed</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
        <img src={generatedImage} alt="Generated" className="max-w-full max-h-[80%] object-contain rounded-lg shadow-2xl" />
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
      <p>Upload a photo and select your desired options to begin.</p>
    </div>
  );
};

export default GeneratedImage;
