"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	useEffect(() => {
		if (!loading && !user) {
			router.push('/login');
		}
		if (user) {
			setFormData({
				name: user.name,
				email: user.email,
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			});
		}
	}, [user, loading, router]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Saving user data:', formData);
		setIsEditing(false);
		// success message
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
			<div className="max-w-2xl mx-auto">
				<div className="bg-white shadow-md rounded-lg p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
						<button
							onClick={() => setIsEditing(!isEditing)}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							{isEditing ? 'Cancel' : 'Edit Profile'}
						</button>
					</div>

					<div className="flex items-center mb-6">
						<div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
							{user.name.charAt(0).toUpperCase()}
						</div>
						<div className="ml-4">
							<h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
							<p className="text-gray-600">{user.email}</p>
						</div>
					</div>

					<form onSubmit={handleSave} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								disabled={!isEditing}
								className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								disabled={!isEditing}
								className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
							/>
						</div>

						{isEditing && (
							<>
								<div className="border-t pt-4">
									<h4 className="text-lg font-medium text-gray-800 mb-3">Change Password</h4>
									
									<div className="mb-4">
										<label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
											Current Password
										</label>
										<input
											type="password"
											id="currentPassword"
											name="currentPassword"
											value={formData.currentPassword}
											onChange={handleInputChange}
											className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
										/>
									</div>

									<div className="mb-4">
										<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
											New Password
										</label>
										<input
											type="password"
											id="newPassword"
											name="newPassword"
											value={formData.newPassword}
											onChange={handleInputChange}
											className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
										/>
									</div>

									<div>
										<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
											Confirm New Password
										</label>
										<input
											type="password"
											id="confirmPassword"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleInputChange}
											className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
										/>
									</div>
								</div>
							</>
						)}

						{isEditing && (
							<div className="flex justify-end space-x-3 pt-4">
								<button
									type="button"
									onClick={() => setIsEditing(false)}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
								>
									Save Changes
								</button>
							</div>
						)}
					</form>

					{/* Account Statistics */}
					<div className="mt-8 pt-6 border-t">
						<h4 className="text-lg font-medium text-gray-800 mb-4">Account Statistics</h4>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-blue-50 p-4 rounded-lg text-center">
								<div className="text-2xl font-bold text-blue-600">12</div>
								<div className="text-sm text-blue-800">Tasks Completed</div>
							</div>
							<div className="bg-green-50 p-4 rounded-lg text-center">
								<div className="text-2xl font-bold text-green-600">8</div>
								<div className="text-sm text-green-800">Active Projects</div>
							</div>
							<div className="bg-purple-50 p-4 rounded-lg text-center">
								<div className="text-2xl font-bold text-purple-600">24</div>
								<div className="text-sm text-purple-800">Messages Sent</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
