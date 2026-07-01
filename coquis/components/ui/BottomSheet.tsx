"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  className,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-midnight-900/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-xl bg-cream-50 p-6 pb-8 shadow-lifted dark:bg-charcoal-800",
                  "focus-visible:focus-ring",
                  className
                )}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-pill bg-stone-200 dark:bg-canopy-900" />
                <Dialog.Title className="font-display text-xl text-canopy-700 dark:text-leaf-300">
                  {title}
                </Dialog.Title>
                <div className="mt-4">{children}</div>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close"
                    className="absolute right-4 top-4 rounded-pill p-1 text-charcoal-800/70 hover:bg-leaf-100 focus-visible:focus-ring dark:text-mist-100/70 dark:hover:bg-canopy-900"
                  >
                    ✕
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
