/**
 * data.js — single source of truth.
 *
 * Every metric follows { value, label, source, verified }.
 *   verified: true  — a real figure from a supplied document / dashboard / Studio.
 *   verified: false — no data supplied yet; the UI shows "DATA UPDATE PENDING".
 * Never invent historical results (esp. TikTok / X / LinkedIn).
 */

export const profile = {
  nickname: 'Kd',
  name: 'Kundan Sonji',
  role: 'Digital Growth Strategist',
  secondary: [
    'Remote Growth Services — Worldwide',
    'Senior Social Media Manager',
    'Performance Marketing',
    'Paid Media',
    'Content Strategy',
    'YouTube Growth',
    'Multi-Brand Digital Systems',
  ],
  statement: 'I don’t just manage social media. I build digital growth systems.',
  location: 'Karachi, Pakistan',
  email: 'kdstudio96@gmail.com',
  phoneDisplay: '+92 339 1121169',
  whatsapp: '923391121169',
  linkedin: 'https://www.linkedin.com/in/kundan-kd-b39158217/',
  positioning:
    'Remote services available worldwide. Strategy. Content. Paid Media. Performance. I build and run multi-brand content systems and paid media that scales across Google, YouTube, Meta, TikTok, X and Snapchat.',
};

export const hero = {
  eyebrow: 'I build systems that scale brands',
  lines: ['I BUILD', 'DIGITAL GROWTH', 'ENGINES.'],
  gradientLine: 'DIGITAL GROWTH',
  ctaPrimary: { label: 'Explore my work', href: '#metrics' },
  ctaSecondary: { label: 'Hire Me', href: 'https://wa.me/923391121169' },
};

/** Vertical social rail. url:null renders disabled. */
export const socials = [
  { name: 'WhatsApp', key: 'whatsapp', url: 'https://wa.me/923391121169', hue: '#25D366' },
  { name: 'LinkedIn', key: 'linkedin', url: 'https://www.linkedin.com/in/kundan-kd-b39158217/', hue: '#0A66C2' },
  { name: 'Instagram', key: 'instagram', url: null, hue: '#E1306C' },
  { name: 'YouTube', key: 'youtube', url: null, hue: '#FF3B30' },
  { name: 'TikTok', key: 'tiktok', url: null, hue: '#19E6D2' },
  { name: 'X', key: 'x', url: null, hue: '#F7F7F5' },
  { name: 'Email', key: 'email', url: 'mailto:kdstudio96@gmail.com', hue: '#FF7A18' },
];

