"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import Link from "next/link";

type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

interface TaskItem {
	id: string;
	title: string;
	description?: string | null;
	status: Status;
	assignedToId: string;
	createdById: string;
	createdAt: string;
	updatedAt: string;
}

const STATUS_OPTIONS: Status[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export default function TasksPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const { tasks, loading: taskLoading, updateTaskStatus } = useTasks();
	const [error, setError] = useState<string>("");
	const [savingId, setSavingId] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<"ALL" | Status>("ALL");

	useEffect(() => {
		if (!loading && !user) router.push("/login");
	}, [tasks, user, loading, router]);

	// const loadTasks = async () => {
	// 	try {
	// 		setLoadingTasks(true);
	// 		const res = await fetch("http://localhost:5000/api/tasks/get");
	// 		if (!res.ok) throw new Error("Failed to load tasks");
	// 		const data = await res.json();
	// 		setTasks(data);
	// 	} catch (e: any) {
	// 		setError(e?.message || "Failed to load tasks");
	// 	} finally {
	// 		setLoadingTasks(false);
	// 	}
	// };

	// useEffect(() => {
	// 	loadTasks();
	// }, []);

	const filteredTasks = useMemo(() => {
		if (statusFilter === "ALL") return tasks;
		return tasks.filter(t => t.status === statusFilter);
	}, [tasks, statusFilter]);

	const onChangeStatus = async (taskId: string, nextStatus: Status) => {
		const task = tasks.find(t => t.id === taskId);
		if (!task) return;
		setSavingId(taskId);
		setError("");
		try {
			await updateTaskStatus(taskId, nextStatus);
		} catch (e: any) {
			setError(e?.message || "Failed to update status");
		} finally {
			setSavingId(null);
		}
	};

	if (loading || taskLoading ||(!user && typeof window !== "undefined")) {
		return (
			<div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}
	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
					<button
						onClick={() => router.push("/tasks/create")}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						New Task
					</button>
				</div>

				<div className="flex items-center gap-3 mb-4">
					<label className="text-sm font-medium text-gray-700">Filter by status:</label>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as any)}
						className="px-3 py-2 border  border-gray-300 rounded-md text-sm text-gray-900 bg-white"
					>
						<option value="ALL">All</option>
						{STATUS_OPTIONS.map(s => (
							<option key={s} value={s}>{s.replace("_", " ")}</option>
						))}
					</select>
				</div>

				{error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

				{taskLoading ? (
					<div className="py-12 text-center text-gray-500">Loading tasks...</div>
				) : tasks.length === 0 ? (
					<div className="py-12 text-center text-gray-500">No tasks found</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium-bold text-gray-800 uppercase tracking-wider">Title</th>
									<th className="px-6 py-3 text-left text-xs font-medium-bold text-gray-800 uppercase tracking-wider">Description</th>
									<th className="px-6 py-3 text-left text-xs font-medium-bold text-gray-800 uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium-bold text-gray-800 uppercase tracking-wider">Assigned Time</th>
									<th className="px-6 py-3 text-left text-xs font-medium-bold text-gray-800 uppercase tracking-wider">Updated</th>
									<th className="px-6 py-3"/>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
									{filteredTasks.map(t => (
									<tr key={t.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-gray-800"><Link	href={`/tasks/${t.id}`}>{t.title}</Link></td>
										<td className="px-6 py-4 text-gray-800">{t.description? t.description.slice(0,50) : "-"}</td>
										<td className={`px-6 py-4`}>
											
											<select
												value={t.status}
												onChange={(e) => onChangeStatus(t.id, e.target.value as Status)}
												className={`px-2 py-1 border border-gray-800 rounded-md text-sm font-semibold bg-white
													${t.status === "TODO" ? "text-red-600" : ""}
													${t.status === "IN_PROGRESS" ? "text-blue-600" : ""}
													${t.status === "REVIEW" ? "text-yellow-600" : ""}
													${t.status === "DONE" ? "text-green-600" : ""}
												  `}
												disabled={savingId === t.id}
											>
												{STATUS_OPTIONS.map(s => (
													<option className="text-gray-900" key={s} value={s}>{s.replace("_", " ")}</option>
													
												))}
											</select>
											</td>
											<td className="px-6 py-4 text-gray-800">{new Date(t.createdAt).toLocaleString()}</td>
											<td className="px-6 py-4 text-gray-800">{new Date(t.updatedAt).toLocaleString()}</td>
											<td className="px-6 py-4 text-right text-sm text-gray-800">{savingId === t.id ? "Saving..." : ""}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
