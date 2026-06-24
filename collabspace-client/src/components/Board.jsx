import React, { useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Users, Plus, MoreHorizontal } from 'lucide-react';
import useBoardStore from '../store/boardStore';
import Column from './Column';

const Board = () => {
  const { boardState, isConnected, initSocket, moveCard } = useBoardStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      moveCard(active.id, over.id, false); // isFinal = false
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      moveCard(active.id, over.id, true); // isFinal = true
    }
  };

  if (!boardState.columnOrder) return <div className="text-center mt-10">Loading board...</div>;

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <h1>CollabSpace</h1>
          <div className="active-users">
            <div className="user-avatar" style={{zIndex: 3}}><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="user" className="user-avatar"/></div>
            <div className="user-avatar" style={{zIndex: 2}}>JS</div>
            <div className="user-avatar" style={{zIndex: 1}}>+3</div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="status-indicator">
            <span>Live Sync</span>
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          </div>
          <button className="btn-primary">
            <Users size={16} />
            Share Board
          </button>
        </div>
      </header>

      <main className="board">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {boardState.columnOrder.map((columnId) => {
            const column = boardState.columns[columnId];
            if (!column) return null;
            const cards = column.cardIds.map(id => boardState.cards[id]).filter(Boolean);

            return <Column key={column.id} column={column} cards={cards} />;
          })}
        </DndContext>
      </main>
    </div>
  );
};

export default Board;