export const navLinks = [
  { label: 'Metrics', href: '#metrics' },
  { label: 'Brands', href: '#ecosystem', dropdown: true },
  { label: 'Paid media', href: '#paid-media' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Case studies', href: '#case-study' },
];

/**
 * Six orbiting service modules around the 3D Kd.
 * `system` maps to the colour system (see styles.css).
 */
export const modules = [
  { key: 'strategy', title: 'Strategy', glyph: 'target', system: 'gold', lines: ['Data-Led', 'Audience First', 'Brand-Focused'] },
  { key: 'content', title: 'Content', glyph: 'clap', system: 'violet', lines: ['Content Systems', 'Creative Direction', 'Multi-Platform'] },
  { key: 'paid', title: 'Paid Media', glyph: 'ads', system: 'orange', lines: ['Google Ads', 'Meta Ads', 'Performance Max'] },
  { key: 'youtube', title: 'YouTube', glyph: 'play', system: 'pink', lines: ['Strategy', 'Optimization', 'Growth'] },
  { key: 'growth', title: 'Growth', glyph: 'rise', system: 'lime', lines: ['Measure', 'Optimize', 'Scale'] },
  { key: 'reporting', title: 'Reporting', glyph: 'pie', system: 'cyan', lines: ['Dashboards', 'Insights', 'ROI'] },
];

/** Orbital ring labels (rendered around the 3D platform base). */
export const ringLabels = ['STRATEGY', 'CONTENT', 'PAID MEDIA', 'GROWTH', 'REPORTING'];

/**
 * Hero performance strip — command-center metric cards.
 * `spark` is a 0..1 series for the mini sparkline. `system` = accent colour.
 */
export const perfStrip = [
  { value: '24.6M+', label: 'YouTube views', system: 'pink', icon: 'youtube', source: 'YouTube Studio', verified: true, spark: [0.2, 0.28, 0.24, 0.42, 0.5, 0.46, 0.66, 0.8, 0.74, 0.95] },
  { value: '175.9M+', label: 'Meta impressions', system: 'blue', icon: 'meta', source: 'Meta Business Suite', verified: true, spark: [0.1, 0.22, 0.35, 0.3, 0.52, 0.6, 0.58, 0.78, 0.86, 1] },
  { value: '117.1M+', label: 'Google / YT impressions', system: 'lime', icon: 'google', source: 'Google Ads', verified: true, spark: [0.3, 0.26, 0.44, 0.5, 0.48, 0.64, 0.72, 0.68, 0.9, 0.96] },
  { value: '1.01M+', label: 'Total clicks', system: 'violet', icon: 'click', source: 'Google Ads', verified: true, spark: [0.18, 0.3, 0.26, 0.4, 0.52, 0.5, 0.62, 0.78, 0.82, 0.94] },
  { value: '17.2M+', label: 'TrueView views', system: 'orange', icon: 'play', source: 'Google Ads', verified: true, spark: [0.22, 0.3, 0.42, 0.38, 0.55, 0.62, 0.7, 0.82, 0.8, 0.98] },
  { value: '29.9M+', label: 'Total interactions', system: 'pink', icon: 'bars', source: 'Google Ads', verified: true, spark: [0.14, 0.24, 0.34, 0.46, 0.44, 0.6, 0.7, 0.76, 0.88, 1] },
  { value: 'PKR 30M+', label: 'Google Ads managed', system: 'cyan', icon: 'money', source: 'Google Ads', verified: true, spark: [0.2, 0.34, 0.3, 0.5, 0.58, 0.64, 0.72, 0.8, 0.9, 0.97] },
  { value: 'USD 75K+', label: 'Social ads managed', system: 'gold', icon: 'money', source: 'Ad accounts', verified: true, spark: [0.24, 0.3, 0.4, 0.48, 0.5, 0.62, 0.68, 0.8, 0.86, 0.95] },
];

/** Right-hand hero experience panel. */
export const expPanel = {
  stats: [
    { value: '8+', label: 'Years experience' },
    { value: '30', label: 'Concurrent campaigns' },
  ],
  tagline: 'Multi-platform expert',
  platforms: ['google', 'meta', 'youtube', 'tiktok', 'x', 'snapchat'],
};

/** Hero brand strip. */
export const brandStrip = {
  title: ['Brands', 'I work with'],
  brands: [
    { name: 'Vie (Pvt) Ltd.' },
    { name: 'Gatay Chalo' },
    { name: 'Eva Foods' },
    { name: 'Livvividly' },
    { name: 'Dancing Dishes' },
    { name: 'Bazm-e-Tajalli' },
    { name: 'Spotlight Spa & Saloon' },
  ],
};

/** Animated metrics section (deeper detail). */
export const metrics = [
  { value: '24.6M+', label: 'YouTube views', note: 'Gatay Chalo S1 · YouTube Studio', system: 'pink', verified: true },
  { value: '255.7K', label: 'Watch hours', note: 'YouTube Studio', system: 'pink', verified: true },
  { value: '25.9K+', label: 'Subscribers gained', note: 'YouTube Studio', system: 'pink', verified: true },
  { value: '175.9M+', label: 'Meta impressions', note: 'Meta Business Suite', system: 'blue', verified: true },
  { value: '31.4M+', label: 'Meta reach', note: 'Meta Business Suite', system: 'blue', verified: true },
  { value: '117.1M+', label: 'Google / YouTube impressions', note: 'Google Ads', system: 'lime', verified: true },
  { value: '17.2M+', label: 'TrueView views', note: 'Google Ads', system: 'orange', verified: true },
  { value: '1.01M+', label: 'Clicks', note: 'Google Ads', system: 'violet', verified: true },
  { value: '29.9M+', label: 'Interactions', note: 'Google Ads', system: 'pink', verified: true },
  { value: '5.6x', label: 'Avg. frequency', note: 'Meta dashboard snapshot', system: 'blue', verified: true },
  { value: 'PKR 30M+', label: 'Google Ads managed', note: 'Campaign spend under management', system: 'cyan', verified: true },
  { value: 'USD 75K+', label: 'Social ads managed', note: 'Across ad accounts', system: 'gold', verified: true },
];

/** Paid-media command center. */
export const paidMedia = {
  intro: 'I manage media. I measure everything.',
  google: {
    platform: 'Google / YouTube',
    system: 'lime',
    stats: [
      { value: '117.1M+', label: 'Impressions', verified: true },
      { value: '17.2M+', label: 'TrueView views', verified: true },
      { value: '1.01M+', label: 'Clicks', verified: true },
      { value: '29.9M+', label: 'Interactions', verified: true },
      { value: 'PKR 30M+', label: 'Google Ads managed', verified: true },
    ],
  },
  meta: {
    platform: 'Meta',
    system: 'blue',
    stats: [
      { value: '175.9M+', label: 'Impressions', verified: true },
      { value: '31.4M+', label: 'Reach', verified: true },
      { value: '5.6x', label: 'Average frequency', verified: true },
      { value: 'PKR 8.49M+', label: 'Displayed campaign spend', verified: true },
    ],
  },
  note: 'Figures are dashboard snapshots for the reported campaign periods. TikTok, X and LinkedIn performance — data update pending.',
  levers: ['CTR', 'CPC', 'CPM', 'CPA', 'ROAS', 'ROI', 'Reach', 'Frequency', 'Engagement', 'Retention'],
};

/** Brand ecosystem — VIE at the centre, brands connected around it. */
export const ecosystem = {
  heading: ['One person.', 'Multiple brands.', 'One growth system.'],
  centre: { name: 'Vie (Private) Limited', slug: 'vie', role: 'Senior Social Media Manager — multi-brand digital operator', website: 'https://viepk.com', socials: { facebook: 'https://facebook.com/vie.pvtltd', instagram: 'https://instagram.com/vie.pvtltd', tiktok: 'https://tiktok.com/@viepvtltd', x: 'https://x.com/viepvtltd', linkedin: 'https://linkedin.com/company/viepvtltd' } },
  brands: [
    { name: 'Gatay Chalo', slug: 'gatay-chalo', system: 'pink', kind: 'Entertainment property — Season 1', work: 'Social, content, paid media, growth, platform management, campaign execution', website: 'https://gataychalo.com', socials: { facebook: 'https://facebook.com/gataychalooffical', instagram: 'https://instagram.com/gataychalo', tiktok: 'https://tiktok.com/@gataychalo', x: 'https://x.com/gataychalo', linkedin: 'https://linkedin.com/company/gataychalo' }, featured: true },
    { name: 'Eva Foods', slug: 'eva-foods', system: 'orange', kind: 'Main sponsor — Gatay Chalo S1', work: 'Social media management via Vie during the sponsorship; brand integration & content', website: 'https://www.youtube.com/@evakitchen8191', socials: { facebook: 'https://www.facebook.com/EvaCookingOil', youtube: 'https://www.youtube.com/@evakitchen8191' } },
    { name: 'Livvividly', slug: 'livvividly', system: 'violet', kind: 'Lifestyle brand', work: 'Social media strategy, content & paid support', website: 'https://livvividly.com', socials: { facebook: 'https://facebook.com/LivVividly365', instagram: 'https://instagram.com/livvividly365', tiktok: 'https://tiktok.com/@livvividly365', x: 'https://x.com/livvividly365', linkedin: 'https://linkedin.com/company/livvividly365' } },
    { name: 'Dancing Dishes', slug: 'dancing-dishes', system: 'gold', kind: 'Food & lifestyle content', work: 'Social media strategy, content & campaigns', website: 'https://dancingdishes.pk', socials: { facebook: 'https://facebook.com/dancingdishesvie', instagram: 'https://instagram.com/dancing_dishes', tiktok: 'https://tiktok.com/@dancing_dishes', x: 'https://x.com/Dancing_Dishes', linkedin: 'https://linkedin.com/company/dancingdishesvie' } },
    { name: 'Bazm-e-Tajalli', slug: 'bazm-e-tajalli', system: 'cyan', kind: 'Cultural / arts content', work: 'Social media strategy, content & campaigns', website: 'https://bazmetajalli.com', socials: { facebook: 'https://facebook.com/bazmetajalli', instagram: 'https://instagram.com/bazmetajalli', tiktok: 'https://tiktok.com/@bazmetajalli', x: 'https://x.com/BazmeTajalli', linkedin: 'https://linkedin.com/company/bazmetajalli' } },
    { name: 'Spotlight Salon & Spa', slug: 'spotlight', system: 'lime', kind: 'Beauty & wellness', work: 'Social media management, content & local campaigns' },
    { name: 'Smart Almonds', slug: 'smart-almonds', system: 'violet', kind: 'Kids learning & story channel', work: 'Content systems, social media and audience growth', website: 'https://smartalmonds.tv', socials: { facebook: 'https://facebook.com/SmartAlmonds', instagram: 'https://instagram.com/smart_almonds', tiktok: 'https://tiktok.com/@smartalmonds', x: 'https://x.com/Smart_almonds', linkedin: 'https://linkedin.com/company/smart-almonds' } },
    { name: 'interGraphics', slug: 'intergraphics', system: 'blue', kind: 'Creative and advertising agency', work: 'Promotional content for real estate, brands and corporate clients', website: 'https://intergraphicscna.com' },
  ],
};

/** VIE experience. */
export const experience = {
  company: 'Vie (Private) Limited',
  role: 'Senior Social Media Manager',
  dates: '2024 – Present',
  positioning: 'I managed the digital execution and performance layer across multiple brands as a single operator.',
  responsibilities: [
    'Social media strategy', 'Content management', 'Platform management', 'Paid media',
    'Bulk campaign management', 'Budget optimization', 'Campaign expansion', 'Performance analysis',
    'Reporting', 'Content planning', 'Publishing', 'Audience growth',
  ],
  timeline: [
    { role: 'Senior Social Media Manager', org: 'Vie (Private) Limited', dates: '2024 – Present', points: ['Lead multi-brand social strategy, paid-media planning, budgets and reporting.', 'Independently ran up to 30 concurrent campaigns across accounts.', 'Managed PKR 30M in Google Ads spend and USD 75K+ in social advertising.'] },
    { role: 'Social Media Marketing Manager', org: 'ABS Shipping & Logistics', dates: 'Jan 2023 – Aug 2023', points: ['Content planning, scheduling, publishing and community engagement.', 'Executed Facebook Ads with audience targeting and budget control.'] },
    { role: 'Senior Social Media Executive', org: 'Leolax', dates: 'Aug 2019 – Dec 2022', points: ['Daily content creation, publishing and social workflows across brand profiles.', 'Supported paid campaigns, engagement and profile optimisation.'] },
    { role: 'Social Media Engagement Coordinator', org: 'Sindh Youth Services (NGO)', dates: 'Jan 2018 – Jun 2019', points: ['Advocacy-focused social strategies and community outreach.', 'Field communications and structured engagement planning.'] },
  ],
  education: [
    { credential: 'BS, Media Sciences', org: 'Iqra University, Karachi', year: '2021' },
    { credential: 'Intermediate', org: 'Govt. (B) Degree College, Mithi', year: '2015' },
  ],
  languages: ['English', 'Urdu', 'Sindhi'],
};

/** Gatay Chalo flagship case study. */
export const caseStudy = {
  name: 'Gatay Chalo',
  season: 'Season 1',
  subtitle: 'Turning an entertainment property into a digital audience engine.',
  roleTags: ['Social Media', 'Content', 'Paid Media', 'Growth', 'Platform Management', 'Campaign Execution'],
  results: [
    { value: '24.6M+', label: 'YouTube views', verified: true },
    { value: '255.7K', label: 'Watch hours', verified: true },
    { value: '25.9K+', label: 'Subscribers', verified: true },
  ],
  topVideos: ['2.3M', '2.0M', '1.2M', '1.1M', '949.6K'],
  phases: [
    { title: 'Starting point', body: 'A new Season 1 entertainment property with no established digital audience.' },
    { title: 'Content system', body: 'A repeatable calendar — episodes, clips, shorts and reaction cuts mapped to release windows.' },
    { title: 'Distribution', body: 'Multi-platform publishing across YouTube, Meta, TikTok and X with format-specific edits.' },
    { title: 'Paid amplification', body: 'YouTube + Meta campaigns pushing views, watch-time and subscribers — measured on cost per outcome.' },
    { title: 'Audience growth', body: 'Compounding subscribers and returning viewers, not one-off spikes.' },
    { title: 'Result', body: '24.6M+ views · 255.7K watch hours · 25.9K+ subscribers on YouTube (Studio-verified).' },
  ],
  note: 'YouTube figures verified from YouTube Studio. Top-video numbers as shown in supplied screenshots.',
};

/** Eva Foods connected case study. */
export const evaCase = {
  title: 'Eva Foods × Gatay Chalo',
  body: 'Eva Foods / Eva Industries was the main sponsor of Gatay Chalo Season 1. Through Vie (Private) Limited I managed the Eva Foods social media profiles during the sponsorship — brand integration into the entertainment ecosystem, content, campaigns, sponsor visibility and audience distribution.',
  tags: ['Brand integration', 'Social media management', 'Content', 'Campaigns', 'Audience distribution', 'Sponsor visibility'],
  note: 'Eva-specific performance figures — data update pending.',
};

/** What I can do for your brand — six service environments. */
export const services = [
  {
    n: '01', title: 'Social Media Growth', system: 'pink',
    problem: 'Accounts posting with no system, no compounding audience.',
    strategy: 'Platform-by-platform strategy tied to one business objective.',
    execution: ['Platform strategy', 'Content calendars', 'Publishing systems', 'Community systems'],
    measurement: 'Follower growth, returning viewers, engagement rate.',
    outcome: 'A repeatable growth engine, not one-off spikes.',
  },
  {
    n: '02', title: 'Performance Marketing', system: 'orange',
    problem: 'Ad spend with no clear line to a result.',
    strategy: 'Full-funnel structure with disciplined testing and scaling.',
    execution: ['Google Ads', 'YouTube Ads', 'Meta Ads', 'TikTok · X · Snapchat', 'Budget allocation', 'Testing & scaling'],
    measurement: 'CPC, CPA, CTR, ROAS, ROI.',
    outcome: 'Spend that scales toward the formats that convert.',
  },
  {
    n: '03', title: 'Content Strategy', system: 'violet',
    problem: 'Content made ad-hoc, off-brand, hard to scale.',
    strategy: 'Content architecture that many accounts can run in parallel.',
    execution: ['Content architecture', 'Creative direction', 'Short-form', 'Long-form', 'Cross-platform distribution'],
    measurement: 'Output consistency, watch-through, save/share rate.',
    outcome: 'Multi-brand content at volume without quality drift.',
  },
  {
    n: '04', title: 'YouTube Growth', system: 'pink',
    problem: 'Uploads with weak packaging and no channel strategy.',
    strategy: 'Channel strategy + packaging + audience development loop.',
    execution: ['Channel strategy', 'Metadata', 'Thumbnails', 'Shorts', 'Audience development', 'Content optimization'],
    measurement: 'Impressions CTR, average view duration, subscribers.',
    outcome: 'Compounding watch-time and subscriber growth.',
  },
  {
    n: '05', title: 'Paid Media Management', system: 'cyan',
    problem: 'Campaigns launched and left; budgets drifting.',
    strategy: 'Daily optimisation against cost-per-outcome across platforms.',
    execution: ['Build & launch', 'Audience & placement testing', 'Budget pacing', 'Bid strategy', 'Scaling winners'],
    measurement: 'CPA, ROAS, blended efficiency.',
    outcome: 'Every rupee and dollar pointed at a measured result.',
  },
  {
    n: '06', title: 'Analytics & Optimization', system: 'lime',
    problem: 'Reporting that describes the past but never guides the next move.',
    strategy: 'Reporting that ties spend to result and names the next decision.',
    execution: ['Dashboards', 'Attribution view', 'Cohort & retention', 'Weekly optimisation notes'],
    measurement: 'CTR, CPC, CPM, CPA, ROAS, ROI, reach, frequency, engagement, retention.',
    outcome: 'Decisions, not just charts.',
  },
];

/** "How I think" philosophy. */
export const philosophy = {
  lines: ['Strategy is the plan.', 'Execution is the engine.', 'Data is the compass.', 'Growth is the result.'],
  body: 'I don’t optimise for vanity metrics alone. I look at attention, intent, conversion, efficiency, retention and scale.',
};

/** Tools / platform universe. */
export const tools = {
  centre: 'Digital Stack',
  items: ['Google Ads', 'YouTube', 'Meta', 'TikTok', 'X', 'Snapchat', 'LinkedIn', 'WordPress', 'Elementor', 'Google Analytics', 'Meta Business Suite', 'TikTok Business Center'],
};

export const contact = {
  heading: ['Ready to', 'build growth?'],
  body: 'Remote collaboration available worldwide. Tell me what you’re trying to grow.',
  ctaPrimary: { label: 'Let’s grow together', href: 'mailto:kdstudio96@gmail.com' },
  ctaSecondary: { label: 'View my case studies', href: '#case-study' },
};

/** Service dropdown options for the contact form. */
export const serviceOptions = [
  'Social media growth',
  'Performance marketing',
  'Content strategy',
  'YouTube growth',
  'Paid media management',
  'Analytics & optimization',
  'Full growth retainer',
  'Not sure yet — need advice',
];
