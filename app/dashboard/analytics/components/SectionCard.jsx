"use client";

export default function SectionCard({ title, description, children, className = "" }) {
  return (
    <section
      dir="ltr"
      lang="en"
      className={`min-w-0 rounded-2xl border border-(--bgColor)/15 bg-(--mainColor) p-4 text-(--bgColor) shadow-2xs sm:rounded-3xl sm:p-5 ${className}`}
    >
      <div className="mb-4 border-b border-(--bgColor)/10 pb-3">
        <h2 className="text-sm font-bold sm:text-base">{title}</h2>
        {description && (
          <p className="mt-1 text-xs leading-5 text-(--bgColor)/65">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
