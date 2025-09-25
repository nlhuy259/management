"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  refresh: () => void;
  updateTaskStatus: (taskId: string, nextStatus: Task["status"]) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user } = useAuth(); 
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
  
	const fetchTasks = async () => {
		if (!user) return; 
		try {
		  const res = await fetch(`http://localhost:5000/api/tasks/get/${user.id}`);
		  if (!res.ok) throw new Error("Failed to load tasks");
		  const data = await res.json();
		  setTasks(data.tasks); // only set the array
		} catch (err) {
		  console.error("Error fetching tasks:", err);
		} finally {
		  setLoading(false);
		}
	  };
	
	const updateTaskStatus = async (taskId: string, nextStatus: Task["status"]) => {
		try {
		  const res = await fetch(`http://localhost:5000/api/tasks/update/${taskId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status: nextStatus }),
		  });
	
		  if (!res.ok) throw new Error("Failed to update task status");
	
		  const { task: updated } = await res.json();

		  setTasks(prev =>
			prev.map(t => (t.id === taskId ? { ...t, status: updated.status } : t))
		  );
		} catch (err) {
		  console.error("Error updating task:", err);
		  throw err;
		}
	};
	useEffect(() => {
	  fetchTasks();
	}, [user]);

  return (
    <TaskContext.Provider value={{ tasks, loading, refresh: fetchTasks, updateTaskStatus}}>
      {children}
    </TaskContext.Provider>
  );
};
