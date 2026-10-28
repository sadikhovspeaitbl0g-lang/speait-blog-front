function Loader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-64 items-center justify-center gap-3"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-4 border-muted border-t-blue-400 motion-reduce:animate-none"
      />
      <span className="text-sm text-muted-foreground">
        Loading articles...
      </span>
    </div>
  );
}

export default Loader;