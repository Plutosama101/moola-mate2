
import React from 'react';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  name: string;
  emoji: string;
  onClick?: () => void;
}

const CategoryCard = ({ name, emoji, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="p-4 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-[90px] bg-white border border-gray-100 hover:border-orange-200"
      onClick={onClick}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <p className="text-xs font-semibold text-gray-700 leading-tight">{name}</p>
    </Card>
  );
};

export default CategoryCard;
