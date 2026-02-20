import React from 'react';
import ModuleItem from './ModuleItem';

export default function ModuleList({ modules, openModules, onToggleModule, onLessonToggle }) {
    return (
        <div className="modules">
            {modules.map((m) => (
                <ModuleItem
                    key={m.mi}
                    module={m}
                    isOpen={openModules[m.mi]}
                    onToggle={onToggleModule}
                    onLessonToggle={onLessonToggle}
                />
            ))}
        </div>
    );
}
