
import React from 'react';
import type { Item } from '../types.tsx';
import { ELEMENT_ICONS, RARITY_COLORS } from '../constants.tsx';
import { SparklesIcon } from './icons/SparklesIcon.tsx';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const rarityClass = RARITY_COLORS[item.rarity] || 'border-gray-500';
  const IconComponent = ELEMENT_ICONS[item.icon];
  
  return (
    <div className={`bg-gray-800 p-3 rounded-lg border-2 ${rarityClass} transition-all duration-300 relative group`}>
      {item.isNew && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 justify-center items-center">
            <SparklesIcon className="w-3 h-3 text-white"/>
          </span>
        </span>
      )}
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center overflow-hidden">
          {item.isGeneratedIcon ? (
             <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            IconComponent ? <IconComponent /> : <ELEMENT_ICONS.Default />
          )}
        </div>
        <div>
          <h3 className={`font-bold font-cinzel ${rarityClass.split(' ')[1]}`}>{item.name}</h3>
          <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
        </div>
      </div>
    </div>
  );
};
