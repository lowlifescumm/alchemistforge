
import React, { useState, useCallback, useEffect } from 'react';
import type { Item } from '../types.tsx';
import { useGameDispatch } from '../hooks/useGameState.tsx';
import { transmuteItems, generateItemImage } from '../services/alchemyService.tsx';
import { ItemCard } from './ItemCard.tsx';
import { CubeIcon } from './icons/CubeIcon.tsx';

const Slot: React.FC<{ item: Item | null, onDrop: (item: Item) => void, onClear: () => void, isOver: boolean }> = ({ item, onDrop, onClear, isOver }) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData("application/json");
    if (itemData) {
      onDrop(JSON.parse(itemData));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative w-48 h-24 rounded-lg border-2 border-dashed transition-all duration-300 ${isOver ? 'border-purple-500 bg-purple-900/50' : 'border-gray-600 bg-gray-800/50'}`}
    >
      {item ? (
        <>
            <ItemCard item={item} />
            <button onClick={onClear} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white font-bold text-sm hover:bg-red-500 transition-colors">&times;</button>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <CubeIcon className="w-8 h-8 mr-2"/>
          Drop Item
        </div>
      )}
    </div>
  );
};


export const TransmutationCircle: React.FC = () => {
  const [item1, setItem1] = useState<Item | null>(null);
  const [item2, setItem2] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  
  const dispatch = useGameDispatch();

  const handleTransmute = async () => {
    if (!item1 || !item2) return;
    setIsLoading(true);
    setError(null);
    dispatch({ type: 'SET_LAST_DISCOVERY', payload: null });
    
    // Optimistic consumption - can be reverted if API fails
    // dispatch({ type: 'CONSUME_ITEMS', payload: [item1.id, item2.id] });

    const result = await transmuteItems(item1, item2);
    
    if (result.success && result.newItem) {
      const newItem: Item = {
        id: `item_${Date.now()}_${result.newItem.name.replace(/\s+/g, '')}`,
        ...result.newItem,
        isNew: true,
        icon: 'Default', // placeholder
      };
      
      dispatch({ type: 'ADD_ITEM', payload: newItem });
      dispatch({ type: 'SET_LAST_DISCOVERY', payload: { item: newItem, isSuccess: true } });

      // Generate image in the background
      generateItemImage(newItem).then(iconUrl => {
        if(iconUrl){
            dispatch({ type: 'UPDATE_ITEM_ICON', payload: { itemId: newItem.id, iconUrl }});
        }
      });

    } else {
       const failureItem: Item = { id: 'failure', name: 'Failure', description: result.failureReason || "Unknown failure", rarity: 'Common', isNew: false, icon: 'Default' };
       dispatch({ type: 'SET_LAST_DISCOVERY', payload: { item: failureItem, isSuccess: false, reason: result.failureReason } });
    }

    setItem1(null);
    setItem2(null);
    setIsLoading(false);
  };
  
  const handleDrop = (setter: React.Dispatch<React.SetStateAction<Item | null>>) => (item: Item) => {
    setter(item);
    setDragOverSlot(null);
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center p-8 bg-gray-800/30 rounded-2xl border-2 border-gray-700 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent opacity-50 animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        
        <h2 className="font-cinzel text-2xl text-amber-300 z-10">Transmutation Circle</h2>

        <div className="flex items-center justify-center space-x-4 z-10" onDragLeave={() => setDragOverSlot(null)}>
            <div onDragEnter={() => setDragOverSlot(1)}><Slot item={item1} onDrop={handleDrop(setItem1)} onClear={() => setItem1(null)} isOver={dragOverSlot === 1} /></div>
            <span className="text-4xl font-bold text-purple-400">+</span>
            <div onDragEnter={() => setDragOverSlot(2)}><Slot item={item2} onDrop={handleDrop(setItem2)} onClear={() => setItem2(null)} isOver={dragOverSlot === 2} /></div>
        </div>

        <button 
            onClick={handleTransmute}
            disabled={!item1 || !item2 || isLoading}
            className="z-10 w-2/3 py-4 text-xl font-bold font-cinzel text-gray-900 bg-amber-500 rounded-lg hover:bg-amber-400 transition-all duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.8)] disabled:shadow-none"
        >
          {isLoading ? 'Transmuting...' : 'Transmute'}
        </button>

        {error && <p className="text-red-400 mt-2 z-10">{error}</p>}
    </div>
  );
};
