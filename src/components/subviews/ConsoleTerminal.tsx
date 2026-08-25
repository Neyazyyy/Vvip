import React from 'react';
import { Terminal, Trash2, Copy } from 'lucide-react';

export interface LogEntry {
  id: string;
  time: string;
  text: string;
  type?: 'info' | 'success' | 'warn' | 'error';
}

interface ConsoleTerminalProps {
  logs: LogEntry[];
  onClear: () => void;
  onCopy: () => void;
}

export const ConsoleTerminal: React.FC<ConsoleTerminalProps> = ({ logs, onClear, onCopy }) => {
  return (
    <div className="rounded-2xl bg-[#090b10] border border-[#1d2232] overflow-hidden shadow-xl dir-rtl" dir="rtl">
      {/* Terminal Title Bar */}
      <div className="bg-[#10131d] px-3.5 py-2 border-b border-[#1b202e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold text-gray-300 tracking-wider">
            سجل العمليات المباشر (LOGS)
          </span>
          <span className="text-[9px] font-mono text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-800/30">
            {logs.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onCopy}
            title="نسخ السجلات"
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#1a1f2e] transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClear}
            title="مسح السجلات"
            className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-[#1a1f2e] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Logs Body */}
      <div className="p-3 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto space-y-1 select-text bg-[#07080b]/90 text-left dir-ltr" dir="ltr">
        {logs.length === 0 ? (
          <div className="text-gray-600 italic">No logs available...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-gray-600 select-none">[{log.time}]</span>
              <span
                className={
                  log.type === 'error'
                    ? 'text-red-400'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : log.type === 'success'
                    ? 'text-emerald-400'
                    : log.text.includes('Superuser')
                    ? 'text-emerald-400 font-bold'
                    : log.text.includes('Connected') || log.text.includes('Done')
                    ? 'text-cyan-300 font-semibold'
                    : 'text-gray-300'
                }
              >
                {log.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
