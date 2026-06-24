import { create } from 'zustand';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const useBoardStore = create((set, get) => ({
  boardState: {
    columns: {},
    cards: {},
    columnOrder: []
  },
  isConnected: false,

  // Initialize socket listeners
  initSocket: () => {
    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));
    
    socket.on('init_board', (initialState) => {
      set({ boardState: initialState });
    });

    socket.on('board_updated', (newState) => {
      set({ boardState: newState });
    });
  },

  // Optimistic update + emit
  moveCard: (activeId, overId, isFinal = true) => {
    const { boardState } = get();
    
    // Deep clone the state to avoid mutating directly before set
    const newState = JSON.parse(JSON.stringify(boardState));
    
    // Find source column and destination column
    let sourceColId = null;
    let destColId = null;

    for (const colId in newState.columns) {
      if (newState.columns[colId].cardIds.includes(activeId)) {
        sourceColId = colId;
      }
    }
    
    // OverId can be a column or another card
    if (newState.columns[overId]) {
      destColId = overId;
    } else {
      for (const colId in newState.columns) {
        if (newState.columns[colId].cardIds.includes(overId)) {
          destColId = colId;
        }
      }
    }

    if (!sourceColId || !destColId) return;

    const sourceCol = newState.columns[sourceColId];
    const destCol = newState.columns[destColId];
    
    // Remove from source
    sourceCol.cardIds = sourceCol.cardIds.filter(id => id !== activeId);

    // Add to dest
    if (overId === destColId) {
      // Dropped on the column itself, add to end
      destCol.cardIds.push(activeId);
    } else {
      // Dropped on another card, insert before it
      const overIndex = destCol.cardIds.indexOf(overId);
      destCol.cardIds.splice(overIndex >= 0 ? overIndex : destCol.cardIds.length, 0, activeId);
    }

    // Optimistically update local state
    set({ boardState: newState });

    // Emit to server only on drag end
    if (isFinal) {
      socket.emit('update_board', newState);
    }
  }
}));

export default useBoardStore;
