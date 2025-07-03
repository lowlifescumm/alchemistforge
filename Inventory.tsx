
import React from 'react';
import { useGameState } from '../hooks/useGameState.tsx';
import { ItemCard } from './ItemCard.tsx';

export const Inventory: React.FC = () => {
  const { inventory } = useGameState();
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemJson: string) => {
    e.dataTransfer.setData("application/json", itemJson);
  };

  return (
    <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2">
      {[...inventory].sort((a,b) => b.isNew ? 1 : -1).map(item => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, JSON.stringify(item))}
          className="cursor-grab active:cursor-grabbing"
        >
          <ItemCard item={item} />
        </div>
      ))}
    </div>
  );
};
