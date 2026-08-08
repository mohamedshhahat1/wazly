import { Plus, MoreVertical, Mail, Clock } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useLang } from '@/lib/i18n';
import { operators } from '@/lib/mockData';

// Performance keyed by operator id so it stays attached to the right person.
const performance: Record<string, { handled: number; handoffs: number; satisfaction: number }> = {
  op1: { handled: 420, handoffs: 38, satisfaction: 96 },
  op2: { handled: 380, handoffs: 52, satisfaction: 94 },
  op3: { handled: 240, handoffs: 15, satisfaction: 91 },
  op4: { handled: 200, handoffs: 28, satisfaction: 93 },
};

export function Team() {
  const { pick } = useLang();

  const onlineCount = operators.filter(o => o.online).length;
  const totalHandled = operators.reduce((sum, o) => sum + (performance[o.id]?.handled ?? 0), 0);

  const teamStats = [
    { label: pick('أعضاء الفريق', 'Total members'), value: String(operators.length) },
    { label: pick('متاحين دلوقتي', 'Online now'), value: String(onlineCount) },
    { label: pick('محادثات اتعاملوا معاها', 'Conversations handled'), value: totalHandled.toLocaleString('en-US') },
    { label: pick('متوسط وقت الرد', 'Avg response time'), value: pick('45ث', '45s') },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-main">{pick('الفريق', 'Team')}</h2>
          <p className="text-sm text-muted mt-1">
            {pick('ادير أعضاء فريقك وشوف أداءهم.', 'Manage your team and their performance.')}
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5" /> {pick('ضيف عضو', 'Invite member')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {teamStats.map(stat => (
          <Card key={stat.label} className="p-4">
            <div className="text-2xl font-bold text-main num">{stat.value}</div>
            <div className="text-xs text-muted mt-0.5">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Members */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-app">
          <span className="text-sm font-semibold text-main">{pick('أعضاء الفريق', 'Team members')}</span>
        </div>
        <div className="divide-y divide-app">
          {operators.map((member, i) => {
            const perf = performance[member.id] ?? { handled: 0, handoffs: 0, satisfaction: 0 };
            return (
              <div
                key={member.id}
                className="p-4 flex items-center gap-4 hover:bg-subtle transition-colors group"
                style={{ animation: `fadeInUp 0.4s ease ${i * 80}ms both` }}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center text-white font-semibold">
                    {member.avatar}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full border-2 border-app ${
                      member.online ? 'bg-green-500' : 'bg-ink-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-main truncate">{pick(member.name, member.nameEn ?? member.name)}</div>
                  <div className="text-xs text-muted truncate">{pick(member.role, member.roleEn ?? member.role)}</div>
                </div>

                <div className="hidden sm:flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-main num">{perf.handled}</div>
                    <div className="text-[10px] text-muted">{pick('اتعامل معاها', 'Handled')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-main num">{perf.handoffs}</div>
                    <div className="text-[10px] text-muted">{pick('تحويل لموظف', 'Handoffs')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-green-600 num">{perf.satisfaction}%</div>
                    <div className="text-[10px] text-muted">{pick('رضا العملاء', 'CSAT')}</div>
                  </div>
                </div>

                <Badge variant={member.online ? 'success' : 'neutral'} size="xs">
                  {member.online ? pick('متاح', 'Online') : pick('مش متاح', 'Offline')}
                </Badge>

                {/* Visible on touch, hover-revealed on desktop */}
                <button
                  className="text-muted hover:text-main transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                  aria-label={pick('خيارات', 'Options')}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Pending invitations */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-muted" />
          <span className="text-sm font-semibold text-main">{pick('دعوات معلقة', 'Pending invitations')}</span>
        </div>
        <div className="space-y-2">
          {[
            {
              email: 'sales@elkayan.com',
              role: pick('موظف مبيعات', 'Sales agent'),
              sent: pick('من يومين', '2 days ago'),
            },
          ].map(inv => (
            <div key={inv.email} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-subtle">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-muted" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-main truncate force-ltr text-start">{inv.email}</div>
                  <div className="text-xs text-muted truncate">
                    {inv.role} · {pick('اتبعتت', 'Sent')} {inv.sent}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Clock className="w-3.5 h-3.5 text-subtle" />
                <span className="text-xs text-muted">{pick('معلقة', 'Pending')}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
