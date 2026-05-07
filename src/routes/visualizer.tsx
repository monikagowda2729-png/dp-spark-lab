import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { DPTableVisualizer } from "@/components/DPTableVisualizer";
import { Eye, GitBranch, Table2, Layers } from "lucide-react";

export const Route = createFileRoute("/visualizer")({
  head: () => ({
    meta: [
      { title: "Problem Visualizer — DP Visualizer" },
      { name: "description", content: "Interactive step-by-step visualization of Fibonacci, Knapsack, and LCS dynamic programming problems." },
    ],
  }),
  component: Visualizer,
});

type Problem = "fibonacci" | "knapsack" | "lcs";

function Visualizer() {
  const [problem, setProblem] = useState<Problem>("fibonacci");

  const tabs = [
    { id: "fibonacci" as const, label: "Fibonacci", icon: GitBranch },
    { id: "knapsack" as const, label: "0/1 Knapsack", icon: Table2 },
    { id: "lcs" as const, label: "LCS", icon: Layers },
  ];

  return (
    <div className="p-6 md:p-10 space-y-6 grid-bg min-h-full">
      <div className="flex items-center gap-3">
        <Eye className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black gradient-text">Problem Visualizer</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setProblem(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              problem === t.id ? "btn-neon" : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {problem === "fibonacci" && <FibonacciVisualizer />}
      {problem === "knapsack" && <KnapsackVisualizer />}
      {problem === "lcs" && <LCSVisualizer />}
    </div>
  );
}

function FibonacciVisualizer() {
  const [n, setN] = useState(8);
  const dpArray = computeFibDP(n);

  const initialTable = [dpArray.map(() => ({ value: 0 as number | string, state: "default" as const }))];
  const steps = dpArray.map((val, i) => ({ row: 0, col: i, value: val }));

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Fibonacci Sequence</h2>
        <p className="text-sm text-muted-foreground">
          Watch the DP array fill from left to right. Each cell is the sum of the two previous cells.
          Compare this O(n) approach to the O(2ⁿ) naive recursion.
        </p>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">n =</label>
          <input
            type="range"
            min={3}
            max={15}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="font-mono text-primary font-bold w-6">{n}</span>
        </div>
      </GlassCard>

      <DPTableVisualizer
        table={initialTable}
        steps={steps}
        colHeaders={Array.from({ length: n + 1 }, (_, i) => String(i))}
        title={`Fibonacci DP Array (n=${n})`}
      />

      <GlassCard>
        <h3 className="font-bold mb-2">Complexity</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Recursive</p>
            <p className="font-mono text-destructive font-bold">O(2ⁿ) time, O(n) space</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dynamic Programming</p>
            <p className="font-mono font-bold" style={{ color: "var(--neon-cyan)" }}>O(n) time, O(n) space</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function KnapsackVisualizer() {
  const [capacity, setCapacity] = useState(7);
  const weights = [1, 3, 4, 5];
  const values = [1, 4, 5, 7];

  const { table, steps, selectedItems } = computeKnapsack(weights, values, capacity);

  const initialTable = table.map((row) =>
    row.map(() => ({ value: 0 as number | string, state: "default" as const }))
  );

  const pathCells = selectedItems.map((itemIdx) => ({
    row: itemIdx + 1,
    col: capacity,
  }));

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">0/1 Knapsack Problem</h2>
        <p className="text-sm text-muted-foreground">
          Given items with weights and values, find the maximum value that fits in a knapsack of capacity W.
        </p>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Capacity W =</label>
          <input
            type="range"
            min={3}
            max={10}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="font-mono text-primary font-bold w-6">{capacity}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="px-3 py-1 text-muted-foreground">Item</th>
                <th className="px-3 py-1 text-muted-foreground">Weight</th>
                <th className="px-3 py-1 text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((w, i) => (
                <tr key={i}>
                  <td className="px-3 py-1 font-mono">{i + 1}</td>
                  <td className="px-3 py-1 font-mono">{w}</td>
                  <td className="px-3 py-1 font-mono">{values[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <DPTableVisualizer
        table={initialTable}
        steps={steps}
        pathCells={pathCells}
        rowHeaders={["∅", ...weights.map((w, i) => `Item ${i + 1}`)]}
        colHeaders={Array.from({ length: capacity + 1 }, (_, i) => String(i))}
        title={`Knapsack DP Table (W=${capacity})`}
      />
    </div>
  );
}

function LCSVisualizer() {
  const [s1, setS1] = useState("ABCBDAB");
  const [s2, setS2] = useState("BDCAB");

  const { table, steps, pathCells, lcs } = computeLCS(s1, s2);

  const initialTable = table.map((row) =>
    row.map(() => ({ value: 0 as number | string, state: "default" as const }))
  );

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Longest Common Subsequence</h2>
        <p className="text-sm text-muted-foreground">
          Find the longest subsequence common to two strings. The LCS of "{s1}" and "{s2}" is "{lcs}".
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">String 1</label>
            <input
              value={s1}
              onChange={(e) => setS1(e.target.value.toUpperCase().slice(0, 10))}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">String 2</label>
            <input
              value={s2}
              onChange={(e) => setS2(e.target.value.toUpperCase().slice(0, 10))}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
      </GlassCard>

      <DPTableVisualizer
        table={initialTable}
        steps={steps}
        pathCells={pathCells}
        rowHeaders={["∅", ...s1.split("")]}
        colHeaders={["∅", ...s2.split("")]}
        title={`LCS Matrix — Result: "${lcs}" (length ${lcs.length})`}
      />
    </div>
  );
}

// Algorithm helpers
function computeFibDP(n: number): number[] {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp;
}

function computeKnapsack(weights: number[], values: number[], W: number) {
  const n = weights.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  const steps: { row: number; col: number; value: number }[] = [];

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        table[i][w] = Math.max(table[i - 1][w], table[i - 1][w - weights[i - 1]] + values[i - 1]);
      } else {
        table[i][w] = table[i - 1][w];
      }
      steps.push({ row: i, col: w, value: table[i][w] });
    }
  }

  // Traceback
  const selectedItems: number[] = [];
  let w = W;
  for (let i = n; i > 0; i--) {
    if (table[i][w] !== table[i - 1][w]) {
      selectedItems.push(i - 1);
      w -= weights[i - 1];
    }
  }

  return { table, steps, selectedItems };
}

function computeLCS(s1: string, s2: string) {
  const m = s1.length;
  const n = s2.length;
  const table: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const steps: { row: number; col: number; value: number }[] = [];

  for (let i = 0; i <= m; i++) steps.push({ row: i, col: 0, value: 0 });
  for (let j = 1; j <= n; j++) steps.push({ row: 0, col: j, value: 0 });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
      steps.push({ row: i, col: j, value: table[i][j] });
    }
  }

  // Traceback path
  const pathCells: { row: number; col: number }[] = [];
  let lcs = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      pathCells.push({ row: i, col: j });
      lcs = s1[i - 1] + lcs;
      i--; j--;
    } else if (table[i - 1][j] > table[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return { table, steps, pathCells, lcs };
}
