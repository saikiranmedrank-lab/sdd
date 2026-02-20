export const STORAGE_KEY = "ssc_dashboard_progress_v2";
export const STREAK_KEY = "ssc_dashboard_streak_v2";
export const UI_KEY = "ssc_dashboard_ui_v2";

export function loadState(defaultCourse) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultCourse);
    try {
        const parsed = JSON.parse(raw);
        return mergeCourse(structuredClone(defaultCourse), parsed);
    } catch {
        return structuredClone(defaultCourse);
    }
}

export function mergeCourse(base, saved) {
    const savedMap = new Map();
    for (const sm of (saved || [])) {
        for (const sl of (sm.lessons || [])) {
            const sSub = (sm.subject || "english");
            savedMap.set((sSub + "||" + sm.module + "||" + sl.name).toLowerCase(), !!sl.completed);
        }
    }
    for (const bm of base) {
        for (const bl of bm.lessons) {
            const key = ((bm.subject || "english") + "||" + bm.module + "||" + bl.name).toLowerCase();
            if (savedMap.has(key)) bl.completed = savedMap.get(key);
        }
    }
    return base;
}

export function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadStreak() {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { lastMarkISO: null, streak: 0 };
    try { return JSON.parse(raw); } catch { return { lastMarkISO: null, streak: 0 }; }
}
export function saveStreak(s) { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); }

export function loadUI() {
    const raw = localStorage.getItem(UI_KEY);
    if (!raw) return { subject: "all", hideCompleted: false };
    try {
        const v = JSON.parse(raw);
        return {
            subject: (v.subject || "all"),
            hideCompleted: !!v.hideCompleted
        };
    } catch {
        return { subject: "all", hideCompleted: false };
    }
}
export function saveUI(ui) {
    localStorage.setItem(UI_KEY, JSON.stringify(ui));
}
