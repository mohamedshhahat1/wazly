import { useState } from 'react';
import { Download, MoreVertical, TrendingUp, Target } from 'lucide-react';
import { Card, Badge, ChannelBadge, Button, ProgressBar } from '@/components/ui';
import { useLang } from '@/lib/i18n';

interface Lead {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  channel: 'whatsapp' | 'instagram' | 'messenger' | 'comments';
  intent: string;
  intentEn: string;
  score: number;
  status: 'qualified' | 'warm' | 'cold' | 'converted';
  lastContact: string;
  lastContactEn: string;
  value?: number;
}

const leads: Lead[] = [
  { id: '1', name: 'أحمد محمد', nameEn: 'Ahmed Mohamed', avatar: 'أ', channel: 'whatsapp', intent: 'تسعير', intentEn: 'Pricing', score: 91, status: 'qualified', lastContact: '٢ د', lastContactEn: '2m ago', value: 120000 },
  { id: '2', name: 'سارة أحمد', nameEn: 'Sara Ahmed', avatar: 'س', channel: 'instagram', intent: 'تشطيبات', intentEn: 'Finishing', score: 72, status: 'warm', lastContact: '٨ د', lastContactEn: '8m ago' },
  { id: '3', name: 'محمود السيد', nameEn: 'Mahmoud Elsayed', avatar: 'م', channel: 'messenger', intent: 'متابعة', intentEn: 'Follow-up', score: 68, status: 'warm', lastContact: '١٥ د', lastContactEn: '15m ago' },
  { id: '4', name: 'نورهان عادل', nameEn: 'Nourhan Adel', avatar: 'ن', channel: 'whatsapp', intent: 'تسعير', intentEn: 'Pricing', score: 85, status: 'qualified', lastContact: '١ س', lastContactEn: '1h ago', value: 85000 },
  { id: '5', name: 'حسن إبراهيم', nameEn: 'Hassan Ibrahim', avatar: 'ح', channel: 'comments', intent: 'استفسار', intentEn: 'General', score: 50, status: 'cold', lastContact: '٢ س', lastContactEn: '2h ago' },
  { id: '6', name: 'فريدة سمير', nameEn: 'Farida Samir', avatar: 'ف', channel: 'whatsapp', intent: 'تسعير', intentEn: 'Pricing', score: 88, status: 'qualified', lastContact: '٣ س', lastContactEn: '3h ago', value: 150000 },
  { id: '7', name: 'محمد حسن', nameEn: 'Mohamed Hassan', avatar: 'م', channel: 'instagram', intent: 'استشارة', intentEn: 'Consultation', score: 94, status: 'converted', lastContact: '٥ س', lastContactEn: '5h ago', value: 220000 },
  { id: '8', name: 'ريم مصطفى', nameEn: 'Reem Mostafa', avatar: 'ر', channel: 'messenger', intent: 'تسعير', intentEn: 'Pricing', score: 45, status: 'cold', lastContact: 'يوم', lastContactEn: '1d ago' },
];

const statusVariant: Record<Lead['status'], 'success' | 'warning' | 'neutral' | 'brand'> = {
  qualified: 'success',
  warm: 'warning',
  cold: 'neutral',
  converted: 'brand',
};

type Filter = 'all' | 'qualified' | 'warm' | 'cold' | 'converted';

