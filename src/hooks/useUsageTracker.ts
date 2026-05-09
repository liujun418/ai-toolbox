import { useEffect } from "react";

interface UsageTrackerProps {
  toolId: string;
  toolName: string;
  icon: string;
  creditsUsed: number;
  trigger: boolean;
}

export function useUsageTracker({ toolId, toolName, icon, creditsUsed, trigger }: UsageTrackerProps) {
  useEffect(() => {
    if (!trigger) return;
    try {
      const raw = localStorage.getItem("usage_history");
      const history = raw ? JSON.parse(raw) : [];
      history.unshift({
        toolId,
        toolName,
        icon,
        date: new Date().toISOString(),
        creditsUsed,
      });
      localStorage.setItem("usage_history", JSON.stringify(history.slice(0, 50)));
    } catch {
      // Silently fail — usage tracking is non-critical
    }
  }, [toolId, toolName, icon, creditsUsed, trigger]);
}
