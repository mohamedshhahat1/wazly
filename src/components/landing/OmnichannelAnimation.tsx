import { Inbox, Bot, UserRound, Check } from 'lucide-react';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { mapRange } from '@/lib/motion';
import { ChannelIcon } from '@/components/ui';
import { useLang } from '@/lib/i18n';
import { operators, type ChannelType } from '@/lib/mockData';

/**
 * The omnichannel flow: Customer → Channels → Wazly Inbox → AI → Human.
 *
 * Deliberately HTML rather than SVG. SVG does not inherit `direction`, so the
 * previous version mirrored every x coordinate by hand and wrapped each icon in
 * a `foreignObject`. A vertical pipeline needs none of that: flex order and
 * logical properties flip themselves, and the layout reflows on small screens
 * instead of shrinking a fixed viewBox.
 *
 * Scroll position drives every stage, so nothing animates off screen.
 */

type Channel = {
  id: string;
  type: ChannelType;
  label: string;
  color: string;
  /** Entry offset, so cards do not all slide in from the same place. */
  dx: number;
  dy: number;
};

function Connector({ on }: { on: boolean }) {
  return (
    <div className="flex justify-center py-1.5" aria-hidden="true">
      <div className="relative w-px h-7 bg-app overflow-hidden rounded-full">
        <div
          className="absolute inset-x-0 top-0 bg-brand-500 transition-all duration-500 ease-smooth"
          style={{ height: on ? '100%' : '0%', opacity: on ? 0.7 : 0 }}
        />
      </div>
    </div>
  );
}

function Stage({
  icon: Icon,
  title,
  subtitle,
  on,
  accent = 'brand',
}: {
  icon: typeof Inbox;
  title: string;
  subtitle: string;
  on: boolean;
  accent?: 'brand' | 'accent' | 'neutral';
}) {
  const tone =
    accent === 'brand'
      ? 'bg-brand-bg text-brand'
      : accent === 'accent'
        ? 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400'
        : 'bg-muted text-muted';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-app transition-all duration-500 ease-smooth ${
        on ? 'border-app shadow-soft' : 'border-transparent'
      }`}
      style={{
        opacity: on ? 1 : 0.28,
        transform: on ? 'none' : 'translate3d(0, 8px, 0) scale(0.98)',
      }}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-main truncate">{title}</div>
        <div className="text-xs text-muted truncate">{subtitle}</div>
      </div>
    </div>
  );
}

export function OmnichannelAnimation() {
  const { pick, isRTL } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress: raw } = useScrollProgress<HTMLDivElement>({ disabled: reduced });

  // Reduced motion shows the assembled flow; otherwise scrub the middle of the
  // element's traversal, while it is actually on screen.
  const p = reduced ? 1 : mapRange(raw, 0.18, 0.72, 0, 1);

  const operator = operators[0];
  const operatorName = pick(operator.name, operator.nameEn ?? operator.name);
  const operatorRole = pick(operator.role, operator.roleEn ?? operator.role);

  const channels: Channel[] = [
    { id: 'whatsapp', type: 'whatsapp', label: 'WhatsApp', color: '#25D366', dx: -20, dy: 8 },
    { id: 'messenger', type: 'messenger', label: 'Messenger', color: '#00B2FF', dx: 18, dy: -6 },
    { id: 'instagram', type: 'instagram', label: 'Instagram', color: '#dc2743', dx: -14, dy: -10 },
    {
      id: 'fb-comments',
      type: 'comments',
      label: pick('تعليقات فيسبوك', 'Facebook comments'),
      color: '#1877F2',
      dx: 16,
      dy: 10,
    },
    {
      id: 'ig-comments',
      type: 'comments',
      label: pick('تعليقات إنستجرام', 'Instagram comments'),
      color: '#c1358a',
      dx: -18,
      dy: -4,
    },
  ];

  // Channels land across the first half; the pipeline stages follow.
  const channelP = mapRange(p, 0.04, 0.5, 0, 1);
  const revealed = Math.min(channels.length, Math.floor(channelP * (channels.length + 0.5)));
  const allConnected = channelP >= 1;

  const customerOn = p > 0.01;
  const inboxOn = p > 0.54;
  const aiOn = p > 0.68;
  const humanOn = p > 0.82;

  // translateX travels the wrong way under RTL.
  const sign = isRTL ? -1 : 1;

  return (
    <div ref={ref} className="w-full max-w-md mx-auto">
      {/* Customer */}
      <Stage
        icon={UserRound}
        title={pick('العميل', 'Customer')}
        subtitle={pick('بيبعت رسالة من أي قناة', 'Writes in from any channel')}
        on={customerOn}
        accent="neutral"
      />

      <Connector on={revealed > 0} />

      {/* Channels — each enters from its own direction */}
      <div className="flex flex-wrap justify-center gap-2">
        {channels.map((ch, i) => {
          const shown = revealed > i;
          const connected = allConnected || revealed > i + 1;
          return (
            <div
              key={ch.id}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border bg-app transition-all duration-500 ease-smooth"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown
                  ? 'none'
                  : `translate3d(${ch.dx * sign}px, ${ch.dy}px, 0) scale(0.97)`,
                borderColor: shown && !connected ? ch.color : 'var(--border)',
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: ch.color }}
              >
                <ChannelIcon channel={ch.type} className="w-3 h-3" />
              </span>
              <span className="text-xs font-medium text-main whitespace-nowrap">{ch.label}</span>
              <span className="text-[10px] shrink-0 min-w-max">
                {connected ? (
                  <span className="inline-flex items-center gap-0.5 text-brand">
                    <Check className="w-3 h-3" />
                    {pick('متصل', 'Connected')}
                  </span>
                ) : (
                  <span className="text-subtle">{pick('جاري الربط…', 'Connecting…')}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <Connector on={inboxOn} />

      <Stage
        icon={Inbox}
        title={pick('صندوق Wazly', 'Wazly inbox')}
        subtitle={pick('كل القنوات في مكان واحد', 'Every channel in one place')}
        on={inboxOn}
      />

      <Connector on={aiOn} />

      <Stage
        icon={Bot}
        title={pick('الـ AI', 'AI agent')}
        subtitle={pick('بيرد على الأسئلة المتكررة', 'Answers the repetitive questions')}
        on={aiOn}
      />

      <Connector on={humanOn} />

      <Stage
        icon={UserRound}
        title={`${operatorName} — ${operatorRole}`}
        subtitle={pick('بيتدخل وقت ما يلزم', 'Steps in when needed')}
        on={humanOn}
        accent="accent"
      />
    </div>
  );
}
