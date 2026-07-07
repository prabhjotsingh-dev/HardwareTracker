'use client'

export default function PrivacyError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mt-10 mb-6 flex items-center gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-5 text-amber-200" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="shrink-0 text-amber-400" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
      <div>
        <h5 className="mb-1 font-semibold">Something went wrong!</h5>
        <p className="mb-0">{error.message}</p>
        <button
          onClick={reset}
          className="mt-2 cursor-pointer rounded-lg bg-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-200 transition-colors hover:bg-amber-500/30"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
