"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  // Mock data for demonstration
  const tasks = [
    { id: 1, title: "Complete project proposal", status: "In Progress", priority: "High" },
    { id: 2, title: "Review team documents", status: "Pending", priority: "Medium" },
    { id: 3, title: "Update project timeline", status: "Completed", priority: "Low" },
  ];

  const recentMessages = [
    { id: 1, from: "John Doe", message: "Hey, how's the project going?", time: "2 min ago" },
    { id: 2, from: "Jane Smith", message: "Can we schedule a meeting?", time: "1 hour ago" },
    { id: 3, from: "Mike Johnson", message: "The report is ready for review", time: "3 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Welcome back, {user.name}!</h2>
        <p className="text-gray-600">Here's what's happening with your projects today.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-xl text-gray-800">Your Tasks</h3>
              <Link href="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-xl text-gray-800">Recent Messages</h3>
              <Link href="/messages" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-800 text-sm">{message.from}</h4>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h3 className="font-semibold text-xl text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/tasks/new" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <div className="text-center">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-medium text-blue-800">Create Task</h4>
              <p className="text-sm text-blue-600">Add a new task to your list</p>
            </div>
          </Link>
          <Link href="/messages" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-medium text-green-800">Send Message</h4>
              <p className="text-sm text-green-600">Start a conversation</p>
            </div>
          </Link>
          <Link href="/user" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <div className="text-center">
              <div className="text-2xl mb-2">👤</div>
              <h4 className="font-medium text-purple-800">Profile</h4>
              <p className="text-sm text-purple-600">Update your information</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}