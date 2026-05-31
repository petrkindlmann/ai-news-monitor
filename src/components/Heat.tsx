export function Heat({ heat }: { heat: number }) {
  return (
    <span className="heat" title={`Heat ${heat} of 5`} aria-label={`Heat ${heat} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`dot${i <= heat ? ' on' : ''}`} />
      ))}
    </span>
  );
}
