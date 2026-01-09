import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Layered Memory Protocol (LMP) Powered</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-display mb-6"
        >
          Your Intelligence, <br />
          <span className="text-cerebro-gradient">Perfectly Remembered.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-body mx-auto mb-10 text-muted-foreground"
        >
          CerebroFlow is the next generation of contextual AI workspaces. Our unique memory layers 
          ensure your AI remembers what matters, when it matters.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild className="btn-gradient">
            <Link to="/dashboard">
              Launch Workspace <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" className="rounded-full px-8 py-6 text-lg hover:bg-white/5">
            How it works
          </Button>
        </motion.div>
      </div>
    </section>
  );
}