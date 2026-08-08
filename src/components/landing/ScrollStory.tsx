import { MessageSquare, Brain, BookOpen, Send, UserPlus, CheckCheck } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useScrollProgress, usePrefersReducedMotion } from '@/lib/hooks';
import { stageFrom, stageProgress, mapRange, round, clamp01 } from '@/lib/motion';
import { operators, knowledgeSources } from '@/lib/mockData';
import { Badge, TypingIndicator, ChannelBadge } from '@/components/ui';

/**
 * Scroll-driven product story.
 *
 * The whole point of this section is that the user's scroll *is* the timeline.
 * Nothing here runs on a timer, so the story can be scrubbed forwards and
 * backwards and always reads correctly.
 *
 * Beat structure is deliberately shared between two parts of the brief: the
 * seven conversation states and the six "how the AI works" steps describe the
 * same journey, so they are one section with a step rail rather than two
 * sections showing the same thing twice.
 */

type Beat =
  | { id: string; kind: 'customer'; text: string; textEn: string; time: string }
  | { id: string; kind: 'ai'; text: string; textEn: string; time: string }
  | { id: string; kind: 'operator'; text: string; textEn: string; time: string }
  | { id: string; kind: 'event'; text: string; textEn: string; tone: 'ai' | 'alert' | 'join' };

type Stage = {
  /** Step label shown in the rail. */
  label: string;
  labelEn: string;
  icon: typeof MessageSquare;
  /** Beats appended to the transcript once this stage is reached. */
  beats: Beat[];
  /** When true, a typing indicator holds the first part of the stage. */
  thinkFirst?: boolean;
  /** Label shown next to the typing dots. */
  thinkLabel?: string;
  thinkLabelEn?: string;
};

const STAGES: Stage[] = [
  {
    label: 'العميل يبعت رسالة',
    labelEn: 'A customer writes in',
    icon: MessageSquare,
    beats: [
      {
        id: 'c1',
        kind: 'customer',
        text: 'مساء الخير، ممكن أعرف تكلفة التشطيب؟',
        textEn: 'Good evening — could you tell me what finishing costs?',
        time: '8:42',
      },
    ],
  },
  {
    label: 'الـ AI يفهم السؤال',
    labelEn: 'The AI reads the question',
    icon: Brain,
    thinkFirst: true,
    thinkLabel: 'AI بيحلل الرسالة…',
    thinkLabelEn: 'AI is reading the message…',
    beats: [
      {
        id: 'a1',
        kind: 'ai',
        text: 'أهلًا بحضرتك 👋\nأكيد، ممكن أعرف مساحة الوحدة وموقعها؟',
        textEn: 'Hello 👋\nOf course — could I ask the unit size and location?',
        time: '8:42',
      },
      {
        id: 'e1',
        kind: 'event',
        text: 'AI يرد تلقائيًا',
        textEn: 'AI replied automatically',
        tone: 'ai',
      },
    ],
  },
  {
    label: 'العميل يكمل التفاصيل',
    labelEn: 'The customer adds detail',
    icon: MessageSquare,
    beats: [
      {
        id: 'c2',
        kind: 'customer',
        text: '150 متر في التجمع الخامس',
        textEn: '150 sqm in Fifth Settlement',
        time: '8:43',
      },
    ],
  },
  {
    label: 'يرجع لمعلومات شركتك',
    labelEn: 'It checks your company knowledge',
    icon: BookOpen,
    thinkFirst: true,
    thinkLabel: 'AI بيحلل الرسالة…',
    thinkLabelEn: 'AI is reading the message…',
    beats: [],
  },
  {
    label: 'يرد على العميل',
    labelEn: 'It answers the customer',
    icon: Send,
    beats: [
      {
        id: 'a2',
        kind: 'ai',
        text: 'تمام، نقدر نساعدك في تقدير مبدئي للتكلفة حسب مستوى التشطيب والخامات.',
        textEn:
          'Great — we can put together an initial estimate based on the finishing level and materials.',
        time: '8:43',
      },
    ],
  },
  {
    label: 'لو محتاج موظف…',
    labelEn: 'If a person is needed…',
    icon: UserPlus,
    beats: [
      {
        id: 'e2',
        kind: 'event',
        text: 'المحادشة تحتاج تدخل من فريق المبيعات',
        textEn: 'This conversation needs the sales team',
        tone: 'alert',
      },
    ],
  },
  {
    label: 'الموظف يكمل المحادثة',
    labelEn: 'A teammate takes over',
    icon: CheckCheck,
    beats: [
      {
        id: 'e3',
        kind: 'event',
        text: 'محمد انضم للمحادثة',
        textEn: 'Mohamed joined the conversation',
        tone: 'join',
      },
      {
        id: 'o1',
        kind: 'operator',
        text: 'أهلًا يا أستاذ أحمد، معاك محمد من فريق المبيعات. تحت أمرك.',
        textEn: "Hi Ahmed, this is Mohamed from sales. I'm happy to help.",
        time: '8:45',
      },
    ],
  },
];

