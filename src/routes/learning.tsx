import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { GraduationCap, BookOpen, Video, Code2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "Learning Resources — DP Visualizer" },
      { name: "description", content: "Curated educational resources for mastering Dynamic Programming." },
    ],
  }),
  component: Learning,
});

function Learning() {
  const tutorials = [
    {
      title: "Memoization Explained",
      desc: "Store results of expensive function calls and return the cached result when the same inputs occur again. Top-down approach using recursion + cache.",
      code: `function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n-1, memo) + fib(n-2, memo);
  return memo[n];
}`,
    },
    {
      title: "Tabulation Explained",
      desc: "Build a table bottom-up, starting from the smallest subproblems. Iterative, no recursion overhead, and often more space-efficient.",
      code: `function fib(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++)
    dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}`,
    },
    {
      title: "Space Optimization",
      desc: "Many DP problems only need the previous row/value. Reduce O(n) space to O(1) by keeping only what's needed.",
      code: `function fib(n) {
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++)
    [prev, curr] = [curr, prev + curr];
  return curr;
}`,
    },
  ];

  const resources = [
    { title: "Introduction to Algorithms (CLRS)", type: "Book", icon: BookOpen, desc: "Chapter 15 covers DP fundamentals with rigorous analysis." },
    { title: "MIT 6.006 - Dynamic Programming", type: "Video", icon: Video, desc: "Lectures 19-22 from MIT OpenCourseWare cover DP in depth." },
    { title: "LeetCode DP Problem Set", type: "Practice", icon: Code2, desc: "Curated collection of 50+ DP problems from easy to hard." },
    { title: "Competitive Programming Handbook", type: "Book", icon: BookOpen, desc: "Chapter 7 provides contest-oriented DP techniques." },
  ];

  const patterns = [
    { name: "Linear DP", examples: "Fibonacci, Climbing Stairs, House Robber", complexity: "O(n)" },
    { name: "Grid DP", examples: "Unique Paths, Minimum Path Sum", complexity: "O(m×n)" },
    { name: "String DP", examples: "LCS, Edit Distance, Palindrome", complexity: "O(m×n)" },
    { name: "Knapsack DP", examples: "0/1 Knapsack, Coin Change, Subset Sum", complexity: "O(n×W)" },
    { name: "Interval DP", examples: "Matrix Chain, Burst Balloons", complexity: "O(n³)" },
    { name: "Tree DP", examples: "Binary Tree Diameter, House Robber III", complexity: "O(n)" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-6 grid-bg min-h-full">
      <div className="flex items-center gap-3">
        <GraduationCap className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black gradient-text">Learning Resources</h1>
      </div>

      {/* Interactive Tutorials */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Core Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutorials.map((t) => (
            <GlassCard key={t.title} className="space-y-3">
              <h3 className="font-bold text-primary">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
              <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono overflow-x-auto" style={{ color: "var(--neon-cyan)" }}>
                {t.code}
              </pre>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* DP Patterns */}
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Common DP Patterns</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground">Pattern</th>
                <th className="text-left py-2 px-3 text-muted-foreground">Examples</th>
                <th className="text-left py-2 px-3 text-muted-foreground">Typical Complexity</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((p) => (
                <tr key={p.name} className="border-b border-border/30">
                  <td className="py-2 px-3 font-semibold">{p.name}</td>
                  <td className="py-2 px-3 text-muted-foreground text-xs">{p.examples}</td>
                  <td className="py-2 px-3 font-mono text-xs" style={{ color: "var(--neon-cyan)" }}>{p.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Resources */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Recommended Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map((r) => (
            <GlassCard key={r.title} className="flex items-start gap-4 hover:border-primary/40 transition-colors">
              <r.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">{r.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">{r.type}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
