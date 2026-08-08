import { useState, useEffect } from 'react';
import { Building2, FileText, HelpCircle, Tag, Shield, Check, Upload, Sparkles, Plus, Search } from 'lucide-react';
import { Card, Button, Badge, StatusDot, ProgressBar } from '@/components/ui';
import { useReveal, usePrefersReducedMotion } from '@/lib/hooks';
import { knowledgeSources, readinessItems } from '@/lib/mockData';

const iconMap: Record<string, typeof Building2> = {
  building: Building2,
  'file-text': FileText,
  'help-circle': HelpCircle,
  tag: Tag,
  shield: Shield,
};

export function Knowledge() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const reduced = usePrefersReducedMotion();
  const [indexingProgress, setIndexingProgress] = useState(0);
  const [showIndexed, setShowIndexed] = useState(false);

  // Animate indexing of the "processing" source
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

  return (
    <div ref={ref} className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-main">AI Knowledge</h2>
          <p className="text-sm text-muted mt-1">Your AI learns from these sources to answer customer questions.</p>
        </div>
        <Button size="sm">
          <Upload className="w-3.5 h-3.5" /> Add Source
        </Button>
      </div>

      {/* AI Readiness Score */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold text-main">AI Readiness Score</span>
          </div>
          <span className="text-2xl font-bold text-brand tabular-nums count-up">
            {Math.round(((readyCount + (showIndexed ? 1 : 0)) / totalSources) * 100)}%
          </span>
        </div>
        <ProgressBar
          value={(readyCount + (showIndexed ? 1 : 0)) / totalSources * 100}
          color="brand"
          animated
          className="mb-4"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {readinessItems.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-2 text-xs transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-brand-600 dark:bg-brand-500' : 'bg-muted'}`}>
                {item.done ? <Check className="w-2.5 h-2.5 text-white" /> : <div className="w-1 h-1 rounded-full bg-subtle" />}
              </div>
              <span className={item.done ? 'text-main' : 'text-muted'}>{item.label}</span>
            </div>
          ))}
        </div>
        {readyCount + (showIndexed ? 1 : 0) === totalSources && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-bg border border-brand-200/30 animate-fade-in-up">
            <Check className="w-5 h-5 text-brand" />
            <span className="text-sm text-brand font-medium">Your AI is ready to help customers.</span>
          </div>
        )}
      </Card>

      {/* Knowledge sources */}
      <div>
        <div className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Knowledge Sources</div>
        <div className="grid md:grid-cols-2 gap-3">
          {knowledgeSources.map((source, i) => {
            const Icon = iconMap[source.icon] || FileText;
            const isProcessing = source.status === 'processing';
            return (
              <Card key={source.id} className="p-4" hover>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-main">{source.name}</span>
                      {source.status === 'ready' && <Badge variant="success" size="xs">Ready</Badge>}
                      {isProcessing && <Badge variant="warning" size="xs">Indexing</Badge>}
                    </div>

                    {source.status === 'ready' ? (
                      <div className="flex items-center gap-2 mt-1.5">
                        <StatusDot status="ready" />
                        <span className="text-xs text-muted">Indexed and searchable</span>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted">{showIndexed ? 'Knowledge ready' : 'Indexing knowledge…'}</span>
                          <span className="font-mono text-main tabular-nums">{indexingProgress}%</span>
                        </div>
                        <ProgressBar value={indexingProgress} color="brand" animated />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Add new source card */}
          <button className="border-2 border-dashed border-app rounded-xl p-4 flex items-center justify-center gap-2 text-muted hover:text-main hover:border-strong transition-all duration-200 min-h-[88px]">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add knowledge source</span>
          </button>
        </div>
      </div>

      {/* Pipeline visualization */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-brand" />
          <span className="text-sm font-semibold text-main">How AI Knowledge Works</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {['Documents', 'Processing', 'Indexing', 'AI Knowledge', 'Ready'].map((stage, i) => (
            <div key={stage} className="flex items-center gap-2 flex-1">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 flex items-center gap-1.5 ${
                  visible ? 'bg-brand-bg text-brand border border-brand-200/30 scale-100' : 'bg-muted text-subtle scale-95'
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                {i === 4 && <Check className="w-3 h-3" />}
                {stage}
              </div>
              {i < 4 && (
                <div className={`h-px flex-1 transition-colors duration-500 ${visible ? 'bg-brand-400' : 'bg-border'}`} style={{ transitionDelay: `${i * 200 + 100}ms` }} />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
