"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTasks } from "@/contexts/TaskContext";
import Link from "next/link";
import { getSocket } from "@/contexts/socket";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { tasks, loading: taskLoading } = useTasks();
  const router = useRouter();
  type CurrentMsg = {
    id: string; 
    content: string;
    createdAt: string;
    sender:
      {
        id: string; 
        name: string
      } 
    };

  const [recentMessages, setRecentMessages] = useState<CurrentMsg[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [tasks, user, loading, router]);

  useEffect(() => {
    let abort = false;
    const load = async () => {
      if (!user?.id) return;
      try {
        setLoadingMsgs(true);
        console.log(user.id)
        const res = await fetch(`http://localhost:5000/api/messages/recent/${user.id}`);
        const data: unknown = await res.json();
        type RawMsg = { 
          id: string; 
          content: string; 
          createdAt: string; 
          sender: 
            { id: string; 
              name: string 
            } 
          };
        const msgs: CurrentMsg[] = ((data as { messages?: RawMsg[] })?.messages || []).map((m: RawMsg) => ({
          id: m.id,
          content: m.content,
          createdAt: m.createdAt,
          sender: m.sender,
        }));
        if (!abort) setRecentMessages(msgs);
      } catch (e) {
        console.error("Failed to load current messages", e);
      } finally {
        if (!abort) setLoadingMsgs(false);
      }
    };
    load();
    // subscribe to realtime updates to refresh the recent list
    const socket = getSocket();
    const refresh = () => load();
    socket.emit('chat:join', { userId: user?.id });
    socket.on('chat:message', refresh);
    return () => { abort = true; socket.off('chat:message', refresh); };
  }, [user?.id]);

  if (loading || taskLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const timeAgo = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const sec = Math.max(1, Math.floor(diffMs / 1000));
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.floor(hr / 24);
    return `${d}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Welcome back, {user.name}!</h2>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your projects today.</p>
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
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks available</p>
              ) : (
                tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{task.title}</h4>
                      <p className="text-sm text-gray-600">
                        {task.description? task.description.slice(0,50) : "No description"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "DONE"
                          ? "bg-green-100 text-green-800"
                          : task.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : task.status === "REVIEW"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              )}
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
              {loadingMsgs ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : recentMessages.length === 0 ? (
                <div className="text-sm text-gray-500">No recent messages</div>
              ) : (
                recentMessages.map((m) => (
                  <div key={m.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-800 text-sm">{m.sender?.name || "Unknown"}</h4>
                      <span className="text-xs text-gray-500">{timeAgo(m.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{m.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h3 className="font-semibold text-xl text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/tasks/create"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-medium text-blue-800">Create Task</h4>
              <p className="text-sm text-blue-600">Add a new task to your list</p>
            </div>
          </Link>
          <Link
            href="/messages"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-medium text-green-800">Send Message</h4>
              <p className="text-sm text-green-600">Start a conversation</p>
            </div>
          </Link>
          <Link
            href="/user"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
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
