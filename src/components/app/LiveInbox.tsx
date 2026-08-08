import { useEffect, useState, useRef } from 'react';
import {
  Sparkles, User, Search, MoreVertical, Send,
  CheckCircle2, Bot,
} from 'lucide-react';
import {
  inboxConversations, incomingConversations, channelMeta,
  type Conversation, type Message,
} from '@/lib/mockData';
import { ChannelBadge, Badge, TypingIndicator } from '@/components/ui';
import { usePrefersReducedMotion } from '@/lib/hooks';

type ExtendedConversation = Conversation & { justArrived?: boolean; aiTyping?: boolean };

export function LiveInbox() {
  const [conversations, setConversations] = useState<ExtendedConversation[]>(inboxConversations);
  const [selectedId, setSelectedId] = useState<string>(inboxConversations[0].id);
  const [incomingIndex, setIncomingIndex] = useState(0);
  const [showNewNotif, setShowNewNotif] = useState(false);
  const reduced = usePrefersReducedMotion();
  const threadRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find(c => c.id === selectedId);

  // Simulate new conversations arriving
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setIncomingIndex(prev => {
        const incoming = incomingConversations[prev % incomingConversations.length];
        const newConv: ExtendedConversation = {
          id: `new-${Date.now()}`,
          customerName: incoming.customerName,
          customerAvatar: incoming.customerAvatar,
          channel: incoming.channel,
          preview: incoming.message,
          previewArabic: incoming.arabic,
          time: 'now',
          unread: 1,
          status: 'pending',
          intent: incoming.intent,
          leadScore: 30,
          messages: [
            { id: `msg-${Date.now()}`, sender: 'customer', text: incoming.message, arabic: incoming.arabic, time: 'now' },
          ],
          justArrived: true,
        };

        setConversations(prev => [newConv, ...prev]);
        setShowNewNotif(true);
        setTimeout(() => setShowNewNotif(false), 2500);

        // Auto-select after a moment
        setTimeout(() => {
          setSelectedId(newConv.id);
          // AI auto-responds
          setTimeout(() => {
            setConversations(prev => prev.map(c =>
              c.id === newConv.id ? { ...c, aiTyping: true, status: 'ai' as const } : c
            ));
            setTimeout(() => {
              const aiResponse = incoming.arabic
                ? 'أهلًا 👋 شكرًا لتواصلك معنا! كيف يمكنني مساعدتك؟'
                : 'Hello! 👋 Thanks for reaching out. How can I help you today?';
              setConversations(prev => prev.map(c =>
                c.id === newConv.id ? {
                  ...c,
                  aiTyping: false,
                  status: 'ai' as const,
                  unread: 0,
                  messages: [...c.messages, {
                    id: `ai-${Date.now()}`,
                    sender: 'ai' as const,
                    text: aiResponse,
                    arabic: incoming.arabic,
                    time: 'now',
                    status: 'read' as const,
                  }],
                } : c
              ));
            }, 2500);
          }, 800);
        }, 1200);

        return prev + 1;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [reduced]);

  // Auto-scroll thread
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [selected?.messages, selected?.aiTyping]);

  return (
    <div className="flex h-full">
      {/* Column 1: Conversation list */}
      <div className="w-80 border-r border-app flex flex-col shrink-0">
        <div className="p-3 border-b border-app space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-main">Inbox</h2>
            <Badge variant="brand" size="xs">{conversations.filter(c => c.unread > 0).length} unread</Badge>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted">
            <Search className="w-3.5 h-3.5 text-subtle" />
            <input
              type="text"
              placeholder="Search conversations…"
              className="bg-transparent text-sm text-main placeholder:text-subtle outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button className="text-xs px-2 py-1 rounded-md bg-brand-bg text-brand font-medium">All</button>
            <button className="text-xs px-2 py-1 rounded-md text-muted hover:bg-muted transition-colors">AI</button>
            <button className="text-xs px-2 py-1 rounded-md text-muted hover:bg-muted transition-colors">Human</button>
            <button className="text-xs px-2 py-1 rounded-md text-muted hover:bg-muted transition-colors">Resolved</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => {
            const isSel = conv.id === selectedId;
            return (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedId(conv.id);
                  setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c));
                }}
                className={`px-3 py-3 border-b border-app cursor-pointer transition-all duration-200 relative ${
                  isSel ? 'bg-brand-bg' : 'hover:bg-muted'
                } ${conv.justArrived ? 'animate-slide-in-right' : ''}`}
              >
                {conv.justArrived && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-500" />
                )}
                <div className="flex items-start gap-2.5">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
                      {conv.customerAvatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <ChannelBadge channel={conv.channel} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-main truncate">{conv.customerName}</span>
                      <span className="text-[10px] text-subtle shrink-0 ml-1">{conv.time}</span>
                    </div>
                    <div className={`text-xs truncate mt-0.5 ${conv.previewArabic ? 'font-arabic' : ''}`} dir={conv.previewArabic ? 'rtl' : 'ltr'}>
                      <span className={conv.unread > 0 ? 'text-main font-medium' : 'text-muted'}>{conv.preview}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <StatusBadge status={conv.status} />
                      {conv.unread > 0 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950 animate-scale-in">
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

      {/* Column 2: Thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {selected && (
          <>
            <div className="h-14 border-b border-app px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
                    {selected.customerAvatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <ChannelBadge channel={selected.channel} size="sm" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-main">{selected.customerName}</div>
                  <div className="text-xs text-subtle">{channelMeta[selected.channel].label}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-muted transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-subtle">
              {selected.messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {selected.aiTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <TypingIndicator label="AI is thinking" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-app p-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  <input
                    type="text"
                    placeholder="Type a reply…"
                    className="bg-transparent text-sm text-main placeholder:text-subtle outline-none flex-1"
                  />
                </div>
                <button className="w-9 h-9 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white hover:bg-brand-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-subtle">
                <button className="flex items-center gap-1 hover:text-main transition-colors">
                  <Bot className="w-3.5 h-3.5" /> AI will auto-reply
                </button>
                <button className="flex items-center gap-1 hover:text-main transition-colors">
                  <User className="w-3.5 h-3.5" /> Take over
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Column 3: Details */}
      {selected && (
        <div className="w-72 border-l border-app p-4 space-y-4 shrink-0 overflow-y-auto hidden lg:block">
          <div>
            <div className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Customer</div>
            <div className="bg-subtle border border-app rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                  {selected.customerAvatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-main">{selected.customerName}</div>
                  <div className="text-xs text-subtle">{channelMeta[selected.channel].label}</div>
                </div>
              </div>
            </div>
          </div>

          {selected.intent && (
            <div>
              <div className="text-xs font-medium text-muted uppercase tracking-wider mb-2">AI Analysis</div>
              <div className="bg-subtle border border-app rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Intent</span>
                  <Badge variant="brand" size="xs">{selected.intent}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Lead Score</span>
                  <span className="font-semibold text-main tabular-nums">{selected.leadScore}</span>
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
            <div className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Status</div>
            <div className="bg-subtle border border-app rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Conversation</span>
                <StatusBadge status={selected.status} />
              </div>
              {selected.operator && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Operator</span>
                  <span className="text-main font-medium">{selected.operator}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Actions</div>
            <div className="space-y-1.5">
              <button className="w-full text-xs px-3 py-2 rounded-lg border border-app text-main hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Take over from AI
              </button>
              <button className="w-full text-xs px-3 py-2 rounded-lg border border-app text-main hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark as resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New conversation notification */}
      {showNewNotif && (
        <div className="absolute bottom-6 right-6 bg-app border border-app rounded-xl shadow-xl p-3 pr-5 flex items-center gap-3 animate-slide-in-right z-50">
          <div className="w-9 h-9 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-main">New conversation</div>
            <div className="text-xs text-muted">AI is responding automatically</div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Conversation['status'] }) {
  switch (status) {
    case 'ai':
      return <Badge variant="ai" size="xs"><Sparkles className="w-2.5 h-2.5" /> AI handling</Badge>;
    case 'human':
      return <Badge variant="human" size="xs"><User className="w-2.5 h-2.5" /> Human takeover</Badge>;
    case 'resolved':
      return <Badge variant="success" size="xs"><CheckCircle2 className="w-2.5 h-2.5" /> Resolved</Badge>;
    case 'pending':
      return <Badge variant="warning" size="xs">Pending</Badge>;
  }
}

function MessageBubble({ message }: { message: Message }) {
  const isCustomer = message.sender === 'customer';
  const isOperator = message.sender === 'operator';

  return (
    <div className={`flex ${isCustomer ? 'justify-end' : 'justify-start'} animate-slide-in-right`}>
      <div className={`max-w-[70%] ${isCustomer ? 'items-end' : 'items-start'}`}>
        {(message.sender === 'ai' || isOperator) && (
          <div className="flex items-center gap-1.5 mb-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              message.sender === 'ai' ? 'bg-brand-600 dark:bg-brand-500' : 'bg-accent-600'
            }`}>
              {message.sender === 'ai' ? <Sparkles className="w-3 h-3 text-white" /> : <User className="w-3 h-3 text-white" />}
            </div>
            <span className="text-[10px] font-medium text-muted">
              {message.sender === 'ai' ? 'Wazly AI' : 'Operator'}
            </span>
            {message.sender === 'ai' && (
              <Badge variant="ai" size="xs">AI handled</Badge>
            )}
          </div>
        )}
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed ${
            isCustomer
              ? 'bg-brand-600 text-white rounded-2xl rounded-tr-md'
              : isOperator
              ? 'bg-accent-600 text-white rounded-2xl rounded-tl-md'
              : 'bg-app border border-app text-main rounded-2xl rounded-tl-md'
          } ${message.arabic ? 'font-arabic' : ''}`}
          dir={message.arabic ? 'rtl' : 'ltr'}
        >
          {message.text}
        </div>
        <div className={`text-[10px] text-subtle mt-0.5 ${isCustomer ? 'text-right' : 'text-left'}`}>{message.time}</div>
      </div>
    </div>
  );
}
