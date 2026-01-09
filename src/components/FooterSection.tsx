import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function FooterSection() {
  return (
    <footer className="bg-black/40 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-500" />
              <span className="text-xl font-bold text-white tracking-tight">CerebroFlow</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Empowering intelligence with persistent, high-fidelity memory systems. Built for the future of human-AI collaboration.
            </p>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">LMP Protocol</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Enterprise</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="hover:text-white cursor-pointer">Documentation</li>
              <li className="hover:text-white cursor-pointer">API Reference</li>
              <li className="hover:text-white cursor-pointer">Guides</li>
              <li className="hover:text-white cursor-pointer">Support</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Stay Informed</h4>
            <p className="text-sm text-muted-foreground mb-4">Subscribe to get updates on new memory layers.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter email" className="bg-white/5 border-white/10" />
              <Button size="icon" className="shrink-0 bg-indigo-500 hover:bg-indigo-600">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2024 CerebroFlow AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="text-xs text-muted-foreground hover:text-white cursor-pointer">Terms of Service</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] text-white/5 cursor-default hover:text-white/20 transition-colors select-none">Quack!</span>
                </TooltipTrigger>
                <TooltipContent className="bg-indigo-600 border-none text-white font-bold">
                  CerebroDuck v1.0.13 Engaged 🦆
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  );
}