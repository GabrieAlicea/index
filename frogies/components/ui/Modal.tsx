"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
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
                  "fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2",
                  "rounded-xl bg-cream-50 p-6 shadow-lifted dark:bg-charcoal-800",
                  "focus-visible:focus-ring",
                  className
                )}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Dialog.Title className="font-display text-xl text-canopy-700 dark:text-leaf-300">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-charcoal-800/70 dark:text-mist-100/70">
                    {description}
                  </Dialog.Description>
                )}
                <div className="mt-4">{children}</div>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close dialog"
                    className="absolute right-4 top-4 rounded-pill p-1 text-charcoal-800/60 hover:bg-leaf-100 focus-visible:focus-ring dark:text-mist-100/60 dark:hover:bg-canopy-900"
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
