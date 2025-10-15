import { useMemo } from 'react';

type Props = {
  data: Record<string, unknown>;
  onCopy?: () => void;
  onCenter?: () => void;
};

export function FeaturePopup({ data, onCopy, onCenter }: Props) {
  const entries = useMemo(
    () => Object.entries(data).map(([k, v]) => [k, formatValue(v)] as const),
    [data]
  );

  return (
    <div className="min-w-[280px] max-w-[420px]">
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 -mx-4 -mt-3 mb-3 rounded-t-lg">
        <div className="flex items-center gap-2 text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold">Информация об объекте</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto px-1">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {k}
              </div>
              <div className="text-sm font-medium text-gray-900 break-words">{v || '—'}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
        <button
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            onCopy?.();
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium text-sm">Копировать</span>
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-2.5 text-white hover:from-gray-800 hover:to-gray-900 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          onClick={onCenter}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="font-medium text-sm">Центр</span>
        </button>
      </div>
    </div>
  );
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
