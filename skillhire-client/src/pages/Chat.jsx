import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { MessageSquare, Send, User } from 'lucide-react';

const Chat = () => {
  const { socket, isConnected } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('receive-message', (message) => {
        if (selectedRoom && message.roomId === selectedRoom.roomId) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('receive-message');
      };
    }
  }, [socket, selectedRoom]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedRoom && socket) {
      socket.emit('send-message', {
        roomId: selectedRoom.roomId,
        message: newMessage.trim(),
        senderId: 'current-user-id', // This should come from auth context
        senderName: 'You'
      });
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
          <p className="text-gray-600">Connect with recruiters and candidates</p>
        </div>

        <div className="bg-white rounded-lg shadow h-96">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              </div>
              <div className="p-4">
                {rooms.length > 0 ? (
                  <div className="space-y-2">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedRoom?.id === room.id
                            ? 'bg-primary-100 text-primary-900'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">John Doe</h3>
                            <p className="text-sm text-gray-500">Last message preview...</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No conversations yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-500">
                          {isConnected ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.length > 0 ? (
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === 'current-user-id'
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p className="text-xs mt-1 opacity-75">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No messages yet. Start a conversation!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 input"
                        disabled={!isConnected}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || !isConnected}
                        className="btn btn-primary"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
