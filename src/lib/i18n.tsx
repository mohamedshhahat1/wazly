import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/lib/hooks';

export type Lang = 'ar' | 'en';
export type Dir = 'rtl' | 'ltr';

/**
 * Wazly is an Arabic-first product.
 *
 * Every string is authored in Egyptian business Arabic first, then mirrored in
 * English. Copy rules:
 *   - Short, concrete UI labels. "حلها الـ AI", not "المحادثات التي تم حلها
 *     بواسطة الذكاء الاصطناعي".
 *   - Professional but not stiff. It should read like a modern Egyptian SaaS.
 *   - Brand and channel names (Wazly, AI, WhatsApp, Messenger, Instagram) are
 *     left as-is on purpose.
 */
const ar = {
  // ── Language switcher ───────────────────────────────────────────
  'lang.ar': 'العربية',
  'lang.en': 'English',
  'lang.aria': 'تغيير اللغة',

  // ── Shared ──────────────────────────────────────────────────────
  'common.back': 'رجوع',
  'common.next': 'التالي',
  'common.skip': 'تخطي',
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.search': 'ابحث…',
  'common.viewAll': 'عرض الكل',
  'common.openFull': 'افتح الصفحة',
  'common.live': 'مباشر الآن',
  'common.ai': 'AI',
  'common.human': 'موظف',
  'common.all': 'الكل',
  'common.currency': 'ج.م',
  'common.perMonth': 'ج.م/شهر',
  'common.empty': 'مفيش حاجة هنا لسه',

  // ── Landing · nav ───────────────────────────────────────────────
  'nav.features': 'المميزات',
  'nav.how': 'إزاي بيشتغل',
  'nav.analytics': 'التحليلات',
  'nav.pricing': 'الأسعار',
  'nav.launch': 'ابدأ مجانًا',

  // ── Landing · hero ──────────────────────────────────────────────
  'hero.badge': 'رد على عملائك أسرع، على كل القنوات',
  'hero.title': 'خلي الـ AI يتولى خدمة عملائك',
  'hero.subtitle':
    'اربط واتساب، ماسنجر وإنستجرام، وخلي Wazly يرد على عملائك تلقائيًا، يحوّل المحادثات للموظفين عند الحاجة، ويتابع كل حاجة من مكان واحد.',
  'hero.cta': 'ابدأ مجانًا',
  'hero.ctaSecondary': 'شوف Wazly بيشتغل إزاي',
  'hero.trust1': 'من غير كارت ائتمان',
  'hero.trust2': 'التفعيل في 5 دقايق',
  'hero.demoTitle': 'شركة الكيان للتشطيبات',
  'hero.demoOnline': 'متصل',
  'hero.demoAiActive': 'AI شغال',
  'hero.composer': 'اكتب رسالة…',

  // ── Landing · stats strip ───────────────────────────────────────
  'stats.conversations': 'محادثة اتعاملنا معاها',
  'stats.aiRate': 'حلها الـ AI',
  'stats.responseTime': 'متوسط وقت الرد',
  'stats.channels': 'قنوات متصلة',

  // ── Landing · omnichannel ───────────────────────────────────────
  'omni.label': 'كل القنوات',
  'omni.title': 'كل محادثات عملائك في مكان واحد',
  'omni.body':
    'واتساب، إنستجرام، ماسنجر وتعليقات فيسبوك — كلها متوصلة بـ Wazly. الرسايل بتوصل من أي قناة، الـ AI بيرد فورًا، وانت شايف كل حاجة قدامك.',
  'omni.item1.title': 'صندوق واحد',
  'omni.item1.desc': 'كل القنوات في شاشة واحدة',
  'omni.item2.title': 'رد فوري',
  'omni.item2.desc': 'الـ AI بيرد في ثواني، مش ساعات',
  'omni.item3.title': 'تحليلات لكل قناة',
  'omni.item3.desc': 'اعرف أي قناة بتجيبلك عملاء أكتر',

  // ── Landing · how it works ──────────────────────────────────────
  'how.label': 'إزاي بيشتغل',
  'how.title': 'من رسالة العميل لحد ما تتقفل — أوتوماتيك',
  'how.step': 'خطوة {n}',
  'how.s1.title': 'العميل يبعت رسالة',
  'how.s1.desc': 'من أي قناة — واتساب، إنستجرام، ماسنجر أو تعليقات فيسبوك.',
  'how.s2.title': 'الـ AI يفهم ويدوّر',
  'how.s2.desc': 'Wazly بيقرا الرسالة ويلاقي المعلومة المظبوطة من معرفة شركتك.',
  'how.s3.title': 'الـ AI يرد فورًا',
  'how.s3.desc': 'عميلك بياخد رد دقيق في ثواني، طول اليوم.',
  'how.s4.title': 'الموظف يتدخل وقت الحاجة',
  'how.s4.desc': 'الحالات المعقدة بتتحوّل لفريقك بكل تفاصيل المحادثة.',
  'how.s5.title': 'العملاء والتحليلات بتتحدث',
  'how.s5.desc': 'كل محادثة بتتسجل وبتتقيّم وبتتحول لمعلومة تفيدك.',

  // ── Landing · handoff ───────────────────────────────────────────
  'handoff.label': 'التحويل لموظف',
  'handoff.title': 'اتدخل في المحادثة وقت ما تحتاج',
  'handoff.body':
    'الـ AI بيتولى الأسئلة المتكررة. ولما العميل يحتاج حد من فريقك، Wazly بيحوّل المحادثة للموظف المناسب بكل السياق — من غير ما العميل يعيد كلامه تاني.',
  'handoff.item1.title': 'اكتشاف ذكي',
  'handoff.item1.desc': 'الـ AI بيعرف امتى المحادثة محتاجة موظف',
  'handoff.item2.title': 'السياق كامل',
  'handoff.item2.desc': 'الموظف بيشوف المحادثة من أولها',
  'handoff.item3.title': 'توزيع تلقائي',
  'handoff.item3.desc': 'المحادثة بتروح للموظف المناسب على طول',

  // ── Landing · knowledge ─────────────────────────────────────────
  'knowledge.label': 'معرفة الـ AI',
  'knowledge.title': 'علّم Wazly كل حاجة عن شغلك',
  'knowledge.body':
    'ارفع بيانات شركتك، خدماتك، الأسئلة المتكررة والسياسات. Wazly بيتعلم منها ويرد على عملائك بدقة — وبنفس أسلوب شركتك.',
  'knowledge.item1.title': 'أي نوع مستندات',
  'knowledge.item1.desc': 'PDF، نصوص، أسئلة متكررة، قوائم أسعار',
  'knowledge.item2.title': 'بيتعلم باستمرار',
  'knowledge.item2.desc': 'ضيف معلومة جديدة في أي وقت والـ AI بيحدّث نفسه',
  'knowledge.item3.title': 'المصدر واضح',
  'knowledge.item3.desc': 'كل رد بيوريك جه منين',

  // ── Landing · analytics ─────────────────────────────────────────
  'analytics.label': 'التحليلات',
  'analytics.title': 'اعرف شغلك ماشي إزاي بالظبط',
  'analytics.body': 'متابعة مباشرة للمحادثات، أداء الـ AI، العملاء المحتملين وأوقات الرد.',

  // ── Landing · pricing ───────────────────────────────────────────
  'pricing.label': 'الأسعار',
  'pricing.title': 'باقات بتكبر مع شغلك',
  'pricing.subtitle': 'ابدأ مجانًا. اترقّى لما تحتاج.',
  'pricing.popular': 'الأكتر اختيارًا',
  'pricing.custom': 'حسب الطلب',
  'pricing.getStarted': 'ابدأ دلوقتي',
  'pricing.contactSales': 'كلّم المبيعات',

  // ── Landing · CTA + footer ──────────────────────────────────────
  'cta.badge': 'التفعيل في 5 دقايق',
  'cta.title': 'خلي عملاءك يلاقوا رد دلوقتي',
  'cta.body': 'اربط قنواتك، علّم Wazly عن شغلك، وشوفه بيتعامل مع عملائك فورًا.',
  'cta.button': 'ابدأ مجانًا',
  'footer.tagline': 'خدمة عملاء بالـ AI على كل القنوات.',
  'footer.product': 'المنتج',
  'footer.company': 'الشركة',
  'footer.legal': 'قانوني',
  'footer.rights': '© 2026 Wazly. كل الحقوق محفوظة.',
  'footer.about': 'عن Wazly',
  'footer.blog': 'المدونة',
  'footer.careers': 'وظايف',
  'footer.contact': 'اتصل بنا',
  'footer.privacy': 'الخصوصية',
  'footer.terms': 'الشروط',
  'footer.security': 'الأمان',
  'footer.status': 'حالة الخدمة',
  'footer.integrations': 'الربط',

  // ── App · navigation ────────────────────────────────────────────
  'app.nav.overview': 'نظرة عامة',
  'app.nav.inbox': 'المحادثات',
  'app.nav.customers': 'العملاء',
  'app.nav.leads': 'تأهيل العملاء',
  'app.nav.ai': 'تجربة الـ AI',
  'app.nav.knowledge': 'معرفة الشركة',
  'app.nav.analytics': 'التحليلات',
  'app.nav.integrations': 'الربط',
  'app.nav.team': 'الفريق',
  'app.nav.billing': 'الاشتراك',
  'app.nav.settings': 'الإعدادات',
  'app.topbar.search': 'ابحث في المحادثات والعملاء…',
  'app.topbar.notifications': 'التنبيهات',
  'app.topbar.exit': 'رجوع للموقع',
  'app.status.operational': 'كل الأنظمة شغالة',

  // ── App · overview ──────────────────────────────────────────────
  'overview.greeting': 'أهلًا يا محمد 👋',
  'overview.sub': 'ده اللي حصل في شركة الكيان النهارده.',
  'overview.active': 'محادثة نشطة',
  'overview.aiHandled': 'رد عليها الـ AI',
  'overview.needsHuman': 'محتاجة تدخل بشري',
  'overview.newLeads': 'عميل محتمل جديد',
  'overview.recentLeads': 'آخر العملاء المحتملين',
  'overview.channelSplit': 'المحادثات حسب القناة',
  'overview.needsYou': 'محتاجة منك',

  // ── App · inbox ─────────────────────────────────────────────────
  'inbox.title': 'المحادثات',
  'inbox.search': 'ابحث في المحادثات…',
  'inbox.filter.all': 'الكل',
  'inbox.filter.ai': 'الـ AI',
  'inbox.filter.human': 'موظف',
  'inbox.filter.resolved': 'اتقفلت',
  'inbox.composer': 'اكتب ردك…',
  'inbox.aiTyping': 'الـ AI بيكتب',
  'inbox.aiHandled': 'AI تعامل مع المحادثة',
  'inbox.assigned': 'تم تحويل المحادثة إلى {name} — المبيعات',
  'inbox.joined': '{name} انضم للمحادثة',
  'inbox.requestedHuman': 'طلب العميل التحدث مع موظف',
  'inbox.aiAutoReply': 'AI يرد تلقائيًا',
  'inbox.details': 'بيانات العميل',
  'inbox.intent': 'نوع الطلب',
  'inbox.leadScore': 'تقييم العميل',
  'inbox.channel': 'القناة',
  'inbox.assignedTo': 'مسؤول المحادثة',
  'inbox.newMessage': 'رسالة جديدة',
  'inbox.empty': 'اختار محادثة عشان تشوف تفاصيلها',

  // ── App · analytics view ────────────────────────────────────────
  'an.range.7d': 'آخر 7 أيام',
  'an.range.30d': 'آخر 30 يوم',
  'an.conversations': 'المحادثات',
  'an.aiResolution': 'حلها الـ AI',
  'an.leads': 'عملاء محتملين',
  'an.responseTime': 'متوسط وقت الرد',
  'an.byChannel': 'الأداء حسب القناة',
  'an.share': 'النسبة',
  'an.conversion': 'التحويل',
  'an.ai': 'AI',
  'an.humanLabel': 'موظف',

  // ── App · billing ───────────────────────────────────────────────
  'billing.title': 'الاشتراك والاستهلاك',
  'billing.plan': 'باقتك الحالية',
  'billing.usage': 'استهلاك الشهر',
  'billing.ofLimit': 'من {limit} محادثة',
  'billing.upgrade': 'ترقية الباقة',
  'billing.invoices': 'الفواتير',
  'billing.usage.normal': 'الاستهلاك في المعدل الطبيعي.',
  'billing.usage.warning': 'قربت توصل لحد الباقة.',
  'billing.usage.critical': 'فاضلك محادثات قليلة على حد الباقة.',
  'billing.usage.full': 'وصلت لحد الباقة. رقّي عشان تكمل.',

  // ── App · onboarding ────────────────────────────────────────────
  'ob.step.business': 'بيانات الشركة',
  'ob.step.channels': 'القنوات',
  'ob.step.knowledge': 'المعرفة',
  'ob.step.ai': 'الـ AI',
  'ob.step.team': 'الفريق',
  'ob.step.ready': 'جاهز',
  'ob.title': 'يلا نجهّز Wazly لشركتك',
  'ob.readiness': 'جاهزية الـ AI',
  'ob.finish': 'ابدأ استخدام Wazly',

  // ── App · customers ─────────────────────────────────────────────
  'cust.title': 'العملاء',
  'cust.export': 'تصدير',
  'cust.name': 'العميل',
  'cust.channel': 'القناة',
  'cust.status': 'الحالة',
  'cust.score': 'التقييم',
  'cust.lastContact': 'آخر تواصل',
  'cust.status.qualified': 'مؤهل',
  'cust.status.warm': 'مهتم',
  'cust.status.cold': 'بارد',
  'cust.status.converted': 'اتحول لعميل',

  // ── App · team / integrations / knowledge / playground ──────────
  'team.title': 'الفريق',
  'team.invite': 'ضيف عضو',
  'team.online': 'متصل',
  'team.offline': 'غير متصل',
  'integ.title': 'الربط',
  'integ.connect': 'اربط',
  'integ.connected': 'متصل',
  'integ.connecting': 'جاري الربط',
  'kb.title': 'معرفة الشركة',
  'kb.ready': 'جاهز',
  'kb.processing': 'جاري المعالجة',
  'play.title': 'تجربة الـ AI',
  'play.sub': 'اسأل أي حاجة وشوف الـ AI هيرد إزاي على عملائك.',
  'play.placeholder': 'اكتب سؤال زي ما العميل هيكتبه…',
  'play.source': 'المصدر',
  'play.confidence': 'الثقة',
  'leads.title': 'تأهيل العملاء',
  'leads.sub': 'شوف الـ AI بيفهم نية العميل ويقيّمه لحظة بلحظة.',
  'leads.qualified': 'عميل مؤهل',
  'leads.score': 'التقييم',
  'leads.intent': 'نوع الطلب',
};

