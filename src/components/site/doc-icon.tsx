import {
  Baby, Fingerprint, CreditCard, Vote, Car, Plane, FolderLock, Landmark, HeartPulse,
  HandHeart, GraduationCap, Wrench, Briefcase, PiggyBank, Receipt, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "birth-certificate": Baby,
  aadhaar: Fingerprint,
  "pan-card": CreditCard,
  "voter-id": Vote,
  "driving-licence": Car,
  passport: Plane,
  digilocker: FolderLock,
  "bank-account": Landmark,
  abha: HeartPulse,
  "organ-donor": HandHeart,
  scholarship: GraduationCap,
  "skill-india": Wrench,
  "career-service": Briefcase,
  "epfo-uan": PiggyBank,
  "income-tax": Receipt,
};

export function DocIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? FolderLock;
  return <Icon className={className} aria-hidden />;
}
