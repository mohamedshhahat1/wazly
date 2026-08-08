import { useState, useEffect } from 'react';
import { Building2, FileText, HelpCircle, Tag, Shield, Check, Upload, Sparkles, Plus, Search } from 'lucide-react';
import { Card, Button, Badge, StatusDot, ProgressBar } from '@/components/ui';
import { useReveal, usePrefersReducedMotion } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';
import { knowledgeSources, readinessItems } from '@/lib/mockData';

const iconMap: Record<string, typeof Building2> = {
  building: Building2,
  'file-text': FileText,
  'help-circle': HelpCircle,
  tag: Tag,
  shield: Shield,
};

export function Knowledge() {
  const { pick, isRTL } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const reduced = usePrefersReducedMotion();
  const [indexingProgress, setIndexingProgress] = useState(0);
  const [showIndexed, setShowIndexed] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setIndexingProgress(100);
      setShowIndexed(true);
      return;
    }
    const interval = setInterval(() => {
      setIndexingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowIndexed(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [visible, reduced]);

  const readyCount = knowledgeSources.filter(s => s.status === 'ready').length;
  const totalSources = knowledgeSources.length;
  const readiness = Math.round(((readyCount + (showIndexed ? 1 : 0)) / totalSources) * 100);
  const allReady = readyCount + (showIndexed ? 1 : 0) === totalSources;

  const stages = pick(
    ['الملفات', 'المعالجة', 'الفهرسة', 'معرفة الـ AI', 'جاهز'],
    ['Documents', 'Processing', 'Indexing', 'AI knowledge', 'Ready'],
  );

  return (
    <div ref={ref} className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-main">{pick('معرفة الشركة', 'Company knowledge')}</h2>
          <p className="text-sm text-muted mt-1">
            {pick('الـ AI بيتعلم من المصادر دي عشان يرد على عملائك.', 'Your AI learns from these sources to answer customers.')}
          </p>
        </div>
        <Button size="sm">
          <Upload className="w-3.5 h-3.5" /> {pick('ضيف مصدر', 'Add source')}
        </Button>
      </div>

      {/* Readiness */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold text-main">{pick('جاهزية الـ AI', 'AI readiness')}</span>
          </div>
          <span className="text-2xl font-bold text-brand num">{readiness}%</span>
        </div>
        <ProgressBar value={readiness} color="brand" animated className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {readinessItems.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-2 text-xs transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-brand-600 dark:bg-brand-500' : 'bg-muted'}`}>
                {item.done ? <Check className="w-2.5 h-2.5 text-white" /> : <div className="w-1 h-1 rounded-full bg-subtle" />}
              </div>
              <span className={item.done ? 'text-main' : 'text-muted'}>
                {pick(item.label, item.labelEn ?? item.label)}
              </span>
            </div>
          ))}
        </div>
        {allReady && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-bg border border-brand-200/30 animate-fade-in-up">
            <Check className="w-5 h-5 text-brand shrink-0" />
            <span className="text-sm text-brand font-medium">
              {pick('الـ AI جاهز يساعد عملائك.', 'Your AI is ready to help customers.')}
            </span>
          </div>
        )}
      </Card>

      {/* Sources */}
      <div>
        <div className={`text-xs font-medium text-muted mb-3 ${isRTL ? '' : 'uppercase tracking-wider'}`}>
          {pick('مصادر المعرفة', 'Knowledge sources')}
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {knowledgeSources.map(source => {
            const Icon = iconMap[source.icon] || FileText;
            const isProcessing = source.status === 'processing';
            return (
              <Card key={source.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-main">
                        {pick(source.name, source.nameEn ?? source.name)}
                      </span>
                      {source.status === 'ready' && <Badge variant="success" size="xs">{pick('جاهز', 'Ready')}</Badge>}
                      {isProcessing && <Badge variant="warning" size="xs">{pick('بيتفهرس', 'Indexing')}</Badge>}
                    </div>

                    {source.status === 'ready' ? (
                      <div className="flex items-center gap-2 mt-1.5">
                        <StatusDot status="ready" />
                        <span className="text-xs text-muted">{pick('اتفهرس وقابل للبحث', 'Indexed and searchable')}</span>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1 gap-2">
                          <span className="text-muted">
                            {showIndexed ? pick('المعرفة جاهزة', 'Knowledge ready') : pick('بنفهرس المعرفة…', 'Indexing knowledge…')}
                          </span>
                          <span className="font-mono text-main num">{indexingProgress}%</span>
                        </div>
                        <ProgressBar value={indexingProgress} color="brand" animated />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          <button className="border border-dashed border-app rounded-xl p-4 flex items-center justify-center gap-2 text-muted hover:text-main hover:border-strong transition-all duration-200 min-h-[88px]">
            <Plus className="w-4 h-4" />
            <span className="text-sm">{pick('ضيف مصدر معرفة', 'Add knowledge source')}</span>
          </button>
        </div>
      </div>

      {/* Pipeline */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted" />
          <span className="text-sm font-semibold text-main">
            {pick('معرفة الـ AI بتشتغل إزاي', 'How AI knowledge works')}
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {stages.map((stage, i) => (
            <div key={stage} className="flex items-center gap-2 flex-1 min-w-max">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 flex items-center gap-1.5 whitespace-nowrap ${
                  visible ? 'bg-brand-bg text-brand border border-brand-200/30' : 'bg-muted text-subtle'
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                {i === stages.length - 1 && <Check className="w-3 h-3" />}
                {stage}
              </div>
              {i < stages.length - 1 && (
                <div
                  className={`h-px flex-1 min-w-[16px] transition-colors duration-500 ${visible ? 'bg-brand-400' : 'bg-border'}`}
                  style={{ transitionDelay: `${i * 200 + 100}ms` }}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
