import React, { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";

// --- API URL ---
// This MUST match the address your api.py server is running on
const API_URL = 'http://127.0.0.1:5000';

// --- Icon Components ---

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

// --- PYTHON CODE REMOVED FROM HERE ---

const AppLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CitizenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TaskforceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
    </svg>
);

const VolunteerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const FeedbackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.455.09-.934.09-1.423A8.98 8.98 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const FaqIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const WelcomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3 1m0-1l-3-1m3 1v5.505M12 15.75V21" />
    </svg>
);

// Unified ECS badge used in welcome popup
const ECSBadgeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-20 h-20">
        <defs>
            <linearGradient id="ecsGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#ecsGrad)" />
        <circle cx="32" cy="32" r="22" fill="rgba(255,255,255,0.2)" />
        <path d="M20 34h24a2 2 0 0 1 0 4H20a2 2 0 0 1 0-4zm0-8h24a2 2 0 0 1 0 4H20a2 2 0 0 1 0-4zm0-8h16a2 2 0 0 1 0 4H20a2 2 0 0 1 0-4z" fill="#fff" opacity="0.95" />
    </svg>
);

// --- Icons from reactFN.js ---
const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
    </svg>
);
// --- End Icons from reactFN.js ---

const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-6 left-6 p-2 rounded-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    </button>
);

// --- ICONS ADDED BACK ---
const ParamedicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-10 w-10 mb-2">
        <defs>
            <linearGradient id="medGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#medGrad)" />
        <circle cx="32" cy="32" r="22" fill="rgba(255,255,255,0.2)" />
        <rect x="28" y="18" width="8" height="28" rx="2" fill="#fff" />
        <rect x="18" y="28" width="28" height="8" rx="2" fill="#fff" />
    </svg>
);

const PoliceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-10 w-10 mb-2">
        <defs>
            <linearGradient id="polGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#polGrad)" />
        <circle cx="32" cy="32" r="22" fill="rgba(255,255,255,0.2)" />
        <path d="M32 20l10 4v8c0 7.732-5 12-10 14-5-2-10-6.268-10-14v-8l10-4z" fill="#ffffff" opacity="0.95" />
        <path d="M32 28l1.6 3.4 3.8.5-2.8 2.6.7 3.7L32 37l-3.3 1.2.7-3.7-2.8-2.6 3.8-.5L32 28z" fill="#1e3a8a" />
    </svg>
);

const FirefighterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-10 w-10 mb-2">
        <defs>
            <linearGradient id="ffGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="ffFlame" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#ffGrad)" />
        <circle cx="32" cy="32" r="22" fill="rgba(255,255,255,0.2)" />
        <path d="M16 35c0-9 7.5-16 16-16s16 7 16 16" fill="#111827" opacity="0.95" />
        <rect x="22" y="32" width="20" height="8" rx="2" fill="#374151" />
        <path d="M32 24c2.4 2.4 4 4.4 4 6.8a4 4 0 1 1-8 0c0-2.4 1.6-4.4 4-6.8z" fill="url(#ffFlame)" />
    </svg>
);
// --- END ICONS ADDED BACK ---


// --- Custom Splash Screen Logo (from reactFN.js) ---
const ShadowCorpsLogo = () => (
    <svg className="w-48 h-48" viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="135" cy="135" r="135" fill="black"/>
        <path d="M135 24.5C100.5 24.5 27 101 27 151.5C27 202 76.5 241 135 241C193.5 241 243 202 243 151.5C243 101 169.5 24.5 135 24.5Z" fill="#D91F26"/>
        <path d="M135.061 140.75C146.436 140.75 155.624 131.562 155.624 120.187C155.624 108.812 146.436 99.6245 135.061 99.6245C123.686 99.6245 114.5 108.812 114.5 120.187C114.5 131.562 123.686 140.75 135.061 140.75Z" fill="white"/>
        <path d="M129.5 107.375C129.5 106.012 128.312 104.875 126.875 104.875C125.437 104.875 124.25 106.012 124.25 107.375V119.5C124.25 120.863 125.437 122 126.875 122H140.75C142.187 122 143.375 120.863 143.375 119.5C143.375 118.137 142.187 117 140.75 117H129.5V107.375Z" fill="black"/>
        <path d="M148.25 97.625C143.937 94.5 139.125 92.75 134 92.75C128.875 92.75 124.062 94.5 119.75 97.625C118.5 98.4375 118.062 99.9375 118.812 101.125C119.5 102.312 121 102.812 122.25 102C125.75 99.5625 129.812 98 134 98C138.187 98 142.25 99.5625 145.75 102C146.312 102.375 146.937 102.5 147.5 102.5C148.312 102.5 149.125 102.062 149.562 101.25C150.312 100.062 149.5 98.4375 148.25 97.625Z" fill="white"/>
        <path d="M135 153C116.5 153 101.375 168.125 101.375 186.625C101.375 187.988 102.562 189.125 104 189.125C105.437 189.125 106.625 187.988 106.625 186.625C106.625 170.812 119.187 158.25 135 158.25C150.812 158.25 163.375 170.812 163.375 186.625C163.375 187.988 164.562 189.125 166 189.125C167.437 189.125 168.625 187.988 168.625 186.625C168.625 168.125 153.5 153 135 153Z" fill="white"/>
    </svg>
);


// --- Theme Toggle Component ---
const ThemeToggle = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
    >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
);

// --- Splash Screen Component (Updated, ECS Welcome) ---
const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-black" />
            <div className="relative mx-6 max-w-2xl w-full text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <AppLogo />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-sm">Welcome to ECS</h1>
                </div>
                <p className="text-indigo-100/90 dark:text-gray-300 text-lg md:text-xl">
                    Emergency Coordination System
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 text-indigo-50 dark:text-gray-300">
                    <span className="inline-block h-2 w-2 rounded-full bg-white/80 animate-bounce [animation-delay:-.2s]" />
                    <span className="inline-block h-2 w-2 rounded-full bg-white/80 animate-bounce [animation-delay:-.1s]" />
                    <span className="inline-block h-2 w-2 rounded-full bg-white/80 animate-bounce" />
                </div>
            </div>
        </div>
    );
};


// --- Welcome Popup Component ---
const WelcomePopup = ({ onEnter }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center max-w-lg mx-4 transform transition-all duration-500 scale-95 opacity-0 animate-fade-in-scale">
                <div className="mx-auto mb-6 h-20 w-20">
                     <ECSBadgeIcon />
                </div>
                <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">Welcome</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-4 text-xl">
                    This is the central hub for coordinating emergency response efforts. Please proceed by selecting your role.
                </p>
                <button
                    onClick={onEnter}
                    className="mt-8 w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-lg transition-transform transform hover:scale-105 duration-300">
                    Enter Hub
                </button>
            </div>
        </div>
);
};

// --- Success Popup Component ---
const SuccessPopup = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // Automatically close after 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center animate-fade-in-scale">
                <VerifiedIcon />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-4">{message}</h2>
                <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
            </div>
        </div>
    );
};

