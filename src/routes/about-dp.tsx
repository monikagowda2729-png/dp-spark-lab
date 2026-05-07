import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { BookOpen, ArrowDown, Layers, Repeat, Table2, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/about-dp")({
  head: () => ({
    meta: [
      { title: "About Dynamic Programming — DP Visualizer" },
      { name: "description", content: "Learn the fundamentals of Dynamic Programming including memoization, tabulation, and key concepts." },
    ],
  }),
  component: AboutDP,
});

function AboutDP() {
  const concepts = [
    {
      icon: Layers,
      title: "Optimal Substructure",
      desc: "A problem has optimal substructure if the optimal solution contains optimal solutions to sub-problems. For example, the shortest path between two nodes contains shortest paths between intermediate nodes.",
    },
    {
      icon: Repeat,
      title: "Overlapping Subproblems",
      desc: "When a recursive algorithm revisits the same subproblem repeatedly. Fibonacci is the classic example: fib(5) calls fib(3) twice, fib(2) three times, etc.",
    },
    {
      icon: ArrowDown,
      title: "Memoization (Top-Down)",
      desc: "Start from the main problem and recurse into subproblems, caching results. If a subproblem was already solved, return the cached result instead of recomputing.",
    },
    {
      icon: Table2,
      title: "Tabulation (Bottom-Up)",
      desc: "Build a table from the smallest subproblems up. Each cell depends only on previously computed cells. This avoids recursion overhead entirely.",
    },
  ];

  const applications = [
    "Bioinformatics — DNA sequence alignment (LCS)",
    "Finance — Portfolio optimization (Knapsack)",
    "NLP — Edit distance for spell checking",
    "Networking — Shortest path routing",
    "Operations Research — Resource allocation",
    "Computer Graphics — Seam carving for image resizing",
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 grid-bg min-h-full">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black gradient-text">About Dynamic Programming</h1>
      </div>

      <GlassCard>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Dynamic Programming (DP)</strong> is an algorithmic technique
          for solving optimization problems by breaking them down into simpler subproblems. Unlike divide and conquer,
          DP is applicable when subproblems overlap — meaning the same computation is needed multiple times.
          By storing solutions to subproblems, DP transforms exponential-time algorithms into polynomial-time solutions.
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((c) => (
          <GlassCard key={c.title} className="space-y-3 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-3">
              <c.icon className="w-6 h-6 text-primary shrink-0" />
              <h3 className="text-lg font-bold">{c.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold">Real-World Applications</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {applications.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--neon-cyan)" }} />
              {a}
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard className="space-y-3">
        <h2 className="text-xl font-bold gradient-text">Recursion vs Dynamic Programming</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground">Feature</th>
                <th className="text-left py-2 px-3 text-muted-foreground">Recursion</th>
                <th className="text-left py-2 px-3 text-muted-foreground">Dynamic Programming</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[
                ["Time Complexity", "Exponential", "Polynomial"],
                ["Redundant Calls", "Yes", "No"],
                ["Speed", "Slow", "Fast"],
                ["Memory", "Stack heavy", "Table-based"],
                ["Approach", "Top-down", "Top-down / Bottom-up"],
              ].map(([f, r, d]) => (
                <tr key={f} className="border-b border-border/30">
                  <td className="py-2 px-3 font-semibold text-foreground font-sans">{f}</td>
                  <td className="py-2 px-3 text-destructive">{r}</td>
                  <td className="py-2 px-3" style={{ color: "var(--neon-cyan)" }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
