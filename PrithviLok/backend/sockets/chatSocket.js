// ============================================================
// Socket.io - Real-Time Communication + Admin Notifications
// ============================================================

export const initializeSockets = (io) => {
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`📡 Client connected: ${socket.id}`);

    // ── User joins ──────────────────────────────────────────
    socket.on('user:join', (userId) => {
      connectedUsers.set(socket.id, userId);
      socket.join('community_global');
    });

    // ── Admin joins admin room ──────────────────────────────
    socket.on('admin:join', () => {
      socket.join('admin_room');
      console.log(`🛡️ Admin joined: ${socket.id}`);
    });

    // ── Chat ────────────────────────────────────────────────
    socket.on('chat:message', (data) => {
      socket.to('community_global').emit('chat:message:receive', {
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    // ── Dustbin subscriptions ───────────────────────────────
    socket.on('dustbin:subscribe', (dustbinId) => {
      socket.join(`dustbin_${dustbinId}`);
    });

    socket.on('dustbin:unsubscribe', (dustbinId) => {
      socket.leave(`dustbin_${dustbinId}`);
    });

    // ── System alerts ───────────────────────────────────────
    socket.on('system:alert', (message) => {
      io.emit('system:notification', { message, type: 'alert' });
    });

    // ── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
    });
  });
};
