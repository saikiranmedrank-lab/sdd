import React from 'react';
import RingChart from './RingChart';
import { fmtH, fmtHM } from '../../utils/timeUtils';

export default function OverallStats({
    stats,
    dailyHours,
    setDailyHours,
    focusModule
}) {
    const { totalSeconds, doneSeconds, leftSeconds, totalLessons, doneLessons, leftLessons, pct } = stats;

    const days = dailyHours > 0 ? Math.ceil((leftSeconds / 3600) / dailyHours) : 0;

    const paceHint =
        pct >= 75 ? "Final lap 🔥" :
            pct >= 50 ? "Nice momentum 🚀" :
                pct >= 25 ? "Good start 👍" :
                    "Start small, stay consistent";

    return (
        <section className="card">
            <div className="hd">
                <h2>Overall</h2>
                <div className="pill"><span>Target:</span> <b>{fmtH(totalSeconds)}</b></div>
            </div>
            <div className="bd">
                <div className="stats">
                    <div className="stat">
                        <div className="k">Completed</div>
                        <div className="v">{fmtHM(doneSeconds)}</div>
                        <div className="s">{doneLessons} / {totalLessons} lessons</div>
                    </div>
                    <div className="stat">
                        <div className="k">Remaining</div>
                        <div className="v">{fmtHM(leftSeconds)}</div>
                        <div className="s">{leftLessons} lessons left</div>
                    </div>
                    <div className="stat">
                        <div className="k">Progress</div>
                        <div className="v">{pct}%</div>
                        <div className="s">{paceHint}</div>
                    </div>
                    <div className="stat">
                        <div className="k">Streak</div>
                        <div className="v">{stats.streak || 0} days</div>
                        <div className="s">Based on "Mark Next"</div>
                    </div>
                </div>

                <div className="row">
                    <div className="ringWrap">
                        <RingChart pct={pct} />

                        <div className="legend">
                            <div className="item"><span className="dot good"></span><span><b>{fmtH(doneSeconds)}</b> completed</span></div>
                            <div className="item"><span className="dot"></span><span><b>{fmtH(leftSeconds)}</b> remaining</span></div>
                            <div className="item"><span className="dot warn"></span><span><b>{fmtH(totalSeconds)}</b> total time</span></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 280, flex: 1 }}>
                        <div className="pill">
                            Focus: <b dangerouslySetInnerHTML={{ __html: focusModule || "—" }} />
                        </div>

                        <div className="stat" style={{ minHeight: 'auto' }}>
                            <div className="k">Goal calculator</div>
                            <div className="s" style={{ marginTop: 10 }}>
                                If you study <b>{dailyHours}</b> hours/day, you will finish in about <b>{days}</b> days.
                            </div>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
                                <input
                                    type="range" min="1" max="24" value={dailyHours}
                                    onChange={(e) => setDailyHours(Number(e.target.value))}
                                    style={{ width: 240 }}
                                />
                                <span className="pill">Daily: <b>{dailyHours}h</b></span>
                            </div>
                            <div className="s" style={{ marginTop: 10 }}>
                                Pro tip: 90 minutes video + 25 questions = solid daily momentum.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footerNote">
                    Tip: You can edit the data inside <code>src/data/courseData.js</code>.
                </div>
            </div>
        </section>
    );
}
