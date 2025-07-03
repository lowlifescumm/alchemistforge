import React, { useState, useEffect } from 'react';
import { useGameState, useGameDispatch } from '../hooks/useGameState.tsx';
import { ELEMENT_ICONS } from '../constants.tsx';

interface ElementGeneratorProps {
  name: string;
}

export const ElementGenerator: React.FC<ElementGeneratorProps> = ({ name }) => {
  const { elements, aetherCrystals } = useGameState();
  const dispatch = useGameDispatch();
  const [progress, setProgress] = useState(0);

  const generationTime = 5000; // 5 seconds
  const boostCost = 10;
  
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'ADD_ELEMENT', payload: { name, amount: 1 } });
    }, generationTime);

    return () => clearInterval(interval);
  }, [dispatch, name]);

  useEffect(() => {
     const progressInterval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 100 / (generationTime / 100)));
     }, 100);
     return () => clearInterval(progressInterval);
  }, [elements[name]]);


  const handleBoost = () => {
    if (aetherCrystals >= boostCost) {
      dispatch({ type: 'SPEND_CRYSTALS', payload: boostCost });
      dispatch({ type: 'ADD_ELEMENT', payload: { name, amount: 10 } });
    } else {
      alert("Not enough Aether Crystals!");
    }
  };

  const Icon = ELEMENT_ICONS[name] || ELEMENT_ICONS['Default'];

  return (
    <div className="bg-gray-900/70 p-3 rounded-lg border border-gray-700 flex items-center justify-between relative overflow-hidden">
      <div className="absolute bottom-0 left-0 h-full bg-purple-600/20" style={{width: `${progress}%`, transition: 'width 0.1s linear'}}></div>
      <div className="flex items-center space-x-3 z-10">
        <div className="bg-gray-800 p-2 rounded-md"><Icon /></div>
        <span className="font-bold text-lg">{name}</span>
      </div>
      <div className="flex items-center space-x-4 z-10">
        <span className="text-xl font-mono bg-gray-800 px-3 py-1 rounded-md">{elements[name] || 0}</span>
        <button 
          onClick={handleBoost}
          className="bg-purple-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          disabled={aetherCrystals < boostCost}
          title={`Cost: ${boostCost} Aether`}
        >
          +10
        </button>
      </div>
    </div>
  );
};