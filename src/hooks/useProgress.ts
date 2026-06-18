"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "atlas_np_progress";

interface ProgressState {
  visited: string[];
  quizBest: number | null;
  quizTotal: number | null;
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { visited: [], quizBest: null, quizTotal: null };
}

function save(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>({ visited: [], quizBest: null, quizTotal: null });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  function markVisited(id: string) {
    setState((prev) => {
      if (prev.visited.includes(id)) return prev;
      const next = { ...prev, visited: [...prev.visited, id] };
      save(next);
      return next;
    });
  }

  function saveQuizScore(score: number, total: number) {
    setState((prev) => {
      const best = prev.quizBest === null ? score : Math.max(prev.quizBest, score);
      const next = { ...prev, quizBest: best, quizTotal: total };
      save(next);
      return next;
    });
  }

  function isVisited(id: string) {
    return state.visited.includes(id);
  }

  function moduleProgress(proteinIds: string[]) {
    if (!ready) return 0;
    return proteinIds.filter((id) => state.visited.includes(id)).length;
  }

  return { state, ready, markVisited, saveQuizScore, isVisited, moduleProgress };
}
