'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isSupabaseEnvError = error.message.includes('Missing Supabase environment variables')

  if (isSupabaseEnvError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Supabase Not Configured
            </h1>
            <p className="text-gray-600">
              The application needs to be connected to Supabase before it can run.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup (5 minutes):</h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full mr-3 flex-shrink-0 text-xs font-bold">1</span>
                <div>
                  <strong>Create a Supabase account</strong>
                  <br />
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    Go to supabase.com →
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full mr-3 flex-shrink-0 text-xs font-bold">2</span>
                <div>
                  <strong>Create a new project</strong>
                  <br />
                  Wait 2-3 minutes for it to initialize
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full mr-3 flex-shrink-0 text-xs font-bold">3</span>
                <div>
                  <strong>Get your API credentials</strong>
                  <br />
                  Settings → API → Copy URL and anon key
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full mr-3 flex-shrink-0 text-xs font-bold">4</span>
                <div>
                  <strong>Update .env.local file</strong>
                  <br />
                  <code className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-xs block mt-1">
                    NEXT_PUBLIC_SUPABASE_URL=your_url_here<br />
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
                  </code>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full mr-3 flex-shrink-0 text-xs font-bold">5</span>
                <div>
                  <strong>Run the database migration</strong>
                  <br />
                  SQL Editor → Run <code className="bg-gray-200 px-1 rounded">001_initial_schema.sql</code>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full mr-3 flex-shrink-0 text-xs font-bold">6</span>
                <div>
                  <strong>Restart the dev server</strong>
                  <br />
                  Stop and run <code className="bg-gray-200 px-1 rounded">npm run dev</code> again
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Need detailed instructions? Check <strong>SETUP.md</strong> in the project root.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            I've configured Supabase - Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
