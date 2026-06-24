import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paperclip, MessageSquare } from 'lucide-react';

const Card = ({ id, card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card ${isDragging ? 'card-dragging' : ''}`}
    >
      {card.tag && (
        <span className="card-tag" style={{ backgroundColor: `${card.tag.color}20`, color: card.tag.color }}>
          {card.tag.text}
        </span>
      )}
      
      <div className="card-content">
        {card.content}
      </div>

      <div className="card-footer">
        <div className="card-actions">
          <div className="card-action"><Paperclip size={14} /></div>
          <div className="card-action"><MessageSquare size={14} /></div>
        </div>
        {card.assignee && (
          <img src={card.assignee} alt="assignee" className="card-assignee" />
        )}
      </div>
    </div>
  );
};

export default Card;
