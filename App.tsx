
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { POSES, EXPRESSIONS } from './constants';
import type { Option } from './types';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import GeneratedImage from './components/GeneratedImage';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<Option | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<Option | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File, url: string) => {
    setUploadedFile(file);
    setPreviewUrl(url);
    setGeneratedImage(null);
    setError(null);
  };
  
  const handleGenerate = useCallback(async () => {
    if (!uploadedFile || !selectedPose || !selectedExpression) {
      setError("Please upload an image and select a pose and expression.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const base64Image = await fileToBase64(uploadedFile);
      const mimeType = uploadedFile.type;
      
      const prompt = `Based on the provided image, regenerate it to show the person with a new pose: '${selectedPose.label}' (${selectedPose.value}), and a new facial expression: '${selectedExpression.label}' (${selectedExpression.value}). Maintain the person's identity, clothing, and background as closely as possible to the original image.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageData = part.inlineData.data;
          setGeneratedImage(`data:${part.inlineData.mimeType};base64,${base64ImageData}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("AI did not return an image. Please try a different combination.");
      }

    } catch (e: any) {
      console.error(e);
      setError(`An error occurred: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, selectedPose, selectedExpression]);

  const isGenerateButtonDisabled = !uploadedFile || !selectedPose || !selectedExpression || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Pose & Expression Generator
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Transform your photos with new poses and expressions instantly.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-indigo-400">1. Upload Your Photo</h2>
              <ImageUploader onFileSelect={handleFileSelect} previewUrl={previewUrl} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-indigo-400">2. Select a Pose</h2>
              <OptionSelector 
                options={POSES}
                selectedOption={selectedPose}
                onSelect={setSelectedPose}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-indigo-400">3. Select an Expression</h2>
              <OptionSelector 
                options={EXPRESSIONS}
                selectedOption={selectedExpression}
                onSelect={setSelectedExpression}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerateButtonDisabled}
              className={`w-full flex items-center justify-center py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out
                ${isGenerateButtonDisabled 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transform hover:scale-105'
                }`}
            >
              {isLoading && <SpinnerIcon />}
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[400px] lg:min-h-full">
            <GeneratedImage
              generatedImage={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
            <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
