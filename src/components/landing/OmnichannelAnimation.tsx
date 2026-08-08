import { useEffect, useRef, useState } from 'react';
import { useReveal, usePrefersReducedMotion, useInterval } from '@/lib/hooks';
import { ChannelIcon } from '@/components/ui';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { ChannelType } from '@/lib/mockData';

const channels: { type: ChannelType; label: string; color: string; y: number }[] = [
  { type: 'whatsapp', label: 'WhatsApp', color: '#25D366', y: 0 },
  { type: 'instagram', label: 'Instagram', color: '#dc2743', y: 1 },
  { type: 'messenger', label: 'Messenger', color: '#00B2FF', y: 2 },
  { type: 'comments', label: 'Comments', color: '#1877F2', y: 3 },
];

export function OmnichannelAnimation() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const [particles, setParticles] = useState<{ id: number; channel: number; direction: 'in' | 'out'; progress: number }[]>([]);
  const idRef = useRef(0);
  const [activeChannel, setActiveChannel] = useState(0);

  useInterval(() => {
    if (!visible || reduced) return;
    const ch = Math.floor(Math.random() * 4);
    const id = idRef.current++;
    setParticles(prev => [...prev, { id, channel: ch, direction: 'in', progress: 0 }]);

    // Response particle after delay
    setTimeout(() => {
      const respId = idRef.current++;
      setParticles(prev => [...prev, { id: respId, channel: ch, direction: 'out', progress: 0 }]);
    }, 1200);
  }, visible && !reduced ? 1400 : null);

  // Animate particles
  useEffect(() => {
    if (reduced) return;
    let raf: number;
    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + 0.012 }))
          .filter(p => p.progress < 1)
      );
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Rotate active channel for highlight
  useEffect(() => {
    if (!visible || reduced) return;
    const interval = setInterval(() => {
      setActiveChannel(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [visible, reduced]);

  const channelY = (i: number) => 40 + i * 60;
  const wazlyX = 260;
  const wazlyY = 130;
  const startX = 20;

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 540 280" className="w-full h-auto" style={{ overflow: 'visible' }}>
        {/* Connection lines */}
        {channels.map((ch, i) => {
          const y = channelY(i);
          const isActive = activeChannel === i;
          return (
            <g key={ch.type}>
              <line
                x1={startX + 40}
                y1={y}
                x2={wazlyX - 30}
                y2={wazlyY}
                stroke="currentColor"
                strokeWidth={isActive ? 2 : 1}
                className={isActive ? 'text-brand transition-colors duration-500' : 'text-border transition-colors duration-500'}
                opacity={isActive ? 0.6 : 0.3}
              />
              <line
                x1={startX + 40}
                y1={y}
                x2={wazlyX - 30}
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

        {/* Response lines (Wazly → channels) */}
        {channels.map((ch, i) => (
          <line
            key={`resp-${ch.type}`}
            x1={wazlyX + 30}
            y1={wazlyY}
            x2={520}
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
          const x1 = startX + 40, y1 = channelY(p.channel);
          const x2 = wazlyX - 30, y2 = wazlyY;
          const t = p.progress;
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t;
          return (
            <circle key={p.id} cx={x} cy={y} r="4" fill={ch.color} opacity={1 - t * 0.3}>
              <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Outbound particles */}
        {particles.filter(p => p.direction === 'out').map(p => {
          const ch = channels[p.channel];
          const x1 = wazlyX + 30, y1 = wazlyY;
          const x2 = 520, y2 = channelY(p.channel);
          const t = p.progress;
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t;
          return (
            <circle key={p.id} cx={x} cy={y} r="3" fill={ch.color} opacity={0.8 - t * 0.4} />
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
              x={startX}
              y={channelY(i) - 18}
              width={120}
              height={36}
              rx={10}
              fill="var(--bg)"
              stroke={activeChannel === i ? ch.color : 'var(--border)'}
              strokeWidth={activeChannel === i ? 2 : 1}
              className="transition-all duration-500"
            />
            <circle cx={startX + 18} cy={channelY(i)} r={10} fill={ch.color} />
            <foreignObject x={startX + 33} y={channelY(i) - 9} width={14} height={18}>
              <ChannelIcon channel={ch.type} className="w-3.5 h-3.5 text-white" />
            </foreignObject>
            <text x={startX + 56} y={channelY(i) + 4} className="text-xs fill-current text-main font-medium" style={{ fontSize: 12 }}>
              {ch.label}
            </text>
          </g>
        ))}

        {/* Wazly AI center node */}
        <g style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 600ms' }}>
          <circle
            cx={wazlyX}
            cy={wazlyY}
            r={32}
            fill="var(--brand-bg)"
            stroke="var(--brand)"
            strokeWidth="2"
          />
          <circle
            cx={wazlyX}
            cy={wazlyY}
            r={32}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2"
            opacity="0.3"
          >
            {!reduced && (
              <animate attributeName="r" values="32;42;32" dur="2.5s" repeatCount="indefinite" />
            )}
            {!reduced && (
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
            )}
          </circle>
          <foreignObject x={wazlyX - 12} y={wazlyY - 12} width={24} height={24}>
            <Sparkles className="w-6 h-6 text-brand" />
          </foreignObject>
          <text x={wazlyX} y={wazlyY + 50} textAnchor="middle" className="fill-current text-main font-semibold" style={{ fontSize: 13 }}>
            Wazly AI
          </text>
        </g>

        {/* Customer node (right side) */}
        <g style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 800ms' }}>
          <rect x={486} y={112} width={54} height={36} rx={10} fill="var(--bg-muted)" stroke="var(--border)" />
          <text x={513} y={134} textAnchor="middle" className="fill-current text-muted" style={{ fontSize: 11 }}>
            Customer
          </text>
        </g>
      </svg>
    </div>
  );
}
