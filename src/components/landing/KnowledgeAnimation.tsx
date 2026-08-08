import { useEffect, useState } from 'react';
import { Building2, FileText, HelpCircle, Tag, Shield, Check, Sparkles } from 'lucide-react';
import { useReveal, usePrefersReducedMotion } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';

const sourceIcons = [Building2, FileText, HelpCircle, Tag, Shield];

export function KnowledgeAnimation() {
  const { pick, isRTL } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.25 });
  const reduced = usePrefersReducedMotion();
  const [activeSource, setActiveSource] = useState(-1);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [cycle, setCycle] = useState(0);

  const sources = pick(
    ['بيانات الشركة', 'كتالوج الأعمال (PDF)', 'الأسئلة الشائعة', 'الأسعار والخدمات', 'الشروط والسياسات'],
    ['Company information', 'Work catalogue (PDF)', 'FAQ document', 'Pricing & services', 'Terms & policies'],
  );

  const pipeline = pick(
    ['المعالجة', 'التقسيم', 'الفهرسة', 'معرفة الـ AI'],
    ['Processing', 'Chunking', 'Indexing', 'AI knowledge'],
  );

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setActiveSource(sources.length - 1);
      setPipelineStep(pipeline.length - 1);
      setProgress(100);
      setDone(true);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    setDone(false);
    setProgress(0);
    setActiveSource(-1);
    setPipelineStep(-1);

    for (let i = 0; i < sources.length; i++) {
      timeouts.push(setTimeout(() => setActiveSource(i), 300 + i * 600));
    }

    for (let i = 0; i < pipeline.length; i++) {
      timeouts.push(setTimeout(() => setPipelineStep(i), 800 + i * 700));
    }

    const progressStart = 800;
    const progressDuration = 2800;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      timeouts.push(
        setTimeout(() => setProgress(Math.round((i / steps) * 100)), progressStart + (i / steps) * progressDuration),
      );
    }

    timeouts.push(setTimeout(() => setDone(true), 800 + pipeline.length * 700 + 300));
    timeouts.push(setTimeout(() => setCycle(c => c + 1), 6000));

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, cycle, reduced]);

  return (
    <div ref={ref} className="w-full max-w-lg mx-auto">
      <div className="bg-app border border-app rounded-2xl shadow-medium p-5 sm:p-6 space-y-5">
        {/* Sources */}
        <div>
          <div className={`text-xs font-medium text-muted mb-3 ${isRTL ? '' : 'uppercase tracking-wider'}`}>
            {pick('معلومات شركتك', 'Your business information')}
          </div>
          <div className="space-y-2">
            {sources.map((name, i) => {
              const Icon = sourceIcons[i] ?? FileText;
              const active = activeSource >= i;
              return (
                <div
                  key={name}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-500 ${
                    active
                      ? 'border-app bg-subtle opacity-100 translate-y-0'
                      : 'border-transparent bg-transparent opacity-30 translate-y-1'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      active ? 'bg-brand-bg' : 'bg-muted'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors duration-300 ${active ? 'text-brand' : 'text-subtle'}`} />
                  </div>
                  <span className={`text-sm flex-1 min-w-0 truncate ${active ? 'text-main' : 'text-subtle'}`}>{name}</span>
                  {active && <Check className="w-4 h-4 text-brand animate-scale-in shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div
            className={`w-px h-8 bg-brand-500 transition-opacity duration-500 ${
              pipelineStep >= 0 ? 'opacity-60' : 'opacity-0'
            }`}
          />
        </div>

        {/* Pipeline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {pipeline.map((stage, i) => {
            const active = pipelineStep >= i;
            return (
              <div key={stage} className="flex items-center gap-2 flex-1 min-w-max">
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'bg-brand-bg text-brand border border-brand-200/30'
                      : 'bg-muted text-subtle border border-transparent'
                  }`}
                >
                  {active && <Sparkles className="w-3 h-3" />}
                  {stage}
                </div>
                {i < pipeline.length - 1 && (
                  <div
                    className={`h-px flex-1 min-w-[12px] transition-colors duration-500 ${
                      pipelineStep > i ? 'bg-brand-400' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="text-muted">
              {done ? pick('المعرفة جاهزة', 'Knowledge ready') : pick('بنفهرس المعرفة…', 'Indexing knowledge…')}
            </span>
            <span className="font-mono text-main num">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Done */}
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-bg border border-brand-200/20 transition-all duration-500 ${
            done ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-brand">{pick('معرفة الـ AI جاهزة', 'AI knowledge ready')}</div>
            <div className="text-xs text-muted">
              {pick('الـ AI بقى يقدر يرد على أسئلة عملائك.', 'Your AI can now answer questions about your business.')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
