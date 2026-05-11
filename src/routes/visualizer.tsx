import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { DPTableVisualizer } from "@/components/DPTableVisualizer";
import { Eye, GitBranch, Table2, Layers, Grid3X3, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/visualizer")({
  head: () => ({
    meta: [
      { title: "Problem Visualizer — DP Visualizer" },
      { name: "description", content: "Interactive step-by-step visualization of Fibonacci, Knapsack, LCS, and MCM dynamic programming problems." },
    ],
  }),
  component: Visualizer,
});

type Problem = "fibonacci" | "knapsack" | "lcs" | "mcm";

function Visualizer() {
  const [problem, setProblem] = useState<Problem>("fibonacci");

  const tabs = [
    { id: "fibonacci" as const, label: "Fibonacci", icon: GitBranch },
    { id: "knapsack" as const, label: "0/1 Knapsack", icon: Table2 },
    { id: "lcs" as const, label: "LCS", icon: Layers },
    { id: "mcm" as const, label: "MCM", icon: Grid3X3 },
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
      {problem === "mcm" && <MCMVisualizer />}
    </div>
  );
}

/* ─── Input field component ─── */
function NeonInput({ label, value, onChange, type = "number", min, max, placeholder, className = "" }: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; min?: number; max?: number; placeholder?: string; className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary/80 border border-border hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/30 rounded-lg px-3 py-2 font-mono text-sm text-foreground outline-none transition-all duration-200"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   FIBONACCI
   ═══════════════════════════════════════════ */
function FibonacciVisualizer() {
  const [n, setN] = useState(8);

  const { dpArray, steps, initialTable, colHeaders } = useMemo(() => {
    const clamped = Math.max(2, Math.min(20, n));
    const dp = [0, 1];
    for (let i = 2; i <= clamped; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return {
      dpArray: dp,
      steps: dp.map((val, i) => ({ row: 0, col: i, value: val })),
      initialTable: [dp.map(() => ({ value: 0 as number | string, state: "default" as const }))],
      colHeaders: Array.from({ length: clamped + 1 }, (_, i) => String(i)),
    };
  }, [n]);

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Fibonacci Sequence</h2>
        <p className="text-sm text-muted-foreground">
          Enter the value of <strong>n</strong> to generate the Fibonacci sequence. Watch the DP array fill left to right — each cell is the sum of the two previous cells.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NeonInput label="Value of n" value={n} onChange={(v) => setN(Math.max(2, Math.min(20, Number(v) || 2)))} min={2} max={20} />
        </div>
      </GlassCard>

      <DPTableVisualizer
        table={initialTable}
        steps={steps}
        colHeaders={colHeaders}
        title={`Fibonacci DP Array (n=${n})`}
      />

      <GlassCard>
        <h3 className="font-bold mb-2">Complexity Analysis</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="glass-card p-3">
            <p className="text-muted-foreground text-xs">Recursive</p>
            <p className="font-mono text-destructive font-bold text-lg">O(2ⁿ)</p>
            <p className="text-xs text-muted-foreground">time · O(n) space</p>
          </div>
          <div className="glass-card p-3">
            <p className="text-muted-foreground text-xs">Dynamic Programming</p>
            <p className="font-mono font-bold text-lg" style={{ color: "var(--neon-cyan)" }}>O(n)</p>
            <p className="text-xs text-muted-foreground">time · O(n) space</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   0/1 KNAPSACK
   ═══════════════════════════════════════════ */
function KnapsackVisualizer() {
  const [capacity, setCapacity] = useState(7);
  const [items, setItems] = useState([
    { weight: 1, value: 1 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 7 },
  ]);

  const addItem = () => setItems([...items, { weight: 1, value: 1 }]);
  const removeItem = (idx: number) => items.length > 1 && setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: "weight" | "value", val: number) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: Math.max(1, val) };
    setItems(next);
  };

  const weights = items.map((i) => i.weight);
  const values = items.map((i) => i.value);

  const { table, steps, selectedItems } = useMemo(() => computeKnapsack(weights, values, capacity), [weights.join(), values.join(), capacity]);

  const initialTable = table.map((row) => row.map(() => ({ value: 0 as number | string, state: "default" as const })));
  const pathCells = selectedItems.map((itemIdx) => ({ row: itemIdx + 1, col: capacity }));

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">0/1 Knapsack Problem</h2>
        <p className="text-sm text-muted-foreground">
          Enter item weights, values, and knapsack capacity. The system dynamically generates the DP table and highlights the optimal selection.
        </p>
        <NeonInput label="Knapsack Capacity (W)" value={capacity} onChange={(v) => setCapacity(Math.max(1, Math.min(15, Number(v) || 1)))} min={1} max={15} className="max-w-xs" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</span>
            <button onClick={addItem} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr>
                  <th className="px-3 py-1 text-muted-foreground text-left">Item</th>
                  <th className="px-3 py-1 text-muted-foreground text-left">Weight</th>
                  <th className="px-3 py-1 text-muted-foreground text-left">Value</th>
                  <th className="px-3 py-1 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1 font-mono">{i + 1}</td>
                    <td className="px-3 py-1">
                      <input type="number" value={item.weight} min={1} onChange={(e) => updateItem(i, "weight", Number(e.target.value))}
                        className="w-16 bg-secondary border border-border rounded px-2 py-1 font-mono text-sm focus:border-primary outline-none" />
                    </td>
                    <td className="px-3 py-1">
                      <input type="number" value={item.value} min={1} onChange={(e) => updateItem(i, "value", Number(e.target.value))}
                        className="w-16 bg-secondary border border-border rounded px-2 py-1 font-mono text-sm focus:border-primary outline-none" />
                    </td>
                    <td className="px-3 py-1">
                      {items.length > 1 && (
                        <button onClick={() => removeItem(i)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-3 h-3" /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      <DPTableVisualizer
        table={initialTable}
        steps={steps}
        pathCells={pathCells}
        rowHeaders={["∅", ...weights.map((w, i) => `I${i + 1}(${w},${values[i]})`)]}
        colHeaders={Array.from({ length: capacity + 1 }, (_, i) => String(i))}
        title={`Knapsack DP Table (W=${capacity}) — Max Value: ${table[weights.length][capacity]}`}
      />

      <GlassCard>
        <h3 className="font-bold mb-2">Result</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground">Maximum Value</p>
            <p className="font-mono font-bold text-2xl gradient-text">{table[weights.length][capacity]}</p>
          </div>
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground">Selected Items</p>
            <p className="font-mono font-bold" style={{ color: "var(--neon-cyan)" }}>
              {selectedItems.map((i) => `Item ${i + 1}`).join(", ") || "None"}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LONGEST COMMON SUBSEQUENCE
   ═══════════════════════════════════════════ */
function LCSVisualizer() {
  const [s1, setS1] = useState("ABCBDAB");
  const [s2, setS2] = useState("BDCAB");

  const { table, steps, pathCells, lcs } = useMemo(() => computeLCS(s1, s2), [s1, s2]);

  const initialTable = table.map((row) => row.map(() => ({ value: 0 as number | string, state: "default" as const })));

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Longest Common Subsequence</h2>
        <p className="text-sm text-muted-foreground">
          Enter two strings to find their longest common subsequence. The DP matrix highlights matching characters and traces the optimal path.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NeonInput label="String 1" value={s1} type="text" placeholder="e.g. ABCDGH" onChange={(v) => setS1(v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12))} />
          <NeonInput label="String 2" value={s2} type="text" placeholder="e.g. AEDFHR" onChange={(v) => setS2(v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12))} />
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

      <GlassCard>
        <h3 className="font-bold mb-2">Result</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground">LCS Length</p>
            <p className="font-mono font-bold text-2xl gradient-text">{lcs.length}</p>
          </div>
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground">LCS String</p>
            <p className="font-mono font-bold text-xl" style={{ color: "var(--neon-cyan)" }}>{lcs || "—"}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MATRIX CHAIN MULTIPLICATION
   ═══════════════════════════════════════════ */
function MCMVisualizer() {
  const [dims, setDims] = useState([10, 20, 30, 40, 30]);

  const addMatrix = () => setDims([...dims, dims[dims.length - 1] === 0 ? 10 : dims[dims.length - 1]]);
  const removeMatrix = () => dims.length > 3 && setDims(dims.slice(0, -1));
  const updateDim = (idx: number, val: number) => {
    const next = [...dims];
    next[idx] = Math.max(1, val);
    setDims(next);
  };

  const n = dims.length - 1; // number of matrices

  const { costTable, splitTable, steps, initialTable, optimalParens, minCost } = useMemo(() => computeMCM(dims), [dims.join()]);

  const colHeaders = Array.from({ length: n }, (_, i) => `A${i + 1}`);

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4">
        <h2 className="text-xl font-bold">Matrix Chain Multiplication</h2>
        <p className="text-sm text-muted-foreground">
          Enter matrix dimensions. For <strong>{n}</strong> matrices, you need <strong>{n + 1}</strong> dimension values.
          Matrix Aᵢ has dimensions <em>dims[i-1] × dims[i]</em>.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dimensions Array</span>
            <div className="flex gap-2">
              <button onClick={removeMatrix} disabled={dims.length <= 3}
                className="flex items-center gap-1 text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors disabled:opacity-30">
                <Trash2 className="w-3 h-3" /> Remove
              </button>
              <button onClick={addMatrix}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                <Plus className="w-3 h-3" /> Add Matrix
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {dims.map((d, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-mono block text-center">d{i}</span>
                <input type="number" value={d} min={1} onChange={(e) => updateDim(i, Number(e.target.value))}
                  className="w-16 bg-secondary border border-border rounded-lg px-2 py-1.5 font-mono text-sm text-center focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all" />
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <div className="flex flex-wrap gap-2 text-xs">
              {Array.from({ length: n }, (_, i) => (
                <span key={i} className="glass-card px-3 py-1.5 font-mono">
                  A{i + 1}: {dims[i]}×{dims[i + 1]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <DPTableVisualizer
        table={initialTable}
        steps={steps}
        rowHeaders={colHeaders}
        colHeaders={colHeaders}
        title={`MCM Cost Table — Min Cost: ${minCost}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard>
          <h3 className="font-bold mb-3">Optimal Parenthesization</h3>
          <div className="glass-card p-4 text-center">
            <p className="font-mono text-lg font-bold" style={{ color: "var(--neon-cyan)" }}>{optimalParens}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This grouping minimizes the total scalar multiplications.
          </p>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold mb-3">Result Summary</h3>
          <div className="space-y-2">
            <div className="glass-card p-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Minimum Multiplications</span>
              <span className="font-mono font-bold text-xl gradient-text">{minCost.toLocaleString()}</span>
            </div>
            <div className="glass-card p-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Number of Matrices</span>
              <span className="font-mono font-bold">{n}</span>
            </div>
            <div className="glass-card p-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Complexity</span>
              <span className="font-mono font-bold text-sm" style={{ color: "var(--neon-cyan)" }}>O(n³) time · O(n²) space</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="font-bold mb-2">Split Table (k values)</h3>
        <p className="text-xs text-muted-foreground mb-3">Shows the optimal split point k for each subproblem (i,j).</p>
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-10 h-8" />
                {colHeaders.map((h, i) => (
                  <th key={i} className="w-12 h-8 text-xs text-muted-foreground font-mono text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {splitTable.map((row, ri) => (
                <tr key={ri}>
                  <td className="w-10 h-10 text-xs text-muted-foreground font-mono text-center">{colHeaders[ri]}</td>
                  {row.map((val, ci) => (
                    <td key={ci}
                      className="dp-cell w-12 h-10 text-center text-sm font-mono font-semibold"
                      style={{
                        background: val > 0 ? "var(--cell-done)" : "var(--cell-default)",
                        color: val > 0 ? "white" : "var(--muted-foreground)",
                      }}>
                      {val > 0 ? val : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ALGORITHM HELPERS
   ═══════════════════════════════════════════ */

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

function computeMCM(dims: number[]) {
  const n = dims.length - 1;
  const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const s: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const steps: { row: number; col: number; value: number | string }[] = [];

  // Fill diagonal with 0
  for (let i = 0; i < n; i++) {
    steps.push({ row: i, col: i, value: 0 });
  }

  // chain length l from 2 to n
  for (let l = 2; l <= n; l++) {
    for (let i = 0; i < n - l + 1; i++) {
      const j = i + l - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < m[i][j]) {
          m[i][j] = cost;
          s[i][j] = k + 1; // 1-indexed for display
        }
      }
      steps.push({ row: i, col: j, value: m[i][j] });
    }
  }

  const initialTable = m.map((row) =>
    row.map(() => ({ value: "" as number | string, state: "default" as const }))
  );

  // Build optimal parenthesization string
  function buildParens(i: number, j: number): string {
    if (i === j) return `A${i + 1}`;
    const k = s[i][j] - 1; // back to 0-indexed
    return `(${buildParens(i, k)} × ${buildParens(k + 1, j)})`;
  }

  return {
    costTable: m,
    splitTable: s,
    steps,
    initialTable,
    optimalParens: n > 0 ? buildParens(0, n - 1) : "",
    minCost: n > 0 ? m[0][n - 1] : 0,
  };
}
