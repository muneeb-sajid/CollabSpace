const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // For development
    methods: ['GET', 'POST']
  }
});

// Initial In-Memory State
let boardState = {
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      color: '#3b82f6', // blue-500
      cardIds: ['card-1', 'card-2']
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      color: '#f59e0b', // amber-500
      cardIds: ['card-3']
    },
    'done': {
      id: 'done',
      title: 'Done',
      color: '#10b981', // emerald-500
      cardIds: ['card-4']
    }
  },
  cards: {
    'card-1': { 
      id: 'card-1', 
      content: 'Design premium UI components',
      tag: { text: 'Design', color: '#ec4899' },
      assignee: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    },
    'card-2': { 
      id: 'card-2', 
      content: 'Implement Socket.io server',
      tag: { text: 'Backend', color: '#8b5cf6' },
      assignee: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    'card-3': { 
      id: 'card-3', 
      content: 'Initialize React + Vite project',
      tag: { text: 'Frontend', color: '#3b82f6' },
      assignee: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
    },
    'card-4': { 
      id: 'card-4', 
      content: 'Set up project architecture',
      tag: { text: 'Planning', color: '#14b8a6' },
      assignee: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    }
  },
  columnOrder: ['todo', 'in-progress', 'done']
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send the current state to the newly connected client
  socket.emit('init_board', boardState);

  // Listen for board updates
  socket.on('update_board', (newState) => {
    // Update the server's state
    boardState = newState;
    
    // Broadcast the updated state to all OTHER clients
    socket.broadcast.emit('board_updated', boardState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`);
});
