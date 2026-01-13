"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const PointsContext = createContext(null);

export function PointsProvider({ children }) {
  const [points, setPoints] = useState(0);

  // (Optional) persist points
  useEffect(() => {
    const saved = localStorage.getItem("quiz.points");
    if (saved) setPoints(Number(saved) || 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("quiz.points", String(points));
  }, [points]);

  const value = useMemo(() => ({ points, setPoints }), [points]);

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints must be used within <PointsProvider />");
  return ctx;
}
