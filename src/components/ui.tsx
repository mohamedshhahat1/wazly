import type { ReactNode } from 'react';
import { MessageCircle, Instagram, Send, MessageSquare } from 'lucide-react';
import type { ChannelType } from '@/lib/mockData';
import { useLang } from '@/lib/i18n';

export function ChannelIcon({ channel, className = '' }: { channel: ChannelType; className?: string }) {
  switch (channel) {
    case 'whatsapp':
      return <MessageCircle className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'messenger':
      return <Send className={className} />;
    case 'comments':
      return <MessageSquare className={className} />;
    default:
      return <MessageCircle className={className} />;
  }
}

export function ChannelBadge({ channel, size = 'sm' }: { channel: ChannelType; size?: 'sm' | 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-7 h-7' };
  const iconSizes = { sm: 'w-3 h-3', md: 'w-4 h-4' };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white channel-${channel}`}
      style={{ minWidth: size === 'sm' ? 20 : 28 }}
    >
      <ChannelIcon channel={channel} className={iconSizes[size]} />
    </div>
  );
}

/**
 * Editorial section marker. Replaces the icon-in-a-tinted-pill label that
 * made every band on the page open the same way. A number, a rule and a
 * word: it sits quietly at the top of a composition instead of announcing
 * itself.
 *
 * The tracking on `text-eyebrow` is neutralised for Arabic by the RTL rule
 * in index.css, since tracking breaks Arabic letter joining.
 */
export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-eyebrow font-medium uppercase text-muted">
      {index && <span className="num text-brand">{index}</span>}
      <span className="h-px w-7 bg-ink-300 dark:bg-ink-700" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

/**
 * Initial-letter avatar. `tone` carries meaning: brand for the assistant,
 * ink for a human teammate, muted for a customer.
 */
export function Avatar({
  initial,
  tone = 'muted',
  size = 'md',
}: {
  initial: string;
  tone?: 'brand' | 'ink' | 'muted';
  size?: 'sm' | 'md' | 'lg';
}) {
  const tones: Record<string, string> = {
    brand: 'bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950',
    ink: 'bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900',
    muted: 'bg-muted text-muted border border-app',
  };
  const sizes: Record<string, string> = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-11 h-11 text-sm',
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${tones[tone]} ${sizes[size]}`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export function StatusDot({
  status,
  label,
}: {
  status: 'operational' | 'connected' | 'ready' | 'warning' | 'error';
  label?: string;
}) {
  // Teal is the product's status colour. `connected` used to be green, which
  // was the only green in the product and read as an oversight.
  const colors: Record<string, string> = {
    operational: 'bg-brand-600 dark:bg-brand-400',
    connected: 'bg-brand-600 dark:bg-brand-400',
    ready: 'bg-brand-600 dark:bg-brand-400',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  // Only live states pulse. A pulsing error dot is decoration, not signal.
  const isLive = status === 'operational' || status === 'connected' || status === 'ready';

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-50 animate-ping`}
            style={{ animationDuration: '3s' }}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[status]}`} />
      </span>
      {label && <span className="text-xs text-muted">{label}</span>}
    </span>
  );
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
}: {
  children: ReactNode;
  variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'ai' | 'human';
  size?: 'xs' | 'sm';
}) {
  const variants: Record<string, string> = {
    neutral: 'bg-muted text-muted border border-app',
    brand: 'bg-brand-bg text-brand border border-brand-600/15',
    // Success is teal, not green: the product has one positive colour.
    success: 'bg-brand-bg text-brand border border-brand-600/15',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
    error: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50',
    ai: 'bg-brand-bg text-brand border border-brand-600/15',
    // Deliberately the strongest chip in the system. When a conversation moves
    // from the assistant to a person, that transition should be the most
    // legible state change on the page — teal to ink does that without copy.
    human: 'bg-ink-900 text-white border border-ink-900 dark:bg-ink-100 dark:text-ink-900 dark:border-ink-100',
  };
  const sizes: Record<string, string> = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2 py-0.5 rounded-md',
  };
  return (
    <span className={`inline-flex items-center gap-1 font-medium whitespace-nowrap ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-elevated border border-app rounded-xl ${
        hover
          ? 'transition-all duration-200 ease-smooth hover:border-strong hover:shadow-soft hover:-translate-y-px cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled,
  loading,
  type = 'button',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants: Record<string, string> = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-soft dark:bg-brand-500 dark:hover:bg-brand-400 dark:text-brand-950',
    secondary: 'bg-elevated hover:bg-subtle text-main border border-app hover:border-strong',
    ghost: 'hover:bg-muted text-muted hover:text-main',
    outline: 'border border-app hover:border-strong text-main hover:bg-elevated',
    // For the dark closing band, where a teal fill would fight the surface.
    inverted: 'bg-white text-deep-700 hover:bg-ink-100',
  };
  const sizes: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-sm px-6 py-3 rounded-xl gap-2',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-200 ease-smooth hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-ring ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <span className="relative group inline-flex">
      {children}
      {/* Centred with a transform, so it stays correct in both directions */}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs bg-ink-900 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150 z-50 shadow-large dark:bg-ink-800">
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-900 dark:border-t-ink-800" />
      </span>
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'brand',
  animated = true,
}: {
  value: number;
  max?: number;
  className?: string;
  color?: 'brand' | 'green' | 'amber' | 'red';
  animated?: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const colors: Record<string, string> = {
    brand: 'bg-brand-600 dark:bg-brand-500',
    // Kept in the union for existing callers; resolves to the same teal.
    green: 'bg-brand-600 dark:bg-brand-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };
  // The inner block starts from the inline start, so this fills right-to-left
  // in Arabic without any extra handling.
  return (
    <div className={`h-1.5 rounded-full bg-muted overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full ${colors[color]} ${animated ? 'transition-all duration-700 ease-smooth' : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}

export function TypingIndicator({ label }: { label?: string }) {
  const { pick } = useLang();
  const text = label ?? pick('الـ AI بيكتب', 'AI is typing');

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted animate-fade-in">
      <span className="flex gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </span>
      <span className="text-xs">{text}…</span>
    </div>
  );
}
