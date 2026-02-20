import React from 'react';
import clsx from 'clsx';
import { Check, Clock } from 'lucide-react';

export default function LessonItem({ lesson, onToggle }) {
    return (
        <div className="lesson">
            <input
                className="chk"
                type="checkbox"
                checked={lesson.completed}
                onChange={() => onToggle(lesson.mi, lesson.li)}
                aria-label="mark completed"
            />
            <div>
                <div className={clsx("name", lesson.completed && "muted")} style={{ textDecoration: lesson.completed ? 'line-through' : 'none' }}>
                    {lesson.name}
                </div>
                <div className="meta">
                    {lesson.subject === 'maths' ? '🧮' : '📘'} {lesson.moduleName}
                </div>
            </div>
            <div className={clsx("dur", lesson.completed && "good-bg")}>
                {lesson.duration} • {lesson.completed ? "✅ Done" : "⏳ Pending"}
            </div>
        </div>
    );
}
