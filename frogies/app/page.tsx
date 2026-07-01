"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  Button,
  Modal,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Slider,
  Tooltip,
  TooltipProvider,
} from "@/components/ui";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [size, setSize] = useState([50]);

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-cream-50 dark:bg-midnight-900">
        <Header />

        <section className="mx-auto max-w-2xl px-6 py-12">
          <h1 className="font-display text-4xl font-semibold text-canopy-700 dark:text-leaf-300">
            Frogies design system
          </h1>
          <p className="mt-2 font-body text-charcoal-800/80 dark:text-mist-100/80">
            Scaffold checkpoint (M0) — the rainforest hero and Coquí creator
            arrive in the next milestones.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Tooltip content="This is a primary action">
              <Button onClick={() => setModalOpen(true)}>Meet your Coquí</Button>
            </Tooltip>
            <Button variant="secondary">Learn about Coquíes</Button>
            <Button variant="ghost">Skip for now</Button>
          </div>

          <div className="mt-10">
            <Tabs defaultValue="body">
              <TabsList>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="eyes">Eyes</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
              </TabsList>
              <TabsContent value="body">
                <p className="text-sm text-charcoal-800/70 dark:text-mist-100/70">
                  Body color and pattern controls will live here.
                </p>
              </TabsContent>
              <TabsContent value="eyes">
                <p className="text-sm text-charcoal-800/70 dark:text-mist-100/70">
                  Eye style and color controls will live here.
                </p>
              </TabsContent>
              <TabsContent value="accessories">
                <p className="text-sm text-charcoal-800/70 dark:text-mist-100/70">
                  Hats, flowers, and flags will live here.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-10 max-w-xs">
            <label
              htmlFor="size-slider"
              className="mb-2 block text-sm font-body text-charcoal-800 dark:text-mist-100"
            >
              Size: {size[0]}
            </label>
            <Slider
              label="Frog size"
              value={size}
              onValueChange={setSize}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </section>

        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Coming soon"
          description="The full Frog Creator arrives in milestone M3."
        >
          <Button onClick={() => setModalOpen(false)}>Got it</Button>
        </Modal>
      </main>
    </TooltipProvider>
  );
}
