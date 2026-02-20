import React, { useState, useEffect, useMemo, useRef } from 'react';
import { COURSE } from './data/courseData';
import {
  loadState, saveState,
  loadStreak, saveStreak,
  loadUI, saveUI,
  mergeCourse
} from './utils/storageUtils';
import { parseHMS, pct } from './utils/timeUtils';
import Layout from './components/Layout/Layout';
import Header from './components/Layout/Header';
import FilterBar from './components/Controls/FilterBar';
import OverallStats from './components/Stats/OverallStats';
import TodayPlan from './components/Dashboard/TodayPlan';
import ModuleList from './components/Modules/ModuleList';


function App() {
  // Removed Lenis due to user feedback ("hard to scroll"). 
  // Native scrolling is preferred for better UX on this device.

  const [course, setCourse] = useState(() => loadState(COURSE));
  const [streak, setStreak] = useState(() => loadStreak());
  const [ui, setUI] = useState(() => loadUI());
  const [dailyHours, setDailyHours] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");

  // Track open modules
  const [openModules, setOpenModules] = useState({});

  // Persistence
  useEffect(() => { saveState(course); }, [course]);
  useEffect(() => { saveStreak(streak); }, [streak]);
  useEffect(() => { saveUI(ui); }, [ui]);

  const importInputRef = useRef(null);

  // --- Derived State & Logic ---

  const flattenLessons = useMemo(() => {
    const out = [];
    course.forEach((m, mi) => {
      const subject = m.subject || "english";
      m.lessons.forEach((l, li) => {
        out.push({
          mi, li,
          subject,
          moduleName: m.module,
          ...l,
          seconds: parseHMS(l.duration)
        });
      });
    });
    return out;
  }, [course]);

  const counts = useMemo(() => ({
    all: flattenLessons.length,
    english: flattenLessons.filter(x => x.subject === 'english').length,
    maths: flattenLessons.filter(x => x.subject === 'maths').length
  }), [flattenLessons]);

  const filteredLessons = useMemo(() => {
    let list = flattenLessons;
    if (ui.subject !== 'all') {
      list = list.filter(x => x.subject === ui.subject);
    }
    return list;
  }, [flattenLessons, ui.subject]);

  const stats = useMemo(() => {
    const totalSeconds = filteredLessons.reduce((a, x) => a + x.seconds, 0);
    const doneSeconds = filteredLessons.filter(x => x.completed).reduce((a, x) => a + x.seconds, 0);
    const totalLessons = filteredLessons.length;
    const doneLessons = filteredLessons.filter(x => x.completed).length;

    return {
      totalSeconds,
      doneSeconds,
      leftSeconds: totalSeconds - doneSeconds,
      totalLessons,
      doneLessons,
      leftLessons: totalLessons - doneLessons,
      pct: pct(doneSeconds, totalSeconds),
      streak: streak.streak
    };
  }, [filteredLessons, streak]);

  const nextLesson = useMemo(() => {
    return filteredLessons.find(x => !x.completed) || null;
  }, [filteredLessons]);

  const subStats = useMemo(() => ({
    total: stats.totalLessons,
    done: stats.doneLessons,
    left: stats.leftLessons,
    leftSeconds: stats.leftSeconds
  }), [stats]);

  const focusModule = useMemo(() => {
    const modulesInFilter = course.filter(m => {
      const s = m.subject || "english";
      return ui.subject === 'all' || s === ui.subject;
    });
    const moduleLeft = modulesInFilter.map(m => {
      const sec = (m.lessons || []).filter(l => !l.completed).reduce((a, l) => a + parseHMS(l.duration), 0);
      return { subject: (m.subject || "english"), module: m.module, sec };
    }).sort((a, b) => b.sec - a.sec);

    return moduleLeft[0]?.sec > 0
      ? `${moduleLeft[0].subject === 'maths' ? '🧮' : '📘'} ${moduleLeft[0].module}`
      : "Revision & mocks";
  }, [course, ui.subject]);


  // --- Modules Data Preparation for List ---

  const processedModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return course.map((m, mi) => {
      const subject = m.subject || "english";
      // Filter by subject
      if (ui.subject !== 'all' && subject !== ui.subject) return null;

      const lessons = m.lessons.map((l, li) => ({
        ...l, li, mi, seconds: parseHMS(l.duration)
      }));

      const total = lessons.reduce((a, x) => a + x.seconds, 0);
      const done = lessons.filter(x => x.completed).reduce((a, x) => a + x.seconds, 0);
      const leftCount = lessons.filter(x => !x.completed).length;

      // Filter lessons by search & hideCompleted
      const visibleLessons = lessons.filter(l => {
        const hay = (m.module + " " + l.name).toLowerCase();
        const okQ = !q || hay.includes(q);
        const okH = !ui.hideCompleted || !l.completed;
        return okQ && okH;
      });

      // Filter module itself
      const moduleMatch = !q || m.module.toLowerCase().includes(q) || visibleLessons.length > 0;
      if (!moduleMatch && visibleLessons.length === 0) return null;

      // Auto-expand if searching
      // We can't set state during render. controlled by openModules state.
      // But we can check if we should default open.
      // If q exists and matches, we might want to force open.

      return {
        mi,
        module: m.module,
        subject,
        stats: { total, done, pct: pct(done, total), leftCount },
        totalLessonsCount: lessons.length,
        lessons: visibleLessons,
        hasMatch: visibleLessons.length > 0 || m.module.toLowerCase().includes(q)
      };
    }).filter(Boolean);
  }, [course, ui, searchQuery]);

  // Effect to auto-expand on search
  useEffect(() => {
    if (searchQuery) {
      const newOpen = {};
      processedModules.forEach(m => {
        if (m.hasMatch) newOpen[m.mi] = true;
      });
      setOpenModules(prev => ({ ...prev, ...newOpen }));
    }
  }, [searchQuery, processedModules]);


  // --- Handlers ---

  const handleToggleLesson = (mi, li) => {
    const newCourse = [...course];
    newCourse[mi].lessons[li].completed = !newCourse[mi].lessons[li].completed;
    setCourse(newCourse);
  };

  const handleBumpStreak = () => {
    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);
    const last = streak.lastMarkISO;

    let newStreakVal = streak.streak;
    if (!last) {
      newStreakVal = 1;
    } else {
      const lastDate = new Date(last + "T00:00:00");
      const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreakVal += 1;
      else if (diffDays > 1) newStreakVal = 1;
    }
    setStreak({ lastMarkISO: todayISO, streak: newStreakVal });
  };

  const handleMarkNext = () => {
    if (!nextLesson) {
      alert("All lessons completed! 🎉");
      return;
    }
    const newCourse = [...course];
    newCourse[nextLesson.mi].lessons[nextLesson.li].completed = true;
    setCourse(newCourse);
    handleBumpStreak();
    // Toast logic could go here
  };

  const handleOpenNext = () => {
    if (!nextLesson) {
      alert("All done!");
      return;
    }
    setOpenModules(prev => ({ ...prev, [nextLesson.mi]: true }));
    // scrolling logic: simpler to just expand. 
    // real scrolling requires refs to modules.
    setTimeout(() => {
      const el = document.querySelector(`details[data-mi="${nextLesson.mi}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleExpandAll = () => {
    const all = {};
    processedModules.forEach(m => all[m.mi] = true);
    setOpenModules(all);
  };

  const handleCollapseAll = () => {
    setOpenModules({});
  };

  const handleToggleModule = (mi, nextOpen) => {
    setOpenModules(prev => {
      const prevOpen = !!prev[mi];
      const resolvedNextOpen = typeof nextOpen === "boolean" ? nextOpen : !prevOpen;

      if (prevOpen === resolvedNextOpen) return prev;

      const out = { ...prev };
      if (resolvedNextOpen) out[mi] = true;
      else delete out[mi];
      return out;
    });
  };

  const handleReset = () => {
    if (!confirm("Reset ALL progress?")) return;
    const newCourse = course.map(m => ({
      ...m,
      lessons: m.lessons.map(l => ({ ...l, completed: false }))
    }));
    setCourse(newCourse);
    setStreak({ lastMarkISO: null, streak: 0 });
    localStorage.removeItem("ssc_dashboard_progress_v2");
    localStorage.removeItem("ssc_dashboard_streak_v2");
  };

  const handleExport = () => {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      state: course,
      streakState: streak,
      ui
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssc-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed && parsed.state) {
        setCourse(mergeCourse(structuredClone(COURSE), parsed.state));
      }
      if (parsed && parsed.streakState) {
        setStreak(parsed.streakState);
      }
      if (parsed && parsed.ui) {
        setUI(prev => ({ ...prev, ...parsed.ui }));
      }
      alert("Imported successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Import failed ❌");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <Layout>
      <Header
        onMarkNext={handleMarkNext}
        onOpenNext={handleOpenNext}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        importInputRef={importInputRef}
      />

      <FilterBar
        ui={ui}
        setUI={setUI}
        counts={counts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="grid">
        <OverallStats
          stats={stats}
          dailyHours={dailyHours}
          setDailyHours={setDailyHours}
          focusModule={focusModule}
        />
        <TodayPlan
          nextLesson={nextLesson}
          onMarkNext={handleMarkNext}
          onOpenNext={handleOpenNext}
          subStats={subStats}
        />
      </div>

      <section className="card" style={{ marginTop: 14 }}>
        <div className="hd">
          <h2>Modules</h2>
          <div className="pill"><span>Tip:</span> <b>Click a module to expand</b></div>
        </div>
        <div className="bd">
          <ModuleList
            modules={processedModules}
            openModules={openModules}
            onToggleModule={handleToggleModule}
            onLessonToggle={handleToggleLesson}
          />
        </div>
      </section>
    </Layout>
  );
}

export default App;
