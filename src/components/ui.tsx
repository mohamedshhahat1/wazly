import type { ReactNode } from 'react';
import { MessageCircle, Instagram, Send, MessageSquare } from 'lucide-react';
import type { ChannelType } from '@/lib/mockData';

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
    <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white channel-${channel}`} style={{ minWidth: size === 'sm' ? 20 : 28 }}>
      <ChannelIcon channel={channel} className={iconSizes[size]} />
    </div>
  );
}

export function StatusDot({ status, label }: { status: 'operational' | 'connected' | 'ready' | 'warning' | 'error'; label?: string }) {
  const colors: Record<string, string> = {
    operational: 'bg-brand-500',
    connected: 'bg-green-500',
    ready: 'bg-brand-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`relative flex ${label ? 'h-2 w-2' : 'h-2 w-2'}`}>
        <span className={`absolute inline-flex h-full w-full rounded-full ${colors[status]} opacity-60 animate-ping`} style={{ animationDuration: '3s' }} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[status]}`} />
      </span>
      {label && <span className="text-xs text-muted">{label}</span>}
    </span>
  );
}

export function Badge({ children, variant = 'neutral', size = 'sm' }: { children: ReactNode; variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'ai' | 'human'; size?: 'xs' | 'sm' }) {
  const variants: Record<string, string> = {
    neutral: 'bg-muted text-muted border border-app',
    brand: 'bg-brand-bg text-brand border border-brand-200/30',
    success: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
    error: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50',
    ai: 'bg-brand-bg text-brand border border-brand-200/30',
    human: 'bg-accent-50 text-accent-600 border border-accent-200 dark:bg-accent-950/30 dark:text-accent-400 dark:border-accent-900/50',
  };
  const sizes: Record<string, string> = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2 py-0.5 rounded-md',
  };
  return <span className={`inline-flex items-center gap-1 font-medium ${variants[variant]} ${sizes[size]}`}>{children}</span>;
}

export function Card({ children, className = '', hover = false, onClick }: { children: ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-app border border-app rounded-xl shadow-soft ${hover ? 'transition-all duration-300 ease-smooth hover:shadow-medium hover:-translate-y-0.5 cursor-pointer' : ''} ${className}`}
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
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants: Record<string, string> = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md dark:bg-brand-500 dark:hover:bg-brand-400 dark:text-brand-950',
    secondary: 'bg-muted hover:bg-border text-main border border-app',
    ghost: 'hover:bg-muted text-muted hover:text-main',
    outline: 'border border-app hover:border-strong text-main hover:bg-subtle',
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
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 ease-smooth active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-ring ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs bg-ink-900 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150 z-50 shadow-large dark:bg-ink-700">
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink-900 dark:border-t-ink-700" />
      </span>
    </span>
  );
}

export function ProgressBar({ value, max = 100, className = '', color = 'brand', animated = true }: { value: number; max?: number; className?: string; color?: 'brand' | 'green' | 'amber' | 'red'; animated?: boolean }) {
  const pct = Math.min((value / max) * 100, 100);
  const colors: Record<string, string> = {
    brand: 'bg-brand-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };
  return (
    <div className={`h-2 rounded-full bg-muted overflow-hidden ${className}`}>
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

export function TypingIndicator({ label = 'AI is thinking' }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted text-sm animate-fade-in">
      <span className="flex gap-1">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </span>
      <span className="text-xs">{label}…</span>
    </div>
  );
}
