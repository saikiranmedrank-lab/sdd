import React from 'react';

export default function Layout({ children }) {
    // Header is now inside Layout or passed as children? 
    // In the original design, Header is inside .wrap but .header itself has sticky positioning.
    // The .header in CSS has `backdrop-filter` and `sticky`.
    // The .wrap has padding.
    // The original HTML structure:
    // .wrap
    //   .header (sticky)
    //     .topbar ...
    //     .mini ...
    //   .grid ...
    //
    // Wait, .header is INSIDE .wrap in original HTML?
    // Line 499: <div class="wrap">
    // Line 501:   <div class="header">
    //
    // So .header is sticky RELATIVE to .wrap? 
    // If .wrap has overflow hidden, sticky might break?
    // .wrap css: max-width:1280px; margin:0 auto; padding: ...
    // .header css: position:sticky; top:0; ...
    // Use Fragment to avoid extra nesting if possible, but strict port needs to look at CSS usage.

    return (
        <div className="wrap">
            {children}
        </div>
    );
}
