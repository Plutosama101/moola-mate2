
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
      className="p-4 text-center cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 min-w-[80px]"
      onClick={onClick}
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <p className="text-xs font-medium">{name}</p>
    </Card>
  );
};

export default CategoryCard;
