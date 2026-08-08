export type ChannelType = 'whatsapp' | 'instagram' | 'messenger' | 'comments';
export type ConversationStatus = 'ai' | 'human' | 'resolved' | 'pending';
export type SenderType = 'customer' | 'ai' | 'operator';

export interface Message {
  id: string;
  sender: SenderType;
  text: string;
  arabic?: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  customerName: string;
  customerNameEn?: string;
  customerAvatar: string;
  channel: ChannelType;
  preview: string;
  previewArabic?: boolean;
  time: string;
  unread: number;
  status: ConversationStatus;
  messages: Message[];
  intent?: string;
  intentEn?: string;
  leadScore?: number;
  operator?: string;
  phone?: string;
}

export interface Operator {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  avatar: string;
  online: boolean;
}

/**
 * The demo workspace belongs to one real-feeling business rather than a
 * generic "company". Every conversation, lead and metric below comes from it.
 */
export const company = {
  name: 'شركة الكيان للتشطيبات والمقاولات العامة',
  shortName: 'شركة الكيان',
  nameEn: 'Al Kayan Finishing & General Contracting',
  shortNameEn: 'Al Kayan',
  industry: 'تشطيبات ومقاولات',
  industryEn: 'Finishing & contracting',
  areas: ['التجمع الخامس', 'القاهرة الجديدة', 'المعادي', 'الشيخ زايد'],
};

export const channelMeta: Record<ChannelType, { label: string; color: string; bgClass: string; icon: string }> = {
  whatsapp: { label: 'WhatsApp', color: '#25D366', bgClass: 'channel-whatsapp', icon: 'whatsapp' },
  instagram: { label: 'Instagram', color: '#dc2743', bgClass: 'channel-instagram', icon: 'instagram' },
  messenger: { label: 'Messenger', color: '#00B2FF', bgClass: 'channel-messenger', icon: 'messenger' },
  comments: { label: 'Comments', color: '#1877F2', bgClass: 'channel-comments', icon: 'comments' },
};

export const operators: Operator[] = [
  { id: '1', name: 'محمد سعيد', nameEn: 'Mohamed Saeed', role: 'المبيعات', roleEn: 'Sales', avatar: 'م', online: true },
  { id: '2', name: 'ليلى فؤاد', nameEn: 'Layla Fouad', role: 'مسؤول خدمة العملاء', roleEn: 'Support Lead', avatar: 'ل', online: true },
  { id: '3', name: 'كريم عادل', nameEn: 'Karim Adel', role: 'مهندس موقع', roleEn: 'Site Engineer', avatar: 'ك', online: false },
  { id: '4', name: 'ياسمين طارق', nameEn: 'Yasmin Tarek', role: 'المبيعات', roleEn: 'Sales', avatar: 'ي', online: true },
];

// ─── Hero conversation script ─────────────────────────────────
export const heroScript = [
  {
    type: 'customer' as const,
    text: 'مساء الخير، ممكن أعرف تكلفة تشطيب شقة 150 متر؟',
    arabic: true,
  },
  {
    type: 'processing' as const,
    steps: ['بيقرا الرسالة', 'بيدوّر في معرفة الشركة', 'لقى قائمة الأسعار', 'بيكتب الرد'],
  },
  {
    type: 'ai' as const,
    text: 'أهلًا بحضرتك 👋\nأكيد. تكلفة التشطيب بتختلف حسب مستوى التشطيب والخامات المطلوبة.\nلو تحب، ابعتلنا موقع الشقة ونوع التشطيب المطلوب، ونقدر نساعدك بتقدير مبدئي.',
    arabic: true,
    source: 'قائمة الأسعار',
  },
  {
    type: 'customer' as const,
    text: 'هل بتشتغلوا في التجمع الخامس؟',
    arabic: true,
  },
  {
    type: 'processing' as const,
    steps: ['بيقرا الرسالة', 'بيدوّر في معرفة الشركة', 'لقى نطاق العمل', 'بيكتب الرد'],
  },
  {
    type: 'ai' as const,
    text: 'أيوه، بننفذ أعمال التشطيبات في القاهرة الجديدة والتجمع الخامس والمناطق المحيطة.',
    arabic: true,
    source: 'معرفة الشركة',
  },
];

