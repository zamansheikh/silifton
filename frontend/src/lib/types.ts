export type Service = {
  num: string;
  title: string;
  desc: string;
  icon: string;
  tags: string[];
};

export type PortfolioItem = {
  id: string;
  client: string;
  industry: string;
  title: string;
  year: number;
  span: number;
  status: string;
  thumb: string;
  color: string;
  metric: string;
  image?: string;          // Cloudinary URL — when set, replaces the gradient/letter
  imagePublicId?: string;
  summary?: string;        // 1–2 sentences shown on the card under the title
  body?: string;           // full case-study text rendered on /portfolio/<id> (\n\n splits paragraphs)
};

export type TeamMember = {
  id?: string;       // assigned by backend (kebab slug of name)
  name: string;
  role: string;
  initials: string;
  focus: string;
  avatar?: string;          // Cloudinary URL — replaces initials when set
  avatarPublicId?: string;
};

export type Post = {
  id: string;
  title: string;
  author: string;
  date: string;
  read: string;
  category: string;
  status: "Published" | "Draft";
  views: number;
  excerpt?: string;        // 1–2 sentence teaser shown in cards / lists
  body?: string;           // full post text rendered on /blog/<slug> (\n\n splits paragraphs)
  image?: string;          // Cloudinary cover image — shown on /blog cards + post hero
  imagePublicId?: string;
};

export type Career = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  level: string;
  posted: string;
  status: "Open" | "Closed";
  applicants: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  featured: boolean;
  avatar?: string;          // Cloudinary URL — replaces initials when set
  avatarPublicId?: string;
};

export type Inquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  subject: string;
  budget: string;
  message: string;
  date: string;
  status: "New" | "In review" | "Replied" | "Won" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
};

export type Application = {
  id: string;
  candidate: string;
  email: string;
  role: string;
  stage: string;
  score: number;
  date: string;
  source: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  initials: string;
  you?: boolean;
  avatar?: string;          // Cloudinary URL — replaces initials when set (admin UI only)
  avatarPublicId?: string;
};

export type AnalyticsOverview = {
  kpis: Array<{ label: string; value: number; unit: string; trend: number; spark: number[] }>;
  months: string[];
  sources: Array<{ label: string; value: number; color: string }>;
  activity: Array<{ who: string; action: string; target: string; time: string }>;
};

export type AnalyticsSeries = {
  months: string[];
  visitors: number[];
  inquiries: number[];
  revenue: number[];
  hires: number[];
  sources: Array<{ label: string; value: number; color: string }>;
};
