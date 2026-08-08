import { Users, Plus, MoreVertical, Mail, Clock } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { operators } from '@/lib/mockData';

const teamStats = [
  { label: 'Total members', value: 4 },
  { label: 'Online now', value: 3 },
  { label: 'Conversations handled', value: 1240 },
  { label: 'Avg response time', value: '45s' },
];

const memberPerformance = [
  { name: 'Mohamed', avatar: 'M', role: 'Sales Operator', handled: 420, handoffs: 38, satisfaction: 96, online: true },
  { name: 'Layla', avatar: 'L', role: 'Support Lead', handled: 380, handoffs: 52, satisfaction: 94, online: true },
  { name: 'Karim', avatar: 'K', role: 'Customer Success', handled: 240, handoffs: 15, satisfaction: 91, online: false },
  { name: 'Yasmin', avatar: 'Y', role: 'Sales Operator', handled: 200, handoffs: 28, satisfaction: 93, online: true },
];

export function Team() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-main">Team</h2>
          <p className="text-sm text-muted mt-1">Manage your team members and their performance.</p>
        </div>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5" /> Invite member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {teamStats.map((stat, i) => (
          <Card key={stat.label} className="p-4" hover>
            <div className="text-2xl font-bold text-main tabular-nums">{stat.value}</div>
            <div className="text-xs text-muted mt-0.5">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Team members */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-app">
          <span className="text-sm font-semibold text-main">Team Members</span>
        </div>
        <div className="divide-y divide-app">
          {memberPerformance.map((member, i) => (
            <div
              key={member.name}
              className="p-4 flex items-center gap-4 hover:bg-subtle transition-colors group"
              style={{ animation: `fadeInUp 0.4s ease ${i * 80}ms both` }}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-semibold">
                  {member.avatar}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-app ${member.online ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>

              {/* Name & role */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-main">{member.name}</div>
                <div className="text-xs text-muted">{member.role}</div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm font-semibold text-main tabular-nums">{member.handled}</div>
                  <div className="text-[10px] text-muted">Handled</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-main tabular-nums">{member.handoffs}</div>
                  <div className="text-[10px] text-muted">Handoffs</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-green-600 tabular-nums">{member.satisfaction}%</div>
                  <div className="text-[10px] text-muted">CSAT</div>
                </div>
              </div>

              {/* Status badge */}
              <Badge variant={member.online ? 'success' : 'neutral'} size="xs">
                {member.online ? 'Online' : 'Offline'}
              </Badge>

              {/* Actions */}
              <button className="text-muted hover:text-main transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending invitations */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-brand" />
          <span className="text-sm font-semibold text-main">Pending Invitations</span>
        </div>
        <div className="space-y-2">
          {[
            { email: 'team@wazly.com', role: 'Support Agent', sent: '2 days ago' },
          ].map(inv => (
            <div key={inv.email} className="flex items-center justify-between p-3 rounded-lg bg-subtle">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Mail className="w-4 h-4 text-muted" />
                </div>
                <div>
                  <div className="text-sm font-medium text-main">{inv.email}</div>
                  <div className="text-xs text-muted">{inv.role} · Sent {inv.sent}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-subtle" />
                <span className="text-xs text-muted">Pending</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
