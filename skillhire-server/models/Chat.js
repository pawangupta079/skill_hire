const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isRead: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  metadata: {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
chatSchema.index({ roomId: 1, createdAt: -1 });
chatSchema.index({ participants: 1, createdAt: -1 });
chatSchema.index({ senderId: 1, createdAt: -1 });
chatSchema.index({ 'isRead.userId': 1 });

// Pre-save middleware to set read status for sender
chatSchema.pre('save', function(next) {
  if (this.isNew) {
    this.isRead.push({
      userId: this.senderId,
      readAt: new Date()
    });
  }
  next();
});

// Method to mark message as read by user
chatSchema.methods.markAsRead = function(userId) {
  const existingRead = this.isRead.find(read => read.userId.toString() === userId.toString());
  if (!existingRead) {
    this.isRead.push({
      userId,
      readAt: new Date()
    });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to check if message is read by user
chatSchema.methods.isReadBy = function(userId) {
  return this.isRead.some(read => read.userId.toString() === userId.toString());
};

// Method to edit message
chatSchema.methods.editMessage = function(newMessage) {
  this.message = newMessage;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

// Method to delete message
chatSchema.methods.deleteMessage = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.message = '[Message deleted]';
  return this.save();
};

// Static method to get room messages
chatSchema.statics.getRoomMessages = function(roomId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  return this.find({ 
    roomId, 
    isDeleted: false 
  })
  .populate('senderId', 'firstName lastName profilePicture')
  .populate('replyTo', 'message senderName')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// Static method to get unread count for user
chatSchema.statics.getUnreadCount = function(userId, roomId = null) {
  const query = {
    'isRead.userId': { $ne: userId },
    isDeleted: false
  };
  
  if (roomId) {
    query.roomId = roomId;
  }
  
  return this.countDocuments(query);
};

// Static method to create or get room
chatSchema.statics.createOrGetRoom = function(participantIds) {
  const sortedIds = participantIds.sort();
  const roomId = sortedIds.join('_');
  return roomId;
};

module.exports = mongoose.model('Chat', chatSchema);
