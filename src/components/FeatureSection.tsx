import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, ShieldCheck, Zap, History, Layout } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
const features = [
  {
    title: 'Episodic Memory',
    description: 'Recalls exact details of past interactions, maintaining continuity across every session.',
    icon: History,
  },
  {
    title: 'Semantic Retrieval',
    description: 'Finds information based on meaning, not just keywords, powered by our custom vector engine.',
    icon: Brain,
  },
  {
    title: 'Dynamic Pruning',
    description: 'Intelligently manages context by decaying irrelevant information and highlighting key facts.',
    icon: Zap,
  },
  {
    title: 'State Checkpoints',
    description: 'Capture stable states of your context and return to them anytime with a single click.',
    icon: ShieldCheck,
  },
  {
    title: 'Unified Dashboard',
    description: 'Manage all your active and past workspaces from a single, high-performance interface.',
    icon: Layout,
  },
  {
    title: 'Persistent Storage',
    description: 'Your context is stored securely and is always available, session after session.',
    icon: Database,
  },
];
export function FeatureSection() {
  return (
    <section className="py-24 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Context Management</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the Layered Memory Protocol (LMP) that abstracts complexity into a seamless workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="glass-panel hover:bg-white/10 transition-colors group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}