const COUNT = STAGES.length;
/** Fraction of the scroll track held on the final beat so it does not flick past. */
const HOLD = 0.14;
/** Portion of each "thinking" stage spent on the typing indicator. */
const THINK = 0.45;
/** Beat index at which the conversation is reassigned to a person. */
const HANDOFF_AT = 5;

export function ScrollStory() {
  const { pick } = useLang();
  const reduced = usePrefersReducedMotion();
  const { ref, progress: rawProgress } = useScrollProgress<HTMLDivElement>({
    mode: 'sticky',
    disabled: reduced,
  });

  // Reduced motion resolves to the finished story rather than the empty start.
  const progress = reduced ? 1 : rawProgress;
  const stage = stageFrom(progress, COUNT, HOLD);
  const within = stageProgress(progress, COUNT, HOLD);

  const current = STAGES[stage];
  const thinking = !reduced && Boolean(current?.thinkFirst) && within < THINK;

  // Build the transcript up to the current beat. The active stage withholds its
  // messages while the typing indicator is showing.
  const beats: Beat[] = [];
  for (let i = 0; i <= stage; i++) {
    if (i === stage && thinking) break;
    beats.push(...STAGES[i].beats);
  }

  const handedOff = stage >= HANDOFF_AT;
  const operator = operators[0];
  const operatorName = pick(operator.name, operator.nameEn ?? operator.name);
  const operatorRole = pick(operator.role, operator.roleEn ?? operator.role);
  const shortName = operatorName.split(' ')[0];

  // Knowledge lookup surfaces on the beat that describes it and stays visible
  // afterwards, because the answer that follows depends on it.
  const showLookup = stage >= 3;
  const sources = knowledgeSources.slice(0, 3);
  const railFill = round(clamp01((stage + within) / COUNT) * 100, 1);
  const panelScale = reduced ? 1 : round(mapRange(progress, 0, 0.12, 0.985, 1), 4);

  return (
    <section
      ref={ref}
      className={reduced ? 'py-20' : 'h-[430vh] sm:h-[540vh]'}
      aria-label={pick('إزاي Wazly بيشتغل', 'How Wazly works')}
    >
      <div
        className={
          reduced
            ? ''
            : 'sticky top-0 min-h-[100svh] flex items-center overflow-hidden'
        }
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Section heading */}
          <div className="mb-8 lg:mb-10 max-w-xl">
            <div className="text-xs font-medium text-brand mb-2">
              {pick('إزاي بيشتغل', 'How it works')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-main">
              {pick('من أول رسالة لحد حل المشكلة', 'From first message to resolved')}
            </h2>
            <p className="text-sm text-muted mt-2">
              {pick(
                'انزل بالماوس وشوف محادثة حقيقية بتتم خطوة خطوة.',
                'Scroll to watch a real conversation play out, step by step.'
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
            {/* ----------------------------------------------------------- *
             * Step rail — desktop
             * ----------------------------------------------------------- */}
            <div className="hidden lg:block">
              <div className="relative ps-6">
                {/* Track */}
                <div className="absolute top-1 bottom-1 start-[7px] w-px bg-app" aria-hidden="true" />
                {/* Fill */}
                <div
                  className="absolute top-1 start-[7px] w-px bg-brand origin-top"
                  style={{ height: `${railFill}%`, transition: 'height 260ms var(--ease-state)' }}
                  aria-hidden="true"
                />

                <ol className="space-y-5">
                  {STAGES.map((s, i) => {
                    const StepIcon = s.icon;
                    const active = i === stage;
                    const done = i < stage;
                    return (
                      <li key={s.labelEn} className="relative">
                        {/* Node */}
                        <span
                          className={`absolute -start-6 top-1 w-[15px] h-[15px] rounded-full border-2 bg-app transition-colors duration-300 ${
                            active || done ? 'border-brand' : 'border-strong'
                          }`}
                          aria-hidden="true"
                        >
                          <span
                            className={`block w-full h-full rounded-full bg-brand transition-transform duration-300 ease-smooth ${
                              done || active ? 'scale-[0.45]' : 'scale-0'
                            }`}
                          />
                        </span>

                        <div
                          className="flex items-center gap-2.5 transition-opacity duration-300"
                          style={{ opacity: active ? 1 : done ? 0.62 : 0.38 }}
                        >
                          <StepIcon
                            className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
                              active ? 'text-brand' : 'text-muted'
                            }`}
                          />
                          <span
                            className={`text-sm transition-colors duration-300 ${
                              active ? 'font-semibold text-main' : 'text-muted'
                            }`}
                          >
                            {pick(s.label, s.labelEn)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* ----------------------------------------------------------- *
             * Step indicator — mobile. Deliberately a single line plus a
             * bar, not a compressed version of the desktop column.
             * ----------------------------------------------------------- */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {(() => {
                    const StepIcon = current.icon;
                    return <StepIcon className="w-4 h-4 text-brand shrink-0" />;
                  })()}
                  <span className="text-sm font-semibold text-main truncate">
                    {pick(current.label, current.labelEn)}
                  </span>
                </div>
                <span className="text-xs text-subtle shrink-0">
                  <span className="num">{stage + 1}</span>
                  {' / '}
                  <span className="num">{COUNT}</span>
                </span>
              </div>
              <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full"
                  style={{ width: `${railFill}%`, transition: 'width 260ms var(--ease-state)' }}
                />
              </div>
            </div>

            {/* ----------------------------------------------------------- *
             * Conversation panel — the thing the scroll is driving
             * ----------------------------------------------------------- */}
            <div
              className="border border-app rounded-2xl bg-app shadow-medium overflow-hidden"
              style={{
                transform: `scale(${panelScale})`,
                transition: 'transform 300ms var(--ease-state)',
              }}
            >
              {/* Panel header — carries the handoff moment */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-app bg-subtle">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                    أ
                  </div>
                  <div className="absolute -bottom-0.5 -end-0.5">
                    <ChannelBadge channel="whatsapp" size="sm" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-main truncate">
                    {pick('أحمد محمد', 'Ahmed Mohamed')}
                  </div>
                  <div className="text-xs text-muted truncate">WhatsApp</div>
                </div>

                {/* AI → person. Both chips occupy the same cell and cross-fade,
                    so the swap reads as a transition rather than a reflow. */}
                <div className="relative shrink-0 grid">
                  <div
                    className="col-start-1 row-start-1 transition-all duration-500 ease-smooth"
                    style={{
                      opacity: handedOff ? 0 : 1,
                      transform: handedOff ? 'translateY(-6px) scale(0.96)' : 'none',
                      pointerEvents: handedOff ? 'none' : undefined,
                    }}
                  >
                    <Badge variant="ai" size="sm">AI</Badge>
                  </div>
                  <div
                    className="col-start-1 row-start-1 flex justify-end transition-all duration-500 ease-smooth"
                    style={{
                      opacity: handedOff ? 1 : 0,
                      transform: handedOff ? 'none' : 'translateY(6px) scale(0.96)',
                      pointerEvents: handedOff ? undefined : 'none',
                    }}
                  >
                    <Badge variant="human" size="sm">
                      {shortName} — {operatorRole}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="px-4 py-4 space-y-2.5 min-h-[19rem] sm:min-h-[21rem]">
                {beats.map(beat => {
                  if (beat.kind === 'event') {
                    const toneCls =
                      beat.tone === 'alert'
                        ? 'text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10'
                        : beat.tone === 'join'
                          ? 'text-brand bg-brand-bg'
                          : 'text-muted bg-muted';
                    return (
                      <div key={beat.id} className="flex justify-center animate-fade-in">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full ${toneCls}`}
                          dir="auto"
                        >
                          {pick(beat.text, beat.textEn)}
                        </span>
                      </div>
                    );
                  }

                  const isCustomer = beat.kind === 'customer';
                  const isOperator = beat.kind === 'operator';

                  return (
                    <div
                      key={beat.id}
                      className={`flex animate-message-in ${isCustomer ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className="max-w-[85%] sm:max-w-[78%]">
                        {isOperator && (
                          <div className="text-[11px] text-muted mb-1 px-1">
                            {operatorName} · {operatorRole}
                          </div>
                        )}
                        <div
                          className={`px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                            isCustomer
                              ? 'bubble-in bg-muted text-main'
                              : isOperator
                                ? 'bubble-out bg-accent-600 text-white'
                                : 'bubble-out bg-brand-600 text-white'
                          }`}
                          dir="auto"
                        >
                          {pick(beat.text, beat.textEn)}
                        </div>
                        <div
                          className={`flex items-center gap-1 mt-1 px-1 ${
                            isCustomer ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <span className="text-[10px] text-subtle num">{beat.time}</span>
                          {!isCustomer && (
                            <CheckCheck className="w-3 h-3 text-brand" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator — position in the stage decides this */}
                {thinking && (
                  <div className="flex justify-end animate-fade-in">
                    <div className="bubble-out bg-muted px-3 py-2">
                      <TypingIndicator
                        label={pick(
                          current.thinkLabel ?? '',
                          current.thinkLabelEn ?? current.thinkLabel ?? ''
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Knowledge lookup — what the AI consulted before answering */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-smooth"
                  style={{
                    maxHeight: showLookup ? '9rem' : '0rem',
                    opacity: showLookup ? 1 : 0,
                  }}
                >
                  <div className="mt-1 border border-app rounded-lg bg-subtle p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-brand shrink-0" />
                      <span className="text-xs font-medium text-main">
                        {pick('راجع معرفة الشركة', 'Checked company knowledge')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sources.map((src, i) => (
                        <span
                          key={src.id}
                          className="text-[11px] px-2 py-0.5 rounded-md border border-app bg-app text-muted transition-all duration-400"
                          style={{
                            opacity: showLookup ? 1 : 0,
                            transform: showLookup ? 'none' : 'translateY(4px)',
                            transitionDelay: `${i * 90}ms`,
                          }}
                          dir="auto"
                        >
                          {pick(src.name, src.nameEn ?? src.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Composer — inert, present so the panel reads as a real product */}
              <div className="px-4 py-3 border-t border-app bg-subtle">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-8 rounded-lg border border-app bg-app flex items-center px-3">
                    <span className="text-xs text-subtle">
                      {handedOff
                        ? pick('محمد بيكتب…', 'Mohamed is typing…')
                        : pick('الـ AI متولي الرد', 'AI is handling replies')}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      handedOff ? 'bg-accent-600' : 'bg-brand-600'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-white flip-rtl" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
