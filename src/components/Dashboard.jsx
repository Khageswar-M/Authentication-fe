import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Settings from './SettingLogout';
import { useAuth } from '../../Auth/AuthProvider';
import axios from 'axios';
import Google from '../assets/google.png';
import Github from '../assets/github.png';
// Importing icons for a more polished look
import { Users, Settings as SettingsIcon, LogOut, ArrowRightCircle } from 'lucide-react';

const Dashboard = () => {
    const { user, isLoggedIn } = useAuth(); // ⬅ get from AuthProvider
    const [owner, setOwner] = useState(null);

    const navigate = useNavigate();
    const [openSettings, setOpenSettings] = useState(false);

    // Load owner from AuthProvider (LOGIC UNCHANGED)
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/"); // user not logged in → redirect to home/login
            return;
        }

        // Set owner instantly from context/localStorage
        setOwner({
            name: user.name,
            email: user.email,
            // Use a placeholder with user's initial if no picture, more professional than a generic image
            picture: user.picture || `https://placehold.co/128x128/4f46e5/ffffff?text=${user.name.charAt(0).toUpperCase()}`,
            role: "Owner",
            status: "Active"
        });

    }, [isLoggedIn, user, navigate]);

    // ----- Dummy Other Users (LOGIC UNCHANGED) -----
    const [loggedUsers, setLoggedUsers] = useState([]);
    const mockLoggedUsers = [
        { id: "aarav-sharma", name: "Aarav Sharma", picture: "https://placehold.co/128x128/10b981/ffffff?text=AS", provider: 'GOOGLE', status: "Active" },
        { id: "emily-johnson", name: "Emily Johnson", picture: "https://placehold.co/128x128/ef4444/ffffff?text=EJ", provider: 'GOOGLE', status: "Offline" },
        { id: "riya-gupta", name: "Riya Gupta", picture: "https://placehold.co/128x128/f59e0b/ffffff?text=RG", provider: 'GOOGLE', status: "Active" },
        { id: "oliver-smith", name: "Oliver Smith", picture: "https://placehold.co/128x128/3b82f6/ffffff?text=OS", provider: 'GOOGLE', status: "Online" },
        { id: "kabir-verma", name: "Kabir Verma", picture: "https://placehold.co/128x128/8b5cf6/ffffff?text=KV", provider: 'GOOGLE', status: "Active" },
        { id: "sophia-martinez", name: "Sophia Martinez", picture: "https://placehold.co/128x128/06b6d4/ffffff?text=SM", provider: 'GOOGLE', status: "Offline" },
    ];


    // Fetch Users from API (LOGIC UNCHANGED)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`http:${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_ALL_USERS}`, { withCredentials: true });

                const dbUsers = res.data.map((u) => ({
                    id: (u.email || u.name)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, ""),
                    name: u.name,
                    picture: u.picture || "https://placehold.co/128x128",
                    provider: u.provider,
                    status: "Online"
                }));

                // ✅ Randomly pick 3 indices from mock users to mark as "Online"
                const pickRandomIndices = (arr, n) => {
                    const indices = Array.from({ length: arr.length }, (_, i) => i);
                    const shuffled = indices.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, n);
                };

                const randomIndices = pickRandomIndices(mockLoggedUsers, 3);

                const updatedMockUsers = mockLoggedUsers.map((user, i) =>
                    randomIndices.includes(i)
                        ? { ...user, status: "Online" }
                        : user
                );

                // ✅ Combine DB + mock users
                const combined = [...dbUsers, ...updatedMockUsers];
                setLoggedUsers(combined);

            } catch (err) {
                console.error("Error fetching users:", err);

                // ✅ Backend down → fallback to mock users with 3 online
                const pickRandomIndices = (arr, n) => {
                    const indices = Array.from({ length: arr.length }, (_, i) => i);
                    const shuffled = indices.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, n);
                };

                const randomIndices = pickRandomIndices(mockLoggedUsers, 3);

                const updatedMockUsers = mockLoggedUsers.map((user, i) =>
                    randomIndices.includes(i)
                        ? { ...user, status: "Online" }
                        : user
                );

                setLoggedUsers(updatedMockUsers);
            }
        };

        fetchUsers();
    }, []);


    // WebSocket for User Presence (LOGIC UNCHANGED)
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    useEffect(() => {
        if (!user) return;
        const userId = (user.email || user.name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        let ws;
        const connectWS = () => {
            ws = new WebSocket(`ws:${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_PRESENCE}${userId}`);
            ws.onopen = () => console.log("✅ WebSocket connected");
            ws.onclose = (e) => {
                console.log("❌ WebSocket disconnected", e.reason);
                // ✅ auto-reconnect after 3s
                setTimeout(connectWS, 3000);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setOnlineUsers(new Set(data.onlineUsers));
                } catch (error) {
                    console.error("Error parsing WebSocket message: ", error);
                }
            };
        };
        connectWS();
        return () => ws && ws.close();
    }, [user]);



    if (!isLoggedIn || !owner) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-gray-700 text-lg font-medium">
                    Loading your dashboard...
                </p>
            </div>
        );

    }


    // -----------------------------------------------------

    const UserCard = ({ user, isOnline }) => {

        // Use distinct professional colors for active/inactive
        const statusColor = isOnline ? 'bg-green-500' : 'bg-gray-400 ';
        const statusText = isOnline ? 'Online' : 'Offline';

        return (
            // Added subtle hover effect and ring focus for interactivity
            <div className="bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center relative border border-gray-100">

                {/* Provider Logo (top right) - Using a small, subtle badge for a professional touch */}
                <div className="absolute top-3 right-3 p-0 rounded-full ">
                    <img
                        src={
                            user.provider === 'GOOGLE'
                                ? Google
                                : user.provider === 'GITHUB'
                                    ? Github
                                    : 'https://placehold.co/128x128/10b981/ffffff?text=PR'
                        }
                        alt={`${user.provider} logo`}
                        className="w-10 h-10 object-contain"
                    />
                </div>

                {/* Profile Image */}
                <div className="relative mb-4 mt-2">
                    <img
                        src={user.picture}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        alt="profile"
                    />
                    {/* Status Dot with professional ring effect */}
                    <div
                        className={`absolute bottom-0 right-2 w-4 h-4 rounded-full ${statusColor} ring-2 ring-white`}
                        title={statusText}
                    ></div>
                </div>

                {/* User Name and Status */}
                <h3 className="text-lg font-bold text-gray-800 truncate max-w-full">{user.name}</h3>
                <p className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>{statusText}</p>

            </div>
        );
    };

    return (
        // Enhanced background and structure for maximum width and centered content
        <div className="min-h-screen bg-gray-100 p-4 sm:p-10 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* OWNER SECTION - Prominent Header Card */}
                <header className="mb-12 bg-white p-8 rounded-3xl shadow-2xl shadow-indigo-200/50 border-t-4 border-indigo-600">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">

                        <div className="flex items-center space-x-6">
                            {/* Owner Profile Image - Larger and more prominent */}
                            <img
                                src={owner.picture}
                                alt="owner"
                                className="w-28 h-28 rounded-full object-cover border-6 border-white shadow-xl ring-2 ring-indigo-500"
                            />

                            {/* Welcome Text */}
                            <div>
                                <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-widest mb-1">
                                    <span className="inline-block px-3 py-1 bg-indigo-100 rounded-full text-sm font-bold">{owner.role}</span> Dashboard
                                </h2>
                                <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                    Hello, {owner.name.split(" ")[0]}! 👋
                                </h1>
                                <p className="mt-2 text-gray-600 text-lg">
                                    Welcome back to your secure management hub.
                                </p>
                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                    <LogOut className="w-3 h-3 mr-1 text-gray-400" /> Session ID: <strong className="ml-1 text-gray-800">{owner.email}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Settings Button - Professional styling */}
                        <button
                            className="cursor-pointer mt-6 md:mt-0 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                            onClick={() => setOpenSettings(true)}
                        >
                            <SettingsIcon className="w-5 h-5" />
                            <span>Manage Settings</span>
                        </button>
                    </div>
                </header>

                {/* HORIZONTAL RULE FOR SEPARATION */}
                <hr className="my-8 border-gray-300" />

                {/* USERS LIST SECTION */}
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
                    <Users className="w-7 h-7 mr-3 text-indigo-600" />
                    System Users
                    <span className="ml-3 text-lg font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{loggedUsers.length}</span>
                </h2>


                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {loggedUsers.map((u) => {
                        // Ensure owner is not duplicated if present in both lists, or filter already handled in useEffect.
                        return (
                            <UserCard
                                key={u.id}
                                user={u}
                                isOnline={onlineUsers.has(u.id) || u.status === "Active"} // ✅ if mock data says "Online", show it
                            />
                        );
                    })}
                </div>

                {/* Settings Modal */}
                {openSettings && <Settings onClose={() => setOpenSettings(false)} />}
            </div>
        </div>
    );
};

export default Dashboard;