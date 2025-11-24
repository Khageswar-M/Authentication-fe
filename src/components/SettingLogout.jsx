import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthProvider';

const Settings = ({ onClose }) => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        if (!user || !user.email) {
            console.warn("⚠️ No user email found. Cannot perform logout.");
            logout();
            window.location.href = "/";
            return;
        }

        if (!window.confirm("Are you sure you want to sign out?")) return;

        try {
            console.log("🔄 Logging out:", user.email);

            // 1️⃣ Delete user from backend database
            const response = await axios.delete(`https:${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_LOGOUT}`, {
                params: { email: user.email },
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("✅ User deleted successfully from DB");
            } else {
                console.warn("⚠️ User not found or already deleted.");
            }

            // 2️⃣ Clear AuthProvider + localStorage
            logout();

            // 3️⃣ Redirect to home/login
            window.location.href = "/";

        } catch (error) {
            console.error("❌ Error during logout:", error);
            alert("An error occurred while logging out. Please try again.");
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-[#6e6e6e6a] bg-opacity-50 flex items-center justify-center z-1000">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                >
                    ✖
                </button>

                <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
                    Account Overview
                </h1>

                <p className="text-md text-gray-500 mb-8 text-center">
                    Review your privacy assurances and manage your current session.
                </p>

                <div className="bg-indigo-50 p-4 rounded-xl mb-6 border-l-4 border-indigo-400">
                    <p className="text-sm font-medium text-gray-600">Active Session for:</p>
                    <p className="text-lg font-bold text-gray-800">{user?.name}</p>
                    <p className="text-sm text-indigo-700 wrap-break-word">{user?.email}</p>
                </div>

                <div className="p-4 bg-green-50 text-green-800 rounded-xl flex items-start space-x-3 mb-8">
                    <span className="text-xl mt-0.5">✅</span>
                    <p className="text-sm font-medium">
                        <strong>Session ID Confidentiality Assured:</strong> Your Session ID is private and never visible to other users.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-3 border border-red-600 rounded-lg 
                                   bg-red-50 text-red-600 font-semibold text-lg shadow-md 
                                   hover:bg-red-100 transition"
                    >
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Settings;
