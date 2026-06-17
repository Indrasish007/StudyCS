// Reading progress and statistics manager using LocalStorage

export interface SubjectProgress {
  percent: number; // 0 to 100
  scrollOffset: number;
  completedTopics: string[]; // List of heading IDs read
  completed: boolean;
}

export interface StreakData {
  count: number;
  lastStudyDate: string; // YYYY-MM-DD
}

export interface ViewedTopic {
  headingId: string;
  text: string;
  subjectSlug: string;
  subjectName: string;
  timestamp: number;
}

const PROGRESS_KEY = "auranotes_progress";
const STREAK_KEY = "auranotes_streak";
const STUDY_TIME_KEY = "auranotes_total_study_time";
const RECENTLY_VIEWED_KEY = "auranotes_recently_viewed";

// 1. Progress Operations
export function getSubjectProgress(slug: string): SubjectProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data[slug]) {
        return data[slug];
      }
    }
  } catch (e) {
    console.error("Failed to read progress:", e);
  }
  return { percent: 0, scrollOffset: 0, completedTopics: [], completed: false };
}

export function saveSubjectProgress(
  slug: string,
  percent: number,
  scrollOffset: number,
  completedTopics: string[],
  completed = false
) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    
    // Maintain completed state if it was already true
    const wasCompleted = data[slug]?.completed || false;
    const isCompleted = completed || wasCompleted || percent >= 100;

    data[slug] = {
      percent: Math.min(100, Math.max(0, Math.max(percent, data[slug]?.percent || 0))),
      scrollOffset,
      completedTopics: Array.from(new Set([...(data[slug]?.completedTopics || []), ...completedTopics])),
      completed: isCompleted,
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export function getStartedSubjectsCount(slugs: string[]): number {
  let count = 0;
  slugs.forEach((slug) => {
    const p = getSubjectProgress(slug);
    if (p.percent > 0 || p.completed) {
      count++;
    }
  });
  return count;
}

export function getCompletedSubjectsCount(slugs: string[]): number {
  let count = 0;
  slugs.forEach((slug) => {
    const p = getSubjectProgress(slug);
    if (p.completed || p.percent >= 100) {
      count++;
    }
  });
  return count;
}

// 2. Study Time Operations
export function getTotalStudyTime(): number {
  try {
    const time = localStorage.getItem(STUDY_TIME_KEY);
    return time ? parseInt(time, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export function incrementStudyTime(seconds: number) {
  try {
    const time = getTotalStudyTime();
    localStorage.setItem(STUDY_TIME_KEY, (time + seconds).toString());
  } catch (e) {
    console.error("Failed to save study time:", e);
  }
}

// 3. Streak Operations
export function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return { count: 0, lastStudyDate: "" };
}

export function updateStreak() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const streak = getStreak();

    if (streak.lastStudyDate === today) {
      return; // Already studied today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newCount = streak.count;
    if (streak.lastStudyDate === yesterdayStr) {
      newCount += 1; // Studied consecutive day
    } else if (streak.lastStudyDate === "") {
      newCount = 1; // First day
    } else {
      newCount = 1; // Streak broken, restart
    }

    const data: StreakData = {
      count: newCount,
      lastStudyDate: today,
    };
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to update streak:", e);
  }
}

// 4. Recently Viewed Topics
export function getRecentlyViewed(): ViewedTopic[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addRecentlyViewed(headingId: string, text: string, subjectSlug: string, subjectName: string) {
  try {
    const list = getRecentlyViewed();
    // Filter out existing duplicates
    const filtered = list.filter((item) => !(item.headingId === headingId && item.subjectSlug === subjectSlug));
    
    const newItem: ViewedTopic = {
      headingId,
      text,
      subjectSlug,
      subjectName,
      timestamp: Date.now(),
    };

    const newList = [newItem, ...filtered].slice(0, 5); // Keep last 5 items
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newList));
  } catch (e) {
    console.error("Failed to add recently viewed topic:", e);
  }
}
