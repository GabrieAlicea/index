"use client";

import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-surface-2)",
          "--normal-text": "var(--color-text)",
          "--normal-border": "color-mix(in oklab, white 10%, transparent)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
