export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="inline-block w-2 h-2 bg-accent-purple rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="inline-block w-2 h-2 bg-accent-red rounded-full animate-bounce"></span>
            </div>
            <span className="text-muted">Loading...</span>
          </div>
          
          <div className="mt-8 font-mono text-sm text-dim">
            <p>[████████████████████████] 100%</p>
            <p className="mt-2 text-xs">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  );
}