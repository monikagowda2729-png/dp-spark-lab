import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward, FastForward } from "lucide-react";

interface CellState {
  value: number | string;
  state: "default" | "active" | "done" | "path";
}

interface DPTableVisualizerProps {
  table: CellState[][];
  steps: { row: number; col: number; value: number | string }[];
  pathCells?: { row: number; col: number }[];
  rowHeaders?: string[];
  colHeaders?: string[];
  title: string;
}

export function DPTableVisualizer({
  table: initialTable,
  steps,
  pathCells = [],
  rowHeaders,
  colHeaders,
  title,
}: DPTableVisualizerProps) {
  const [table, setTable] = useState<CellState[][]>(initialTable);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const reset = useCallback(() => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setTable(initialTable.map((row) => row.map((c) => ({ ...c, state: "default" as const }))));
  }, [initialTable]);

  useEffect(() => {
    reset();
  }, [initialTable, reset]);

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) {
      if (currentStep >= steps.length - 1) setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), speed);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  useEffect(() => {
    if (currentStep < 0) return;
    setTable((prev) => {
      const next: CellState[][] = prev.map((row) =>
        row.map((c): CellState => ({ ...c, state: c.state === "active" ? "done" : c.state }))
      );
      if (currentStep < steps.length) {
        const s = steps[currentStep];
        if (next[s.row] && next[s.row][s.col]) {
          next[s.row][s.col] = { value: s.value, state: "active" };
        }
      }
      // Show path if done
      if (currentStep === steps.length - 1) {
        pathCells.forEach(({ row, col }) => {
          if (next[row] && next[row][col]) {
            next[row][col] = { ...next[row][col], state: "path" };
          }
        });
      }
      return next;
    });
  }, [currentStep, steps, pathCells]);

  const stepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">{title}</h3>
        <span className="text-xs text-muted-foreground">
          Step {Math.max(0, currentStep + 1)} / {steps.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1">
          {colHeaders && (
            <thead>
              <tr>
                {rowHeaders && <th className="w-10 h-8" />}
                {colHeaders.map((h, i) => (
                  <th key={i} className="w-12 h-8 text-xs text-muted-foreground font-mono text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.map((row, ri) => (
              <tr key={ri}>
                {rowHeaders && (
                  <td className="w-10 h-10 text-xs text-muted-foreground font-mono text-center">
                    {rowHeaders[ri]}
                  </td>
                )}
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`dp-cell w-12 h-10 text-center text-sm font-mono font-semibold ${cell.state}`}
                    style={{
                      background:
                        cell.state === "active"
                          ? "var(--cell-active)"
                          : cell.state === "done"
                          ? "var(--cell-done)"
                          : cell.state === "path"
                          ? "var(--cell-path)"
                          : "var(--cell-default)",
                      color: cell.state === "default" ? "var(--muted-foreground)" : "white",
                    }}
                  >
                    {cell.state !== "default" || currentStep >= 0 ? cell.value : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={reset} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="btn-neon !p-2 !px-4 flex items-center gap-2 text-sm"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={stepForward} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <SkipForward className="w-4 h-4" />
        </button>
        <button
          onClick={() => setSpeed((s) => (s === 100 ? 500 : s === 500 ? 200 : 100))}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-1 text-xs"
        >
          <FastForward className="w-4 h-4" />
          {speed === 100 ? "3x" : speed === 200 ? "2x" : "1x"}
        </button>
      </div>
    </div>
  );
}
