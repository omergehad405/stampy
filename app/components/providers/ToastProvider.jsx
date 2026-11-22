"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <>
      {/* Override react-toastify defaults to match Notch brand */}
      <style>{`
        :root {
          --toastify-color-light: var(--bgColor, #f2ebda);
          --toastify-text-color-light: var(--mainColor, #3b2418);
          --toastify-color-progress-light: #8ec5ff;
          --toastify-color-success: #3b2418;
          --toastify-color-error: #b91c1c;
          --toastify-color-info: #3b2418;
          --toastify-color-warning: #92400e;
          --toastify-font-family: inherit;
          --toastify-border-radius: 1rem;
          --toastify-z-index: 9999;
        }
        .Toastify__toast {
          border: 1px solid color-mix(in srgb, var(--mainColor, #3b2418) 15%, transparent);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15), 0 4px 10px -6px rgba(0,0,0,0.1);
          padding: 12px 16px;
          font-weight: 600;
        }
        .Toastify__toast-body {
          font-size: 0.875rem;
          line-height: 1.4;
        }
        .Toastify__progress-bar {
          height: 3px;
        }
        .Toastify__close-button {
          color: var(--mainColor, #3b2418);
          opacity: 0.5;
        }
        .Toastify__close-button:hover {
          opacity: 1;
        }
      `}</style>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 9999 }}
        limit={3}
      />
    </>
  );
}
