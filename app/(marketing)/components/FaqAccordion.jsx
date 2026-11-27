"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown } from "react-icons/lu";
import { useMarketingLanguage, I18N_CONTENT } from "../i18n";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);
  const { language } = useMarketingLanguage();
  const t = I18N_CONTENT[language] || I18N_CONTENT.en;
  const items = t.home?.faq?.items || [];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const headingId = `faq-heading-${idx}`;
        const panelId = `faq-panel-${idx}`;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-(--mainColor)/15 bg-(--mainColor)/5 transition-colors"
          >
            <button
              type="button"
              id={headingId}
              aria-controls={panelId}
              aria-expanded={isOpen}
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-start cursor-pointer transition hover:bg-(--mainColor)/5"
            >
              <span className="text-sm sm:text-base font-bold text-(--mainColor) pe-4">
                {item.question}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--mainColor)/10 text-(--mainColor) transition-transform duration-200 ${
                  isOpen ? "rotate-180 bg-(--secondColor) text-[#3B2418]" : ""
                }`}
              >
                <LuChevronDown className="h-4 w-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm leading-relaxed text-(--mainColor)/80 border-t border-(--mainColor)/10 pt-3">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
