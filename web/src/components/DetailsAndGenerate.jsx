import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function DetailsAndGenerate({ onGenerate, generating }) {
  const [details, setDetails] = useState("");

  return (
    <div className="w-full flex flex-col items-center mt-10 relative">
      {/* Overlay while loading */}
      {generating && (
        <div className="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center rounded-xl">
          <svg className="animate-spin h-10 w-10 text-pink-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-pink-600 font-semibold">Generating UI...</span>
        </div>
      )}
      <label className="w-full mb-4">
        <span className="block text-md font-medium mb-2 text-gray-700">Any other details you want to add? <span className="text-gray-400">(optional)</span></span>
        <textarea
          className="w-full min-h-[80px] max-h-[200px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 resize-vertical shadow"
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Describe anything else you'd like to mention..."
          disabled={generating}
          style={generating ? { opacity: 0.6, pointerEvents: 'none' } : {}}
        />
      </label>
      <button
        type="button"
        onClick={() => onGenerate(details)}
        className={`mt-4 flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-300 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-200 ${generating ? 'opacity-60 cursor-not-allowed' : 'animate-pulse'}`}
        disabled={generating}
      >
        {generating ? (
          <>
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 text-white drop-shadow-glow animate-spin-slow" />
            Generate UI
          </>
        )}
      </button>
    </div>
  );
}

