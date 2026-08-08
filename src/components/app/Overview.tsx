import { useState } from 'react';
import {
  Sparkles, MessageCircle, Clock, Bot, ArrowUpRight, Target,
} from 'lucide-react';
import { Card, Badge, StatusDot, ChannelBadge, Button } from '@/components/ui';
import { useReveal, useCountUp } from '@/lib/hooks';
import { analyticsData, inboxConversations, operators } from '@/lib/mockData';
import { LeadQualification } from './LeadQualification';
import type { AppView } from './AppShell';

interface OverviewProps {
  onViewChange: (v: AppView) => void;
}

export function Overview({ onViewChange }: OverviewProps) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });

  const conversations = useCountUp(analyticsData.kpis.conversations.value, visible, 1800);
  const aiResolution = useCountUp(analyticsData.kpis.aiResolution.value, visible, 1500);
  const leads = useCountUp(analyticsData.kpis.leads.value, visible, 1400);
  const responseTime = useCountUp(analyticsData.kpis.responseTime.value, visible, 1200);

  const [recentLeads] = useState([
    { name: 'Ahmed', channel: 'whatsapp' as const, score: 91, intent: 'Pricing', time: '2m ago' },
    { name: 'Sara', channel: 'instagram' as const, score: 72, intent: 'Shipping', time: '8m ago' },
    { name: 'Omar', channel: 'messenger' as const, score: 68, intent: 'Support', time: '15m ago' },
  ]);

  const maxVal = Math.max(...analyticsData.daily.map(d => d.ai + d.human));

  return (
    <div ref={ref} className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-main">Welcome back, Admin</h2>
          <p className="text-sm text-muted mt-1">Here's what's happening with your customer conversations today.</p>
        </div>
        <Button size="sm" onClick={() => onViewChange('ai')}>
          <Sparkles className="w-3.5 h-3.5" /> Test AI
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MessageCircle, label: 'Conversations', value: Math.round(conversations).toLocaleString(), suffix: '', trend: '+12%', color: 'text-brand' },
          { icon: Bot, label: 'AI Resolution', value: Math.round(aiResolution), suffix: '%', trend: '+5%', color: 'text-brand' },
          { icon: Target, label: 'Leads Captured', value: Math.round(leads), suffix: '', trend: '+23%', color: 'text-accent-600' },
          { icon: Clock, label: 'Avg Response', value: responseTime.toFixed(1), suffix: 's', trend: '-0.4s', color: 'text-amber-600' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} hover className="p-4" >
              <div className="flex items-start justify-between mb-3" style={{ opacity: visible ? 1 : 0, transition: `opacity 0.5s ease ${i * 100}ms` }}>
                <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-brand font-medium flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />{kpi.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-main tabular-nums count-up">
                {kpi.value}{kpi.suffix}
              </div>
              <div className="text-xs text-muted mt-0.5">{kpi.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Chart + Status */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-main">Conversations (Last 7 days)</span>
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
          <div className="flex items-end justify-between gap-3 h-40">
            {analyticsData.daily.map((d, i) => {
              const aiHeight = (d.ai / maxVal) * 100;
              const humanHeight = (d.human / maxVal) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      className="w-4 rounded-t bg-brand-500 origin-bottom transition-all duration-700 ease-smooth hover:opacity-80"
                      style={{ height: visible ? `${aiHeight}%` : '0%', transitionDelay: `${i * 80 + 300}ms` }}
                    />
                    <div
                      className="w-4 rounded-t bg-accent-400 origin-bottom transition-all duration-700 ease-smooth hover:opacity-80"
                      style={{ height: visible ? `${humanHeight}%` : '0%', transitionDelay: `${i * 80 + 450}ms` }}
                    />
                  </div>
                  <span className="text-[10px] text-subtle">{d.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* System Status */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-main">System Status</span>
            <StatusDot status="operational" label="All operational" />
          </div>
          <div className="space-y-3">
            {[
              { name: 'WhatsApp', status: 'connected' as const, channel: 'whatsapp' as const },
              { name: 'Instagram', status: 'connected' as const, channel: 'instagram' as const },
              { name: 'Messenger', status: 'connected' as const, channel: 'messenger' as const },
              { name: 'AI Engine', status: 'operational' as const },
              { name: 'Knowledge Base', status: 'ready' as const },
            ].map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.channel && <ChannelBadge channel={item.channel} size="sm" />}
                  <span className="text-sm text-main">{item.name}</span>
                </div>
                <StatusDot status={item.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent leads + conversations */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-main">Recent Leads</span>
            <button onClick={() => onViewChange('customers')} className="text-xs text-brand hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {recentLeads.map(lead => (
              <div key={lead.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-main">{lead.name}</div>
                  <div className="text-xs text-muted">{lead.intent} · {lead.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-main tabular-nums">{lead.score}</span>
                  <Badge variant={lead.score >= 80 ? 'success' : lead.score >= 50 ? 'warning' : 'neutral'} size="xs">
                    {lead.score >= 80 ? 'Qualified' : lead.score >= 50 ? 'Warm' : 'Cold'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-main">Active Conversations</span>
            <button onClick={() => onViewChange('inbox')} className="text-xs text-brand hover:underline">Open inbox</button>
          </div>
          <div className="space-y-2">
            {inboxConversations.slice(0, 4).map(conv => (
              <div key={conv.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => onViewChange('inbox')}>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                    {conv.customerAvatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <ChannelBadge channel={conv.channel} size="sm" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-main truncate">{conv.customerName}</div>
                  <div className={`text-xs text-muted truncate ${conv.previewArabic ? 'font-arabic' : ''}`} dir={conv.previewArabic ? 'rtl' : 'ltr'}>{conv.preview}</div>
                </div>
                <div>
                  {conv.status === 'ai' && <Badge variant="ai" size="xs">AI</Badge>}
                  {conv.status === 'human' && <Badge variant="human" size="xs">Human</Badge>}
                  {conv.status === 'resolved' && <Badge variant="success" size="xs">Done</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lead qualification demo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-main">AI Lead Qualification</h3>
            <p className="text-xs text-muted">Watch how AI detects intent and scores leads in real time</p>
          </div>
          <button onClick={() => onViewChange('leads')} className="text-xs text-brand hover:underline">Open full view</button>
        </div>
        <LeadQualification />
      </div>

      {/* Team */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-main">Team Online</span>
          <button onClick={() => onViewChange('team')} className="text-xs text-brand hover:underline">Manage team</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {operators.map(op => (
            <div key={op.id} className="flex items-center gap-2 p-2 rounded-lg bg-subtle">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-xs font-semibold">
                  {op.avatar}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-app ${op.online ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-main truncate">{op.name}</div>
                <div className="text-xs text-muted truncate">{op.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
