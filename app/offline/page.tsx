'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You're Offline
        </h1>
        
        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Don't worry, we've saved your place!
        </p>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            <strong>Tip:</strong> You can still browse cached pages while offline. Your connection will resume automatically when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
}
