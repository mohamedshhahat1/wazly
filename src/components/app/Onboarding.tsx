import { useState, useEffect } from 'react';
import {
  Building2, MessageCircle, BookOpen, Sparkles, Users, Check,
  ArrowRight, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { Card, Button, Badge, ProgressBar, ChannelBadge } from '@/components/ui';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { onboardingSteps, readinessItems } from '@/lib/mockData';

const stepIcons = [Building2, MessageCircle, BookOpen, Sparkles, Users, CheckCircle2];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [businessName, setBusinessName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(['whatsapp']));

  const isComplete = (i: number) => completed.has(i);
  const markComplete = (i: number) => {
    setCompleted(prev => new Set(prev).add(i));
    if (i < onboardingSteps.length - 1) {
      setStep(i + 1);
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-main">Wazly</span>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {onboardingSteps.map((label, i) => {
              const Icon = stepIcons[i];
              const active = i === step;
              const done = isComplete(i);
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400 ${
                        done ? 'bg-brand-600 dark:bg-brand-500'
                        : active ? 'bg-brand-600 dark:bg-brand-500 ring-4 ring-brand-200/40 dark:ring-brand-900/30'
                        : 'bg-muted border border-app'
                      }`}
                    >
                      {done ? <Check className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-subtle'}`} />}
                    </div>
                    <span className={`text-[10px] ${active || done ? 'text-main font-medium' : 'text-subtle'}`}>{label}</span>
                  </div>
                  {i < onboardingSteps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-brand-500 transition-all duration-500 ${isComplete(i) ? 'w-full' : 'w-0'}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <Card className="p-6">
          {step === 0 && (
            <StepContainer title="Tell us about your business" desc="This information helps your AI answer customers accurately.">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Wazly Store"
                    className="w-full px-3 py-2.5 rounded-lg bg-muted text-sm text-main placeholder:text-subtle outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">Industry</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-muted text-sm text-main outline-none focus:ring-2 focus:ring-brand-500/30 transition-all">
                    <option>Retail</option>
                    <option>Services</option>
                    <option>Real Estate</option>
                    <option>Food & Beverage</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">Working Hours</label>
                  <div className="flex items-center gap-2">
                    <input type="time" defaultValue="09:00" className="flex-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-main outline-none" />
                    <span className="text-muted text-sm">to</span>
                    <input type="time" defaultValue="22:00" className="flex-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-main outline-none" />
                  </div>
                </div>
              </div>
              <StepFooter>
                <Button onClick={() => markComplete(0)} disabled={!businessName.trim()}>
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 1 && (
            <StepContainer title="Connect your channels" desc="Choose which channels you want Wazly to handle.">
              <div className="space-y-2">
                {[
                  { id: 'whatsapp', label: 'WhatsApp Business' },
                  { id: 'instagram', label: 'Instagram Direct' },
                  { id: 'messenger', label: 'Facebook Messenger' },
                  { id: 'comments', label: 'Facebook Comments' },
                ].map(ch => {
                  const sel = selectedChannels.has(ch.id);
                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannels(prev => {
                          const next = new Set(prev);
                          if (next.has(ch.id)) next.delete(ch.id);
                          else next.add(ch.id);
                          return next;
                        });
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        sel ? 'border-brand-500 bg-brand-bg' : 'border-app hover:border-strong'
                      }`}
                    >
                      <ChannelBadge channel={ch.id as any} size="md" />
                      <span className="flex-1 text-sm font-medium text-main">{ch.label}</span>
                      {sel && <Check className="w-4 h-4 text-brand animate-scale-in" />}
                    </div>
                  );
                })}
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="w-3.5 h-3.5" /> Back</Button>
                <Button onClick={() => markComplete(1)}>Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 2 && (
            <StepContainer title="Add your knowledge" desc="Upload documents so your AI can learn about your business.">
              <div className="space-y-2">
                {readinessItems.map((item, i) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-app" style={{ opacity: 1, animation: `fadeInUp 0.4s ease ${i * 100}ms both` }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.done ? 'bg-brand-600 dark:bg-brand-500' : 'bg-muted'}`}>
                      {item.done ? <Check className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4 text-subtle" />}
                    </div>
                    <span className="flex-1 text-sm text-main">{item.label}</span>
                    {item.done ? <Badge variant="success" size="xs">Ready</Badge> : <Button size="sm" variant="outline">Upload</Button>}
                  </div>
                ))}
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="w-3.5 h-3.5" /> Back</Button>
                <Button onClick={() => markComplete(2)}>Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 3 && (
            <StepContainer title="Configure your AI" desc="Set how your AI should behave with customers.">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">AI Tone</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Friendly', 'Professional', 'Casual'].map((tone, i) => (
                      <div key={tone} className={`p-2.5 rounded-lg border text-center text-sm cursor-pointer transition-all ${i === 0 ? 'border-brand-500 bg-brand-bg text-brand' : 'border-app text-muted hover:border-strong'}`}>
                        {tone}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">Language</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2.5 rounded-lg border border-brand-500 bg-brand-bg text-brand text-sm text-center cursor-pointer">Arabic</div>
                    <div className="flex-1 p-2.5 rounded-lg border border-app text-muted text-sm text-center cursor-pointer hover:border-strong">English</div>
                    <div className="flex-1 p-2.5 rounded-lg border border-app text-muted text-sm text-center cursor-pointer hover:border-strong">Both</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-subtle">
                  <div>
                    <div className="text-sm font-medium text-main">Auto-handoff to human</div>
                    <div className="text-xs text-muted">AI transfers when it can't answer</div>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-brand-500 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="w-3.5 h-3.5" /> Back</Button>
                <Button onClick={() => markComplete(3)}>Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 4 && (
            <StepContainer title="Invite your team" desc="Add team members to handle human handoffs.">
              <div className="space-y-2">
                {[
                  { name: 'Mohamed', role: 'Sales Operator' },
                  { name: 'Layla', role: 'Support Lead' },
                ].map(member => (
                  <div key={member.name} className="flex items-center gap-3 p-3 rounded-xl border border-app">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-semibold">
                      {member.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-main">{member.name}</div>
                      <div className="text-xs text-muted">{member.role}</div>
                    </div>
                    <Badge variant="success" size="xs">Invited</Badge>
                  </div>
                ))}
                <button className="w-full p-3 rounded-xl border-2 border-dashed border-app text-muted hover:text-main hover:border-strong transition-all text-sm">
                  + Invite team member
                </button>
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="w-3.5 h-3.5" /> Back</Button>
                <Button onClick={() => markComplete(4)}>Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 5 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center mx-auto mb-4" style={{ animation: 'scaleIn 0.5s ease-out' }}>
                <CheckCircle2 className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-lg font-bold text-main mb-2">You're all set!</h3>
              <p className="text-sm text-muted mb-6">Your AI is ready to start handling customer conversations.</p>
              <div className="space-y-2 mb-6 text-left">
                {['Business profile created', 'Channels connected', 'Knowledge uploaded', 'AI configured', 'Team invited'].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-main" style={{ animation: `fadeInUp 0.4s ease ${i * 100}ms both` }}>
                    <CheckCircle2 className="w-4 h-4 text-brand" /> {item}
                  </div>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={onComplete}>
                Launch Wazly <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StepContainer({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      <h3 className="text-lg font-semibold text-main mb-1">{title}</h3>
      <p className="text-sm text-muted mb-5">{desc}</p>
      {children}
    </div>
  );
}

function StepFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-app">{children}</div>;
}