/**
 * Typed against `ar`, so a missing English string is a compile error.
 */
const en: Record<keyof typeof ar, string> = {
  'lang.ar': 'العربية',
  'lang.en': 'English',
  'lang.aria': 'Change language',

  'common.back': 'Back',
  'common.next': 'Next',
  'common.skip': 'Skip',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.search': 'Search…',
  'common.viewAll': 'View all',
  'common.openFull': 'Open full view',
  'common.live': 'Live now',
  'common.ai': 'AI',
  'common.human': 'Human',
  'common.all': 'All',
  'common.currency': 'EGP',
  'common.perMonth': 'EGP/mo',
  'common.empty': 'Nothing here yet',

  'nav.features': 'Features',
  'nav.how': 'How it works',
  'nav.analytics': 'Analytics',
  'nav.pricing': 'Pricing',
  'nav.launch': 'Start free',

  'hero.badge': 'Answer customers faster, on every channel',
  'hero.title': 'Let AI handle your customer support',
  'hero.subtitle':
    'Connect WhatsApp, Messenger and Instagram. Wazly replies to your customers automatically, hands conversations to your team when needed, and keeps everything in one place.',
  'hero.cta': 'Start free',
  'hero.ctaSecondary': 'See how Wazly works',
  'hero.trust1': 'No credit card',
  'hero.trust2': 'Live in 5 minutes',
  'hero.demoTitle': 'Al Kayan Finishing',
  'hero.demoOnline': 'Online',
  'hero.demoAiActive': 'AI active',
  'hero.composer': 'Type a message…',

  'stats.conversations': 'Conversations handled',
  'stats.aiRate': 'Resolved by AI',
  'stats.responseTime': 'Average response time',
  'stats.channels': 'Channels connected',

  'omni.label': 'Omnichannel',
  'omni.title': 'Every customer conversation in one place',
  'omni.body':
    'WhatsApp, Instagram, Messenger and Facebook comments all connect to Wazly. Messages arrive from any channel, AI replies instantly, and you see everything in one view.',
  'omni.item1.title': 'One inbox',
  'omni.item1.desc': 'All channels in a single view',
  'omni.item2.title': 'Instant replies',
  'omni.item2.desc': 'AI answers in seconds, not hours',
  'omni.item3.title': 'Per-channel analytics',
  'omni.item3.desc': 'See which channel brings the most leads',

  'how.label': 'How it works',
  'how.title': 'From first message to resolved — automatically',
  'how.step': 'Step {n}',
  'how.s1.title': 'A customer sends a message',
  'how.s1.desc': 'From any channel — WhatsApp, Instagram, Messenger or Facebook comments.',
  'how.s2.title': 'AI understands and searches',
  'how.s2.desc': 'Wazly reads the message and finds the right answer in your company knowledge.',
  'how.s3.title': 'AI replies instantly',
  'how.s3.desc': 'Your customer gets an accurate answer in seconds, around the clock.',
  'how.s4.title': 'A human steps in when needed',
  'how.s4.desc': 'Complex cases move to your team with the full conversation.',
  'how.s5.title': 'Leads and analytics update',
  'how.s5.desc': 'Every conversation is tracked, scored and turned into something useful.',

  'handoff.label': 'Human handoff',
  'handoff.title': 'Step into the conversation whenever you need',
  'handoff.body':
    'AI handles the repetitive questions. When a customer needs your team, Wazly moves the conversation to the right person with full context — so nobody repeats themselves.',
  'handoff.item1.title': 'Smart detection',
  'handoff.item1.desc': 'AI knows when a conversation needs a person',
  'handoff.item2.title': 'Full context',
  'handoff.item2.desc': 'Operators see the conversation from the start',
  'handoff.item3.title': 'Auto-assignment',
  'handoff.item3.desc': 'Conversations route to the right teammate',

  'knowledge.label': 'AI knowledge',
  'knowledge.title': 'Teach Wazly about your business',
  'knowledge.body':
    'Upload your company details, services, FAQs and policies. Wazly learns from them and answers your customers accurately — in your company voice.',
  'knowledge.item1.title': 'Any document type',
  'knowledge.item1.desc': 'PDFs, text, FAQs, price lists',
  'knowledge.item2.title': 'Always learning',
  'knowledge.item2.desc': 'Add new information anytime and AI updates itself',
  'knowledge.item3.title': 'Clear sources',
  'knowledge.item3.desc': 'Every answer shows where it came from',

  'analytics.label': 'Analytics',
  'analytics.title': 'Know exactly how your business is doing',
  'analytics.body': 'Live view of conversations, AI performance, leads and response times.',

  'pricing.label': 'Pricing',
  'pricing.title': 'Plans that grow with you',
  'pricing.subtitle': 'Start free. Upgrade when you need to.',
  'pricing.popular': 'Most popular',
  'pricing.custom': 'Custom',
  'pricing.getStarted': 'Get started',
  'pricing.contactSales': 'Contact sales',

  'cta.badge': 'Live in 5 minutes',
  'cta.title': 'Let your customers get an answer right now',
  'cta.body': 'Connect your channels, teach Wazly about your business, and watch it handle customers instantly.',
  'cta.button': 'Start free',
  'footer.tagline': 'AI customer support across every channel.',
  'footer.product': 'Product',
  'footer.company': 'Company',
  'footer.legal': 'Legal',
  'footer.rights': '© 2026 Wazly. All rights reserved.',
  'footer.about': 'About',
  'footer.blog': 'Blog',
  'footer.careers': 'Careers',
  'footer.contact': 'Contact',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',
  'footer.security': 'Security',
  'footer.status': 'Status',
  'footer.integrations': 'Integrations',

  'app.nav.overview': 'Overview',
  'app.nav.inbox': 'Inbox',
  'app.nav.customers': 'Customers',
  'app.nav.leads': 'Lead qualification',
  'app.nav.ai': 'AI playground',
  'app.nav.knowledge': 'Company knowledge',
  'app.nav.analytics': 'Analytics',
  'app.nav.integrations': 'Integrations',
  'app.nav.team': 'Team',
  'app.nav.billing': 'Billing',
  'app.nav.settings': 'Settings',
  'app.topbar.search': 'Search conversations and customers…',
  'app.topbar.notifications': 'Notifications',
  'app.topbar.exit': 'Back to site',
  'app.status.operational': 'All systems operational',

  'overview.greeting': 'Welcome back, Mohamed 👋',
  'overview.sub': "Here's what happened at Al Kayan today.",
  'overview.active': 'Active conversations',
  'overview.aiHandled': 'Answered by AI',
  'overview.needsHuman': 'Need a human',
  'overview.newLeads': 'New leads',
  'overview.recentLeads': 'Recent leads',
  'overview.channelSplit': 'Conversations by channel',
  'overview.needsYou': 'Needs you',

  'inbox.title': 'Inbox',
  'inbox.search': 'Search conversations…',
  'inbox.filter.all': 'All',
  'inbox.filter.ai': 'AI',
  'inbox.filter.human': 'Human',
  'inbox.filter.resolved': 'Resolved',
  'inbox.composer': 'Write your reply…',
  'inbox.aiTyping': 'AI is typing',
  'inbox.aiHandled': 'AI handled this conversation',
  'inbox.assigned': 'Conversation assigned to {name} — Sales',
  'inbox.joined': '{name} joined the conversation',
  'inbox.requestedHuman': 'Customer asked for a human',
  'inbox.aiAutoReply': 'AI replying automatically',
  'inbox.details': 'Customer details',
  'inbox.intent': 'Intent',
  'inbox.leadScore': 'Lead score',
  'inbox.channel': 'Channel',
  'inbox.assignedTo': 'Assigned to',
  'inbox.newMessage': 'New message',
  'inbox.empty': 'Pick a conversation to see the details',

  'an.range.7d': 'Last 7 days',
  'an.range.30d': 'Last 30 days',
  'an.conversations': 'Conversations',
  'an.aiResolution': 'Resolved by AI',
  'an.leads': 'Leads',
  'an.responseTime': 'Avg response time',
  'an.byChannel': 'Performance by channel',
  'an.share': 'Share',
  'an.conversion': 'Conversion',
  'an.ai': 'AI',
  'an.humanLabel': 'Human',

  'billing.title': 'Billing and usage',
  'billing.plan': 'Your plan',
  'billing.usage': 'This month',
  'billing.ofLimit': 'of {limit} conversations',
  'billing.upgrade': 'Upgrade plan',
  'billing.invoices': 'Invoices',
  'billing.usage.normal': 'Usage is in a healthy range.',
  'billing.usage.warning': "You're getting close to your plan limit.",
  'billing.usage.critical': 'Only a few conversations left on your plan.',
  'billing.usage.full': 'Plan limit reached. Upgrade to continue.',

  'ob.step.business': 'Business',
  'ob.step.channels': 'Channels',
  'ob.step.knowledge': 'Knowledge',
  'ob.step.ai': 'AI',
  'ob.step.team': 'Team',
  'ob.step.ready': 'Ready',
  'ob.title': "Let's set Wazly up for your business",
  'ob.readiness': 'AI readiness',
  'ob.finish': 'Start using Wazly',

  'cust.title': 'Customers',
  'cust.export': 'Export',
  'cust.name': 'Customer',
  'cust.channel': 'Channel',
  'cust.status': 'Status',
  'cust.score': 'Score',
  'cust.lastContact': 'Last contact',
  'cust.status.qualified': 'Qualified',
  'cust.status.warm': 'Warm',
  'cust.status.cold': 'Cold',
  'cust.status.converted': 'Converted',

  'team.title': 'Team',
  'team.invite': 'Invite member',
  'team.online': 'Online',
  'team.offline': 'Offline',
  'integ.title': 'Integrations',
  'integ.connect': 'Connect',
  'integ.connected': 'Connected',
  'integ.connecting': 'Connecting',
  'kb.title': 'Company knowledge',
  'kb.ready': 'Ready',
  'kb.processing': 'Processing',
  'play.title': 'AI playground',
  'play.sub': 'Ask anything and see how AI would answer your customers.',
  'play.placeholder': 'Type a question the way a customer would…',
  'play.source': 'Source',
  'play.confidence': 'Confidence',
  'leads.title': 'Lead qualification',
  'leads.sub': 'Watch AI read intent and score the lead in real time.',
  'leads.qualified': 'Qualified lead',
  'leads.score': 'Score',
  'leads.intent': 'Intent',
};

