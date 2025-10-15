import { Toaster } from 'react-hot-toast';
import { MapView } from '@/components/MapView/MapView';

export function App() {
  return (
    <div className="h-full relative">
      <header className="absolute top-0 left-0 right-0 z-[1001] pointer-events-none">
        <div className="flex items-center justify-center pt-4">
          <div className="pointer-events-auto backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl border border-white/50 px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg blur opacity-50"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ProgisMap
                </h1>
                <p className="text-xs text-gray-500 font-medium">Геоинформационная система</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MapView />

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'backdrop-blur-md',
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            border: '1px solid rgba(229, 231, 235, 0.5)'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white'
            }
          }
        }}
      />
    </div>
  );
}
