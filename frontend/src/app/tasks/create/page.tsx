"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AppUser {
	id: string;
	name: string;
	email: string;
}

export default function CreateTaskPage() {
	const router = useRouter();
	const { user, loading } = useAuth();
	const [users, setUsers] = useState<AppUser[]>([]);
	const [form, setForm] = useState({ title: "", description: "", assignedToId: "" });
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		async function loadUsers() {
			try {
				const res = await fetch("http://localhost:5000/api/users");
				if (!res.ok) return;
				const data = await res.json();
				setUsers(data);
			} catch (e) {}
		}
		loadUsers();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;
		setSubmitting(true);
		setError("");
		setSuccess("");
		try {
			const res = await fetch("http://localhost:5000/api/tasks/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: form.title,
					description: form.description,
					assignedToId: form.assignedToId,
					createdById: user.id,
				}),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				console.log(form.title, form.description, form.assignedToId, user.id);
				throw new Error(data?.message || "Failed to create task");			
			}
			setSuccess("Task created successfully");
			setForm({ title: "", description: "", assignedToId: "" });
			setTimeout(() => router.push("/dashboard"), 800);
		} catch (err: any) {
			setError(err?.message || "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading || (!user && typeof window !== "undefined")) {
		return (
			<div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">Create Task</h2>
				{error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
				{success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
						<input
							name="title"
							value={form.title}
							onChange={handleChange}
							className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
						<textarea
							name="description"
							value={form.description}
							onChange={handleChange}
							rows={4}
							className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
						<select
							name="assignedToId"
							value={form.assignedToId}
							onChange={handleChange}
							className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
							required
						>
							<option value="" disabled>Select a user</option>
							{users.map(u => (
								<option key={u.id} value={u.id}>
								{u.name} ({u.email})
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={() => router.push("/dashboard")}
							className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Creating..." : "Create Task"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
