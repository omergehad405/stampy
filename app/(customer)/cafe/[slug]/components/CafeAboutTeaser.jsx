"use client";

import React from "react";
import Link from "next/link";

export default function CafeAboutTeaser({ cafe, slug }) {
  return (
    <section className="mt-8 p-5 sm:p-6 rounded-3xl bg-(--mainColor) text-(--bgColor) border border-(--bgColor)/15">
      <h3 className="text-base font-bold text-(--bgColor)">
        About {cafe.name}
      </h3>
      <p className="text-xs sm:text-sm text-(--bgColor)/75 mt-1.5 leading-relaxed">
        {cafe.about?.shortDescription || cafe.tagline}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Link
          href={`/cafe/${slug}/info`}
          className="text-xs font-bold text-(--secondColor) hover:underline underline-offset-4"
        >
          Read full hours, location & story →
        </Link>
      </div>
    </section>
  );
}
