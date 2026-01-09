import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
const plans = [
  {
    name: 'Standard',
    price: '$0',
    description: 'Perfect for exploring contextual AI.',
    features: ['3 Active Workspaces', 'Basic Semantic Retrieval', '48h Memory Persistence', 'Community Support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professionals requiring deep context.',
    features: ['Unlimited Workspaces', 'Advanced Semantic Search', 'Infinite Persistence', 'Priority Support', 'State Checkpoints'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solution for teams.',
    features: ['Custom Retrieval Engines', 'Dedicated Memory Nodes', 'SLA Guarantee', 'Advanced Analytics', 'White-labeling'],
    cta: 'Contact Sales',
    popular: false,
  },
];
export function PricingSection() {
  return (
    <section className="py-24 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">Choose the plan that fits your intelligence needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className={`relative flex flex-col h-full border-2 ${plan.popular ? 'border-indigo-500 shadow-indigo-500/10' : 'border-white/5'}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="ml-1 text-xl text-muted-foreground">/mo</span>}
                  </div>
                  <p className="text-muted-foreground mt-4">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className={`w-full py-6 text-lg font-bold ${plan.popular ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-white/5 hover:bg-white/10'}`}>
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}