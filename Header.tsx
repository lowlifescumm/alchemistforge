import React from 'react';
import { useGameState } from '../hooks/useGameState.tsx';
import { SparklesIcon } from './icons/SparklesIcon.tsx';
import { FlaskIcon } from './icons/FlaskIcon.tsx';

export const Header: React.FC = () => {
  const { aetherCrystals } = useGameState();

  return (
    <header className="flex justify-between items-center w-full p-4 bg-gray-800/30 border-b-2 border-purple-800 rounded-lg">
      <div className="flex items-center space-x-3">
        <FlaskIcon className="w-10 h-10 text-purple-400" />
        <h1 className="text-3xl font-bold font-cinzel text-gray-100">AI Alchemist's Forge</h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-purple-900/50 px-4 py-2 rounded-full border border-purple-700">
          <SparklesIcon className="w-6 h-6 text-amber-300" />
          <span className="text-lg font-bold text-white">{aetherCrystals}</span>
          <span className="text-sm text-gray-400">Aether</span>
        </div>
        <button className="bg-amber-500 text-gray-900 font-bold px-4 py-2 rounded-full hover:bg-amber-400 transition-colors duration-200 text-sm">
          Get More
        </button>
      </div>
    </header>
  );
};