/**
 * Extended hero demo: the full arc the landing page tells — customer asks, AI
 * answers, customer asks for a person, a real operator takes over.
 */
export const heroHandoffScript = [
  {
    type: 'customer' as const,
    text: 'أنا عايز أتكلم مع حد من الفريق لو سمحت.',
    arabic: true,
  },
  {
    type: 'ai' as const,
    text: 'هحوّل حضرتك دلوقتي لأحد أعضاء فريق المبيعات عشان يساعدك في التفاصيل.',
    arabic: true,
  },
  { type: 'status' as const, status: 'طلب العميل التحدث مع موظف' },
  { type: 'status' as const, status: 'محمد انضم للمحادثة' },
  {
    type: 'operator' as const,
    text: 'أهلًا يا أستاذ أحمد، معاك محمد من فريق المبيعات. تحت أمرك.',
    arabic: true,
    operator: 'محمد سعيد',
  },
];

// ─── Handoff conversation script ───────────────────────────────
export const handoffScript = [
  {
    type: 'customer' as const,
    text: 'عايز عرض سعر مفصّل للشقة قبل ما أقرر.',
    arabic: true,
  },
  {
    type: 'ai' as const,
    text: 'هحوّل حضرتك دلوقتي لأحد أعضاء فريق المبيعات عشان يجهزلك عرض سعر مفصّل.',
    arabic: true,
  },
  {
    type: 'status' as const,
    status: 'طلب العميل التحدث مع موظف',
  },
  {
    type: 'status' as const,
    status: 'تم تحويل المحادثة إلى محمد — المبيعات',
  },
  {
    type: 'operator' as const,
    text: 'أهلًا يا أستاذ أحمد، معاك محمد من فريق المبيعات. تحت أمرك — هبعتلك عرض السعر خلال ساعة.',
    arabic: true,
    operator: 'محمد سعيد',
  },
];

// ─── Lead qualification script ────────────────────────────────
export const leadQualScript = [
  {
    type: 'customer' as const,
    text: 'عايز أعرف سعر التشطيب لشقة 150 متر.',
    arabic: true,
  },
  {
    type: 'detect' as const,
    intent: 'طلب سعر',
    lead: 'نية شراء عالية',
    score: 42,
  },
  {
    type: 'ai' as const,
    text: 'ممكن أعرف المنطقة وموعد البدء؟',
    arabic: true,
  },
  {
    type: 'customer' as const,
    text: 'في التجمع الخامس، وعايز أبدأ الشهر الجاي.',
    arabic: true,
  },
  {
    type: 'score' as const,
    score: 68,
  },
  {
    type: 'customer' as const,
    text: 'الميزانية تقريبًا 800 ألف جنيه.',
    arabic: true,
  },
  {
    type: 'score' as const,
    score: 91,
  },
  {
    type: 'qualified' as const,
  },
];