export function Customers() {
  const { pick } = useLang();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const statusLabel: Record<Lead['status'], string> = {
    qualified: pick('مؤهل', 'Qualified'),
    warm: pick('مهتم', 'Warm'),
    cold: pick('بارد', 'Cold'),
    converted: pick('اتحوّل', 'Converted'),
  };

  const filterLabel: Record<Filter, string> = {
    all: pick('الكل', 'All'),
    ...statusLabel,
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currency = pick('ج.م', 'EGP');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-main">{pick('العملاء', 'Customers')}</h2>
          <p className="text-sm text-muted mt-1">
            {pick('العملاء اللي جمعهم وأهّلهم الـ AI.', 'Leads captured and qualified by your AI.')}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-3.5 h-3.5" /> {pick('تصدير', 'Export')}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: pick('إجمالي العملاء', 'Total leads'), value: leads.length, icon: Target },
          { label: pick('مؤهلين', 'Qualified'), value: leads.filter(l => l.status === 'qualified').length, icon: TrendingUp },
          { label: pick('اتحوّلوا', 'Converted'), value: leads.filter(l => l.status === 'converted').length, icon: TrendingUp },
          { label: pick('متوسط التقييم', 'Avg score'), value: Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length), icon: Target },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-4">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mb-2 text-muted">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-main num">{kpi.value}</div>
              <div className="text-xs text-muted">{kpi.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'qualified', 'warm', 'cold', 'converted'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              filter === f ? 'bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950' : 'text-muted hover:bg-muted'
            }`}
          >
            {filterLabel[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {selected.size > 0 && (
          <div className="px-4 py-2.5 bg-brand-bg border-b border-brand-200/20 flex items-center gap-3 animate-fade-in">
            <span className="text-xs font-medium text-brand">
              <span className="num">{selected.size}</span> {pick('محدد', 'selected')}
            </span>
            <button className="text-xs text-muted hover:text-main transition-colors">{pick('صدّر المحدد', 'Export selected')}</button>
            <button className="text-xs text-muted hover:text-main transition-colors">{pick('ضيف للـ CRM', 'Add to CRM')}</button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-muted hover:text-main transition-colors ms-auto"
            >
              {pick('إلغاء', 'Clear')}
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app">
                <th className="text-start text-xs font-medium text-muted px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-app"
                    aria-label={pick('حدد الكل', 'Select all')}
                    onChange={e => setSelected(e.target.checked ? new Set(leads.map(l => l.id)) : new Set())}
                  />
                </th>
                <th className="text-start text-xs font-medium text-muted px-4 py-3">{pick('العميل', 'Customer')}</th>
                <th className="text-start text-xs font-medium text-muted px-4 py-3 hidden sm:table-cell">{pick('القناة', 'Channel')}</th>
                <th className="text-start text-xs font-medium text-muted px-4 py-3 hidden md:table-cell">{pick('الطلب', 'Intent')}</th>
                <th className="text-start text-xs font-medium text-muted px-4 py-3">{pick('التقييم', 'Score')}</th>
                <th className="text-start text-xs font-medium text-muted px-4 py-3">{pick('الحالة', 'Status')}</th>
                <th className="text-start text-xs font-medium text-muted px-4 py-3 hidden lg:table-cell">{pick('القيمة', 'Value')}</th>
                <th className="text-start text-xs font-medium text-muted px-4 py-3 hidden sm:table-cell">{pick('آخر تواصل', 'Last contact')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const isSel = selected.has(lead.id);
                return (
                  <tr
                    key={lead.id}
                    className={`border-b border-app last:border-0 transition-colors duration-150 hover:bg-subtle ${isSel ? 'bg-brand-bg/50' : ''}`}
                    style={{ animation: `fadeIn 0.3s ease ${i * 50}ms both` }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleSelect(lead.id)}
                        className="rounded border-app"
                        aria-label={pick(lead.name, lead.nameEn)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {lead.avatar}
                        </div>
                        <span className="text-sm font-medium text-main whitespace-nowrap">{pick(lead.name, lead.nameEn)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <ChannelBadge channel={lead.channel} size="sm" />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted whitespace-nowrap">{pick(lead.intent, lead.intentEn)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-main num w-6">{lead.score}</span>
                        <div className="w-16">
                          <ProgressBar value={lead.score} color={lead.score >= 80 ? 'green' : lead.score >= 50 ? 'amber' : 'red'} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[lead.status]} size="xs">{statusLabel[lead.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {lead.value ? (
                        <span className="text-sm text-main font-medium whitespace-nowrap">
                          <span className="num">{lead.value.toLocaleString('en-US')}</span> {currency}
                        </span>
                      ) : (
                        <span className="text-sm text-subtle">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-subtle whitespace-nowrap">{pick(lead.lastContact, lead.lastContactEn)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-muted hover:text-main transition-colors"
                        aria-label={pick('خيارات', 'Options')}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