export type TKey = keyof typeof ar;

type LangContextValue = {
  lang: Lang;
  dir: Dir;
  isRTL: boolean;
  setLang: (l: Lang) => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  /** Choose between an Arabic and an English value coming from data. */
  pick: <T>(arValue: T, enValue: T) => T;
  /** Group a number in Western digits so it reads correctly inside RTL text. */
  n: (value: number) => string;
  /** Format a price with the right currency label for the active language. */
  currency: (value: number) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Arabic is the default. English is opt-in.
  const [lang, setLang] = useLocalStorage<Lang>('wazly-lang', 'ar');

  const dir: Dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    root.classList.toggle('lang-ar', lang === 'ar');
    root.classList.toggle('lang-en', lang === 'en');
  }, [lang, dir]);

  const value = useMemo<LangContextValue>(() => {
    const table = lang === 'ar' ? ar : en;
    return {
      lang,
      dir,
      isRTL: lang === 'ar',
      setLang,
      t: (key, vars) => {
        let out: string = table[key] ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            out = out.split(`{${k}}`).join(String(v));
          }
        }
        return out;
      },
      pick: (arValue, enValue) => (lang === 'ar' ? arValue : enValue),
      n: (v) => new Intl.NumberFormat('en-US').format(v),
      currency: (v) => {
        const amount = new Intl.NumberFormat('en-US').format(v);
        return lang === 'ar' ? `${amount} ج.م` : `EGP ${amount}`;
      },
    };
  }, [lang, dir, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

/**
 * Deliberately quiet: a small inline pair, not a dropdown or a pill button.
 * The active language is solid, the other is muted until hovered.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs ${className}`}
      role="group"
      aria-label={t('lang.aria')}
    >
      <button
        type="button"
        onClick={() => setLang('ar')}
        aria-pressed={lang === 'ar'}
        className={`font-arabic transition-colors focus-ring rounded px-0.5 ${
          lang === 'ar' ? 'text-main font-semibold' : 'text-subtle hover:text-muted'
        }`}
      >
        العربية
      </button>
      <span className="text-border-strong select-none" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`font-latin transition-colors focus-ring rounded px-0.5 ${
          lang === 'en' ? 'text-main font-semibold' : 'text-subtle hover:text-muted'
        }`}
      >
        English
      </button>
    </div>
  );
}