// ─── Inbox conversations ───────────────────────────────────────
export const inboxConversations: Conversation[] = [
  {
    id: 'c1',
    customerName: 'محمد حسن',
    customerNameEn: 'Mohamed Hassan',
    customerAvatar: 'م',
    channel: 'whatsapp',
    preview: 'عاوز أعرف تكلفة التشطيب للمتر',
    previewArabic: true,
    time: '٢ د',
    unread: 2,
    status: 'ai',
    intent: 'طلب سعر',
    intentEn: 'Pricing',
    leadScore: 74,
    phone: '+20 100 214 8890',
    messages: [
      { id: 'm1', sender: 'customer', text: 'عاوز أعرف تكلفة التشطيب للمتر', arabic: true, time: '10:32' },
      { id: 'm2', sender: 'ai', text: 'أكيد يا أستاذ محمد، ممكن أعرف مساحة الوحدة والموقع؟', arabic: true, time: '10:32', status: 'read' },
    ],
  },
  {
    id: 'c2',
    customerName: 'سارة أحمد',
    customerNameEn: 'Sara Ahmed',
    customerAvatar: 'س',
    channel: 'instagram',
    preview: 'شفت أعمالكم وعاجباني، إيه الخطوات؟',
    previewArabic: true,
    time: '٥ د',
    unread: 1,
    status: 'ai',
    intent: 'استفسار عام',
    intentEn: 'General enquiry',
    leadScore: 61,
    phone: '+20 122 776 3410',
    messages: [
      { id: 'm1', sender: 'customer', text: 'شفت أعمالكم وعاجباني، إيه الخطوات؟', arabic: true, time: '10:29' },
      { id: 'm2', sender: 'ai', text: 'نورتينا 🙏\nالخطوة الأولى معاينة للوحدة، وبعدها بنبعت عرض سعر مفصّل. تحبي نحدد معاينة إمتى؟', arabic: true, time: '10:29', status: 'read' },
    ],
  },
  {
    id: 'c3',
    customerName: 'محمود السيد',
    customerNameEn: 'Mahmoud Elsayed',
    customerAvatar: 'م',
    channel: 'messenger',
    preview: 'عايز أتكلم مع حد من الفريق',
    previewArabic: true,
    time: '١٢ د',
    unread: 0,
    status: 'human',
    intent: 'عرض سعر',
    intentEn: 'Quotation',
    leadScore: 83,
    operator: 'ليلى فؤاد',
    phone: '+20 111 502 6677',
    messages: [
      { id: 'm1', sender: 'customer', text: 'عندي فيلا في الشيخ زايد محتاجة تشطيب كامل', arabic: true, time: '10:18' },
      { id: 'm2', sender: 'ai', text: 'تحت أمرك. المساحة تقريبًا كام، ومستوى التشطيب اللي في بالك إيه؟', arabic: true, time: '10:18', status: 'read' },
      { id: 'm3', sender: 'customer', text: 'عايز أتكلم مع حد من الفريق', arabic: true, time: '10:20' },
      { id: 'm4', sender: 'operator', text: 'أهلًا يا أستاذ محمود، معاك ليلى. تحت أمرك — نقدر نحدد معاينة بكرة لو يناسبك.', arabic: true, time: '10:22', status: 'read' },
    ],
  },
  {
    id: 'c4',
    customerName: 'أحمد محمد',
    customerNameEn: 'Ahmed Mohamed',
    customerAvatar: 'أ',
    channel: 'whatsapp',
    preview: 'تمام، متشكر على سرعة الرد',
    previewArabic: true,
    time: '١ س',
    unread: 0,
    status: 'resolved',
    intent: 'مواعيد العمل',
    intentEn: 'Working hours',
    leadScore: 34,
    phone: '+20 106 933 1245',
    messages: [
      { id: 'm1', sender: 'customer', text: 'مواعيد المعاينة إيه؟', arabic: true, time: '09:15' },
      { id: 'm2', sender: 'ai', text: 'المعاينات من السبت للخميس، من 10 صباحًا لـ 6 مساءً.', arabic: true, time: '09:15', status: 'read' },
      { id: 'm3', sender: 'customer', text: 'تمام، متشكر على سرعة الرد', arabic: true, time: '09:16', status: 'read' },
    ],
  },
  {
    id: 'c5',
    customerName: 'نورهان عادل',
    customerNameEn: 'Nourhan Adel',
    customerAvatar: 'ن',
    channel: 'comments',
    preview: 'بتشتغلوا في المعادي؟',
    previewArabic: true,
    time: '٢ س',
    unread: 0,
    status: 'resolved',
    intent: 'نطاق العمل',
    intentEn: 'Coverage',
    leadScore: 47,
    phone: '+20 128 445 9002',
    messages: [
      { id: 'm1', sender: 'customer', text: 'بتشتغلوا في المعادي؟', arabic: true, time: '08:30' },
      { id: 'm2', sender: 'ai', text: 'أيوه، بننفذ في المعادي والقاهرة الجديدة والتجمع والشيخ زايد.', arabic: true, time: '08:30', status: 'read' },
    ],
  },
];

