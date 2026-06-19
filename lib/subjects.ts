import {
  Microscope, Dna, FlaskConical, Atom, Brain, Stethoscope, HeartPulse, Pill,
  Calculator, Briefcase, ScrollText, Globe, BookOpen, GraduationCap, FileText,
} from 'lucide-react';

export const SUBJECTS = [
  { name: 'Science Flashcards',    icon: Microscope,   href: '/science-flashcards' },
  { name: 'Biology Flashcards',    icon: Dna,          href: '/biology-flashcards' },
  { name: 'Chemistry Flashcards',  icon: FlaskConical,  href: '/chemistry-flashcards' },
  { name: 'Physics Flashcards',    icon: Atom,          href: '/physics-flashcards' },
  { name: 'Psychology Flashcards', icon: Brain,         href: '/psychology-flashcards' },
  { name: 'Medical Flashcards',    icon: Stethoscope,   href: '/medical-flashcards' },
  { name: 'Anatomy Flashcards',    icon: HeartPulse,    href: '/anatomy-flashcards' },
  { name: 'Nursing Flashcards',    icon: Pill,          href: '/nursing-flashcards' },
  { name: 'Maths Flashcards',      icon: Calculator,    href: '/maths-flashcards' },
  { name: 'Business Flashcards',   icon: Briefcase,     href: '/business-flashcards' },
  { name: 'History Flashcards',    icon: ScrollText,    href: '/history-flashcards' },
  { name: 'Geography Flashcards',  icon: Globe,         href: '/geography-flashcards' },
];

export const CURRICULA = [
  { name: 'GCSE Flashcards',    icon: BookOpen,      href: '/gcse-flashcards' },
  { name: 'A-Level Flashcards', icon: GraduationCap, href: '/a-level-flashcards' },
  { name: 'AQA Flashcards',     icon: FileText,      href: '/aqa-flashcards' },
];
