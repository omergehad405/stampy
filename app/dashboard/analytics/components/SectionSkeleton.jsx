export default function SectionSkeleton({ rows = 3, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse space-y-3 ${className}`}
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-4 rounded-lg bg-(--bgColor)/10"
          style={{ width: `${76 + ((index * 13) % 20)}%` }}
        />
      ))}
    </div>
  );
}
