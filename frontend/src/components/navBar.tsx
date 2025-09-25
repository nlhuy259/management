"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Management</h1>
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link href="/dashboard">
      <h1 className="text-2xl font-bold text-blue-600">Management</h1>
      </Link>
      {user ? (
        <div className="flex items-center space-x-4">
          <Link href="/messages" className="text-gray-700 hover:text-blue-600 font-medium">
            Messages
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{user.name}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link href="/user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-x-4">
          <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
            Login
          </Link>
          <Link href="/register" className="text-gray-700 hover:text-blue-600 font-medium">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
