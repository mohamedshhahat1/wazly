import { useEffect, useState, useRef } from 'react';
import {
  Sparkles, User, Search, MoreVertical, Send, ArrowRight,
  CheckCircle2, Bot, Check, CheckCheck, Inbox as InboxIcon,
} from 'lucide-react';
import {
  inboxConversations, incomingConversations, channelMeta, operators,
  type Conversation, type Message,
} from '@/lib/mockData';
import { ChannelBadge, Badge, TypingIndicator } from '@/components/ui';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useLang } from '@/lib/i18n';

type ExtendedConversation = Conversation & {
  justArrived?: boolean;
  aiTyping?: boolean;
  aiHandled?: boolean;
  handoffRequested?: boolean;
  operatorJoined?: boolean;
};

type Filter = 'all' | 'ai' | 'human' | 'resolved';

export function LiveInbox() {
  const { pick } = useLang();
  const [conversations, setConversations] = useState<ExtendedConversation[]>(inboxConversations);
  const [selectedId, setSelectedId] = useState<string>(inboxConversations[0].id);
  const [showNewNotif, setShowNewNotif] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [mobileThread, setMobileThread] = useState(false);
  const reduced = usePrefersReducedMotion();
  const threadRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selected = conversations.find(c => c.id === selectedId);
  const salesOperator = operators[0];

  // A conversation arrives and plays out the whole story: the AI answers, the
  // customer asks for a person, and an operator picks it up.
  useEffect(() => {
    if (reduced) return;

    let index = 0;
    const runArc = () => {
      const incoming = incomingConversations[index % incomingConversations.length];
      index += 1;

      const id = `new-${Date.now()}`;
      const conv: ExtendedConversation = {
        id,
        customerName: incoming.customerName,
        customerAvatar: incoming.customerAvatar,
        channel: incoming.channel,
        preview: incoming.message,
        previewArabic: incoming.arabic,
        time: pick('دلوقتي', 'now'),
        unread: 1,
        status: 'pending',
        intent: incoming.intent,
        leadScore: 30,
        messages: [
          { id: `m-${id}`, sender: 'customer', text: incoming.message, arabic: incoming.arabic, time: pick('دلوقتي', 'now') },
        ],
        justArrived: true,
      };

      const patch = (fn: (c: ExtendedConversation) => ExtendedConversation) =>
        setConversations(prev => prev.map(c => (c.id === id ? fn(c) : c)));

      const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

      setConversations(prev => [conv, ...prev]);
      setShowNewNotif(true);
      at(2500, () => setShowNewNotif(false));
      at(1000, () => setSelectedId(id));

      // AI picks it up
      at(1800, () => patch(c => ({ ...c, aiTyping: true, status: 'ai' })));
      at(4000, () => patch(c => ({
        ...c,
        aiTyping: false,
        unread: 0,
        aiHandled: true,
        messages: [...c.messages, {
          id: `ai-${id}`,
          sender: 'ai',
          text: 'أهلًا بحضرتك 👋 أكيد، ممكن أعرف مساحة الوحدة وموقعها عشان أقدر أديك تقدير مبدئي؟',
          arabic: true,
          time: pick('دلوقتي', 'now'),
          status: 'read',
        }],
      })));

      // The customer wants a person
      at(7000, () => patch(c => ({
        ...c,
        handoffRequested: true,
        messages: [...c.messages, {
          id: `c2-${id}`,
          sender: 'customer',
          text: 'ممكن أتكلم مع حد من فريقكم؟',
          arabic: true,
          time: pick('دلوقتي', 'now'),
        }],
      })));

      // Handed over
      at(8600, () => patch(c => ({
        ...c,
        status: 'human',
        operator: salesOperator.name,
        operatorJoined: true,
      })));
      at(10400, () => patch(c => ({
        ...c,
        messages: [...c.messages, {
          id: `op-${id}`,
          sender: 'operator',
          text: 'أهلًا بحضرتك، معاك محمد من فريق المبيعات. تحت أمرك.',
          arabic: true,
          time: pick('دلوقتي', 'now'),
          status: 'read',
        }],
      })));
    };

    const interval = setInterval(runArc, 18000);
    const kickoff = setTimeout(runArc, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(kickoff);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [reduced, pick, salesOperator.name]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [selected?.messages, selected?.aiTyping, reduced]);

  const visibleConversations = conversations.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter || (filter === 'ai' && c.status === 'pending');
    const q = query.trim();
    const matchesQuery = !q || c.customerName.includes(q) || c.preview.includes(q);
    return matchesFilter && matchesQuery;
  });

  const unreadCount = conversations.filter(c => c.unread > 0).length;

  const filters: Array<{ key: Filter; label: string }> = [
    { key: 'all', label: pick('الكل', 'All') },
    { key: 'ai', label: 'AI' },
    { key: 'human', label: pick('موظف', 'Human') },
    { key: 'resolved', label: pick('تم', 'Resolved') },
  ];

  return (
    <div className="flex h-full relative">
      {/* Column 1 — list. Full width on mobile. */}
      <div className={`w-full md:w-80 border-e border-app flex-col shrink-0 ${mobileThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3 border-b border-app space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-main">{pick('المحادثات', 'Inbox')}</h2>
            {unreadCount > 0 && (
              <Badge variant="brand" size="xs">
                <span className="num">{unreadCount}</span> {pick('مش مقروءة', 'unread')}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted">
            <Search className="w-3.5 h-3.5 text-subtle shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={pick('دوّر في المحادثات…', 'Search conversations…')}
              className="bg-transparent text-sm text-main placeholder:text-subtle outline-none flex-1 min-w-0"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                  filter === f.key ? 'bg-brand-bg text-brand' : 'text-muted hover:bg-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {visibleConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 px-6 text-center">
              <InboxIcon className="w-7 h-7 text-subtle" />
              <p className="text-sm text-muted">{pick('مفيش محادثات هنا', 'No conversations here')}</p>
              <p className="text-xs text-subtle">{pick('جرّب تغير الفلتر أو البحث', 'Try another filter or search')}</p>
            </div>
          )}
          {visibleConversations.map(conv => {
            const isSel = conv.id === selectedId;
            return (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedId(conv.id);
                  setMobileThread(true);
                  setConversations(prev => prev.map(c => (c.id === conv.id ? { ...c, unread: 0 } : c)));
                }}
                className={`px-3 py-3 border-b border-app cursor-pointer transition-colors duration-200 relative ${
                  isSel ? 'bg-brand-bg' : 'hover:bg-muted'
                } ${conv.justArrived ? 'animate-message-in' : ''}`}
              >
                {isSel && <span className="absolute start-0 top-0 bottom-0 w-0.5 bg-brand-500" />}
                <div className="flex items-start gap-2.5">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold">
                      {conv.customerAvatar}
                    </div>
                    <div className="absolute -bottom-0.5 -end-0.5">
                      <ChannelBadge channel={conv.channel} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-main truncate">{conv.customerName}</span>
                      <span className="text-[10px] text-subtle shrink-0">{conv.time}</span>
                    </div>
                    <div className="text-xs truncate mt-0.5" dir="auto">
                      {conv.aiTyping ? (
                        <span className="text-brand font-medium">{pick('الـ AI بيكتب…', 'AI is typing…')}</span>
                      ) : (
                        <span className={conv.unread > 0 ? 'text-main font-medium' : 'text-muted'}>{conv.preview}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <StatusBadge status={conv.status} />
                      {conv.unread > 0 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950 animate-scale-in num">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 2 — thread */}
      <div className={`flex-1 flex-col min-w-0 ${mobileThread ? 'flex' : 'hidden md:flex'}`}>
        {selected && (
          <>
            <div className="h-14 border-b border-app px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setMobileThread(false)}
                  className="md:hidden w-8 h-8 -ms-1 rounded-lg flex items-center justify-center text-muted hover:bg-muted shrink-0"
                  aria-label={pick('رجوع', 'Back')}
                >
                  <ArrowRight className="w-4 h-4 flip-rtl" />
                </button>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold">
                    {selected.customerAvatar}
                  </div>
                  <div className="absolute -bottom-0.5 -end-0.5">
                    <ChannelBadge channel={selected.channel} size="sm" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-main truncate">{selected.customerName}</div>
                  <div className="text-xs text-subtle truncate">{channelMeta[selected.channel].label}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:block"><StatusBadge status={selected.status} /></div>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-muted transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={threadRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-subtle">
              {selected.messages.map((msg, i) => {
                const prev = selected.messages[i - 1];
                const showHandoff = msg.sender === 'operator' && prev?.sender !== 'operator';
                return (
                  <div key={msg.id} className="space-y-3">
                    {selected.handoffRequested && showHandoff && (
                      <EventChip label={pick('طلب العميل التحدث مع موظف', 'Customer asked for a person')} />
                    )}
                    {showHandoff && selected.operator && (
                      <EventChip
                        label={pick(
                          `${selected.operator.split(' ')[0]} انضم للمحادثة`,
                          `${selected.operator.split(' ')[0]} joined the conversation`,
                        )}
                      />
                    )}
                    <MessageBubble message={msg} />
                  </div>
                );
              })}

              {selected.aiHandled && selected.status === 'ai' && (
                <EventChip label={pick('AI تعامل مع المحادثة', 'AI handled this conversation')} />
              )}

              {selected.aiTyping && (
                <div className="flex justify-end animate-fade-in">
                  <div className="flex items-center gap-2">
                    <TypingIndicator label={pick('الـ AI بيكتب', 'AI is typing')} />
                    <div className="w-6 h-6 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-app p-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  <input
                    type="text"
                    placeholder={pick('اكتب ردك…', 'Type a reply…')}
                    className="bg-transparent text-sm text-main placeholder:text-subtle outline-none flex-1 min-w-0"
                  />
                </div>
                <button
                  className="w-9 h-9 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white hover:bg-brand-700 transition-colors shrink-0"
                  aria-label={pick('إرسال', 'Send')}
                >
                  <Send className="w-4 h-4 flip-rtl" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-subtle">
                <button className="flex items-center gap-1 hover:text-main transition-colors">
                  <Bot className="w-3.5 h-3.5" /> {pick('الـ AI هيرد تلقائيًا', 'AI will auto-reply')}
                </button>
                <button className="flex items-center gap-1 hover:text-main transition-colors">
                  <User className="w-3.5 h-3.5" /> {pick('استلم المحادثة', 'Take over')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Column 3 — details */}
      {selected && (
        <div className="w-72 border-s border-app p-4 space-y-4 shrink-0 overflow-y-auto hidden xl:block">
          <div>
            <div className="text-xs font-medium text-muted mb-2">{pick('العميل', 'Customer')}</div>
            <div className="bg-subtle border border-app rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-semibold shrink-0">
                  {selected.customerAvatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-main truncate">{selected.customerName}</div>
                  <div className="text-xs text-subtle truncate">{channelMeta[selected.channel].label}</div>
                </div>
              </div>
              {selected.phone && (
                <div className="mt-3 pt-3 border-t border-app flex items-center justify-between text-xs">
                  <span className="text-muted">{pick('التليفون', 'Phone')}</span>
                  <span className="text-main font-medium force-ltr">{selected.phone}</span>
                </div>
              )}
            </div>
          </div>

          {selected.intent && (
            <div>
              <div className="text-xs font-medium text-muted mb-2">{pick('قراءة الـ AI', 'AI analysis')}</div>
              <div className="bg-subtle border border-app rounded-lg p-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-muted shrink-0">{pick('النية', 'Intent')}</span>
                  <Badge variant="brand" size="xs">{selected.intent}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">{pick('تقييم العميل', 'Lead score')}</span>
                  <span className="font-semibold text-main num">{selected.leadScore}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-700"
                    style={{ width: `${selected.leadScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-muted mb-2">{pick('الحالة', 'Status')}</div>
            <div className="bg-subtle border border-app rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="text-muted shrink-0">{pick('المحادثة', 'Conversation')}</span>
                <StatusBadge status={selected.status} />
              </div>
              {selected.operator && (
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-muted shrink-0">{pick('الموظف', 'Operator')}</span>
                  <span className="text-main font-medium truncate">{selected.operator}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted mb-2">{pick('إجراءات', 'Actions')}</div>
            <div className="space-y-1.5">
              <button className="w-full text-xs px-3 py-2 rounded-lg border border-app text-main hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {pick('استلم من الـ AI', 'Take over from AI')}
              </button>
              <button className="w-full text-xs px-3 py-2 rounded-lg border border-app text-main hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {pick('قفل المحادثة', 'Mark as resolved')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New conversation toast */}
      {showNewNotif && (
        <div className="absolute bottom-6 end-6 bg-app border border-app rounded-xl shadow-large p-3 pe-5 flex items-center gap-3 animate-fade-in-up z-50">
          <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-main">{pick('محادثة جديدة', 'New conversation')}</div>
            <div className="text-xs text-muted">{pick('AI يرد تلقائيًا', 'AI is replying automatically')}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Centred system event, the way a real inbox marks what happened. */
function EventChip({ label }: { label: string }) {
  return (
    <div className="flex justify-center animate-fade-in">
      <span className="text-[11px] text-muted bg-app border border-app rounded-full px-3 py-1">{label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Conversation['status'] }) {
  const { pick } = useLang();
  switch (status) {
    case 'ai':
      return <Badge variant="ai" size="xs"><Sparkles className="w-2.5 h-2.5" /> {pick('الـ AI بيرد', 'AI handling')}</Badge>;
    case 'human':
      return <Badge variant="human" size="xs"><User className="w-2.5 h-2.5" /> {pick('موظف', 'Human')}</Badge>;
    case 'resolved':
      return <Badge variant="success" size="xs"><CheckCircle2 className="w-2.5 h-2.5" /> {pick('اتقفلت', 'Resolved')}</Badge>;
    case 'pending':
      return <Badge variant="warning" size="xs">{pick('مستنية', 'Pending')}</Badge>;
  }
}

/**
 * The operator is the viewer here, so the customer sits on the far side and the
 * team's own messages sit on the near side — which mirrors correctly in RTL.
 */
function MessageBubble({ message }: { message: Message }) {
  const { pick } = useLang();
  const isCustomer = message.sender === 'customer';
  const isOperator = message.sender === 'operator';
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} animate-message-in`}>
      <div className="max-w-[78%] sm:max-w-[70%]">
        {(isAi || isOperator) && (
          <div className="flex items-center gap-1.5 mb-1 justify-end">
            <span className="text-[10px] font-medium text-muted">
              {isAi ? 'Wazly AI' : pick('محمد · المبيعات', 'Mohamed · Sales')}
            </span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              isAi ? 'bg-brand-600 dark:bg-brand-500' : 'bg-accent-600'
            }`}>
              {isAi ? <Sparkles className="w-3 h-3 text-white" /> : <User className="w-3 h-3 text-white" />}
            </div>
          </div>
        )}

        <div
          dir="auto"
          className={`px-3.5 py-2.5 text-sm leading-[1.75] ${
            isCustomer
              ? 'bg-app border border-app text-main rounded-2xl rounded-ss-md'
              : isOperator
                ? 'bg-accent-600 text-white rounded-2xl rounded-se-md'
                : 'bg-brand-600 text-white rounded-2xl rounded-se-md'
          }`}
        >
          {message.text}
        </div>

        <div className={`flex items-center gap-1 mt-1 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
          <span className="text-[10px] text-subtle num">{message.time}</span>
          {!isCustomer && (
            message.status === 'read'
              ? <CheckCheck className="w-3 h-3 text-brand" />
              : <Check className="w-3 h-3 text-subtle" />
          )}
        </div>
      </div>
    </div>
  );
}
