import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/complexity")({
  head: () => ({
    meta: [
      { title: "Complexity Analysis — DP Visualizer" },
      { name: "description", content: "Visualize time and space complexity of different algorithmic approaches." },
    ],
  }),
  component: Complexity,
});

function Complexity() {
  const complexityData = Array.from({ length: 20 }, (_, i) => {
    const n = (i + 1) * 2;
    return {
      n,
      "O(n)": n,
      "O(n²)": n * n,
      "O(n log n)": Math.round(n * Math.log2(n)),
      "O(2ⁿ)": Math.min(Math.pow(2, n), 10000),
      "O(log n)": Math.round(Math.log2(n) * 10) / 10,
    };
  });

  const problems = [
    {
      name: "Fibonacci",
      time: { best: "O(n)", worst: "O(2ⁿ)", avg: "O(n)", dp: "O(n)" },
      space: { recursive: "O(n)", dp: "O(n)", optimized: "O(1)" },
    },
    {
      name: "0/1 Knapsack",
      time: { best: "O(nW)", worst: "O(2ⁿ)", avg: "O(nW)", dp: "O(nW)" },
      space: { recursive: "O(n)", dp: "O(nW)", optimized: "O(W)" },
    },
    {
      name: "LCS",
      time: { best: "O(mn)", worst: "O(2^(m+n))", avg: "O(mn)", dp: "O(mn)" },
      space: { recursive: "O(m+n)", dp: "O(mn)", optimized: "O(min(m,n))" },
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-6 grid-bg min-h-full">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black gradient-text">Complexity Analysis</h1>
      </div>

      {/* Growth rates chart */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Growth Rate Comparison</h2>
        <p className="text-sm text-muted-foreground">
          Visualize how different complexity classes scale with input size.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={complexityData.slice(0, 12)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="n" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="O(log n)" stroke="oklch(0.78 0.18 190)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="O(n)" stroke="oklch(0.65 0.22 250)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="O(n log n)" stroke="oklch(0.65 0.28 290)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="O(n²)" stroke="oklch(0.8 0.18 80)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="O(2ⁿ)" stroke="oklch(0.58 0.25 27)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Per-problem analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {problems.map((p) => (
          <GlassCard key={p.name} className="space-y-3">
            <h3 className="text-lg font-bold gradient-text">{p.name}</h3>
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-muted-foreground">Time Complexity</h4>
              <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                <span className="text-muted-foreground">Best:</span>
                <span style={{ color: "var(--neon-cyan)" }}>{p.time.best}</span>
                <span className="text-muted-foreground">Worst (naive):</span>
                <span className="text-destructive">{p.time.worst}</span>
                <span className="text-muted-foreground">DP:</span>
                <span style={{ color: "var(--neon-cyan)" }}>{p.time.dp}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-muted-foreground">Space Complexity</h4>
              <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                <span className="text-muted-foreground">Recursive:</span>
                <span className="text-accent">{p.space.recursive}</span>
                <span className="text-muted-foreground">DP Table:</span>
                <span className="text-primary">{p.space.dp}</span>
                <span className="text-muted-foreground">Optimized:</span>
                <span style={{ color: "var(--neon-cyan)" }}>{p.space.optimized}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
