export function InitialLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground animate-out fade-out duration-500 fill-mode-forwards" style={{ animationDelay: '1.5s' }}>
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="relative flex items-center justify-center animate-pulse drop-shadow-2xl">
          <img src="/logo.png" alt="MyWish Logo" className="h-24 w-auto object-contain" />
        </div>
        <div className="flex flex-col items-center gap-2">

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
