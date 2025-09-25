"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface UserRef {
  name: string;
  email: string;
}
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedToId: string;
  createdById: string;

  assignedTo?: UserRef;
  createdBy?: UserRef;
}

export default function TaskDetailPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tasks/get/detail/${id}`);
        if (!res.ok) throw new Error("Failed to fetch task");
        const data = await res.json();
        setTask(data.task); 
      } catch (err) {
        console.error("Error loading task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Task not found
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => router.back()}
        className="inline-flex items-center  border border-indigo-300 px-3 py-1.5 mb-2 rounded-md text-indigo-500 hover:bg-indigo-50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18">
            </path>
        </svg>
        <span className="ml-1 font-bold text-lg">Back</span>
    </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h2>
            <p className="text-gray-600 mb-4 max-w-3xl">{task.description}</p>
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                task.status === "DONE"
                  ? "bg-green-100 text-green-800"
                  : task.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-800"
                  : task.status === "REVIEW"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Assigned To</p>
            <p className="font-medium text-gray-800">{task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : "Unknown"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Created By</p>
            <p className="font-medium text-gray-800">{task.createdBy ? `${task.createdBy.name} (${task.createdBy.email})` : "Unknown"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Assigned Time</p>
            <p className="font-medium text-gray-800">{new Date(task.createdAt).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">Updated Time</p>
            <p className="font-medium text-gray-800">{new Date(task.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
