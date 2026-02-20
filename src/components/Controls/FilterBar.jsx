import React from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx'; // Make sure clsx is installed or use template literals

export default function FilterBar({
    ui,
    setUI,
    counts,
    searchQuery,
    setSearchQuery
}) {
    const { subject, hideCompleted } = ui;

    const handleSubChange = (sub) => {
        setUI(prev => ({ ...prev, subject: sub }));
    };

    const handleHideChange = (e) => {
        setUI(prev => ({ ...prev, hideCompleted: e.target.checked }));
    };

    return (
        <div className="mini">
            <div className="seg" role="tablist" aria-label="Subject filter">
                <button
                    className={clsx(subject === 'all' && 'active')}
                    onClick={() => handleSubChange('all')}
                >
                    🌐 All <span className="badge">{counts.all}</span>
                </button>
                <button
                    className={clsx(subject === 'english' && 'active')}
                    onClick={() => handleSubChange('english')}
                >
                    📘 English <span className="badge">{counts.english}</span>
                </button>
                <button
                    className={clsx(subject === 'maths' && 'active')}
                    onClick={() => handleSubChange('maths')}
                >
                    🧮 Maths <span className="badge">{counts.maths}</span>
                </button>
            </div>

            <div className="filters" style={{ margin: 0, flex: 1, justifyContent: 'flex-end' }}>
                <div className="search" title="Search modules / lessons" style={{ maxWidth: 520 }}>
                    <Search size={16} className="muted" />
                    <input
                        placeholder="Search: tenses, idioms, percentages, time & work..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <label className="toggle" title="Hide completed lessons">
                    <input
                        type="checkbox"
                        checked={hideCompleted}
                        onChange={handleHideChange}
                    />
                    Hide completed
                </label>
            </div>
        </div>
    );
}
