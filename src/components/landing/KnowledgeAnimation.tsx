import { useEffect, useState } from 'react';
import { Building2, FileText, HelpCircle, Tag, Shield, Check, Sparkles } from 'lucide-react';
import { useReveal, usePrefersReducedMotion } from '@/lib/hooks';

const sources = [
  { name: 'Company Information', icon: Building2, color: '#0d9488' },
  { name: 'Product Catalog (PDF)', icon: FileText, color: '#2563eb' },
  { name: 'FAQ Document', icon: HelpCircle, color: '#7c3aed' },
  { name: 'Products & Pricing', icon: Tag, color: '#ea580c' },
  { name: 'Policies & Terms', icon: Shield, color: '#0891b2' },
];

const pipeline = ['Processing', 'Chunking', 'Indexing', 'AI Knowledge'];

export function KnowledgeAnimation() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.25 });
  const reduced = usePrefersReducedMotion();
  const [activeSource, setActiveSource] = useState(-1);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setActiveSource(sources.length - 1);
      setPipelineStep(pipeline.length - 1);
      setProgress(100);
      setDone(true);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    setDone(false);
    setProgress(0);
    setActiveSource(-1);
    setPipelineStep(-1);

    // Animate sources flowing in one by one
    for (let i = 0; i < sources.length; i++) {
      timeouts.push(setTimeout(() => setActiveSource(i), 300 + i * 600));
    }

    // Start pipeline after first source
    for (let i = 0; i < pipeline.length; i++) {
      timeouts.push(setTimeout(() => setPipelineStep(i), 800 + i * 700));
    }

    // Progress bar
    const progressStart = 800;
    const progressDuration = 2800;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      timeouts.push(setTimeout(() => {
        setProgress(Math.round((i / steps) * 100));
      }, progressStart + (i / steps) * progressDuration));
    }

    // Done
    timeouts.push(setTimeout(() => setDone(true), 800 + pipeline.length * 700 + 300));

    // Loop
    timeouts.push(setTimeout(() => {
      setCycle(c => c + 1);
    }, 6000));

    return () => timeouts.forEach(clearTimeout);
  }, [visible, cycle, reduced]);

  return (
    <div ref={ref} className="w-full max-w-lg mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-xl p-6 space-y-5">
        {/* Sources */}
        <div>
          <div className="text-xs font-medium text-muted mb-3 uppercase tracking-wider">Your Business Information</div>
          <div className="space-y-2">
            {sources.map((src, i) => {
              const Icon = src.icon;
              const active = activeSource >= i;
              return (
                <div
                  key={src.name}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-500 ${
                    active
                      ? 'border-app bg-subtle opacity-100 translate-x-0'
                      : 'border-transparent bg-transparent opacity-30 translate-x-2'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: active ? `${src.color}15` : 'var(--bg-muted)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: active ? src.color : 'var(--text-subtle)' }} />
                  </div>
                  <span className={`text-sm flex-1 ${active ? 'text-main' : 'text-subtle'}`}>{src.name}</span>
                  {active && (
                    <Check className="w-4 h-4 text-brand animate-scale-in" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center">
          <div className={`w-px h-8 bg-gradient-to-b from-brand-400 to-brand-600 transition-opacity duration-500 ${pipelineStep >= 0 ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Pipeline */}
        <div>
          <div className="flex items-center justify-between gap-2">
            {pipeline.map((stage, i) => {
              const active = pipelineStep >= i;
              return (
                <div key={stage} className="flex items-center gap-2 flex-1">
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-400 flex items-center gap-1.5 ${
                      active
                        ? 'bg-brand-bg text-brand border border-brand-200/30 scale-100'
                        : 'bg-muted text-subtle border border-transparent scale-95'
                    }`}
                  >
                    {active && <Sparkles className="w-3 h-3" />}
                    {stage}
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className={`h-px flex-1 transition-colors duration-500 ${pipelineStep > i ? 'bg-brand-400' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">{done ? 'Knowledge ready' : 'Indexing knowledge…'}</span>
            <span className="font-mono text-main tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-mono text-[10px] text-subtle leading-tight">
            {'█'.repeat(Math.floor(progress / 5))}
            <span className="text-border">{'░'.repeat(20 - Math.floor(progress / 5))}</span>
          </div>
        </div>

        {/* Done state */}
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-bg border border-brand-200/20 transition-all duration-500 ${
            done ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-brand">AI Knowledge Ready</div>
            <div className="text-xs text-muted">Your AI can now answer questions about your business.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
