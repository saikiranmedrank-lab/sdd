import React from 'react';
import Button from '../UI/Button';
import { CheckCircle, FolderOpen } from 'lucide-react';
import { fmtH, fmtHM } from '../../utils/timeUtils';

export default function TodayPlan({
    nextLesson,
    onMarkNext,
    onOpenNext,
    subStats
}) {
    return (
        <section className="card">
            <div className="hd">
                <h2>Today Plan</h2>
                <div className="pill">
                    <span>Next:</span>
                    <b>
                        {nextLesson
                            ? `${nextLesson.subject === 'maths' ? '🧮' : '📘'} ${nextLesson.name} • ${fmtHM(nextLesson.seconds)}`
                            : "All done 🎉"
                        }
                    </b>
                </div>
            </div>
            <div className="bd">
                <div className="stat" style={{ minHeight: 'auto' }}>
                    <div className="k">Suggested mini-targets</div>
                    <div className="s" style={{ marginTop: 8, color: 'var(--text)' }}>
                        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75 }}>
                            <li><b>60–90 mins</b> video + <b>25 questions</b> same topic</li>
                            <li>Write <b>5 rules/formulas</b> you keep forgetting</li>
                            <li>Do <b>error analysis</b> (why wrong?)</li>
                        </ul>
                    </div>
                </div>

                <div className="hr"></div>

                <div className="stat" style={{ minHeight: 'auto' }}>
                    <div className="k">Quick actions</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                        <Button variant="primary" onClick={onMarkNext}>
                            <CheckCircle size={16} /> Complete "Next"
                        </Button>
                        <Button onClick={onOpenNext}>
                            <FolderOpen size={16} /> Open Module
                        </Button>
                    </div>
                    <div className="s" style={{ marginTop: 10 }}>
                        "Complete Next" marks the next unfinished lesson as done, saves it, and updates your streak.
                    </div>
                </div>

                <div className="hr"></div>

                <div className="stat" style={{ minHeight: 'auto' }}>
                    <div className="k">Subject summary (current filter)</div>
                    <div className="s" style={{ marginTop: 10 }}>
                        <span className="pill">Lessons: <b>{subStats.total}</b></span>
                        <span className="pill">Done: <b>{subStats.done}</b></span>
                        <span className="pill">Left: <b>{subStats.left}</b></span>
                        <span className="pill">Time left: <b>{fmtH(subStats.leftSeconds)}</b></span>
                    </div>
                </div>
            </div>
        </section>
    );
}
