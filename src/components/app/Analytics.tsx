import { useState } from 'react';
import { TrendingUp, MessageCircle, Bot, Target, Clock, Download } from 'lucide-react';
import { Card, Badge, Button, ChannelBadge } from '@/components/ui';
import { useReveal, useCountUp } from '@/lib/hooks';
import { analyticsData, channelMeta } from '@/lib/mockData';

export function Analytics() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const [hoveredChannel, setHoveredChannel] = useState<number | null>(null);

  const data = range === '7d' ? analyticsData.daily : analyticsData.monthly;
  const maxVal = Math.max(...data.map(d => d.ai + d.human));

  const conversations = useCountUp(analyticsData.kpis.conversations.value, visible, 1800);
  const aiResolution = useCountUp(analyticsData.kpis.aiResolution.value, visible, 1500);
  const leads = useCountUp(analyticsData.kpis.leads.value, visible, 1400);
  const responseTime = useCountUp(analyticsData.kpis.responseTime.value, visible, 1200);

  const kpis = [
    { icon: MessageCircle, label: 'Conversations', value: Math.round(conversations).toLocaleString(), suffix: '', trend: '+12%', color: 'text-brand' },
    { icon: Bot, label: 'AI Resolution', value: Math.round(aiResolution), suffix: '%', trend: '+5%', color: 'text-brand' },
    { icon: Target, label: 'Leads', value: Math.round(leads), suffix: '', trend: '+23%', color: 'text-accent-600' },
    { icon: Clock, label: 'Avg Response', value: responseTime.toFixed(1), suffix: 's', trend: '-0.4s', color: 'text-amber-600' },
  ];

  return (
    <div ref={ref} className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-main">Analytics</h2>
          <p className="text-sm text-muted mt-1">Track your customer conversations, AI performance, and leads.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-app overflow-hidden">
            <button
              onClick={() => setRange('7d')}
              className={`text-xs px-3 py-1.5 transition-colors ${range === '7d' ? 'bg-brand-600 text-white' : 'text-muted hover:bg-muted'}`}
            >
              Last 7 days
            </button>
            <button
              onClick={() => setRange('30d')}
              className={`text-xs px-3 py-1.5 transition-colors ${range === '30d' ? 'bg-brand-600 text-white' : 'text-muted hover:bg-muted'}`}
            >
              Last 30 days
            </button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-4" hover>
              <div className="flex items-start justify-between mb-3" style={{ opacity: visible ? 1 : 0, transition: `opacity 0.5s ease ${i * 100}ms` }}>
                <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-brand font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />{kpi.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-main tabular-nums count-up">{kpi.value}{kpi.suffix}</div>
              <div className="text-xs text-muted mt-0.5">{kpi.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Conversation chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-main">Conversations Over Time</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
              <span className="text-muted">AI</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-accent-400" />
              <span className="text-muted">Human</span>
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-48">
          {data.map((d, i) => {
            const aiHeight = (d.ai / maxVal) * 100;
            const humanHeight = (d.human / maxVal) * 100;
            return (
              <div key={d.day + range} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1 h-full relative">
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-ink-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                    AI: {d.ai} · Human: {d.human}
                  </div>
                  <div
                    className="w-5 rounded-t bg-brand-500 origin-bottom transition-all duration-700 ease-smooth hover:opacity-80"
                    style={{ height: visible ? `${aiHeight}%` : '0%', transitionDelay: `${i * 60}ms` }}
                  />
                  <div
                    className="w-5 rounded-t bg-accent-400 origin-bottom transition-all duration-700 ease-smooth hover:opacity-80"
                    style={{ height: visible ? `${humanHeight}%` : '0%', transitionDelay: `${i * 60 + 100}ms` }}
                  />
                </div>
                <span className="text-[10px] text-subtle">{d.day}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Channel distribution */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-main">Channel Distribution</span>
        </div>
        <div className="space-y-4">
          {analyticsData.channelDistribution.map((ch, i) => {
            const meta = channelMeta[ch.channel];
            const isHovered = hoveredChannel === i;
            return (
              <div
                key={ch.channel}
                onMouseEnter={() => setHoveredChannel(i)}
                onMouseLeave={() => setHoveredChannel(null)}
                className="transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ChannelBadge channel={ch.channel} size="sm" />
                    <span className="text-sm font-medium text-main">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-main tabular-nums">{ch.percentage}%</span>
                    <span className="text-xs text-muted">{ch.conversations.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-smooth"
                    style={{
                      width: visible ? `${ch.percentage}%` : '0%',
                      backgroundColor: meta.color,
                      transitionDelay: `${i * 150 + 300}ms`,
                    }}
                  />
                </div>
                {isHovered && (
                  <div className="grid grid-cols-3 gap-2 mt-2 animate-fade-in">
                    <div className="text-xs">
                      <span className="text-muted">AI Resolution</span>
                      <div className="font-semibold text-main">{ch.aiResolution}%</div>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted">Leads</span>
                      <div className="font-semibold text-main">{ch.leads}</div>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted">Conversion</span>
                      <div className="font-semibold text-main">{ch.conversion}%</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
