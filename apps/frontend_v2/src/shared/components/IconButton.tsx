import React from 'react';

function IconButton({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`rounded-full focus:outline-none ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}

export default IconButton;