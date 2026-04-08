import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="100" height="100" rx="20" fill="url(#logo_grad)" />
            <path
                d="M30 40L50 25L70 40V70C70 72.2091 68.2091 74 66 74H34C31.7909 74 30 72.2091 30 70V40Z"
                fill="white"
                className="animate-pulse"
            />
            <circle cx="50" cy="50" r="10" fill="#0f766e" />
            <defs>
                <linearGradient id="logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0f766e" />
                    <stop offset="1" stopColor="#14b8a6" />
                </linearGradient>
            </defs>
        </svg>
    );
};
