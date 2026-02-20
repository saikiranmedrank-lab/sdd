import React from 'react';
import clsx from 'clsx';

export default function Button({ children, variant, className, ...props }) {
    // Map variants to CSS classes from index.css
    const variantClass = {
        primary: 'primary',
        good: 'good',
        warn: 'warn',
        ghost: 'ghost',
        default: ''
    }[variant] || '';

    return (
        <button
            className={clsx('btn', variantClass, className)}
            {...props}
        >
            {children}
        </button>
    );
}
