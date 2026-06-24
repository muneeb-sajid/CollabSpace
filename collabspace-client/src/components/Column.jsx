import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus } from 'lucide-react';
import Card from './Card';

const Column = ({ column, cards }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="glass-panel column">
      {column.color && <div className="column-color-bar" style={{ backgroundColor: column.color }}></div>}
      
      <div className="column-header">
        <div className="column-title-wrapper">
          <span className="column-title">{column.title}</span>
          <span className="column-count">{cards.length}</span>
        </div>
        <MoreHorizontal size={20} className="column-options" />
      </div>
      
      <div ref={setNodeRef} className="column-cards">
        <SortableContext 
          items={cards.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card key={card.id} id={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
      
      <button className="add-card-btn">
        <Plus size={16} /> Add Card
      </button>
    </div>
  );
};

export default Column;
