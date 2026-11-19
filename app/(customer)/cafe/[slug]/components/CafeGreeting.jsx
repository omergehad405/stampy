"use client";

import React from "react";

export default function CafeGreeting({ cafe, user }) {
  return (
    <section>
      <p className="text-xs font-semibold tracking-wider uppercase opacity-60">
        {cafe.name} LOYALTY CARD
      </p>
      <h1 className="text-2xl lg:text-3xl font-bold mt-0.5 flex items-center gap-2">
        <span>Hello, {user?.name?.split(" ")[0] || "Customer"}</span>
        <span className="text-2xl lg:text-3xl">👋</span>
      </h1>
      <p className="text-xs sm:text-sm lg:text-base opacity-70 mt-1">
        Your next reward at {cafe.name} is getting closer!
      </p>
    </section>
  );
}
