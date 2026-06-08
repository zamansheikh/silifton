import {
  ArrowRight, ArrowDown, Plus, Check, Search, Dot,
  Home, Zap, Layers, Briefcase, Users, Mail, FileText, Star, Settings,
  Shield, BarChart3, Globe, Smartphone, Server, Code, Cpu, Brush, Cloud,
  Pencil, Trash2, Eye, Bell, ChevronRight, ExternalLink, Download, Filter, Pin, Clock,
  type LucideIcon,
} from "lucide-react";

const MAP = {
  arrow: ArrowRight,
  arrowDown: ArrowDown,
  plus: Plus,
  check: Check,
  search: Search,
  dot: Dot,
  home: Home,
  bolt: Zap,
  layers: Layers,
  briefcase: Briefcase,
  users: Users,
  mail: Mail,
  fileText: FileText,
  star: Star,
  settings: Settings,
  shield: Shield,
  chart: BarChart3,
  globe: Globe,
  phone: Smartphone,
  server: Server,
  code: Code,
  cpu: Cpu,
  brush: Brush,
  cloud: Cloud,
  edit: Pencil,
  trash: Trash2,
  eye: Eye,
  bell: Bell,
  chevron: ChevronRight,
  external: ExternalLink,
  download: Download,
  filter: Filter,
  pin: Pin,
  clock: Clock,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof MAP;

type Props = { name: IconName; size?: number; className?: string; strokeWidth?: number };

export function Icon({ name, size = 16, className, strokeWidth = 1.6 }: Props) {
  const Cmp = MAP[name];
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden />;
}
