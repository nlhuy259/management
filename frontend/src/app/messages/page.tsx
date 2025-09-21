"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  from: string;
  message: string;
  time: string;
  unread: boolean;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatar: string;
}

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock data
  const conversations: Conversation[] = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how's the project going?",
      time: "2 min ago",
      unreadCount: 2,
      avatar: "JD"
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Can we schedule a meeting?",
      time: "1 hour ago",
      unreadCount: 0,
      avatar: "JS"
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastMessage: "The report is ready for review",
      time: "3 hours ago",
      unreadCount: 1,
      avatar: "MJ"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      lastMessage: "Thanks for the update!",
      time: "1 day ago",
      unreadCount: 0,
      avatar: "SW"
    }
  ];

  const messages: { [key: number]: Message[] } = {
    1: [
      { id: 1, from: "John Doe", message: "Hey, how's the project going?", time: "2 min ago", unread: true },
      { id: 2, from: "You", message: "Going well! We're on track for the deadline.", time: "1 min ago", unread: false },
      { id: 3, from: "John Doe", message: "Great to hear! Let me know if you need any help.", time: "2 min ago", unread: true },
    ],
    2: [
      { id: 1, from: "Jane Smith", message: "Can we schedule a meeting?", time: "1 hour ago", unread: false },
      { id: 2, from: "You", message: "Sure! How about tomorrow at 2 PM?", time: "45 min ago", unread: false },
    ],
    3: [
      { id: 1, from: "Mike Johnson", message: "The report is ready for review", time: "3 hours ago", unread: true },
    ],
    4: [
      { id: 1, from: "You", message: "I've updated the project timeline", time: "1 day ago", unread: false },
      { id: 2, from: "Sarah Wilson", message: "Thanks for the update!", time: "1 day ago", unread: false },
    ]
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Messages</h2>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Conversations</h3>
              </div>
              <div className="overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {conversations.find(c => c.id === selectedConversation)?.avatar}
                      </div>
                      <h4 className="font-medium text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </h4>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages[selectedConversation]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from === 'You' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.from === 'You'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.from === 'You' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-4">💬</div>
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