// ─── New conversations that arrive dynamically ────────────────────
export const incomingConversations = [
  {
    customerName: 'فريدة سمير',
    customerNameEn: 'Farida Samir',
    customerAvatar: 'ف',
    channel: 'whatsapp' as ChannelType,
    message: 'بتعملوا تشطيب محلات تجارية؟',
    arabic: true,
    intent: 'نطاق العمل',
    intentEn: 'Coverage',
  },
  {
    customerName: 'حسن إبراهيم',
    customerNameEn: 'Hassan Ibrahim',
    customerAvatar: 'ح',
    channel: 'instagram' as ChannelType,
    message: 'ممكن أعرف الأسعار؟',
    arabic: true,
    intent: 'طلب سعر',
    intentEn: 'Pricing',
  },
  {
    customerName: 'ريم مصطفى',
    customerNameEn: 'Reem Mostafa',
    customerAvatar: 'ر',
    channel: 'messenger' as ChannelType,
    message: 'محتاجة استشارة في تشطيب شقة',
    arabic: true,
    intent: 'استشارة',
    intentEn: 'Consultation',
  },
];

// ─── AI Playground ───────────────────────────────────────────
export const playgroundExamples = [
  {
    question: 'تكلفة تشطيب المتر كام؟',
    arabic: true,
    answer:
      'سعر المتر بيبدأ من 4,500 جنيه للتشطيب السوبر لوكس، ومن 6,800 جنيه للتشطيب الفاخر. السعر النهائي بيتحدد بعد المعاينة حسب الخامات.',
    source: 'قائمة الأسعار',
    confidence: 94,
  },
  {
    question: 'التشطيب بياخد قد إيه؟',
    arabic: true,
    answer:
      'شقة 150 متر بتاخد من 75 لـ 90 يوم عمل، حسب مستوى التشطيب وتوفر الخامات. بندي جدول زمني معتمد مع العقد.',
    source: 'معرفة الشركة',
    confidence: 89,
  },
  {
    question: 'Do you work in New Cairo?',
    arabic: false,
    answer:
      'Yes. We carry out finishing work across New Cairo, the Fifth Settlement, Maadi and Sheikh Zayed. Site visits are available Saturday to Thursday.',
    source: 'Company knowledge',
    confidence: 96,
  },
];

// ─── Analytics data ──────────────────────────────────────────
// Figures are deliberately mid-sized and internally consistent: the channel
// rows sum to the 3,842 monthly total, percentages sum to 100, and per-channel
// leads sum to the 214 headline.
export const analyticsData = {
  kpis: {
    conversations: { value: 3842, label: 'المحادثات', labelEn: 'Conversations', suffix: '' },
    aiResolution: { value: 86, label: 'حلها الـ AI', labelEn: 'Resolved by AI', suffix: '%' },
    leads: { value: 214, label: 'عملاء محتملين', labelEn: 'Leads', suffix: '' },
    responseTime: { value: 4.2, label: 'متوسط وقت الرد', labelEn: 'Avg response', suffix: 'ث', decimals: true },
  },
  // The Egyptian working week starts on Saturday and Friday is the quiet day.
  daily: [
    { day: 'السبت', dayEn: 'Sat', ai: 168, human: 22 },
    { day: 'الأحد', dayEn: 'Sun', ai: 152, human: 19 },
    { day: 'الاتنين', dayEn: 'Mon', ai: 141, human: 17 },
    { day: 'التلات', dayEn: 'Tue', ai: 134, human: 15 },
    { day: 'الأربع', dayEn: 'Wed', ai: 149, human: 18 },
    { day: 'الخميس', dayEn: 'Thu', ai: 118, human: 14 },
    { day: 'الجمعة', dayEn: 'Fri', ai: 46, human: 5 },
  ],
  monthly: [
    { day: 'الأسبوع 1', dayEn: 'W1', ai: 820, human: 78 },
    { day: 'الأسبوع 2', dayEn: 'W2', ai: 890, human: 82 },
    { day: 'الأسبوع 3', dayEn: 'W3', ai: 950, human: 88 },
    { day: 'الأسبوع 4', dayEn: 'W4', ai: 870, human: 64 },
  ],
  channelDistribution: [
    { channel: 'whatsapp' as ChannelType, conversations: 2612, percentage: 68, aiResolution: 90, leads: 142, conversion: 13.1 },
    { channel: 'instagram' as ChannelType, conversations: 730, percentage: 19, aiResolution: 83, leads: 44, conversion: 9.4 },
    { channel: 'messenger' as ChannelType, conversations: 346, percentage: 9, aiResolution: 78, leads: 19, conversion: 6.8 },
    { channel: 'comments' as ChannelType, conversations: 154, percentage: 4, aiResolution: 71, leads: 9, conversion: 5.2 },
  ],
};

