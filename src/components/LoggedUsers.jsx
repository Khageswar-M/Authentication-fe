import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthProvider";

const LoggedUsers = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { login } = useAuth();

    const navigate = useNavigate();
    useEffect(() => {
        // ✅ Preload Dashboard so it loads instantly when user clicks Continue
        import("./Dashboard");
    }, []);

    useEffect(() => {
        axios.get(`http:${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_USER_INFO}`, 
            // { withCredentials: true }
        )
            .then(response => {
                setUser(response.data);

                const { name } = response.data;

                // console.log(response.data);
                const email =
                    response.data.email ||
                    response.data.login ||
                    response.data.name ||
                    'Placeholder';

                // console.log('From LoggedUser: '+email);

                const picture =
                    response.data.picture ||         // Google
                    response.data.avatar_url ||      // GitHub
                    response.data.image_url ||       // (optional other providers)
                    null;

                login(name, email, picture);
                // console.log('From useEffect: ', login.email);
            })
            .catch(error => {
                console.log("Error occurred", error);
                // Optionally handle error state here
            })
            .finally(() => {
                setIsLoading(false); // Stop loading once request is complete
            });
    }, []);

    // console.log('All user: ', user);
    // Helper to get the first name for a personalized greeting
    const firstName = user?.given_name || (typeof user?.name === "string" ? user.name.split(' ')[0] : 'User');

    // Fallback image URL for better user experience if 'picture' is missing
    const defaultAvatar = 'https://via.placeholder.com/80?text=Profile';

    // --- Loading State UI ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-xl text-gray-600 animate-pulse">Loading user data....</p>
            </div>
        );
    }

    // --- Error/No User State UI ---
    if (!user && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-4">
                <h1 className="text-3xl text-red-700 font-bold mb-4">🚫 Access Denied</h1>
                <p className="text-gray-600">Could not retrieve user information. Please try logging in again.</p>
            </div>
        );
    }

    return (
        <div
            className={`transition-opacity duration-700 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"
                }`}
        >
            {/* 1. Background Gradient */}
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-100">

                {/* 2. Card */}
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-center transition duration-500 hover:shadow-3xl">

                    {/* 3. Profile Picture Section */}
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={user.picture || user.avatar_url || user.image_url || defaultAvatar}
                            alt={`${firstName}'s Profile`}
                            referrerPolicy="no-referrer"
                            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-400 shadow-lg mb-4 transform hover:scale-105 transition duration-300"
                        />

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 tracking-tight leading-snug">
                            Welcome, {firstName}!
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">
                            You're successfully signed in. Your journey begins now.
                        </p>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* 4. User Details */}
                    <div className="text-left space-y-3">
                        <div className="flex items-center p-3 bg-indigo-50 rounded-xl">
                            <span className="text-xl mr-3">👤</span>
                            <p className="flex-grow">
                                <strong className="block text-sm text-gray-600">Full Name</strong>
                                <span className="text-lg text-gray-800 font-medium">{user.name || user.given_name}</span>
                            </p>
                        </div>

                        <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                            <span className="text-xl mr-3">📧</span>
                            <p className="flex-grow">
                                <strong className="block text-sm text-gray-600">Your ID</strong>
                                <span className="text-lg text-gray-800 font-medium break-words">{user.email ? user.email : user.login}</span>
                            </p>
                        </div>
                    </div>

                    {/* 5. Button */}
                    <button
                        onClick={() => setTimeout(() => navigate("/dashboard"), 300)}
                        className="mt-8 px-6 py-3 text-white bg-indigo-600 rounded-full font-semibold shadow-lg hover:bg-indigo-700 transform transition duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoggedUsers;