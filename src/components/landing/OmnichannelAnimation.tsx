import { useEffect, useRef, useState } from 'react';
import { useReveal, usePrefersReducedMotion, useInterval } from '@/lib/hooks';
import { ChannelIcon } from '@/components/ui';
import { useLang } from '@/lib/i18n';
import { Sparkles } from 'lucide-react';
import type { ChannelType } from '@/lib/mockData';

const channels: { type: ChannelType; label: string; color: string }[] = [
  { type: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { type: 'instagram', label: 'Instagram', color: '#dc2743' },
  { type: 'messenger', label: 'Messenger', color: '#00B2FF' },
  { type: 'comments', label: 'Comments', color: '#1877F2' },
];

const VIEW_W = 540;

export function OmnichannelAnimation() {
  const { pick, isRTL } = useLang();
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [particles, setParticles] = useState<{ id: number; channel: number; direction: 'in' | 'out'; progress: number }[]>([]);
  const idRef = useRef(0);
  const [activeChannel, setActiveChannel] = useState(0);

  // SVG does not inherit `direction`, so mirror coordinates explicitly.
  // A CSS scaleX(-1) would flip the text too.
  const px = (x: number) => (isRTL ? VIEW_W - x : x);
  const bx = (x: number, w: number) => (isRTL ? VIEW_W - x - w : x);

  useInterval(() => {
    if (!visible || reduced) return;
    const ch = Math.floor(Math.random() * 4);
    const id = idRef.current++;
    setParticles(prev => [...prev, { id, channel: ch, direction: 'in', progress: 0 }]);

    setTimeout(() => {
      const respId = idRef.current++;
      setParticles(prev => [...prev, { id: respId, channel: ch, direction: 'out', progress: 0 }]);
    }, 1200);
  }, visible && !reduced ? 1400 : null);

  useEffect(() => {
    if (reduced) return;
    let raf: number;
    const animate = () => {
      setParticles(prev => prev.map(p => ({ ...p, progress: p.progress + 0.012 })).filter(p => p.progress < 1));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    if (!visible || reduced) return;
    const interval = setInterval(() => setActiveChannel(prev => (prev + 1) % 4), 2000);
    return () => clearInterval(interval);
  }, [visible, reduced]);

  const channelY = (i: number) => 40 + i * 60;
  const wazlyX = 260;
  const wazlyY = 130;
  const startX = 20;
  const nodeW = 120;

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">
      <svg viewBox={`0 0 ${VIEW_W} 280`} className="w-full h-auto" style={{ overflow: 'visible' }}>
        {/* Channel → hub lines */}
        {channels.map((ch, i) => {
          const y = channelY(i);
          const isActive = activeChannel === i;
          return (
            <g key={ch.type}>
              <line
                x1={px(startX + 40)}
                y1={y}
                x2={px(wazlyX - 30)}
                y2={wazlyY}
                stroke="currentColor"
                strokeWidth={isActive ? 2 : 1}
                className={`transition-colors duration-500 ${isActive ? 'text-brand' : 'text-border'}`}
                opacity={isActive ? 0.6 : 0.3}
              />
              <line
                x1={px(startX + 40)}
                y1={y}
                x2={px(wazlyX - 30)}
                y2={wazlyY}
                stroke="currentColor"
                strokeWidth="2"
                className="text-brand flow-line"
                opacity={visible && !reduced ? 0.5 : 0}
                style={{ transition: `opacity 0.5s ease ${i * 200}ms` }}
              />
            </g>
          );
        })}

        {/* Hub → customer lines */}
        {channels.map((ch, i) => (
          <line
            key={`resp-${ch.type}`}
            x1={px(wazlyX + 30)}
            y1={wazlyY}
            x2={px(520)}
            y2={channelY(i)}
            stroke="currentColor"
            strokeWidth="1"
            className="text-brand"
            opacity={0.15}
            strokeDasharray="4 4"
          />
        ))}

        {/* Inbound particles */}
        {particles.filter(p => p.direction === 'in').map(p => {
          const ch = channels[p.channel];
          const x1 = px(startX + 40);
          const y1 = channelY(p.channel);
          const x2 = px(wazlyX - 30);
          const t = p.progress;
          return (
            <circle
              key={p.id}
              cx={x1 + (x2 - x1) * t}
              cy={y1 + (wazlyY - y1) * t}
              r="4"
              fill={ch.color}
              opacity={1 - t * 0.3}
            >
              <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Outbound particles */}
        {particles.filter(p => p.direction === 'out').map(p => {
          const ch = channels[p.channel];
          const x1 = px(wazlyX + 30);
          const x2 = px(520);
          const y2 = channelY(p.channel);
          const t = p.progress;
          return (
            <circle
              key={p.id}
              cx={x1 + (x2 - x1) * t}
              cy={wazlyY + (y2 - wazlyY) * t}
              r="3"
              fill={ch.color}
              opacity={0.8 - t * 0.4}
            />
          );
        })}

        {/* Channel nodes */}
        {channels.map((ch, i) => (
          <g
            key={ch.type}
            style={{
              opacity: visible ? 1 : 0,
              transform: `translate(0, ${visible ? 0 : 10}px)`,
              transition: `opacity 0.5s ease ${i * 150}ms, transform 0.5s ease ${i * 150}ms`,
            }}
          >
            <rect
              x={bx(startX, nodeW)}
              y={channelY(i) - 18}
              width={nodeW}
              height={36}
              rx={10}
              fill="var(--bg)"
              stroke={activeChannel === i ? ch.color : 'var(--border)'}
              strokeWidth={activeChannel === i ? 2 : 1}
              className="transition-all duration-500"
            />
            <circle cx={px(startX + 18)} cy={channelY(i)} r={10} fill={ch.color} />
            <foreignObject x={bx(startX + 33, 14)} y={channelY(i) - 9} width={14} height={18}>
              <ChannelIcon channel={ch.type} className="w-3.5 h-3.5 text-white" />
            </foreignObject>
            <text
              x={px(startX + 56)}
              y={channelY(i) + 4}
              textAnchor={isRTL ? 'end' : 'start'}
              className="fill-current text-main font-medium"
              style={{ fontSize: 12 }}
            >
              {ch.label}
            </text>
          </g>
        ))}

        {/* Wazly hub */}
        <g style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 600ms' }}>
          <circle cx={px(wazlyX)} cy={wazlyY} r={32} fill="var(--brand-bg)" stroke="var(--brand)" strokeWidth="2" />
          <circle cx={px(wazlyX)} cy={wazlyY} r={32} fill="none" stroke="var(--brand)" strokeWidth="2" opacity="0.3">
            {!reduced && <animate attributeName="r" values="32;42;32" dur="2.5s" repeatCount="indefinite" />}
            {!reduced && <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />}
          </circle>
          <foreignObject x={bx(wazlyX - 12, 24)} y={wazlyY - 12} width={24} height={24}>
            <Sparkles className="w-6 h-6 text-brand" />
          </foreignObject>
          <text
            x={px(wazlyX)}
            y={wazlyY + 50}
            textAnchor="middle"
            className="fill-current text-main font-semibold"
            style={{ fontSize: 13 }}
          >
            Wazly AI
          </text>
        </g>

        {/* Customer */}
        <g style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 800ms' }}>
          <rect x={bx(486, 54)} y={112} width={54} height={36} rx={10} fill="var(--bg-muted)" stroke="var(--border)" />
          <text x={px(513)} y={134} textAnchor="middle" className="fill-current text-muted" style={{ fontSize: 11 }}>
            {pick('العميل', 'Customer')}
          </text>
        </g>
      </svg>
    </div>
  );
}
