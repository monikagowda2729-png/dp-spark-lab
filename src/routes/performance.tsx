import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/GlassCard";
import { LineChart as LineChartIcon, Play, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Performance Dashboard — DP Visualizer" },
      { name: "description", content: "Real-time performance analytics comparing recursive and DP approaches across input sizes." },
    ],
  }),
  component: Performance,
});

function Performance() {
  const [data, setData] = useState<{ n: number; recursive: number; dp: number }[]>([]);
  const [running, setRunning] = useState(false);

  const runAnalysis = useCallback(() => {
    setRunning(true);
    setData([]);
    const results: { n: number; recursive: number; dp: number }[] = [];
    let i = 5;

    const step = () => {
      if (i > 35) {
        setRunning(false);
        return;
      }
      const recStart = performance.now();
      fibRecursive(i);
      const recTime = performance.now() - recStart;

      const dpStart = performance.now();
      fibDP(i);
      const dpTime = performance.now() - dpStart;

      results.push({
        n: i,
        recursive: parseFloat(recTime.toFixed(4)),
        dp: parseFloat(dpTime.toFixed(4)),
      });
      setData([...results]);
      i++;
      setTimeout(step, 50);
    };
    step();
  }, []);

  useEffect(() => { runAnalysis(); }, [runAnalysis]);

  const speedupData = data.map((d) => ({
    n: d.n,
    speedup: d.recursive > 0 ? parseFloat((d.recursive / Math.max(d.dp, 0.001)).toFixed(1)) : 1,
  }));

  return (
    <div className="p-6 md:p-10 space-y-6 grid-bg min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <LineChartIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-black gradient-text">Performance Dashboard</h1>
        </div>
        <button
          onClick={runAnalysis}
          disabled={running}
          className="btn-neon !py-2 !px-4 flex items-center gap-2 text-sm"
        >
          {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? "Analyzing..." : "Re-run Analysis"}
        </button>
      </div>

      {/* Execution time chart */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Execution Time: Recursive vs DP</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="n" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="recursive" stroke="oklch(0.58 0.25 27)" strokeWidth={2} name="Recursive (ms)" dot={{ fill: "oklch(0.58 0.25 27)", r: 3 }} />
            <Line type="monotone" dataKey="dp" stroke="oklch(0.78 0.18 190)" strokeWidth={2} name="DP (ms)" dot={{ fill: "oklch(0.78 0.18 190)", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Speedup chart */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Speedup Factor (Recursive Time / DP Time)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={speedupData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="n" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="speedup" stroke="oklch(0.65 0.28 290)" strokeWidth={3} name="Speedup (x)" dot={{ fill: "oklch(0.65 0.28 290)", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="text-center">
            <p className="text-sm text-muted-foreground">Max Recursive Time</p>
            <p className="text-2xl font-black text-destructive">
              {Math.max(...data.map((d) => d.recursive)).toFixed(2)} ms
            </p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-sm text-muted-foreground">Max DP Time</p>
            <p className="text-2xl font-black" style={{ color: "var(--neon-cyan)" }}>
              {Math.max(...data.map((d) => d.dp)).toFixed(4)} ms
            </p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-sm text-muted-foreground">Max Speedup</p>
            <p className="text-2xl font-black gradient-text">
              {speedupData.length > 0 ? Math.max(...speedupData.map((d) => d.speedup)).toLocaleString() : 0}x
            </p>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

function fibRecursive(n: number): number {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

function fibDP(n: number): number {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
