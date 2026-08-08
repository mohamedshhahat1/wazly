import { useState } from 'react';
import { Search, Filter, Download, MoreVertical, TrendingUp, Target } from 'lucide-react';
import { Card, Badge, ChannelBadge, Button, ProgressBar } from '@/components/ui';
import { channelMeta } from '@/lib/mockData';

interface Lead {
  id: string;
  name: string;
  avatar: string;
  channel: 'whatsapp' | 'instagram' | 'messenger' | 'comments';
  intent: string;
  score: number;
  status: 'qualified' | 'warm' | 'cold' | 'converted';
  lastContact: string;
  value?: string;
}

const leads: Lead[] = [
  { id: '1', name: 'Ahmed', avatar: 'A', channel: 'whatsapp', intent: 'Pricing', score: 91, status: 'qualified', lastContact: '2m ago', value: '12,000 EGP' },
  { id: '2', name: 'Sara', avatar: 'S', channel: 'instagram', intent: 'Shipping', score: 72, status: 'warm', lastContact: '8m ago' },
  { id: '3', name: 'Omar', avatar: 'O', channel: 'messenger', intent: 'Support', score: 68, status: 'warm', lastContact: '15m ago' },
  { id: '4', name: 'Nour', avatar: 'N', channel: 'whatsapp', intent: 'Pricing', score: 85, status: 'qualified', lastContact: '1h ago', value: '8,500 EGP' },
  { id: '5', name: 'Mahmoud', avatar: 'M', channel: 'comments', intent: 'Shipping', score: 50, status: 'cold', lastContact: '2h ago' },
  { id: '6', name: 'Farida', avatar: 'F', channel: 'whatsapp', intent: 'Pricing', score: 88, status: 'qualified', lastContact: '3h ago', value: '15,000 EGP' },
  { id: '7', name: 'Hassan', avatar: 'H', channel: 'instagram', intent: 'Consultation', score: 94, status: 'converted', lastContact: '5h ago', value: '22,000 EGP' },
  { id: '8', name: 'Reem', avatar: 'R', channel: 'messenger', intent: 'Pricing', score: 45, status: 'cold', lastContact: '1d ago' },
];

const statusMeta: Record<Lead['status'], { label: string; variant: 'success' | 'warning' | 'neutral' | 'brand' }> = {
  qualified: { label: 'Qualified', variant: 'success' },
  warm: { label: 'Warm', variant: 'warning' },
  cold: { label: 'Cold', variant: 'neutral' },
  converted: { label: 'Converted', variant: 'brand' },
};

export function Customers() {
  const [filter, setFilter] = useState<'all' | 'qualified' | 'warm' | 'cold' | 'converted'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-main">Customers</h2>
          <p className="text-sm text-muted mt-1">Leads captured and qualified by your AI.</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: leads.length, icon: Target, color: 'text-brand' },
          { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, icon: TrendingUp, color: 'text-brand' },
          { label: 'Avg Score', value: Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length), icon: Target, color: 'text-accent-600' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-4" hover>
              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center mb-2 ${kpi.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-main tabular-nums">{kpi.value}</div>
              <div className="text-xs text-muted">{kpi.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'qualified', 'warm', 'cold', 'converted'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
              filter === f ? 'bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950' : 'text-muted hover:bg-muted'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {selected.size > 0 && (
          <div className="px-4 py-2.5 bg-brand-bg border-b border-brand-200/20 flex items-center gap-3 animate-fade-in">
            <span className="text-xs font-medium text-brand">{selected.size} selected</span>
            <button className="text-xs text-muted hover:text-main transition-colors">Export selected</button>
            <button className="text-xs text-muted hover:text-main transition-colors">Add to CRM</button>
            <button onClick={() => setSelected(new Set())} className="text-xs text-muted hover:text-main transition-colors ml-auto">Clear</button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-app">
                <th className="text-left text-xs font-medium text-muted px-4 py-3">
                  <input type="checkbox" className="rounded border-app" onChange={(e) => setSelected(e.target.checked ? new Set(leads.map(l => l.id)) : new Set())} />
                </th>
                <th className="text-left text-xs font-medium text-muted px-4 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-muted px-4 py-3 hidden sm:table-cell">Channel</th>
                <th className="text-left text-xs font-medium text-muted px-4 py-3 hidden md:table-cell">Intent</th>
                <th className="text-left text-xs font-medium text-muted px-4 py-3">Score</th>
                <th className="text-left text-xs font-medium text-muted px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted px-4 py-3 hidden lg:table-cell">Value</th>
                <th className="text-left text-xs font-medium text-muted px-4 py-3 hidden sm:table-cell">Last contact</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const isSel = selected.has(lead.id);
                const meta = statusMeta[lead.status];
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
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                          {lead.avatar}
                        </div>
                        <span className="text-sm font-medium text-main">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <ChannelBadge channel={lead.channel} size="sm" />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted">{lead.intent}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-main tabular-nums w-6">{lead.score}</span>
                        <div className="w-16">
                          <ProgressBar value={lead.score} color={lead.score >= 80 ? 'green' : lead.score >= 50 ? 'amber' : 'red'} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={meta.variant} size="xs">{meta.label}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-main font-medium">{lead.value || '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-subtle">{lead.lastContact}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-muted hover:text-main transition-colors">
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
