const express = require('express');
const Chat = require('../models/Chat');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chat/room
// @desc    Create or get chat room
// @access  Private
router.post('/room', auth, async (req, res) => {
  try {
    const { participantId, applicationId } = req.body;

    // Check if application exists and user is involved
    if (applicationId) {
      const application = await Application.findById(applicationId)
        .populate('candidate', 'firstName lastName')
        .populate('recruiter', 'firstName lastName');

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Check if user is part of this application
      const isCandidate = application.candidate._id.toString() === req.user._id.toString();
      const isRecruiter = application.recruiter._id.toString() === req.user._id.toString();

      if (!isCandidate && !isRecruiter) {
        return res.status(403).json({ message: 'Not authorized to access this chat' });
      }

      // Create room ID based on application
      const roomId = `app_${applicationId}`;
      
      // Get or create room participants
      const participants = [application.candidate._id, application.recruiter._id];
      
      res.json({
        roomId,
        participants: {
          candidate: {
            id: application.candidate._id,
            name: `${application.candidate.firstName} ${application.candidate.lastName}`
          },
          recruiter: {
            id: application.recruiter._id,
            name: `${application.recruiter.firstName} ${application.recruiter.lastName}`
          }
        },
        application: {
          id: application._id,
          jobTitle: application.job.title,
          status: application.status
        }
      });
    } else if (participantId) {
      // Direct chat between users
      const otherUser = await User.findById(participantId);
      if (!otherUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const roomId = Chat.createOrGetRoom([req.user._id, participantId]);
      
      res.json({
        roomId,
        participants: {
          current: {
            id: req.user._id,
            name: `${req.user.firstName} ${req.user.lastName}`
          },
          other: {
            id: otherUser._id,
            name: `${otherUser.firstName} ${otherUser.lastName}`
          }
        }
      });
    } else {
      return res.status(400).json({ message: 'Either participantId or applicationId is required' });
    }
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/rooms
// @desc    Get user's chat rooms
// @access  Private
router.get('/rooms', auth, async (req, res) => {
  try {
    // Get all rooms where user is a participant
    const rooms = await Chat.aggregate([
      {
        $match: {
          participants: req.user._id,
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $not: { $in: [req.user._id, '$isRead.userId'] } },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants'
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/room/:roomId/messages
// @desc    Get messages for a room
// @access  Private
router.get('/room/:roomId/messages', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user has access to this room
    const hasAccess = await Chat.findOne({
      roomId,
      participants: req.user._id
    });

    if (!hasAccess) {
      return res.status(403).json({ message: 'Not authorized to access this room' });
    }

    const messages = await Chat.getRoomMessages(roomId, page, limit);

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/room/:roomId/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.post('/room/:roomId/messages/:messageId/read', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Chat.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user has access to this message
    const hasAccess = message.participants.includes(req.user._id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Not authorized to access this message' });
    }

    await message.markAsRead(req.user._id);

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/chat/messages/:messageId
// @desc    Edit message
// @access  Private
router.put('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    const chatMessage = await Chat.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (chatMessage.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    await chatMessage.editMessage(message);

    res.json({ message: 'Message updated successfully' });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/messages/:messageId
// @desc    Delete message
// @access  Private
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const chatMessage = await Chat.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (chatMessage.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await chatMessage.deleteMessage();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    const { roomId } = req.query;

    const unreadCount = await Chat.getUnreadCount(req.user._id, roomId);

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
