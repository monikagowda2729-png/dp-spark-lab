import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GlassCard } from "@/components/GlassCard";
import { Zap, Clock, Brain, TrendingUp, ArrowRight, Layers, GitBranch, Table2, Grid3X3 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    { label: "Problems Available", value: 4, suffix: "+", icon: Layers, color: "var(--neon-purple)" },
    { label: "Time Saved (avg)", value: 95, suffix: "%", icon: Clock, color: "var(--neon-blue)" },
    { label: "Recursive Calls Avoided", value: 10842, suffix: "", icon: Brain, color: "var(--neon-cyan)" },
    { label: "Performance Boost", value: 500, suffix: "x", icon: TrendingUp, color: "var(--neon-purple)" },
  ];

  const problems = [
    {
      title: "Fibonacci Sequence",
      description: "Visualize recursive tree vs DP array filling",
      complexity: "O(n) vs O(2ⁿ)",
      icon: GitBranch,
    },
    {
      title: "0/1 Knapsack",
      description: "Interactive weight/value input with DP table animation",
      complexity: "O(nW)",
      icon: Table2,
    },
    {
      title: "Longest Common Subsequence",
      description: "String comparison with matrix animation",
      complexity: "O(mn)",
      icon: Layers,
    },
    {
      title: "Matrix Chain Multiplication",
      description: "Find optimal parenthesization with M and K split tables",
      complexity: "O(n³)",
      icon: Grid3X3,
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 grid-bg min-h-full">
      {/* Hero */}
      <section className="text-center space-y-6 py-10">
        <div className="animate-float inline-block">
          <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center pulse-neon" style={{ background: "var(--gradient-primary)" }}>
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black">
          <span className="gradient-text">Dynamic Programming</span>
          <br />
          <span className="text-foreground">Visualization Lab</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Explore, visualize, and master DP algorithms through interactive step-by-step animations,
          real-time performance comparisons, and deep complexity analysis.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/visualizer" className="btn-neon flex items-center gap-2">
            Start Visualizing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/about-dp" className="px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors font-semibold">
            Learn DP Concepts
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="text-center space-y-2">
            <s.icon className="w-8 h-8 mx-auto" style={{ color: s.color }} />
            <div className="text-3xl font-black">
              <AnimatedCounter end={s.value} suffix={s.suffix} />
            </div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </GlassCard>
        ))}
      </section>

      {/* Problem Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Available Problems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map((p) => (
            <Link key={p.title} to="/visualizer" className="group">
              <GlassCard className="h-full hover:border-primary/50 transition-all duration-300 group-hover:shadow-[0_0_30px_oklch(0.65_0.28_290/20%)]">
                <p.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                <span className="text-xs font-mono gradient-text-accent font-semibold">{p.complexity}</span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Complexity Overview */}
      <section>
        <GlassCard className="space-y-4">
          <h2 className="text-xl font-bold gradient-text">Why Dynamic Programming?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Optimal Substructure</h3>
              <p className="text-muted-foreground">
                A problem exhibits optimal substructure if its optimal solution can be constructed from optimal solutions of its subproblems.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">Overlapping Subproblems</h3>
              <p className="text-muted-foreground">
                When the same subproblems are solved multiple times, DP stores results to avoid redundant computation.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold" style={{ color: "var(--neon-cyan)" }}>Memoization vs Tabulation</h3>
              <p className="text-muted-foreground">
                Top-down memoization caches results of recursive calls. Bottom-up tabulation fills a table iteratively.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
