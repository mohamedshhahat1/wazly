import { useState } from 'react';
import {
  Building2, MessageCircle, BookOpen, Sparkles, Users, Check,
  ArrowRight, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { Card, Button, Badge, ChannelBadge } from '@/components/ui';
import { useLang, LanguageSwitcher } from '@/lib/i18n';
import {
  onboardingSteps, onboardingStepsEn, readinessItems, operators, company,
  type ChannelType,
} from '@/lib/mockData';

const stepIcons = [Building2, MessageCircle, BookOpen, Sparkles, Users, CheckCircle2];

const channelOptions: { id: ChannelType; label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp Business' },
  { id: 'instagram', label: 'Instagram Direct' },
  { id: 'messenger', label: 'Facebook Messenger' },
  { id: 'comments', label: pickStaticCommentsLabel() },
];

// Channel names are brand terms and stay Latin; only the generic one is copy.
function pickStaticCommentsLabel() {
  return 'Facebook Comments';
}

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { pick } = useLang();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [businessName, setBusinessName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(['whatsapp']));

  const steps = pick(onboardingSteps, onboardingStepsEn);
  const isComplete = (i: number) => completed.has(i);
  const markComplete = (i: number) => {
    setCompleted(prev => new Set(prev).add(i));
    if (i < steps.length - 1) setStep(i + 1);
  };

  const back = (
    <ArrowLeft className="w-3.5 h-3.5 flip-rtl" />
  );
  const forward = (
    <ArrowRight className="w-3.5 h-3.5 flip-rtl" />
  );

  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo + switcher — first screen a new account sees */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-24" />
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-main font-latin">Wazly</span>
          </div>
          <div className="w-24 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Progress — labels collapse to the active step on mobile */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((label, i) => {
              const Icon = stepIcons[i];
              const active = i === step;
              const done = isComplete(i);
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        done
                          ? 'bg-brand-600 dark:bg-brand-500'
                          : active
                            ? 'bg-brand-600 dark:bg-brand-500 ring-4 ring-brand-200/40 dark:ring-brand-900/30'
                            : 'bg-muted border border-app'
                      }`}
                    >
                      {done
                        ? <Check className="w-4 h-4 text-white" />
                        : <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-subtle'}`} />}
                    </div>
                    <span
                      className={`text-[10px] text-center leading-tight ${
                        active ? 'text-main font-medium' : 'text-subtle hidden sm:block'
                      } ${done ? 'sm:text-main' : ''}`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full bg-brand-500 transition-all duration-500 ${done ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="p-5 sm:p-6">
          {step === 0 && (
            <StepContainer
              title={pick('حدثنا عن شغلك', 'Tell us about your business')}
              desc={pick('المعلومات دي بتساعد الـ AI يرد على عملائك صح.', 'This helps the AI answer your customers accurately.')}
            >
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">{pick('اسم الشركة', 'Business name')}</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder={pick(`مثال: ${company.shortName} للتشطيبات`, `e.g. ${company.shortNameEn}`)}
                    className="w-full px-3 py-2.5 rounded-lg bg-muted text-sm text-main placeholder:text-subtle outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">{pick('المجال', 'Industry')}</label>
                  <select className="w-full px-3 py-2.5 rounded-lg bg-muted text-sm text-main outline-none focus:ring-2 focus:ring-brand-500/30 transition-all">
                    {pick(
                      ['مقاولات وتشطيبات', 'عقارات', 'تجارة وتجزئة', 'خدمات', 'مطاعم وكافيهات', 'حاجة تانية'],
                      ['Contracting & finishing', 'Real estate', 'Retail', 'Services', 'Food & beverage', 'Other'],
                    ).map(opt => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">{pick('مواعيد الشغل', 'Working hours')}</label>
                  <div className="flex items-center gap-2">
                    <input type="time" defaultValue="09:00" className="flex-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-main outline-none force-ltr" />
                    <span className="text-muted text-sm shrink-0">{pick('إلى', 'to')}</span>
                    <input type="time" defaultValue="22:00" className="flex-1 px-3 py-2.5 rounded-lg bg-muted text-sm text-main outline-none force-ltr" />
                  </div>
                </div>
              </div>
              <StepFooter>
                <span />
                <Button onClick={() => markComplete(0)} disabled={!businessName.trim()}>
                  {pick('يلا نكمل', 'Continue')} {forward}
                </Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 1 && (
            <StepContainer
              title={pick('اربط قنواتك', 'Connect your channels')}
              desc={pick('اختار القنوات اللي عايز Wazly يتولاها.', 'Choose the channels you want Wazly to handle.')}
            >
              <div className="space-y-2">
                {channelOptions.map(ch => {
                  const sel = selectedChannels.has(ch.id);
                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannels(prev => {
                          const next = new Set(prev);
                          if (next.has(ch.id)) next.delete(ch.id);
                          else next.add(ch.id);
                          return next;
                        });
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        sel ? 'border-brand-500 bg-brand-bg' : 'border-app hover:border-strong'
                      }`}
                    >
                      <ChannelBadge channel={ch.id} size="md" />
                      <span className="flex-1 text-sm font-medium text-main font-latin">{ch.label}</span>
                      {sel && <Check className="w-4 h-4 text-brand animate-scale-in shrink-0" />}
                    </div>
                  );
                })}
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(0)}>{back} {pick('رجوع', 'Back')}</Button>
                <Button onClick={() => markComplete(1)}>{pick('يلا نكمل', 'Continue')} {forward}</Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 2 && (
            <StepContainer
              title={pick('ضيف معرفة الشركة', 'Add your knowledge')}
              desc={pick('ارفع ملفاتك عشان الـ AI يتعلم عن شغلك.', 'Upload documents so the AI can learn your business.')}
            >
              <div className="space-y-2">
                {readinessItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-app"
                    style={{ animation: `fadeInUp 0.4s ease ${i * 100}ms both` }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.done ? 'bg-brand-600 dark:bg-brand-500' : 'bg-muted'}`}>
                      {item.done ? <Check className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4 text-subtle" />}
                    </div>
                    <span className="flex-1 text-sm text-main">{pick(item.label, item.labelEn ?? item.label)}</span>
                    {item.done
                      ? <Badge variant="success" size="xs">{pick('جاهز', 'Ready')}</Badge>
                      : <Button size="sm" variant="outline">{pick('ارفع', 'Upload')}</Button>}
                  </div>
                ))}
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(1)}>{back} {pick('رجوع', 'Back')}</Button>
                <Button onClick={() => markComplete(2)}>{pick('يلا نكمل', 'Continue')} {forward}</Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 3 && (
            <StepContainer
              title={pick('ظبّط الـ AI', 'Configure your AI')}
              desc={pick('حدد الـ AI يتعامل مع عملائك إزاي.', 'Set how the AI should talk to your customers.')}
            >
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">{pick('أسلوب الرد', 'Tone')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {pick(['ودود', 'رسمي', 'بسيط'], ['Friendly', 'Professional', 'Casual']).map((tone, i) => (
                      <div
                        key={tone}
                        className={`p-2.5 rounded-lg border text-center text-sm cursor-pointer transition-all ${
                          i === 0 ? 'border-brand-500 bg-brand-bg text-brand' : 'border-app text-muted hover:border-strong'
                        }`}
                      >
                        {tone}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">{pick('لغة الرد', 'Reply language')}</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2.5 rounded-lg border border-brand-500 bg-brand-bg text-brand text-sm text-center cursor-pointer">
                      {pick('عربي', 'Arabic')}
                    </div>
                    <div className="flex-1 p-2.5 rounded-lg border border-app text-muted text-sm text-center cursor-pointer hover:border-strong">
                      {pick('إنجليزي', 'English')}
                    </div>
                    <div className="flex-1 p-2.5 rounded-lg border border-app text-muted text-sm text-center cursor-pointer hover:border-strong">
                      {pick('الاتنين', 'Both')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-subtle">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-main">{pick('تحويل تلقائي لموظف', 'Auto-handoff to a person')}</div>
                    <div className="text-xs text-muted">{pick('لما الـ AI ميعرفش يرد، يحوّل للفريق', "When the AI can't answer, it hands over")}</div>
                  </div>
                  <div className="w-10 h-5 rounded-full bg-brand-500 relative cursor-pointer shrink-0">
                    <div className="absolute end-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(2)}>{back} {pick('رجوع', 'Back')}</Button>
                <Button onClick={() => markComplete(3)}>{pick('يلا نكمل', 'Continue')} {forward}</Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 4 && (
            <StepContainer
              title={pick('ادعي فريقك', 'Invite your team')}
              desc={pick('اللي هيستلموا المحادثات لما الـ AI يحوّل.', 'The people who take over when the AI hands off.')}
            >
              <div className="space-y-2">
                {operators.slice(0, 2).map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl border border-app">
                    <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-main truncate">{pick(member.name, member.nameEn ?? member.name)}</div>
                      <div className="text-xs text-muted truncate">{pick(member.role, member.roleEn ?? member.role)}</div>
                    </div>
                    <Badge variant="success" size="xs">{pick('اتبعتله دعوة', 'Invited')}</Badge>
                  </div>
                ))}
                <button className="w-full p-3 rounded-xl border border-dashed border-app text-muted hover:text-main hover:border-strong transition-all text-sm">
                  {pick('+ ضيف عضو جديد', '+ Invite a team member')}
                </button>
              </div>
              <StepFooter>
                <Button variant="outline" onClick={() => setStep(3)}>{back} {pick('رجوع', 'Back')}</Button>
                <Button onClick={() => markComplete(4)}>{pick('يلا نكمل', 'Continue')} {forward}</Button>
              </StepFooter>
            </StepContainer>
          )}

          {step === 5 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center mx-auto mb-4" style={{ animation: 'scaleIn 0.5s ease-out' }}>
                <CheckCircle2 className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-lg font-bold text-main mb-2">{pick('خلاص، كل حاجة جاهزة', "You're all set")}</h3>
              <p className="text-sm text-muted mb-6">
                {pick('الـ AI بقى جاهز يستقبل محادثات عملائك.', 'Your AI is ready to start handling conversations.')}
              </p>
              <div className="space-y-2 mb-6 text-start">
                {pick(
                  ['بيانات الشركة اتسجلت', 'القنوات اتربطت', 'المعرفة اترفعت', 'الـ AI اتظبط', 'الفريق اتدعى'],
                  ['Business profile created', 'Channels connected', 'Knowledge uploaded', 'AI configured', 'Team invited'],
                ).map((item, i) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-main" style={{ animation: `fadeInUp 0.4s ease ${i * 100}ms both` }}>
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0" /> {item}
                  </div>
                ))}
              </div>
              <Button size="lg" className="w-full" onClick={onComplete}>
                {pick('ادخل على Wazly', 'Launch Wazly')}
                <ArrowRight className="w-4 h-4 flip-rtl" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StepContainer({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      <h3 className="text-lg font-semibold text-main mb-1">{title}</h3>
      <p className="text-sm text-muted mb-5 leading-[1.8]">{desc}</p>
      {children}
    </div>
  );
}

function StepFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-app">
      {children}
    </div>
  );
}
