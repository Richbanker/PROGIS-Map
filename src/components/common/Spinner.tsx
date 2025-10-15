export function Spinner() {
  return (
    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-md">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-xl opacity-50 animate-pulse"></div>
        <div className="relative rounded-2xl bg-white p-8 shadow-2xl border border-blue-100">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-transparent bg-gradient-to-br from-blue-500 to-indigo-600"
                style={{
                  borderTopColor: 'transparent',
                  borderRightColor: 'rgb(59 130 246)',
                  borderBottomColor: 'rgb(99 102 241)',
                  borderLeftColor: 'rgb(139 92 246)'
                }}
              />
              <div
                className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-400 opacity-40"
                style={{ animationDirection: 'reverse', animationDuration: '1s' }}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-sm font-semibold text-gray-700">Загрузка данных</div>
              <div className="flex gap-1">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
