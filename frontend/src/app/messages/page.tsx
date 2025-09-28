"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/contexts/socket';

interface ConversationUser { id: string; name: string }
interface ApiMessage { id: string; senderId: string; receiverId: string; content: string; createdAt: string }

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedConversationUserId, setSelectedConversationUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<ConversationUser[]>([]);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        const data: unknown = await res.json();
        type RawUser =
        {
          id: string;
          name?: string
        };
        const rawUsers = (Array.isArray(data) ? data : (data as { users?: RawUser[] })?.users || []) as RawUser[];
        const others = rawUsers.filter((u) => (u as { id: string }).id !== user.id);
        setUsers(others.map((u) => ({ id: (u as { id: string }).id, name: (u as { name?: string }).name || 'Unknown' })));
      } catch (e) {
        console.error('Failed to load users', e);
      }
    };
    loadUsers();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedConversationUserId) return;
    let aborted = false;
    const loadInitial = async () => {
      try {
        setLoadingMessages(true);
        const url = `http://localhost:5000/api/messages/get?user1=${user.id}&user2=${selectedConversationUserId}`;
        const res = await fetch(url);
        const data: unknown = await res.json();
        const parsed = (Array.isArray(data) ? data : (data as { messages?: ApiMessage[] })?.messages || []) as ApiMessage[];
        if (!aborted) setMessages(parsed);
      } catch (e) {
        if (!aborted) console.error('Failed to load messages', e);
      } finally {
        if (!aborted) setLoadingMessages(false);
      }
    };
    loadInitial();

    const socket = getSocket();
    socketRef.current = socket;
    socket.emit('chat:join', { userId: user.id });

    const onIncoming = (msg: ApiMessage) => {
      const isInThisConversation = (
        (msg.senderId === user.id && msg.receiverId === selectedConversationUserId) ||
        (msg.senderId === selectedConversationUserId && msg.receiverId === user.id)
      );
      if (isInThisConversation) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('chat:message', onIncoming);
    return () => {
      aborted = true;
      socket.off('chat:message', onIncoming);
    };
  }, [user, selectedConversationUserId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationUserId || !user) return;
    try {
      const socket = socketRef.current ?? getSocket();
      socket.emit('chat:send', { senderId: user.id, receiverId: selectedConversationUserId, content: newMessage.trim() });
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
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
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedConversationUserId(u.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversationUserId === u.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {u.name?.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{u.name}</h4>
                          <span className="text-xs text-gray-500"></span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">&nbsp;</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversationUserId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {users.find(u => u.id === selectedConversationUserId)?.name?.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <h4 className="font-medium text-gray-900">{users.find(u => u.id === selectedConversationUserId)?.name}</h4>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMessages ? (
                      <div className="text-center text-gray-500">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500">No messages yet</div>
                    ) : messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${m.senderId === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                        >
                          <p className="text-sm">{m.content}</p>
                          <p className={`text-xs mt-1 ${m.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>{new Date(m.createdAt).toLocaleString()}</p>
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
                        className="flex-1 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
