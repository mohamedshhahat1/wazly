import { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Clock, Bot, ArrowUpRight, Target } from 'lucide-react';
import { Card, Badge, StatusDot, ChannelBadge, Button } from '@/components/ui';
import { useReveal, useCountUp } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';
import { analyticsData, inboxConversations, operators } from '@/lib/mockData';
import { LeadQualification } from './LeadQualification';
import type { AppView } from './AppShell';

interface OverviewProps {
  onViewChange: (v: AppView) => void;
}

export function Overview({ onViewChange }: OverviewProps) {
  const { pick } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.1 });

  const conversations = useCountUp(analyticsData.kpis.conversations.value, visible, 1800);
  const aiResolution = useCountUp(analyticsData.kpis.aiResolution.value, visible, 1500);
  const leads = useCountUp(analyticsData.kpis.leads.value, visible, 1400);
  const responseTime = useCountUp(analyticsData.kpis.responseTime.value, visible, 1200);

  // Today's live state. One conversation arrives shortly after load and the
  // count ticks up — a single real event rather than a permanent animation.
  const [active, setActive] = useState(12);
  const [newLeads, setNewLeads] = useState(1);
  const [justArrived, setJustArrived] = useState(false);

  useEffect(() => {
    const bump = setTimeout(() => {
      setActive(13);
      setNewLeads(2);
      setJustArrived(true);
    }, 6000);
    const settle = setTimeout(() => setJustArrived(false), 9000);
    return () => {
      clearTimeout(bump);
      clearTimeout(settle);
    };
  }, []);

  const maxVal = Math.max(...analyticsData.daily.map(d => d.ai + d.human));

  const liveStats = [
    {
      value: active,
      label: pick('محادثة نشطة', 'active conversations'),
      accent: false,
      pulse: justArrived,
    },
    { value: 8, label: pick('حلها الـ AI', 'resolved by AI'), accent: false, pulse: false },
    { value: 3, label: pick('محتاجة تدخل', 'need a person'), accent: true, pulse: false },
    { value: newLeads, label: pick('عميل محتمل جديد', 'new leads'), accent: false, pulse: justArrived },
  ];

  const recentLeads = inboxConversations
    .filter(c => (c.leadScore ?? 0) >= 45)
    .slice(0, 3)
    .map(c => ({
      name: pick(c.customerName, c.customerNameEn ?? c.customerName),
      avatar: c.customerAvatar,
      channel: c.channel,
      score: c.leadScore ?? 0,
      intent: pick(c.intent ?? '', c.intentEn ?? c.intent ?? ''),
      time: c.time,
    }));

  return (
    <div ref={ref} className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-main">{pick('أهلًا محمد', 'Welcome back, Mohamed')}</h2>
          <p className="text-sm text-muted mt-1">
            {pick('ده اللي بيحصل في محادثات عملائك النهارده.', "Here's what's happening with your conversations today.")}
          </p>
        </div>
        <Button size="sm" onClick={() => onViewChange('ai')}>
          <Sparkles className="w-3.5 h-3.5" />
          {pick('جرّب الـ AI', 'Test AI')}
        </Button>
      </div>

      {/* Today — the live strip. Deliberately dense. */}
      <div className="border border-app rounded-xl bg-subtle overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-app">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
          <span className="text-xs font-medium text-main">{pick('مباشر الآن', 'Live now')}</span>
          <span className="text-xs text-subtle">· {pick('النهارده', 'Today')}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x-0 lg:divide-x lg:rtl:divide-x-reverse divide-app">
          {liveStats.map(stat => (
            <div key={stat.label} className="px-4 py-3.5">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold num transition-colors duration-500 ${
                    stat.accent ? 'text-amber-600 dark:text-amber-500' : 'text-main'
                  }`}
                >
                  {stat.value}
                </span>
                {stat.pulse && (
                  <span className="text-[10px] font-medium text-brand animate-fade-in">
                    {pick('جديد', 'new')}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* This month — context, not headline */}
      <div>
        <div className="text-xs font-medium text-subtle mb-2">{pick('الشهر ده', 'This month')}</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MessageCircle, label: pick('محادثة', 'Conversations'), value: Math.round(conversations).toLocaleString('en-US'), suffix: '', trend: '+12%' },
            { icon: Bot, label: pick('حلها الـ AI', 'Resolved by AI'), value: Math.round(aiResolution), suffix: '%', trend: '+5%' },
            { icon: Target, label: pick('عميل محتمل', 'Leads'), value: Math.round(leads), suffix: '', trend: '+23%' },
            { icon: Clock, label: pick('متوسط وقت الرد', 'Avg response'), value: responseTime.toFixed(1), suffix: pick('ث', 's'), trend: '-0.4' },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="p-4">
                <div className="flex items-start justify-between mb-3" style={{ opacity: visible ? 1 : 0, transition: `opacity 0.5s ease ${i * 100}ms` }}>
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-brand font-medium flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3 flip-rtl" />
                    <span className="num">{kpi.trend}</span>
                  </span>
                </div>
                <div className="text-2xl font-bold text-main num">
                  {kpi.value}{kpi.suffix}
                </div>
                <div className="text-xs text-muted mt-0.5">{kpi.label}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chart + status */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <span className="text-sm font-semibold text-main">
              {pick('المحادثات — آخر 7 أيام', 'Conversations — last 7 days')}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
                <span className="text-muted">AI</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent-400" />
                <span className="text-muted">{pick('موظف', 'Human')}</span>
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-40">
            {analyticsData.daily.map((d, i) => {
              const aiHeight = (d.ai / maxVal) * 100;
              const humanHeight = (d.human / maxVal) * 100;
              return (
                <div key={d.dayEn} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      className="w-4 rounded-t bg-brand-500 transition-all duration-700 ease-smooth hover:opacity-80"
                      style={{ height: visible ? `${aiHeight}%` : '0%', transitionDelay: `${i * 80 + 300}ms` }}
                    />
                    <div
                      className="w-4 rounded-t bg-accent-400 transition-all duration-700 ease-smooth hover:opacity-80"
                      style={{ height: visible ? `${humanHeight}%` : '0%', transitionDelay: `${i * 80 + 450}ms` }}
                    />
                  </div>
                  <span className="text-[10px] text-subtle">{pick(d.day, d.dayEn)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-main">{pick('حالة النظام', 'System status')}</span>
            <StatusDot status="operational" />
          </div>
          <div className="space-y-3">
            {[
              { name: 'WhatsApp', status: 'connected' as const, channel: 'whatsapp' as const },
              { name: 'Instagram', status: 'connected' as const, channel: 'instagram' as const },
              { name: 'Messenger', status: 'connected' as const, channel: 'messenger' as const },
              { name: pick('محرك الـ AI', 'AI engine'), status: 'operational' as const },
              { name: pick('معرفة الشركة', 'Company knowledge'), status: 'ready' as const },
            ].map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {'channel' in item && item.channel && <ChannelBadge channel={item.channel} size="sm" />}
                  <span className="text-sm text-main">{item.name}</span>
                </div>
                <StatusDot status={item.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leads + conversations */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-main">{pick('أحدث العملاء المحتملين', 'Recent leads')}</span>
            <button onClick={() => onViewChange('customers')} className="text-xs text-brand hover:underline">
              {pick('عرض الكل', 'View all')}
            </button>
          </div>
          <div className="space-y-1">
            {recentLeads.map(lead => (
              <div key={lead.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {lead.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-main truncate">{lead.name}</div>
                  <div className="text-xs text-muted truncate">{lead.intent} · {lead.time}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-main num">{lead.score}</span>
                  <Badge variant={lead.score >= 80 ? 'success' : lead.score >= 50 ? 'warning' : 'neutral'} size="xs">
                    {lead.score >= 80
                      ? pick('مؤهل', 'Qualified')
                      : lead.score >= 50
                        ? pick('مهتم', 'Warm')
                        : pick('بارد', 'Cold')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-main">{pick('محادثات شغّالة', 'Active conversations')}</span>
            <button onClick={() => onViewChange('inbox')} className="text-xs text-brand hover:underline">
              {pick('افتح الصندوق', 'Open inbox')}
            </button>
          </div>
          <div className="space-y-1">
            {inboxConversations.slice(0, 4).map(conv => (
              <div
                key={conv.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => onViewChange('inbox')}
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                    {conv.customerAvatar}
                  </div>
                  <div className="absolute -bottom-0.5 -end-0.5">
                    <ChannelBadge channel={conv.channel} size="sm" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-main truncate">
                    {pick(conv.customerName, conv.customerNameEn ?? conv.customerName)}
                  </div>
                  <div className="text-xs text-muted truncate" dir="auto">{conv.preview}</div>
                </div>
                <div className="shrink-0">
                  {conv.status === 'ai' && <Badge variant="ai" size="xs">AI</Badge>}
                  {conv.status === 'human' && <Badge variant="human" size="xs">{pick('موظف', 'Human')}</Badge>}
                  {conv.status === 'resolved' && <Badge variant="success" size="xs">{pick('تم', 'Done')}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lead qualification demo */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-main">{pick('تأهيل العملاء بالـ AI', 'AI lead qualification')}</h3>
            <p className="text-xs text-muted mt-0.5">
              {pick('شوف الـ AI بيفهم نية العميل ويقيّمه لحظيًا', 'Watch the AI read intent and score a lead in real time')}
            </p>
          </div>
          <button onClick={() => onViewChange('leads')} className="text-xs text-brand hover:underline shrink-0">
            {pick('العرض الكامل', 'Open full view')}
          </button>
        </div>
        <LeadQualification />
      </div>

      {/* Team */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-main">{pick('الفريق دلوقتي', 'Team online')}</span>
          <button onClick={() => onViewChange('team')} className="text-xs text-brand hover:underline">
            {pick('إدارة الفريق', 'Manage team')}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {operators.map(op => (
            <div key={op.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-subtle">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-white text-xs font-semibold">
                  {op.avatar}
                </div>
                <span className={`absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full border-2 border-app ${op.online ? 'bg-green-500' : 'bg-ink-400'}`} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-main truncate">{pick(op.name, op.nameEn ?? op.name)}</div>
                <div className="text-xs text-muted truncate">{pick(op.role, op.roleEn ?? op.role)}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
