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
  customerAvatar: string;
  channel: ChannelType;
  preview: string;
  previewArabic?: boolean;
  time: string;
  unread: number;
  status: ConversationStatus;
  messages: Message[];
  intent?: string;
  leadScore?: number;
  operator?: string;
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
}

export const channelMeta: Record<ChannelType, { label: string; color: string; bgClass: string; icon: string }> = {
  whatsapp: { label: 'WhatsApp', color: '#25D366', bgClass: 'channel-whatsapp', icon: 'whatsapp' },
  instagram: { label: 'Instagram', color: '#dc2743', bgClass: 'channel-instagram', icon: 'instagram' },
  messenger: { label: 'Messenger', color: '#00B2FF', bgClass: 'channel-messenger', icon: 'messenger' },
  comments: { label: 'Comments', color: '#1877F2', bgClass: 'channel-comments', icon: 'comments' },
};

export const operators: Operator[] = [
  { id: '1', name: 'Mohamed', role: 'Sales Operator', avatar: 'M', online: true },
  { id: '2', name: 'Layla', role: 'Support Lead', avatar: 'L', online: true },
  { id: '3', name: 'Karim', role: 'Customer Success', avatar: 'K', online: false },
  { id: '4', name: 'Yasmin', role: 'Sales Operator', avatar: 'Y', online: true },
];

// ─── Hero conversation script ─────────────────────────────────────
export const heroScript = [
  {
    type: 'customer' as const,
    text: 'مواعيد العمل إيه؟',
    arabic: true,
  },
  {
    type: 'processing' as const,
    steps: ['Thinking', 'Searching knowledge', 'Found relevant information', 'Generating response'],
  },
  {
    type: 'ai' as const,
    text: 'أهلًا 👋\nمواعيد العمل من السبت للخميس من 9 صباحًا حتى 10 مساءً.',
    arabic: true,
    source: 'Company Knowledge',
  },
  {
    type: 'customer' as const,
    text: 'ممكن أعرف الأسعار؟',
    arabic: true,
  },
  {
    type: 'processing' as const,
    steps: ['Thinking', 'Searching knowledge', 'Found relevant information', 'Generating response'],
  },
  {
    type: 'ai' as const,
    text: 'بالطبع! 📋\nلدينا عدة باقات تناسب احتياجاتك:\n• الباقة الأساسية — ١٩٩ ج\n• الباقة المتقدمة — ٣٩٩ ج\n• باقة البريميوم — ٦٩٩ ج\nأي باقة تهمك أكثر؟',
    arabic: true,
    source: 'Pricing Document',
  },
];

// ─── Handoff conversation script ──────────────────────────────────
export const handoffScript = [
  {
    type: 'customer' as const,
    text: 'I want to speak with someone about a custom quotation.',
  },
  {
    type: 'ai' as const,
    text: "I'll connect you with a team member who can help with custom quotations.",
  },
  {
    type: 'status' as const,
    status: 'Human takeover',
  },
  {
    type: 'status' as const,
    status: 'Assigned to Mohamed',
  },
  {
    type: 'operator' as const,
    text: 'Hello! This is Mohamed from Sales. I\'d be happy to prepare a custom quotation for you. Could you share more details about what you need?',
    operator: 'Mohamed',
  },
];

