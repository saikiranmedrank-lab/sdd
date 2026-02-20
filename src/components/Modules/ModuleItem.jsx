import React from 'react';
import LessonItem from './LessonItem';
import { fmtHM, fmtH } from '../../utils/timeUtils';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

const MotionI = motion.i;
const MotionDiv = motion.div;

export default function ModuleItem({ module, isOpen, onToggle, onLessonToggle }) {
    const { subject, module: title, mi } = module;

    // Calculate stats for this module based on ALL lessons, not just filtered ones?
    // Wait, the progress bar should reflect the module completion, but the list shows filtered lessons.
    // The module object passed here should probably contain stats pre-calculated.
    // In `App.jsx`, we'll prepare the data.

    // Let's assume `module` prop has:
    // title, subject, stats: { total, done, pct, leftCount }, lessons (visible ones)

    const { stats, lessons } = module;
    const subTag = subject === "maths" ? "maths" : "english";

    return (
        <div className="module-wrapper" style={{ marginBottom: 10 }}>
            <details
                className="module"
                open={isOpen}
                data-mi={mi}
            >
                <summary onClick={(e) => { e.preventDefault(); onToggle(mi, !isOpen); }}>
                    <div className="mLeft">
                        <div className="mTitle">
                            {title}
                            <span className={clsx("tag", subTag)}>{subject === "maths" ? "Maths" : "English"}</span>
                            <span className="tag">{stats.leftCount === 0 ? "Done" : `${stats.leftCount} left`}</span>
                            <span className="tag">{module.totalLessonsCount} lessons</span>
                        </div>
                        <div className="mSub">{fmtHM(stats.done)} completed • {fmtHM(stats.total - stats.done)} remaining</div>
                    </div>
                    <div className="mRight">
                        <div className="bar" aria-label="module progress">
                            <MotionI
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.pct}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="mMeta">{stats.pct}% • {fmtH(stats.total)}</div>
                        {isOpen ? <ChevronDown size={20} className="muted" /> : <ChevronRight size={20} className="muted" />}
                    </div>
                </summary>
            </details>

            <AnimatePresence>
                {isOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="moduleBody"
                    >
                        <div className="lessons">
                            {lessons.length === 0 ? (
                                <div style={{ color: 'var(--muted)', fontSize: 12, padding: '8px 6px' }}>
                                    No lessons match current filters.
                                </div>
                            ) : (
                                lessons.map((lesson) => (
                                    <LessonItem
                                        key={lesson.li}
                                        lesson={{ ...lesson, moduleName: title, subject }}
                                        onToggle={onLessonToggle}
                                    />
                                ))
                            )}
                            <div className="moduleFooter">
                                <button
                                    type="button"
                                    className="btn ghost moduleFooterBtn"
                                    onClick={() => onToggle(mi, false)}
                                >
                                    Collapse
                                </button>
                            </div>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
}