// ─── Pricing plans ───────────────────────────────────────────
export const pricingPlans = [
  {
    name: 'البداية',
    nameEn: 'Starter',
    price: 499,
    period: 'ج.م/شهر',
    periodEn: 'EGP/mo',
    conversations: 1000,
    features: ['1,000 محادثة بالـ AI', 'قناتين', 'معرفة الشركة', 'تحليلات أساسية', 'دعم بالإيميل'],
    featuresEn: ['1,000 AI conversations', '2 channels', 'Company knowledge', 'Basic analytics', 'Email support'],
    highlighted: false,
  },
  {
    name: 'النمو',
    nameEn: 'Growth',
    price: 999,
    period: 'ج.م/شهر',
    periodEn: 'EGP/mo',
    conversations: 5000,
    features: ['5,000 محادثة بالـ AI', '4 قنوات', 'تحويل لموظف', 'تحليلات متقدمة', 'تأهيل العملاء', 'دعم ذو أولوية'],
    featuresEn: ['5,000 AI conversations', '4 channels', 'Human handoff', 'Advanced analytics', 'Lead qualification', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'الأعمال',
    nameEn: 'Business',
    price: 1999,
    period: 'ج.م/شهر',
    periodEn: 'EGP/mo',
    conversations: 15000,
    features: ['15,000 محادثة بالـ AI', 'كل القنوات', 'عمل جماعي للفريق', 'مصادر معرفة مخصصة', 'وصول للـ API', 'مدير حساب مخصص'],
    featuresEn: ['15,000 AI conversations', 'All channels', 'Team collaboration', 'Custom knowledge sources', 'API access', 'Dedicated manager'],
    highlighted: false,
  },
  {
    name: 'المؤسسات',
    nameEn: 'Enterprise',
    price: null,
    period: 'حسب الطلب',
    periodEn: 'Custom',
    conversations: null,
    features: ['محادثات غير محدودة', 'كل القنوات وأكتر', 'علامة تجارية خاصة', 'SSO و SAML', 'اتفاقية مستوى خدمة', 'دعم 24/7'],
    featuresEn: ['Unlimited conversations', 'All channels + custom', 'White-label option', 'SSO & SAML', 'SLA guarantee', '24/7 support'],
    highlighted: false,
  },
];

// ─── Integrations ────────────────────────────────────────────
export const integrations = [
  { id: 'whatsapp', name: 'WhatsApp Business', channel: 'whatsapp' as ChannelType, connected: true, description: 'اربط حساب واتساب بزنس وخلي الـ AI يرد على عملائك تلقائيًا.', descriptionEn: 'Connect your WhatsApp Business account to handle customer chats automatically.' },
  { id: 'instagram', name: 'Instagram Direct', channel: 'instagram' as ChannelType, connected: true, description: 'رد على رسايل إنستجرام والمنشنز من مكان واحد.', descriptionEn: 'Respond to Instagram DMs and mentions with AI-powered replies.' },
  { id: 'messenger', name: 'Facebook Messenger', channel: 'messenger' as ChannelType, connected: true, description: 'اتعامل مع محادثات ماسنجر من غير ما تفوتك رسالة.', descriptionEn: 'Handle Messenger conversations and never miss a customer message.' },
  { id: 'comments', name: 'Facebook Comments', channel: 'comments' as ChannelType, connected: false, description: 'رد تلقائي على التعليقات على بوستات صفحتك.', descriptionEn: 'Automatically reply to comments on your Facebook posts.' },
  { id: 'telegram', name: 'Telegram', channel: null, connected: false, description: 'اربط تليجرام ووصل لعملاء أكتر.', descriptionEn: 'Connect Telegram to reach customers on another popular channel.' },
  { id: 'slack', name: 'Slack', channel: null, connected: true, description: 'يوصلك تنبيه على Slack أول ما يجي عميل محتمل أو تحويل.', descriptionEn: 'Get notified in Slack when leads are captured or handoffs happen.' },
  { id: 'sheets', name: 'Google Sheets', channel: null, connected: false, description: 'صدّر العملاء وبيانات المحادثات لجوجل شيتس أوتوماتيك.', descriptionEn: 'Sync leads and conversation data to Google Sheets automatically.' },
  { id: 'crm', name: 'CRM Sync', channel: null, connected: false, description: 'ابعت العملاء المؤهلين على طول للـ CRM بتاعك.', descriptionEn: 'Push qualified leads directly to your CRM.' },
];

// ─── Knowledge sources ───────────────────────────────────────
export const knowledgeSources = [
  { id: 'info', name: 'بيانات الشركة', nameEn: 'Company information', icon: 'building', status: 'ready' as const },
  { id: 'pdf', name: 'كتالوج الأعمال (PDF)', nameEn: 'Project catalogue (PDF)', icon: 'file-text', status: 'ready' as const },
  { id: 'faq', name: 'الأسئلة المتكررة', nameEn: 'FAQ document', icon: 'help-circle', status: 'ready' as const },
  { id: 'products', name: 'قائمة الأسعار والخامات', nameEn: 'Price list & materials', icon: 'tag', status: 'ready' as const },
  { id: 'policies', name: 'شروط التعاقد والدفع', nameEn: 'Contract & payment terms', icon: 'shield', status: 'processing' as const },
];

// ─── AI Readiness items ──────────────────────────────────────
export const readinessItems = [
  { id: 'info', label: 'بيانات الشركة', labelEn: 'Company information', done: true },
  { id: 'products', label: 'الخدمات والأسعار', labelEn: 'Services & pricing', done: true },
  { id: 'faq', label: 'الأسئلة المتكررة', labelEn: 'FAQ', done: true },
  { id: 'hours', label: 'مواعيد العمل والمعاينة', labelEn: 'Working hours', done: true },
  { id: 'policies', label: 'شروط التعاقد', labelEn: 'Contract terms', done: false },
];

// ─── Onboarding steps ────────────────────────────────────────
export const onboardingSteps = ['الشركة', 'القنوات', 'المعرفة', 'الـ AI', 'الفريق', 'جاهز'];
export const onboardingStepsEn = ['Business', 'Channels', 'Knowledge', 'AI', 'Team', 'Ready'];

// ─── Notifications ──────────────────────────────────────────
export const notificationTemplates = [
  { type: 'lead' as const, title: 'عميل محتمل جديد', titleEn: 'New lead', body: 'محمد حسن سأل عن تشطيب شقة 150 متر.', bodyEn: 'Mohamed Hassan asked about finishing a 150 m² flat.', time: 'دلوقتي', timeEn: 'Just now' },
  { type: 'handoff' as const, title: 'تحويل لموظف', titleEn: 'Human handoff', body: 'محمود السيد طلب التحدث مع المبيعات.', bodyEn: 'Mahmoud Elsayed asked to speak with sales.', time: 'من ٢ د', timeEn: '2m ago' },
  { type: 'integration' as const, title: 'ربط قناة', titleEn: 'Integration', body: 'تم ربط واتساب بنجاح.', bodyEn: 'WhatsApp connected successfully.', time: 'من ساعة', timeEn: '1h ago' },
  { type: 'knowledge' as const, title: 'معرفة الشركة', titleEn: 'Company knowledge', body: 'تمت فهرسة قائمة الأسعار الجديدة.', bodyEn: 'The new price list has been indexed.', time: 'من ٣ س', timeEn: '3h ago' },
];
