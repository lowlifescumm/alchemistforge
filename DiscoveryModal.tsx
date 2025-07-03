
import React from 'react';
import type { Item } from '../types.tsx';
import { ItemCard } from './ItemCard.tsx';
import { RARITY_COLORS } from '../constants.tsx';

interface DiscoveryModalProps {
  discovery: {
    item: Item;
    isSuccess: boolean;
    reason?: string;
  };
  onClose: () => void;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ discovery, onClose }) => {
  const { item, isSuccess, reason } = discovery;
  
  const rarityClass = RARITY_COLORS[item.rarity] || 'border-gray-500';
  const headerText = isSuccess ? 'Discovery!' : 'Failure!';
  const headerColor = isSuccess ? 'text-amber-400' : 'text-red-500';

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`bg-gray-800 rounded-2xl border-2 ${rarityClass} w-full max-w-md m-4 shadow-2xl shadow-purple-900/50 transform animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <h2 className={`font-cinzel text-4xl font-bold mb-4 ${headerColor}`}>{headerText}</h2>
          
          {isSuccess ? (
            <>
              <p className="text-gray-300 mb-6">You have created something new!</p>
              <div className="scale-110">
                 <ItemCard item={item} />
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-300 mb-6">{reason}</p>
              <div className="opacity-60">
                 <ItemCard item={item} />
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="mt-8 bg-purple-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-purple-500 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