const MinedBlockModal = ({ block, onClose }) => {
    if (!block) return null;

    const emergencies = Array.isArray(block.emergencies) ? block.emergencies : [];
    const formattedTimestamp = block.timestamp ? new Date(block.timestamp * 1000).toLocaleString() : 'N/A';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
                    aria-label="Close mined block details"
                >
                    &times;
                </button>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Block #{block.index ?? 'N/A'} Mined
                </h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-2 text-sm md:text-base">
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Timestamp:</span> {formattedTimestamp}</p>
                    <p className="break-all"><span className="font-semibold text-gray-700 dark:text-gray-300">Hash:</span> {block.hash || 'N/A'}</p>
                    <p className="break-all"><span className="font-semibold text-gray-700 dark:text-gray-300">Previous Hash:</span> {block.previous_hash || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">Proof:</span> {block.proof ?? 'N/A'}</p>
                </div>
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Emergencies in Block</h4>
                    {emergencies.length > 0 ? (
                        <div className="space-y-3">
                            {emergencies.map((emergency, idx) => {
                                const resources = Array.isArray(emergency.resources) && emergency.resources.length
                                    ? emergency.resources.join(', ')
                                    : 'N/A';
                                let locationDisplay = 'N/A';
                                if (Array.isArray(emergency.location) && emergency.location.length === 2) {
                                    const [lat, lng] = emergency.location;
                                    const latNum = Number(lat);
                                    const lngNum = Number(lng);
                                    if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
                                        locationDisplay = `Lat: ${latNum.toFixed(4)}, Lon: ${lngNum.toFixed(4)}`;
                                    }
                                }
                                return (
                                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm md:text-base">
                                        <p><span className="font-semibold text-gray-700 dark:text-gray-300">Reporter:</span> {emergency.sender || 'N/A'}</p>
                                        <p><span className="font-semibold text-gray-700 dark:text-gray-300">Details:</span> {emergency.details || 'N/A'}</p>
                                        <p><span className="font-semibold text-gray-700 dark:text-gray-300">Location:</span> {locationDisplay}</p>
                                        <p><span className="font-semibold text-gray-700 dark:text-gray-300">Resources:</span> {resources}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Reported: {emergency.timestamp ? new Date(emergency.timestamp * 1000).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No emergencies recorded in this block.</p>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200"
                    >
                        Close
                    </button>
            </div>
        </div>
        </div>
    );
};


const AdminTwoFactor = ({ onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpPreview, setOtpPreview] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('info');
    const [isRequesting, setIsRequesting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const resetState = () => {
        setUsername('');
        setPassword('');
        setOtp('');
        setOtpSent(false);
        setOtpPreview('');
        setStatusMessage('');
        setStatusType('info');
    };

    const requestOtp = async () => {
        if (!username || !password) {
            setStatusMessage('Please provide both username and password.');
            setStatusType('error');
            return;
        }
        setIsRequesting(true);
        setStatusMessage('');
        try {
            const response = await fetch(`${API_URL}/admin/otp/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                setOtpSent(true);
                setStatusMessage(data.message || 'OTP sent successfully.');
                setStatusType('success');
                setOtpPreview(data.otp_code || '');
            } else {
                setStatusMessage(data.message || 'Unable to generate OTP.');
                setStatusType('error');
            }
        } catch (error) {
            console.error('OTP request error:', error);
            setStatusMessage('Could not contact server. Please try again.');
            setStatusType('error');
        } finally {
            setIsRequesting(false);
        }
    };

    const verifyOtp = async () => {
        if (!otpSent) {
            setStatusMessage('Request an OTP before attempting verification.');
            setStatusType('error');
            return;
        }
        if (!otp) {
            setStatusMessage('Enter the OTP you received.');
            setStatusType('error');
            return;
        }
        setIsVerifying(true);
        setStatusMessage('');
        try {
            const response = await fetch(`${API_URL}/admin/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, otp })
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                setStatusMessage(data.message || 'OTP verified. Opening admin panel...');
                setStatusType('success');
                setTimeout(() => {
                    window.open(`${API_URL}/`, '_blank', 'noopener,noreferrer');
                    resetState();
                    onBack();
                }, 800);
            } else {
                setStatusMessage(data.message || 'OTP verification failed.');
                setStatusType('error');
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setStatusMessage('Could not verify OTP. Please try again.');
            setStatusType('error');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-6 relative">
            <BackButton onClick={() => { resetState(); onBack(); }} />
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100">
                    Admin Two-Factor Verification
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400">
                    Enter your admin credentials to request a one-time passcode (OTP), then verify it to open the admin console.
                </p>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Admin Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter admin username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter admin password"
                        />
                    </div>
                    <button
                        onClick={requestOtp}
                        disabled={isRequesting}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold transition disabled:bg-indigo-400"
                    >
                        {isRequesting ? 'Requesting OTP...' : 'Request OTP'}
                    </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            One-Time Passcode
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 tracking-widest"
                            placeholder="Enter the 6-digit OTP"
                            maxLength={6}
                        />
                    </div>
                    {otpPreview && (
                        <p className="text-sm text-amber-500 bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2">
                            Demo OTP (for testing): <span className="font-semibold">{otpPreview}</span>
                        </p>
                    )}
                    <button
                        onClick={verifyOtp}
                        disabled={isVerifying}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-bold transition disabled:bg-emerald-400"
                    >
                        {isVerifying ? 'Verifying...' : 'Verify & Open Admin Panel'}
                    </button>
                </div>

                {statusMessage && (
                    <div
                        className={`px-4 py-3 rounded-lg text-sm font-medium ${
                            statusType === 'error'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                        }`}
                    >
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Verification and Profile Components ---

const VerifiedIcon = () => (
    <svg className="h-20 w-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CitizenVerificationPage = ({ onVerified, onBack }) => {
    const [uniqueNumber, setUniqueNumber] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const handleVerify = () => {
        setError('');
        if (!/^\d{12}$/.test(uniqueNumber)) {
            setError('Please enter a valid 12-digit number.');
            return;
        }
        setStatus('verifying');
        setTimeout(() => {
            setStatus('verified');
            // No auto-redirect, show success popup
        }, 1500);
    };

    const handleClosePopup = () => {
        setStatus('idle'); // Reset status
        onVerified(); // Go to next page
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            <BackButton onClick={onBack} />
            {status === 'verified' && (
                 <SuccessPopup message="Verified Successfully!" onClose={handleClosePopup} />
            )}
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                     <h1 className="text-5xl font-extrabold">Citizen Verification</h1>
                     <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Enter your 12-digit unique identification number.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                    <div>
                        <label htmlFor="uniqueNumber" className="text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide">Unique Number</label>
                        <input
                            id="uniqueNumber"
                            type="text"
                            value={uniqueNumber}
                            onChange={(e) => setUniqueNumber(e.target.value)}
                            maxLength="12"
                            className="w-full text-xl p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500"
                            placeholder="xxxx xxxx xxxx"
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <button onClick={handleVerify} disabled={status === 'verifying'} className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition duration-300 disabled:bg-indigo-400">
                        {status === 'verifying' ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
                 <button onClick={onBack} className="text-center w-full mt-6 text-lg text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition">
                    &larr; Back to Role Selection
                </button>
            </div>
        </div>
    );
};

const CitizenProfileForm = ({ onProfileSubmit, onBack }) => {
    const [profile, setProfile] = useState({
        username: '', password: '', // Add account fields
        firstName: '', middleName: '', lastName: '', phone1: '', phone2: '', address: '',
        profession: '', gender: '', isPhysicallyDisabled: 'No', disabilityDetails: ''
    });
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const registrationData = {
            username: profile.username,
            password: profile.password,
            fullName: `${profile.firstName} ${profile.middleName || ''} ${profile.lastName}`.trim(),
            profession: 'Citizen',
            details: { ...profile }
        };
        delete registrationData.details.username;
        delete registrationData.details.password;
        delete registrationData.details.firstName;
        delete registrationData.details.middleName;
        delete registrationData.details.lastName;

        try {
            const response = await fetch(`${API_URL}/register/citizen`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setShowSuccessPopup(true);
            } else {
                alert('Registration failed: ' + result.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Could not connect to the server.');
        }
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        onProfileSubmit(); // Go to dashboard
    };

    const inputStyles = "p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-lg";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            <BackButton onClick={onBack} />
            {showSuccessPopup && <SuccessPopup message="Registration Completed!" onClose={handlePopupClose} />}
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Complete Your Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Please fill in your details to finalize your registration.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Account Details */}
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Account Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-lg font-bold text-gray-700 dark:text-gray-300">Username</label>
                                <input name="username" value={profile.username} onChange={handleChange} placeholder="Choose a username" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className="text-lg font-bold text-gray-700 dark:text-gray-300">Password</label>
                                <input name="password" type="password" value={profile.password} onChange={handleChange} placeholder="Choose a password" className={`${inputStyles} mt-1`} required />
                           </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                     <div className="space-y-6">
                         <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Personal Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" className={inputStyles} required />
                            <input name="middleName" value={profile.middleName} onChange={handleChange} placeholder="Middle Name" className={inputStyles} />
                            <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" className={inputStyles} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="phone1" value={profile.phone1} onChange={handleChange} placeholder="Primary Phone Number" className={inputStyles} required />
                            <input name="phone2" value={profile.phone2} onChange={handleChange} placeholder="Alternate Phone Number" className={inputStyles} />
                        </div>
                         <textarea name="address" value={profile.address} onChange={handleChange} placeholder="Full Address" rows="3" className={inputStyles} required></textarea>
                         <input name="profession" value={profile.profession} onChange={handleChange} placeholder="Profession / Job" className={inputStyles} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select name="gender" value={profile.gender} onChange={handleChange} className={inputStyles} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <select name="isPhysicallyDisabled" value={profile.isPhysicallyDisabled} onChange={handleChange} className={inputStyles}>
                                <option value="No">Physically Disabled: No</option>
                                <option value="Yes">Physically Disabled: Yes</option>
                            </select>
                        </div>
                        {profile.isPhysicallyDisabled === 'Yes' && (
                            <input name="disabilityDetails" value={profile.disabilityDetails} onChange={handleChange} placeholder="Please specify your disability" className={inputStyles} />
                        )}
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition">
                        Save and Continue
                    </button>
                </form>
                <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Role Selection
                </button>
            </div>
        </div>
    );
};

// --- DAppDashboard (The Main App from backend.py) ---
// This is the component from your 'backend.py' file, now integrated
const DAppDashboard = ({ onBack, currentUser }) => {
    const [chain, setChain] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [showChain, setShowChain] = useState(false);
    const [lastSubmittedBlockIndex, setLastSubmittedBlockIndex] = useState(null);
    const [minedBlock, setMinedBlock] = useState(null);
    const [showMinedBlockModal, setShowMinedBlockModal] = useState(false);
    const [formData, setFormData] = useState({
        sender: currentUser?.fullName || 'Anonymous',
        country: '',
        state: '',
        city: '',
        area: '',
        details: '',
        additionalResources: ''
    });
    const [selectedResponders, setSelectedResponders] = useState([]);

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const mapMarkers = useRef([]);
    const blockchainSectionRef = useRef(null);
    //  IMPORTANT: Add your Google Maps API Key here
    const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';

    const loadGoogleMapsScript = () => {
        if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY') {
            setStatusMessage("Map is disabled. Missing GOOGLE_MAPS_API_KEY.");
            return;
        }
        if (window.google) {
            initMap();
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geocoding`;
        script.async = true;
        script.onload = () => initMap();
        document.head.appendChild(script);
    };

    const initMap = async () => {
        if (!mapRef.current || mapInstance.current || !window.google) return;
        try {
            const { Map } = await window.google.maps.importLibrary("maps");
            mapInstance.current = new Map(mapRef.current, {
                zoom: 12,
                center: { lat: 23.0225, lng: 72.5714 }, // Default to Ahmedabad
                mapId: "EMERGENCY_DAPP_MAP_ID",
            });
        } catch (e) {
            console.error("Error loading Google Maps: ", e);
            setStatusMessage("Error loading Google Maps. Check API Key and internet.");
        }
    };

    const fetchChain = async (shouldScroll = false) => {
        try {
            const response = await fetch(`${API_URL}/chain`); // Assuming backend has /chain
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setChain(data.chain);
            updateMapMarkers(data.chain.flatMap(block => block.emergencies));
            setShowChain(true);
            if (shouldScroll && blockchainSectionRef.current) {
                requestAnimationFrame(() => {
                    blockchainSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
        } catch (error) {
            console.error("Failed to fetch chain:", error);
            setStatusMessage('Error: Could not connect to the API or fetch chain.');
        }
    };

    useEffect(() => {
        loadGoogleMapsScript();
        fetchChain();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleResponderSelect = (responder) => {
        setSelectedResponders(prev =>
            prev.includes(responder) ? prev : [...prev, responder]
        );
    };

    const handleDisasterSelect = (disaster) => setFormData(prev => ({ ...prev, details: disaster }));
    const handleCrimeSelect = (crime) => setFormData(prev => ({ ...prev, details: crime }));

    const updateMapMarkers = (emergencies) => {
        if (!mapInstance.current || !window.google) return;

        mapMarkers.current.forEach(marker => marker.setMap(null));
        mapMarkers.current = [];

        emergencies.forEach(e => {
            if (!Array.isArray(e.location) || e.location.length !== 2) return;
            const [lat, lng] = e.location;

            // Check if lat/lng are valid numbers
            if (isNaN(lat) || isNaN(lng)) {
                console.warn("Invalid location data for emergency:", e);
                return;
            }

            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map: mapInstance.current,
                title: `Emergency: ${e.details}`,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            const infowindow = new window.google.maps.InfoWindow({
                content: `<b>Emergency Report</b><br><strong>Details:</strong> ${e.details}<br><strong>Resources:</strong> ${e.resources.join(', ')}`
            });
            marker.addListener("click", () => infowindow.open(mapInstance.current, marker));
            mapMarkers.current.push(marker);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Processing...');

        const { sender, details, country, state, city, area, additionalResources } = formData;
        const address = `${area}, ${city}, ${state}, ${country}`;

        if (!address.replace(/,/g, '').trim()) {
            setStatusMessage('Please enter a location.');
            return;
        }
        if (!window.google || !window.google.maps.Geocoder) {
            setStatusMessage('Geocoding library not loaded. Check API Key.');
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, async (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                const resources = [...new Set([...selectedResponders, ...additionalResources.split(',').map(r => r.trim()).filter(Boolean)])];

                try {
                    const response = await fetch(`${API_URL}/emergencies/new`, { // Assuming backend has /emergencies/new
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            sender,
                            details,
                            location: [location.lat(), location.lng()],
                            resources
                        })
                    });
                    if (!response.ok) throw new Error('Failed to submit report');

                    const data = await response.json();
                    setStatusMessage(data.message);
                    setLastSubmittedBlockIndex(
                        typeof data.block_index === 'number' ? data.block_index : null
                    );
                    setFormData(prev => ({ ...prev, country: '', state: '', city: '', area: '', details: '', additionalResources: '' }));
                    setSelectedResponders([]);
                    fetchChain(); // Refresh chain after submitting
                } catch (error) {
                    console.error("Submission error:", error);
                    setStatusMessage('Error submitting report.');
                }
            } else {
                setStatusMessage('Geocoding failed: Location not found.');
            }
        });
    };

    const mineBlock = async () => {
        setStatusMessage('Mining new block...');
        try {
            const response = await fetch(`${API_URL}/mine`, { method: 'POST' }); // Assuming backend has /mine
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setStatusMessage(data.message || 'New block mined.');
            setMinedBlock(data);
            setShowMinedBlockModal(true);
            setLastSubmittedBlockIndex(null);
            fetchChain();
        } catch (error) {
            console.error("Mining error:", error);
            setStatusMessage('Error mining block.');
            setMinedBlock(null);
            setShowMinedBlockModal(false);
        }
    };

    const handleCloseMinedBlockModal = () => {
        setShowMinedBlockModal(false);
        setMinedBlock(null);
    };

    // Options for dropdowns
    const disasterOptions = ["Earthquake - Cat 5", "Earthquake - Cat 4", "Earthquake - Cat 3", "Earthquake - Cat 2", "Earthquake - Cat 1", "Tsunami", "Flood", "Wildfire", "Hurricane", "Volcanic Eruption", "Landslide", "Drought", "Blizzard"];
    const crimeOptions = ["Robbery", "Assault", "Burglary", "Theft", "Vandalism", "Bomb Threat", "Active Shooter", "Hostage Situation", "Arson", "Kidnapping"];
    const responderOptions = ["Police", "Paramedics", "Fire Brigade", "Disaster Response Team (NDRF/SDRF)", "Bomb Squad", "Coast Guard", "Mountain Rescue"];


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-8 font-sans relative">
            <BackButton onClick={onBack} />
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-5xl font-bold text-center dark:text-white">Emergency Coordination DApp</h1>
                <p className="text-center text-xl dark:text-gray-300">Welcome, {currentUser?.fullName || 'User'} {currentUser?.profession ? `(${currentUser.profession})` : ''}</p>

                {/* Report Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700 dark:text-white text-center">Select Emergency Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SearchableDropdown title="Disaster" options={disasterOptions} onSelect={handleDisasterSelect} color="red" />
                        <SearchableDropdown title="Crimes & Attack" options={crimeOptions} onSelect={handleCrimeSelect} color="blue" />
                        <SearchableDropdown title="Responder" options={responderOptions} onSelect={handleResponderSelect} isMultiSelect={true} color="green" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700 dark:text-white">Report Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">Reporter Name</label>
                            <input type="text" id="sender" value={formData.sender} onChange={handleInputChange} className="w-full p-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-lg" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">Country</label>
                                <input type="text" id="country" value={formData.country} onChange={handleInputChange} className="w-full p-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-lg" placeholder="e.g., India" />
                            </div>
                             <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">State</label>
                                <input type="text" id="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-lg" placeholder="e.g., Gujarat" />
                            </div>
                             <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">City</label>
                                <input type="text" id="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-lg" placeholder="e.g., Ahmedabad" />
                            </div>
                             <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">Area</label>
                                <input type="text" id="area" value={formData.area} onChange={handleInputChange} className="w-full p-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-lg" placeholder="e.g., Satellite" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">Details (Select a type above or enter manually)</label>
                            <textarea id="details" value={formData.details} onChange={handleInputChange} rows="3" className="w-full p-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-lg" placeholder="e.g., 'Tornado damage, multiple injuries...'"></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">Selected Responders</label>
                            <textarea id="selected-responders" value={selectedResponders.join(', ')} rows="2" className="w-full p-3 border border-gray-300 dark:bg-gray-900 dark:border-gray-600 rounded-md bg-gray-100 text-lg" readOnly placeholder="Select responders from the dropdown above..."></textarea>
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 text-lg">Additional Resources Needed (comma-separated)</label>
                            <input type="text" id="additionalResources" value={formData.additionalResources} onChange={handleInputChange} className="w-full p-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-lg" placeholder="e.g., 'water, food, shelter'" />
                        </div>
                        <button type="submit" className="btn w-full bg-red-500 text-white p-3 rounded-md font-bold hover:bg-red-600 text-xl">Submit Report</button>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex justify-around">
                    <button onClick={mineBlock} className="btn bg-blue-500 text-white p-3 rounded-md font-bold hover:bg-blue-600 text-lg">Mine New Block</button>
                    <button onClick={() => updateMapMarkers(chain.flatMap(b => b.emergencies))} className="btn bg-yellow-500 text-white p-3 rounded-md font-bold hover:bg-yellow-600 text-lg">Refresh Map</button>
                    <button onClick={() => fetchChain(true)} className="btn bg-green-500 text-white p-3 rounded-md font-bold hover:bg-green-600 text-lg">View Blockchain</button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700 dark:text-white">Live Emergency Map</h2>
                    {GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY' ? (
                         <div className="h-96 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <p className="text-yellow-700 dark:text-yellow-200 text-lg font-bold">Map is disabled. Please add a valid GOOGLE_MAPS_API_KEY to the code.</p>
                        </div>
                    ) : (
                         <div id="map" ref={mapRef} style={{ height: '400px', borderRadius: '1rem' }}></div>
                    )}
                </div>

                {lastSubmittedBlockIndex !== null && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200 rounded-xl px-4 py-3 text-center text-lg font-semibold">
                        Next block index: {lastSubmittedBlockIndex}
                    </div>
                )}

                <div className="text-center text-xl font-semibold text-gray-700 dark:text-gray-200">{statusMessage}</div>

                {showChain && (
                    <div ref={blockchainSectionRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <h2 className="text-3xl font-bold mb-4 text-gray-700 dark:text-white">Blockchain Records</h2>
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                            {chain.slice().reverse().map(block => ( // Show newest first
                                <div key={block.index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                    <p><strong>Block #:</strong> {block.index}</p>
                                    <p><strong>Timestamp:</strong> {new Date(block.timestamp * 1000).toLocaleString()}</p>
                                    <p className="text-sm"><strong>Hash:</strong> <span className="break-all">{block.hash}</span></p>
                                    <p className="text-sm"><strong>Prev. Hash:</strong> <span className="break-all">{block.previous_hash}</span></p>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-gray-600 dark:text-gray-200">Emergencies:</h4>
                                        {block.emergencies.length > 0 ? block.emergencies.map((e, idx) => (
                                            <div key={idx} className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                                                <p><strong>Reporter:</strong> {e.sender}</p>
                                                <p><strong>Details:</strong> {e.details}</p>
                                                <p><strong>Location:</strong> Lat: {e.location[0].toFixed(4)}, Lon: {e.location[1].toFixed(4)}</p>
                                                <p><strong>Resources:</strong> {e.resources.join(', ')}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Report Timestamp: {new Date(e.timestamp * 1000).toLocaleString()}</p>
                                            </div>
                                        )) : <p className="text-gray-500 dark:text-gray-400">No emergencies in this block.</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {showMinedBlockModal && minedBlock && (
                <MinedBlockModal block={minedBlock} onClose={handleCloseMinedBlockModal} />
            )}
        </div>
    );
};


// --- TASKFORCE COMPONENTS ---
// ... (ParamedicIcon, PoliceIcon, FirefighterIcon) ...

const TaskforceLoginPage = ({ onLogin, onBack, onParamedicSelect, onPoliceSelect, onFirefighterSelect }) => {
    const [name, setName] = useState(''); // Used for registration identification
    const [profession, setProfession] = useState(null);
    const [username, setUsername] = useState(''); // Added for login
    const [password, setPassword] = useState(''); // Added for login
    const [isLoginView, setIsLoginView] = useState(false); // Toggle between Register/Login
    const [error, setError] = useState(''); // For login errors


    const handleProfessionSelect = (prof) => {
        setProfession(prof);
    };

    const handleRegisterSubmit = () => {
        if (!name || !profession) {
            alert("Please enter your name and select a profession.");
            return;
        }

        if (profession === 'Paramedic') {
            onParamedicSelect(name);
        } else if (profession === 'Police') {
            onPoliceSelect(name);
        } else if (profession === 'Firefighter') {
            onFirefighterSelect(name);
        }
    };

    const handleLoginSubmit = async () => {
        setError('');
        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/login`, { // Assuming a general login endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (result.status === 'success') {
                onLogin(result.user); // Pass user data to the next view
            } else {
                setError(result.message || 'Login failed.');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError('Could not connect to the server.');
        }
    };

    const professionCardStyles = "flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300";
    const selectedStyles = "bg-indigo-600 border-indigo-600 text-white scale-105 shadow-lg";
    const unselectedStyles = "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700";
    const inputStyles = "w-full text-xl p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500";
    const labelStyles = "text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            <BackButton onClick={onBack} />
            <div className="w-full max-w-2xl">
                 <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">{isLoginView ? 'Taskforce Login' : 'Taskforce Registration'}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                        {isLoginView ? 'Log in to access the coordination dashboard.' : 'Identify yourself to register.'}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
                     {isLoginView ? (
                         <>
                            <div>
                                <label className={labelStyles}>Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={inputStyles}
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div>
                                <label className={labelStyles}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputStyles}
                                    placeholder="Enter your password"
                                />
                            </div>
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            <button onClick={handleLoginSubmit} className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition duration-300">
                                Log In
                            </button>
                         </>
                     ) : (
                         <>
                            <div>
                                <label htmlFor="taskforceName" className={labelStyles}>Your Name</label>
                                <input
                                    id="taskforceName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputStyles}
                                    placeholder="e.g., Jane Doe"
                                />
                            </div>
                            <div>
                                <label className={labelStyles}>Select Your Profession</label>
                                 <div className="flex flex-col md:flex-row gap-4 mt-2">
                                     <div onClick={() => handleProfessionSelect('Paramedic')} className={`${professionCardStyles} ${profession === 'Paramedic' ? selectedStyles : unselectedStyles}`}>
                                         <ParamedicIcon />
                                         <span className="font-bold text-lg">Paramedics</span>
                                     </div>
                                     <div onClick={() => handleProfessionSelect('Police')} className={`${professionCardStyles} ${profession === 'Police' ? selectedStyles : unselectedStyles}`}>
                                         <PoliceIcon />
                                         <span className="font-bold text-lg">Police</span>
                                     </div>
                                     <div onClick={() => handleProfessionSelect('Firefighter')} className={`${professionCardStyles} ${profession === 'Firefighter' ? selectedStyles : unselectedStyles}`}>
                                         <FirefighterIcon />
                                         <span className="font-bold text-lg">Fire Fighters</span>
                                     </div>
                                 </div>
                            </div>
                            <button onClick={handleRegisterSubmit} className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition duration-300 disabled:bg-indigo-400" disabled={!name || !profession}>
                                Continue Registration
                            </button>
                         </>
                     )}
                     <div className="text-center mt-4">
                        <button onClick={() => setIsLoginView(!isLoginView)} className="text-indigo-500 hover:underline">
                            {isLoginView ? "Need to register?" : "Already registered? Log in"}
                        </button>
                    </div>
                </div>
                 <button onClick={onBack} className="text-center w-full mt-6 text-lg text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition">
                    &larr; Back to Role Selection
                </button>
            </div>
        </div>
    );
};

// ... (Rest of TaskforceDashboard, FeedbackPage, FaqPage) ...

// --- PARAMEDIC REGISTRATION ---
const ParamedicRegistrationPage = ({ onRegister, onBack, name }) => {
    const [formData, setFormData] = useState({
        username: '', password: '', // Added for registration
        medicalField: '', certificateName: '', certificateNumber: '', jobExperience: '',
        percentile12th: '', examsGiven: '', presentAddress: '', permanentAddress: '', phone1: '', phone2: ''
    });
    const [copyAddress, setCopyAddress] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCopyAddress = (e) => {
        setCopyAddress(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    };

    useEffect(() => {
        if (copyAddress) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    }, [formData.presentAddress, copyAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registrationData = {
            username: formData.username,
            password: formData.password,
            fullName: name,
            profession: 'Paramedic',
            details: { ...formData } // Nest other details
        };
        // Remove password from details if you don't want it stored there
        delete registrationData.details.password;
        delete registrationData.details.username;

        try {
            const response = await fetch(`${API_URL}/register/taskforce`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setShowSuccessPopup(true); // Show success popup
            } else {
                alert('Registration failed: ' + result.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Could not connect to the server.');
        }
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        onRegister(); // Proceed to login/dashboard view after popup closes
    };

    const inputStyles = "p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-lg";
    const labelStyles = "text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center py-8 px-4 font-sans relative">
            <BackButton onClick={onBack} />
             {showSuccessPopup && <SuccessPopup message="Registration Completed!" onClose={handlePopupClose} />}
            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Paramedic Registration</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xl">Please provide your professional and academic details.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
                    {/* Account Details */}
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Account Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Choose a password" className={`${inputStyles} mt-1`} required />
                           </div>
                        </div>
                    </div>

                    {/* Medical Details */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Medical & Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Field in Medicine</label>
                                <select name="medicalField" value={formData.medicalField} onChange={handleChange} className={`${inputStyles} mt-1`} required>
                                    <option value="">Select your field</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="EMT">EMT</option>
                                    <option value="Pharmacist">Pharmacist</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                             <div>
                                <label className={labelStyles}>Total Job Experience (Years)</label>
                                <input name="jobExperience" type="number" value={formData.jobExperience} onChange={handleChange} placeholder="e.g., 5" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Medical Certificate Name</label>
                                <input name="certificateName" value={formData.certificateName} onChange={handleChange} placeholder="e.g., Registered Nurse" className={`${inputStyles} mt-1`} required />
                           </div>
                           <div>
                                <label className={labelStyles}>Certificate Number</label>
                                <input name="certificateNumber" value={formData.certificateNumber} onChange={handleChange} placeholder="Certificate Number" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelStyles}>Upload CV</label>
                                <input type="file" accept=".pdf,.doc,.docx" className="w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1" />
                            </div>
                        </div>
                    </div>

                     {/* Academic Details */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Academic Background</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <label className={labelStyles}>12th Grade Percentile</label>
                                <input name="percentile12th" type="number" step="0.01" value={formData.percentile12th} onChange={handleChange} placeholder="e.g., 85.5" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Entrance Exams Given</label>
                                <input name="examsGiven" value={formData.examsGiven} onChange={handleChange} placeholder="e.g., NEET, MCAT" className={`${inputStyles} mt-1`} />
                            </div>
                        </div>
                    </div>

                     {/* Address & Contact */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Address & Contact</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelStyles}>Present Address</label>
                                <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange} placeholder="Your current address" rows="3" className={`${inputStyles} mt-1`} required></textarea>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-lg">
                                    <input type="checkbox" checked={copyAddress} onChange={handleCopyAddress} className="h-5 w-5"/>
                                    Permanent address is the same as present
                                </label>
                                <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Your permanent address" rows="3" className={`${inputStyles} mt-2`} required disabled={copyAddress}></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyles}>Primary Phone Number</label>
                                    <input name="phone1" type="tel" value={formData.phone1} onChange={handleChange} placeholder="Primary Phone" className={`${inputStyles} mt-1`} required />
                                </div>
                                <div>
                                    <label className={labelStyles}>Alternate Phone Number</label>
                                    <input name="phone2" type="tel" value={formData.phone2} onChange={handleChange} placeholder="Alternate Phone" className={`${inputStyles} mt-1`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition">
                        Submit Registration
                    </button>
                </form>
                 <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Taskforce Login
                </button>
            </div>
        </div>
    );
};

// --- POLICE REGISTRATION ---
const PoliceRegistrationPage = ({ onRegister, onBack, name }) => {
    const [formData, setFormData] = useState({
        username: '', password: '', // Added for registration
        stationPosting: '', rank: '', graduationCourse: '', percentile12th: '',
        academyName: '', certificateDetails: '', presentAddress: '', permanentAddress: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [copyAddress, setCopyAddress] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCopyAddress = (e) => {
        setCopyAddress(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    };

    useEffect(() => {
        if (copyAddress) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    }, [formData.presentAddress, copyAddress]);

    const handleSubmit = async (e) => {
         e.preventDefault();
        const registrationData = {
            username: formData.username,
            password: formData.password,
            fullName: name,
            profession: 'Police',
            details: { ...formData } // Nest other details
        };
        // Remove sensitive/account info from details
        delete registrationData.details.password;
        delete registrationData.details.username;

        try {
            const response = await fetch(`${API_URL}/register/taskforce`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setShowSuccessPopup(true); // Show success popup
            } else {
                alert('Registration failed: ' + result.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Could not connect to the server.');
        }
    };

     const handlePopupClose = () => {
        setShowSuccessPopup(false);
        onRegister(); // Proceed after popup closes
    };

    const inputStyles = "p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-lg";
    const labelStyles = "text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center py-8 px-4 font-sans relative">
            <BackButton onClick={onBack} />
             {showSuccessPopup && <SuccessPopup message="Registration Completed!" onClose={handlePopupClose} />}
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Police Officer Registration</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xl">Please provide your professional and service details.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
                    {/* Account Details */}
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Account Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Choose a password" className={`${inputStyles} mt-1`} required />
                           </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column */}
                        <div className="flex-1 space-y-6">
                            <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Professional Details</h2>
                             <div>
                                <label className={labelStyles}>Full Name</label>
                                <input type="text" value={name} className={`${inputStyles} mt-1 bg-gray-200 dark:bg-gray-700`} readOnly />
                            </div>
                            <div>
                                <label className={labelStyles}>Current Posting</label>
                                <input name="stationPosting" value={formData.stationPosting} onChange={handleChange} placeholder="e.g., Central Precinct" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Rank</label>
                                <input name="rank" value={formData.rank} onChange={handleChange} placeholder="e.g., Sergeant" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Police Academy / Institution</label>
                                <input name="academyName" value={formData.academyName} onChange={handleChange} placeholder="Name of Training Academy" className={`${inputStyles} mt-1`} required />
                            </div>
                             <div>
                                <label className={labelStyles}>Certificate & Training Details</label>
                                <textarea name="certificateDetails" value={formData.certificateDetails} onChange={handleChange} placeholder="e.g., Certificate No, Specializations" rows="3" className={`${inputStyles} mt-1`} required></textarea>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex-1 space-y-6">
                            <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Academic & Personal Details</h2>
                            <div>
                                <label className={labelStyles}>12th Grade Percentage</label>
                                <input name="percentile12th" type="number" step="0.01" value={formData.percentile12th} onChange={handleChange} placeholder="e.g., 88.5" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Additional Graduation / Courses</label>
                                <input name="graduationCourse" value={formData.graduationCourse} onChange={handleChange} placeholder="e.g., B.A. in Criminology" className={`${inputStyles} mt-1`} />
                            </div>
                            <div>
                                <label className={labelStyles}>Upload CV</label>
                                <input type="file" accept=".pdf,.doc,.docx" className="w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1" />
                            </div>
                             <div>
                                <label className={labelStyles}>Profile Image</label>
                                <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1" />
                                {imagePreview && <img src={imagePreview} alt="Profile Preview" className="mt-4 rounded-lg w-32 h-32 object-cover" />}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                        <h2 className="text-2xl font-bold">Address Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Temporary Address</label>
                                <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange} placeholder="Your current address" rows="3" className={`${inputStyles} mt-1`} required></textarea>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-lg mb-1">
                                    <input type="checkbox" checked={copyAddress} onChange={handleCopyAddress} className="h-5 w-5"/>
                                    Permanent address is the same as temporary
                                </label>
                                <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Your permanent address" rows="3" className={`${inputStyles}`} required disabled={copyAddress}></textarea>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition">
                        Submit Registration
                    </button>
                </form>
                 <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Taskforce Login
                </button>
            </div>
        </div>
    );
};

// --- Firefighter Registration Page ---
const FirefighterRegistrationPage = ({ onRegister, onBack, name }) => {
    const [formData, setFormData] = useState({
        username: '', password: '', // Added for registration
        firstName: '', middleName: '', lastName: '', age: '', workExperience: '',
        institution: '', otherDegrees: '', currentStation: '',
        percentile12th: '', presentAddress: '', permanentAddress: ''
    });
    const [cvFile, setCvFile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [copyAddress, setCopyAddress] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, fileType) => {
        if (e.target.files && e.target.files[0]) {
            if (fileType === 'cv') {
                setCvFile(e.target.files[0]);
            } else if (fileType === 'photo') {
                setPhotoFile(e.target.files[0]);
                setPhotoPreview(URL.createObjectURL(e.target.files[0]));
            }
        }
    };

    const handleCopyAddress = (e) => {
        setCopyAddress(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    };

    useEffect(() => {
        if (copyAddress) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    }, [formData.presentAddress, copyAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registrationData = {
            username: formData.username,
            password: formData.password,
            // Use the name passed from the previous step if first/middle/last aren't filled
            fullName: (formData.firstName || formData.lastName) ? `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.trim() : name,
            profession: 'Firefighter',
            details: { ...formData }
        };
        // Clean up details
        delete registrationData.details.password;
        delete registrationData.details.username;
        // In a real app, you would handle file uploads separately
        registrationData.details.cvFileName = cvFile?.name;
        registrationData.details.photoFileName = photoFile?.name;

        try {
            const response = await fetch(`${API_URL}/register/taskforce`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setShowSuccessPopup(true);
            } else {
                alert('Registration failed: ' + result.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Could not connect to the server.');
        }
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        onRegister(); // Navigate after closing popup
    };

    const inputStyles = "p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-lg";
    const labelStyles = "text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center py-8 px-4 font-sans relative">
            <BackButton onClick={onBack} />
             {showSuccessPopup && <SuccessPopup message="Registration Completed!" onClose={handlePopupClose} />}
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Firefighter Registration</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xl">Please provide your credentials and details.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
                     {/* Account Details */}
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Account Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Choose a password" className={`${inputStyles} mt-1`} required />
                           </div>
                        </div>
                    </div>

                    {/* Personal & Professional Details */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Personal & Professional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label className={labelStyles}>First Name</label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className={`${inputStyles} mt-1`} required />
                            </div>
                             <div>
                                <label className={labelStyles}>Middle Name</label>
                                <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" className={`${inputStyles} mt-1`} />
                            </div>
                             <div>
                                <label className={labelStyles}>Last Name</label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Age</label>
                                <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="e.g., 30" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Work Experience (Years)</label>
                                <input name="workExperience" type="number" value={formData.workExperience} onChange={handleChange} placeholder="e.g., 8" className={`${inputStyles} mt-1`} required />
                            </div>
                             <div>
                                <label className={labelStyles}>Current Station</label>
                                <input name="currentStation" value={formData.currentStation} onChange={handleChange} placeholder="e.g., Station 5" className={`${inputStyles} mt-1`} required />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Training Institution</label>
                                <input name="institution" value={formData.institution} onChange={handleChange} placeholder="Name of Academy/Institution" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Other Degrees/Certificates</label>
                                <input name="otherDegrees" value={formData.otherDegrees} onChange={handleChange} placeholder="e.g., Hazmat Certification" className={`${inputStyles} mt-1`} />
                           </div>
                             <div>
                                <label className={labelStyles}>12th Marks (%)</label>
                                <input name="percentile12th" type="number" step="0.01" value={formData.percentile12th} onChange={handleChange} placeholder="e.g., 75.0" className={`${inputStyles} mt-1`} required />
                            </div>
                        </div>
                    </div>

                    {/* File Uploads */}
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Documents & Photo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Upload CV</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'cv')} accept=".pdf,.doc,.docx" className="w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1" />
                            </div>
                             <div>
                                <label className={labelStyles}>Upload Your Photo</label>
                                <input type="file" onChange={(e) => handleFileChange(e, 'photo')} accept="image/*" className="w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1" />
                                {photoPreview && <img src={photoPreview} alt="Profile Preview" className="mt-4 rounded-lg w-32 h-32 object-cover" />}
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Address Information</h2>
                        <div>
                             <label className={labelStyles}>Present Address</label>
                             <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange} placeholder="Your current address" rows="3" className={`${inputStyles} mt-1`} required></textarea>
                         </div>
                        <div>
                            <label className="flex items-center gap-2 text-lg">
                                <input type="checkbox" checked={copyAddress} onChange={handleCopyAddress} className="h-5 w-5"/>
                                Permanent address is the same as present
                            </label>
                            <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Your permanent address" rows="3" className={`${inputStyles} mt-2`} required disabled={copyAddress}></textarea>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition">
                        Submit Registration
                    </button>
                </form>
                 <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Taskforce Login
                </button>
            </div>
        </div>
    );
};

// --- VOLUNTEER REGISTRATION ---
const VolunteerRegistrationPage = ({ onRegister, onBack }) => {
    const [formData, setFormData] = useState({
        username: '', password: '', // Added
        firstName: '', middleName: '', lastName: '',
        phone: '', altPhone: '', aadhar: '',
        graduation: '', academy: '', profession: '',
        presentAddress: '', permanentAddress: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [copyAddress, setCopyAddress] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCopyAddress = (e) => {
        setCopyAddress(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    };

    useEffect(() => {
        if (copyAddress) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
        }
    }, [formData.presentAddress, copyAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registrationData = {
            username: formData.username,
            password: formData.password,
            fullName: `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.trim(),
            profession: 'Volunteer',
            details: { ...formData }
        };
        delete registrationData.details.username;
        delete registrationData.details.password;
        delete registrationData.details.firstName;
        delete registrationData.details.middleName;
        delete registrationData.details.lastName;

        try {
            const response = await fetch(`${API_URL}/register/volunteer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });
            const result = await response.json();
            if (result.status === 'success') {
                setShowSuccessPopup(true);
            } else {
                alert('Registration failed: ' + result.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Could not connect to the server.');
        }
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        onRegister(); // Go back to home
    };

    const inputStyles = "p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-lg";
    const labelStyles = "text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center py-8 px-4 font-sans relative">
            <BackButton onClick={onBack} />
            {showSuccessPopup && <SuccessPopup message="Registration Submitted!" onClose={handlePopupClose} />}
            <div className="w-full max-w-4xl">
                 <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Volunteer Registration</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-xl">Thank you for your willingness to help. Please fill out your details.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
                     <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Account Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Username</label>
                                <input name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Choose a password" className={`${inputStyles} mt-1`} required />
                           </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className={inputStyles} required />
                        <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" className={inputStyles} />
                        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className={inputStyles} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyles}>Aadhar Card Number</label>
                            <input name="aadhar" value={formData.aadhar} onChange={handleChange} placeholder="12-digit Aadhar Number" className={`${inputStyles} mt-1`} required />
                        </div>
                         <div>
                            <label className={labelStyles}>Profession</label>
                            <input name="profession" value={formData.profession} onChange={handleChange} placeholder="Your current job" className={`${inputStyles} mt-1`} required />
                        </div>
                        <div>
                            <label className={labelStyles}>Graduation Degree</label>
                            <input name="graduation" value={formData.graduation} onChange={handleChange} placeholder="e.g., B.Com" className={`${inputStyles} mt-1`} />
                        </div>
                         <div>
                            <label className={labelStyles}>Graduation Academy</label>
                            <input name="academy" value={formData.academy} onChange={handleChange} placeholder="Name of your college/university" className={`${inputStyles} mt-1`} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Documents</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className={labelStyles}>Upload CV</label>
                                <input type="file" accept=".pdf,.doc,.docx" className="w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1" />
                            </div>
                             <div>
                                <label className={labelStyles}>Your Photo</label>
                                <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-lg file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-1" />
                                {imagePreview && <img src={imagePreview} alt="Profile Preview" className="mt-4 rounded-lg w-32 h-32 object-cover" />}
                            </div>
                         </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 pb-2">Address & Contact</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Temporary Address</label>
                                <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange} placeholder="Your current address" rows="3" className={`${inputStyles} mt-1`} required></textarea>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-lg mb-1">
                                    <input type="checkbox" checked={copyAddress} onChange={handleCopyAddress} className="h-5 w-5"/>
                                    Permanent address is the same as temporary
                                </label>
                                <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Your permanent address" rows="3" className={`${inputStyles}`} required disabled={copyAddress}></textarea>
                            </div>
                             <div>
                                <label className={labelStyles}>Phone Number</label>
                                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Primary Phone" className={`${inputStyles} mt-1`} required />
                            </div>
                            <div>
                                <label className={labelStyles}>Alternate Phone Number</label>
                                <input name="altPhone" type="tel" value={formData.altPhone} onChange={handleChange} placeholder="Alternate Phone" className={`${inputStyles} mt-1`} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition">
                        Register as Volunteer
                    </button>
                </form>
                <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Home
                </button>
            </div>
        </div>
    );
};

// --- HELP DESK PAGE (from reactfn.js - renamed) ---
const HelpDeskFormPage = ({ onBack }) => {
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Help Desk Request:", { email, message });
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setEmail('');
            setMessage('');
            onBack(); // Go back to main page after submission
        }, 3000);
    };

    const inputStyles = "p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-lg";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            <BackButton onClick={onBack} />
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Help Desk</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Please describe your issue below and we'll get back to you.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                    {submitted ? (
                        <div className="text-center text-green-500 font-bold text-xl">
                            Your request has been submitted! We will contact you shortly.
                        </div>
                    ) : (
                        <>
                            <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email ID" className={inputStyles} required />
                            <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" rows="6" className={inputStyles} required></textarea>
                            <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition">
                                Submit Request
                            </button>
                        </>
                    )}
                </form>
                 <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Home
                </button>
            </div>
        </div>
    );
};

// --- About Us and Help Desk Pages (from reactFN.js) ---

const AboutUsPage = ({ onBack }) => {
    // State to track if the user has scrolled down
    const [isFoundersVisible, setFoundersVisible] = useState(false);

    // More detailed team data structure
    // --- UPDATED TEAM DATA with shadowClass for backlight effect ---
    const team = [
        {
            name: 'Mohammed Ayaan Asfaq Malek',
            image: '/images/ayaan.jpg', // Placeholder image
            github: 'https://github.com/AyaanMalek',
            linkedin: 'https://www.linkedin.com/in/ayaanmalek/',
            // Added red backlight/shadow
            shadowClass: 'shadow-red-500/40 hover:shadow-red-400/60'
        },
        {
            name: 'Abhisheksinh Rathod',
            image: '/images/abhishek.jpg', // Placeholder image
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            // Added blue backlight/shadow
            shadowClass: 'shadow-blue-500/40 hover:shadow-blue-400/60'
        },
        {
            name: 'Adhish Prasad',
            image: '/images/adhish.jpg', // Placeholder image
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            // Added green backlight/shadow
            shadowClass: 'shadow-green-500/40 hover:shadow-green-400/60'
        },
    ];

    // Effect to handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setFoundersVisible(true);
            } else {
                setFoundersVisible(false);
            }
        };
        // Need to attach to the main window or a scrollable container
        // This component might be the root, so window is fine.
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Trigger once on mount in case it's already scrolled
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        // Added overflow-y-auto to the root div to make it scrollable
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 font-sans relative overflow-y-auto">
            <BackButton onClick={onBack} />
            <div className="container mx-auto px-4 py-16">
                {/* Top Section */}
                <div className="text-center max-w-3xl mx-auto mb-24 animate-fade-in-scale">
                    <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">About Our Project</h1>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mt-6 space-y-4">
                         <p>
                            This platform is a state-of-the-art decentralized application designed to revolutionize emergency response. Our mission is to create a seamless, real-time coordination hub that connects citizens, first responders, and volunteers, ensuring that critical aid is dispatched efficiently and transparently when it's needed most.
                        </p>
                        <p>
                            Born from a vision to leverage cutting-edge technology for societal benefit, this project was developed by a passionate team of third-year undergraduate students. As learners pursuing a Bachelor of Technology in Computer Science & Engineering with a specialization in AI & Machine Learning, we are driven to apply complex solutions to real-world challenges. This hub represents our commitment to building resilient communities through innovation.
                        </p>
                        <p className="font-semibold text-indigo-500 dark:text-indigo-400 pt-4">Scroll down to meet the team.</p>
                    </div>
                </div>

                {/* Founders Section - Appears on scroll */}
                <div
                    // This logic is tricky without a parent scroll container.
                    // For simplicity, let's just show it.
                    // className={`transition-opacity duration-1000 ${isFoundersVisible ? 'opacity-100' : 'opacity-0'}`}
                    className="transition-opacity duration-1000 opacity-100"
                >
                    <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
                        Founders
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                // Applied the shadowClass here for the backlight effect
                                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center shadow-2xl ${member.shadowClass}`}
                            >
                                <img
                                    src={member.image}
                                    alt={`Profile of ${member.name}`}
                                    className="w-32 h-32 rounded-full mb-4 border-4 border-indigo-200 dark:border-indigo-800 object-cover"
                                />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                                <div className="flex space-x-4 mt-4">
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                                        aria-label={`${member.name}'s GitHub Profile`}
                                    >
                                        <FaGithub size={28} />
                                    </a>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                                        aria-label={`${member.name}'s LinkedIn Profile`}
                                    >
                                        <FaLinkedin size={28} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HelpDeskContactPage = ({ onBack }) => {
    const [copied, setCopied] = useState(''); // can be 'email', 'phone', or ''
    const email = 'support@emergencyhub.co.in';
    const phone = '+91 14229 14104';

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(type);
            setTimeout(() => setCopied(''), 2000); // Hide message after 2 seconds
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            <BackButton onClick={onBack} />
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center max-w-lg mx-4 transform transition-all duration-500 opacity-0 animate-fade-in-scale">
                <h1 className="text-5xl font-extrabold text-gray-800 dark:text-gray-100">Contact Us</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-4 mb-8 text-xl">
                    Contact us for any support or inquiries. Click to copy.
                </p>
                <div className="space-y-6 text-left">
                    <div onClick={() => handleCopy(email, 'email')} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <EmailIcon />
                        <div>
                            <h2 className="font-bold text-xl text-gray-700 dark:text-gray-300">Email</h2>
                            <span className="text-lg text-indigo-600 dark:text-indigo-400">{email}</span>
                        </div>
                        {copied === 'email' && <span className="ml-auto text-sm font-bold text-green-500">Copied!</span>}
                    </div>
                    <div onClick={() => handleCopy(phone, 'phone')} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <PhoneIcon />
                        <div>
                            <h2 className="font-bold text-xl text-gray-700 dark:text-gray-300">Phone</h2>
                            <span className="text-lg text-indigo-600 dark:text-indigo-400">{phone}</span>
                        </div>
                        {copied === 'phone' && <span className="ml-auto text-sm font-bold text-green-500">Copied!</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- End Pages from reactFN.js ---


// --- FEEDBACK & FAQ COMPONENTS (from reactfn.js) ---

const FeedbackPage = ({ onBack }) => {
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
        }, 3000); // Reset after 3 seconds
    };

    const inputStyles = "p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 text-lg";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            <BackButton onClick={onBack} />
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Submit Feedback</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">We value your input. Let us know how we can improve.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
                    {submitted ? (
                        <div className="text-center text-green-500 font-bold text-xl">
                            Thank you for your feedback!
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" type="text" placeholder="Your Name (Optional)" className={inputStyles} />
                                <input name="email" type="email" placeholder="Your Email (Optional)" className={inputStyles} />
                            </div>
                            <div>
                                <label className="text-lg font-bold text-gray-700 dark:text-gray-300">Feedback Type</label>
                                <select name="feedbackType" className={`${inputStyles} mt-1`}>
                                    <option>General Suggestion</option>
                                    <option>Report a Bug</option>
                                    <option>Feature Request</option>
                                    <option>Usability Issue</option>
                                </select>
                            </div>
                            <textarea name="message" placeholder="Your message..." rows="5" className={inputStyles} required></textarea>
                             <div>
                                <label className="text-lg font-bold text-gray-700 dark:text-gray-300">Rate Your Experience</label>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`h-8 w-8 cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.956a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.956c.3.921-.755 1.688-1.54 1.118l-3.368-2.446a1 1 0 00-1.176 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.05 9.383c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-bold text-xl transition">
                                Send Feedback
                            </button>
                        </>
                    )}
                </form>
                <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Role Selection
                </button>
            </div>
        </div>
    );
};

const FaqPage = ({ onBack }) => {
    const faqs = [
        { q: "What is this platform for?", a: "This is a decentralized application for coordinating emergency response efforts in real-time, connecting citizens, taskforce members, and volunteers." },
        { q: "How do I report an emergency?", a: "Select the 'Citizen' role, complete the quick verification process, and fill out the emergency report form with as much detail as possible. Providing an accurate location is crucial." },
        { q: "Is my data secure?", a: "Yes, our platform uses robust security measures to ensure that all reported data is secure, transparent, and tamper-proof. Personal information is handled with strict confidentiality." },
        { q: "Who can be a volunteer?", a: "Anyone who wants to help can sign up as a volunteer. After a simple registration, you will be able to see requests for assistance in your area and offer your support." },
        { q: "What are the requirements to be a Taskforce member?", a: "Taskforce members are typically professionals from police, paramedic, and fire departments. Specific registration details and verification are required during the sign-up process for each role." },
        { q: "How is my location data used as a Citizen?", a: "Location data is critical and is used only to dispatch the nearest responders to your emergency. It is not stored long-term or used for any other purpose." },
        { q: "What kind of help can I offer as a Volunteer?", a: "Volunteers can assist with non-critical tasks like providing supplies, transportation, or support at designated shelters, depending on the nature of the emergency and the needs communicated by coordinators." }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            <BackButton onClick={onBack} />
            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold">Frequently Asked Questions</h1>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-4">
                    {faqs.map((faq, index) => (
                        <details key={index} className="p-4 border dark:border-gray-700 rounded-lg text-lg">
                            <summary className="font-bold cursor-pointer">{faq.q}</summary>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.a}</p>
                        </details>
                    ))}
                </div>
                <button onClick={onBack} className="text-center w-full mt-6 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition text-lg">
                    &larr; Back to Role Selection
                </button>
            </div>
        </div>
    );
};


// --- Main App Component ---
// This component now manages which view is active (splash, login, or DApp)
export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('roleSelection');
    const [theme, setTheme] = useState('dark'); // Default to dark mode
    const hasShownPopup = useRef(false);
    const [showPopup, setShowPopup] = useState(false);
    const [taskforceName, setTaskforceName] = useState('');
    const [currentUser, setCurrentUser] = useState(null); // State for logged in user

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            if (!hasShownPopup.current) {
                setShowPopup(true);
                hasShownPopup.current = true;
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleSelection = (selection) => {
        switch (selection) {
            case 'Citizen':
                setView('verification');
                break;
            case 'Taskforce':
                setView('taskforceLogin');
                break;
            case 'Volunteer':
                setView('volunteerRegistration');
                break;
            case 'Feedback':
                setView('feedback');
                break;
            case 'FAQ':
                setView('faq');
                break;
            default: // Admin
                setView('adminTwoFactor');
                break;
        }
    };

    const resetView = () => {
        setView('roleSelection');
        setTaskforceName('');
        setCurrentUser(null);
    }

    // Function to handle successful registration and redirect to login
    const handleSuccessfulRegistration = () => {
        setView('taskforceLogin'); // Go back to login view
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    // --- Conditional Rendering Logic ---
    if (view === 'verification') return <CitizenVerificationPage onVerified={() => setView('profileSetup')} onBack={resetView} />;
    if (view === 'profileSetup') return <CitizenProfileForm onProfileSubmit={() => setView('dashboard')} onBack={resetView} />;
    if (view === 'dashboard') return <DAppDashboard currentUser={null} onBack={resetView} />; // Render DApp for Citizen
    if (view === 'adminTwoFactor') return <AdminTwoFactor onBack={resetView} />;
    if (view === 'taskforceLogin') return <TaskforceLoginPage onLogin={(user) => { setCurrentUser(user); setView('taskforceDashboard'); }} onBack={resetView} onParamedicSelect={(name) => { setTaskforceName(name); setView('paramedicRegistration'); }} onPoliceSelect={(name) => { setTaskforceName(name); setView('policeRegistration'); }} onFirefighterSelect={(name) => { setTaskforceName(name); setView('firefighterRegistration'); }}/>;
    if (view === 'paramedicRegistration') return <ParamedicRegistrationPage name={taskforceName} onRegister={handleSuccessfulRegistration} onBack={() => setView('taskforceLogin')} />;
    if (view === 'policeRegistration') return <PoliceRegistrationPage name={taskforceName} onRegister={handleSuccessfulRegistration} onBack={() => setView('taskforceLogin')} />;
    if (view === 'firefighterRegistration') return <FirefighterRegistrationPage name={taskforceName} onRegister={handleSuccessfulRegistration} onBack={() => setView('taskforceLogin')} />;
    if (view === 'taskforceDashboard') return <DAppDashboard currentUser={currentUser} onBack={resetView} />; // Render DApp for Taskforce
    if (view === 'volunteerRegistration') return <VolunteerRegistrationPage onRegister={resetView} onBack={resetView} />;
    if (view === 'feedback') return <FeedbackPage onBack={resetView} />;
    if (view === 'faq') return <FaqPage onBack={resetView} />;

    // --- New/Renamed Views ---
    if (view === 'aboutUs') return <AboutUsPage onBack={resetView} />;
    if (view === 'helpDeskContact') return <HelpDeskContactPage onBack={resetView} />;
    if (view === 'helpDeskForm') return <HelpDeskFormPage onBack={resetView} />;


    // --- Default View: Role Selection ---
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 font-sans relative">
            {showPopup && <WelcomePopup onEnter={() => setShowPopup(false)} />}

            {/* --- Header Buttons (Merged) --- */}
            <div className="absolute top-6 left-6 flex gap-4 z-10">
                <button
                    onClick={() => setView('aboutUs')}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-semibold shadow"
                >
                    About Us
                </button>
                <button
                    onClick={() => setView('helpDeskContact')}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-semibold shadow"
                >
                    Contact Us
                </button>
            </div>

            <div className="absolute top-6 right-6">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>

            <header className="flex flex-col items-center justify-center text-center mb-10">
                <div className="flex items-center gap-4">
                    <AppLogo />
                    <h1 className="text-6xl font-extrabold">Emergency Coordination Hub</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-4 text-xl">Please select your role or an option to continue.</p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
                {/* Admin Block */}
                <div onClick={() => handleSelection('Admin')} className="group h-80 bg-gray-700 dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-indigo-500/20">
                    <AdminIcon />
                    <h2 className="text-3xl font-bold text-white">Admin</h2>
                    <p className="text-lg text-gray-400 dark:text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Oversee operations.
                    </p>
                </div>

                {/* Citizen Block */}
                <div onClick={() => handleSelection('Citizen')} className="group h-80 bg-blue-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-blue-500/30">
                    <CitizenIcon />
                    <h2 className="text-3xl font-bold text-white">Citizen</h2>
                    <p className="text-lg text-blue-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Report an emergency.
                    </p>
                </div>

                {/* Taskforce Block */}
                <div onClick={() => handleSelection('Taskforce')} className="group h-80 bg-red-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-red-500/30">
                    <TaskforceIcon />
                    <h2 className="text-3xl font-bold text-white">Taskforce</h2>
                    <p className="text-lg text-red-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Access incident reports.
                    </p>
                </div>

                {/* Volunteer Block */}
                <div onClick={() => handleSelection('Volunteer')} className="group h-80 bg-green-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-green-500/30">
                    <VolunteerIcon />
                    <h2 className="text-3xl font-bold text-white">Volunteer</h2>
                    <p className="text-lg text-green-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Offer assistance.
                    </p>
                </div>
            </main>

            <footer className="w-full max-w-5xl mt-12 pb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Have Questions or Suggestions?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg">Check our FAQ or leave us your feedback.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleSelection('Feedback')} className="flex items-center gap-3 px-6 py-3 bg-purple-600 rounded-lg cursor-pointer transition-all duration-300 hover:bg-purple-700 transform hover:scale-105">
                            <FeedbackIcon />
                            <span className="font-bold text-white text-lg">Feedback</span>
                        </button>
                        <button onClick={() => handleSelection('FAQ')} className="flex items-center gap-3 px-6 py-3 bg-yellow-500 rounded-lg cursor-pointer transition-all duration-300 hover:bg-yellow-700 transform hover:scale-1GET">
                            <FaqIcon />
                            <span className="font-bold text-white text-lg">FAQ's</span>
                        </button>
                    </div>
                </div>
            </footer>

            <div className="text-center w-full max-w-5xl mt-4 pb-8 text-gray-500 dark:text-gray-400 flex flex-col md:flex-row justify-center items-center gap-4">
                <p>For assistance, contact Customer Care: <a href="tel:7201965361" className="font-bold text-indigo-500 hover:underline">1465914204</a></p>
                <span className="hidden md:inline">|</span>
                <button onClick={() => setView('helpDeskForm')} className="font-bold text-indigo-500 hover:underline">
                    Help Desk (Submit Ticket)
                </button>
            </div>

             <style jsx="true" global="true">{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 1.5s ease-in-out;
                }
                @keyframes fade-out {
                    from { opacity: 1; }
                    to { opacity: 0; visibility: hidden; }
                }
                .animate-fade-out {
                    animation: fade-out 1s ease-in-out 3s forwards;
                }
                @keyframes fade-in-scale {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}

// --- Helper Component for Searchable Dropdowns (for DAppDashboard) ---
const SearchableDropdown = ({ title, options, onSelect, isMultiSelect = false, color = 'gray' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [label, setLabel] = useState(`Select ${title}`);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        if (!isMultiSelect) {
            setLabel(option);
            setIsOpen(false);
        }
        onSelect(option);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <h3 className={`text-xl font-semibold mb-2 text-center text-${color}-600 dark:text-${color}-400`}>{title}s</h3>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-${color}-500 text-lg`}
            >
                <span className="dropdown-label">{label}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar w-full px-4 py-2 border-b dark:border-gray-700 focus:outline-none sticky top-0 dark:bg-gray-800 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="dropdown-options">
                        {filteredOptions.map(option => (
                            <li
                                key={option}
                                className={`px-4 py-2 hover:bg-${color}-50 dark:hover:bg-gray-700 cursor-pointer text-lg`}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};