// ─── Lead qualification script ────────────────────────────────────
export const leadQualScript = [
  {
    type: 'customer' as const,
    text: 'عايز أعرف سعر التشطيب لشقة 150 متر.',
    arabic: true,
  },
  {
    type: 'detect' as const,
    intent: 'Pricing',
    lead: 'High Intent',
    score: 42,
  },
  {
    type: 'ai' as const,
    text: 'ممكن أعرف المنطقة وموعد البدء؟',
    arabic: true,
  },
  {
    type: 'customer' as const,
    text: 'في المعادي، وعايز أبدأ الشهر الجاي.',
    arabic: true,
  },
  {
    type: 'score' as const,
    score: 68,
  },
  {
    type: 'customer' as const,
    text: 'الميزانية تقريبًا 200 ألف جنيه.',
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

// ─── Inbox conversations ──────────────────────────────────────────
export const inboxConversations: Conversation[] = [
  {
    id: 'c1',
    customerName: 'Ahmed',
    customerAvatar: 'A',
    channel: 'whatsapp',
    preview: 'هل المنتج متوفر؟',
    previewArabic: true,
    time: '2m',
    unread: 2,
    status: 'ai',
    intent: 'Product Inquiry',
    leadScore: 55,
    messages: [
      { id: 'm1', sender: 'customer', text: 'هل المنتج متوفر؟', arabic: true, time: '10:32 AM' },
      { id: 'm2', sender: 'ai', text: 'أهلًا 👋 نعم، المنتج متوفر حاليًا. هل ترغب في معرفة المزيد عن الأسعار أو المواصفات؟', arabic: true, time: '10:32 AM', status: 'read' },
    ],
  },
  {
    id: 'c2',
    customerName: 'Sara',
    customerAvatar: 'S',
    channel: 'instagram',
    preview: 'عايز أعرف السعر',
    previewArabic: true,
    time: '5m',
    unread: 1,
    status: 'ai',
    intent: 'Pricing',
    leadScore: 72,
    messages: [
      { id: 'm1', sender: 'customer', text: 'عايز أعرف السعر', arabic: true, time: '10:29 AM' },
      { id: 'm2', sender: 'ai', text: 'أهلًا! 📋 لدينا عدة باقات. أي خدمة تهمك بالتحديد؟', arabic: true, time: '10:29 AM', status: 'read' },
    ],
  },
  {
    id: 'c3',
    customerName: 'Omar',
    customerAvatar: 'O',
    channel: 'messenger',
    preview: 'ممكن حد يساعدني؟',
    previewArabic: true,
    time: '12m',
    unread: 0,
    status: 'human',
    intent: 'Support',
    leadScore: 40,
    operator: 'Layla',
    messages: [
      { id: 'm1', sender: 'customer', text: 'ممكن حد يساعدني؟', arabic: true, time: '10:18 AM' },
      { id: 'm2', sender: 'ai', text: 'أهلًا! كيف يمكنني مساعدتك اليوم؟', arabic: true, time: '10:18 AM', status: 'read' },
      { id: 'm3', sender: 'customer', text: 'عايز أتكلم مع حد من الفريق', arabic: true, time: '10:20 AM' },
      { id: 'm4', sender: 'operator', text: 'Hello! This is Layla. How can I help you today?', time: '10:22 AM', status: 'read' },
    ],
  },
  {
    id: 'c4',
    customerName: 'Nour',
    customerAvatar: 'N',
    channel: 'whatsapp',
    preview: 'Thank you for the quick response!',
    time: '1h',
    unread: 0,
    status: 'resolved',
    intent: 'General',
    leadScore: 30,
    messages: [
      { id: 'm1', sender: 'customer', text: 'What are your working hours?', time: '9:15 AM' },
      { id: 'm2', sender: 'ai', text: 'We are open Saturday to Thursday, 9 AM to 10 PM.', time: '9:15 AM', status: 'read' },
      { id: 'm3', sender: 'customer', text: 'Thank you for the quick response!', time: '9:16 AM', status: 'read' },
    ],
  },
  {
    id: 'c5',
    customerName: 'Mahmoud',
    customerAvatar: 'M',
    channel: 'comments',
    preview: 'Is this available for shipping?',
    time: '2h',
    unread: 0,
    status: 'resolved',
    intent: 'Shipping',
    leadScore: 50,
    messages: [
      { id: 'm1', sender: 'customer', text: 'Is this available for shipping?', time: '8:30 AM' },
      { id: 'm2', sender: 'ai', text: 'Yes! We ship nationwide. Delivery takes 2-4 business days.', time: '8:30 AM', status: 'read' },
    ],
  },
];

// ─── New conversations that arrive dynamically ────────────────────
export const incomingConversations = [
  {
    customerName: 'Farida',
    customerAvatar: 'F',
    channel: 'whatsapp' as ChannelType,
    message: 'هل عندكم توصيل؟',
    arabic: true,
    intent: 'Shipping',
  },
  {
    customerName: 'Hassan',
    customerAvatar: 'H',
    channel: 'instagram' as ChannelType,
    message: 'Price please',
    intent: 'Pricing',
  },
  {
    customerName: 'Reem',
    customerAvatar: 'R',
    channel: 'messenger' as ChannelType,
    message: 'بعد إذنكم محتاج استشارة',
    arabic: true,
    intent: 'Consultation',
  },
];

// ─── AI Playground ────────────────────────────────────────────────
export const playgroundExamples = [
  { question: 'هل عندكم توصيل للقاهرة؟', arabic: true, answer: 'نعم! 🚚 نوفر خدمة التوصيل للقاهرة وكل المحافظات. رسوم التوصيل داخل القاهرة 50 جنيه، وخارجها تبدأ من 80 جنيه. التوصيل خلال 2-3 أيام عمل.', source: 'Delivery Policy', confidence: 94 },
  { question: 'What are your working hours?', arabic: false, answer: 'We are open Saturday to Thursday, from 9:00 AM to 10:00 PM. Fridays we are closed.', source: 'Company Information', confidence: 96 },
  { question: 'ممكن أعرف أسعار الباقات؟', arabic: true, answer: 'بالطبع! 📋 لدينا ثلاث باقات:\n• الأساسية — ١٩٩ ج/شهر\n• المتقدمة — ٣٩٩ ج/شهر\n• بريميوم — ٦٩٩ ج/شهر\nكل الباقات تشمل دعم فني وضمان.', source: 'Pricing Document', confidence: 91 },
];

// ─── Analytics data ───────────────────────────────────────────────
export const analyticsData = {
  kpis: {
    conversations: { value: 12483, label: 'Conversations', suffix: '' },
    aiResolution: { value: 87, label: 'AI Resolution Rate', suffix: '%' },
    leads: { value: 342, label: 'Leads Captured', suffix: '' },
    responseTime: { value: 3.8, label: 'Avg Response Time', suffix: 's', decimals: true },
  },
  daily: [
    { day: 'Mon', ai: 420, human: 80 },
    { day: 'Tue', ai: 510, human: 95 },
    { day: 'Wed', ai: 680, human: 110 },
    { day: 'Thu', ai: 590, human: 70 },
    { day: 'Fri', ai: 320, human: 40 },
    { day: 'Sat', ai: 720, human: 130 },
    { day: 'Sun', ai: 810, human: 150 },
  ],
  monthly: [
    { day: 'W1', ai: 2100, human: 480 },
    { day: 'W2', ai: 2800, human: 520 },
    { day: 'W3', ai: 3100, human: 490 },
    { day: 'W4', ai: 3500, human: 610 },
  ],
  channelDistribution: [
    { channel: 'whatsapp' as ChannelType, conversations: 7740, percentage: 62, aiResolution: 91, leads: 215, conversion: 12.4 },
    { channel: 'instagram' as ChannelType, conversations: 2620, percentage: 21, aiResolution: 84, leads: 78, conversion: 8.2 },
    { channel: 'messenger' as ChannelType, conversations: 1375, percentage: 11, aiResolution: 79, leads: 34, conversion: 6.1 },
    { channel: 'comments' as ChannelType, conversations: 748, percentage: 6, aiResolution: 72, leads: 15, conversion: 4.3 },
  ],
};

// ─── Pricing plans ────────────────────────────────────────────────
export const pricingPlans = [
  {
    name: 'Starter',
    price: 499,
    period: 'EGP/mo',
    conversations: 1000,
    features: ['1,000 AI conversations', '2 channels', 'AI knowledge base', 'Basic analytics', 'Email support'],
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 999,
    period: 'EGP/mo',
    conversations: 5000,
    features: ['5,000 AI conversations', '4 channels', 'AI + human handoff', 'Advanced analytics', 'Lead qualification', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'Business',
    price: 1999,
    period: 'EGP/mo',
    conversations: 15000,
    features: ['15,000 AI conversations', 'All channels', 'Team collaboration', 'Custom knowledge sources', 'API access', 'Dedicated manager'],
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: null,
    period: 'Custom',
    conversations: null,
    features: ['Unlimited conversations', 'All channels + custom', 'White-label option', 'SSO & SAML', 'SLA guarantee', '24/7 support'],
    highlighted: false,
  },
];

// ─── Integrations ─────────────────────────────────────────────────
export const integrations = [
  { id: 'whatsapp', name: 'WhatsApp Business', channel: 'whatsapp' as ChannelType, connected: true, description: 'Connect your WhatsApp Business account to handle customer chats automatically.' },
  { id: 'instagram', name: 'Instagram Direct', channel: 'instagram' as ChannelType, connected: true, description: 'Respond to Instagram DMs and mentions with AI-powered replies.' },
  { id: 'messenger', name: 'Facebook Messenger', channel: 'messenger' as ChannelType, connected: true, description: 'Handle Messenger conversations and never miss a customer message.' },
  { id: 'comments', name: 'Facebook Comments', channel: 'comments' as ChannelType, connected: false, description: 'Automatically reply to comments on your Facebook posts.' },
  { id: 'telegram', name: 'Telegram', channel: null, connected: false, description: 'Connect Telegram to reach customers on another popular channel.' },
  { id: 'slack', name: 'Slack', channel: null, connected: true, description: 'Get notified in Slack when leads are captured or handoffs happen.' },
  { id: 'sheets', name: 'Google Sheets', channel: null, connected: false, description: 'Sync leads and conversation data to Google Sheets automatically.' },
  { id: 'crm', name: 'CRM Sync', channel: null, connected: false, description: 'Push qualified leads directly to your CRM.' },
];

// ─── Knowledge sources ────────────────────────────────────────────
export const knowledgeSources = [
  { id: 'info', name: 'Company Information', icon: 'building', status: 'ready' as const },
  { id: 'pdf', name: 'Product Catalog (PDF)', icon: 'file-text', status: 'ready' as const },
  { id: 'faq', name: 'FAQ Document', icon: 'help-circle', status: 'ready' as const },
  { id: 'products', name: 'Products & Pricing', icon: 'tag', status: 'ready' as const },
  { id: 'policies', name: 'Policies & Terms', icon: 'shield', status: 'processing' as const },
];

// ─── AI Readiness items ───────────────────────────────────────────
export const readinessItems = [
  { id: 'info', label: 'Company Information', done: true },
  { id: 'products', label: 'Products', done: true },
  { id: 'faq', label: 'FAQ', done: true },
  { id: 'hours', label: 'Working Hours', done: true },
  { id: 'policies', label: 'Policies', done: false },
];

// ─── Onboarding steps ─────────────────────────────────────────────
export const onboardingSteps = ['Business', 'Channels', 'Knowledge', 'AI', 'Team', 'Ready'];

// ─── Notifications ────────────────────────────────────────────────
export const notificationTemplates = [
  { type: 'lead' as const, title: 'New lead detected', body: 'Ahmed is interested in your Premium Package.', time: 'Just now' },
  { type: 'handoff' as const, title: 'Human handoff', body: 'Customer requested a human operator.', time: '2m ago' },
  { type: 'integration' as const, title: 'Integration', body: 'WhatsApp connected successfully.', time: '1h ago' },
  { type: 'knowledge' as const, title: 'AI Knowledge', body: 'New knowledge source indexed.', time: '3h ago' },
];
