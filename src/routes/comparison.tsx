import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GitCompareArrows, Play } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/comparison")({
  head: () => ({
    meta: [
      { title: "Algorithm Comparison — DP Visualizer" },
      { name: "description", content: "Compare recursive vs dynamic programming approaches side by side with execution timers and charts." },
    ],
  }),
  component: Comparison,
});

function Comparison() {
  const [n, setN] = useState(30);
  const [results, setResults] = useState<{ n: number; recursive: number; dp: number }[]>([]);
  const [running, setRunning] = useState(false);

  const runBenchmark = () => {
    setRunning(true);
    const data: { n: number; recursive: number; dp: number }[] = [];

    setTimeout(() => {
      for (let i = 5; i <= Math.min(n, 35); i += 5) {
        const recStart = performance.now();
        fibRecursive(i);
        const recTime = performance.now() - recStart;

        const dpStart = performance.now();
        fibDP(i);
        const dpTime = performance.now() - dpStart;

        data.push({
          n: i,
          recursive: parseFloat(recTime.toFixed(3)),
          dp: parseFloat(dpTime.toFixed(3)),
        });
      }
      setResults(data);
      setRunning(false);
    }, 100);
  };

  useEffect(() => { runBenchmark(); }, []);

  const comparisonData = [
    { feature: "Time Complexity", recursive: "O(2ⁿ)", dp: "O(n)", winner: "dp" },
    { feature: "Space Complexity", recursive: "O(n) stack", dp: "O(n) table", winner: "tie" },
    { feature: "Redundant Calls", recursive: "Yes (exponential)", dp: "None", winner: "dp" },
    { feature: "Speed", recursive: "Exponentially slow", dp: "Linear time", winner: "dp" },
    { feature: "Code Simplicity", recursive: "Simpler", dp: "Slightly more", winner: "recursive" },
    { feature: "Scalability", recursive: "Fails at n≈40", dp: "Handles millions", winner: "dp" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-6 grid-bg min-h-full">
      <div className="flex items-center gap-3">
        <GitCompareArrows className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black gradient-text">Algorithm Comparison</h1>
      </div>

      {/* Feature comparison table */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Recursive vs Dynamic Programming</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground">Feature</th>
                <th className="text-left py-2 px-3 text-muted-foreground">Recursion</th>
                <th className="text-left py-2 px-3 text-muted-foreground">DP</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row) => (
                <tr key={row.feature} className="border-b border-border/30">
                  <td className="py-2 px-3 font-medium">{row.feature}</td>
                  <td className={`py-2 px-3 font-mono text-xs ${row.winner === "recursive" ? "text-accent" : "text-destructive"}`}>
                    {row.recursive}
                  </td>
                  <td className={`py-2 px-3 font-mono text-xs ${row.winner === "dp" ? "" : "text-muted-foreground"}`}
                    style={row.winner === "dp" ? { color: "var(--neon-cyan)" } : {}}>
                    {row.dp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Benchmark */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-xl font-bold">Live Performance Benchmark</h2>
          <div className="flex items-center gap-4">
            <label className="text-sm">Max n =</label>
            <input
              type="range"
              min={10}
              max={35}
              step={5}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="accent-primary"
            />
            <span className="font-mono text-primary font-bold w-6">{n}</span>
            <button
              onClick={runBenchmark}
              disabled={running}
              className="btn-neon !py-2 !px-4 flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              {running ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="n" stroke="var(--muted-foreground)" fontSize={12} label={{ value: "Input n", position: "bottom", fill: "var(--muted-foreground)" }} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} label={{ value: "Time (ms)", angle: -90, position: "insideLeft", fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="recursive" fill="oklch(0.58 0.25 27)" name="Recursive" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dp" fill="oklch(0.78 0.18 190)" name="DP" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>
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
