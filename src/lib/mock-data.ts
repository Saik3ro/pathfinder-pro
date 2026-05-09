import { BookOpen, Code2, Languages, Palette, Brain, Music } from "lucide-react";

export type Milestone = {
  id: string;
  title: string;
  description: string;
  content: string;
  completed: boolean;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  topic: string;
  icon: typeof BookOpen;
  accent: string;
  milestones: Milestone[];
  flashcardDecks: { id: string; title: string; cards: number }[];
};

export const mockUser = {
  name: "Alex Chen",
  email: "alex@pathlearn.app",
  initials: "AC",
};

export const mockPaths: LearningPath[] = [
  {
    id: "react-mastery",
    title: "React Mastery",
    description: "From components to advanced patterns and performance.",
    topic: "Frontend",
    icon: Code2,
    accent: "from-indigo-500 to-violet-500",
    milestones: [
      { id: "m1", title: "JSX & Components", description: "The building blocks", content: "Understand JSX syntax, components, props, and composition.", completed: true },
      { id: "m2", title: "State & Effects", description: "Reactivity primitives", content: "useState, useEffect lifecycles, and avoiding pitfalls.", completed: true },
      { id: "m3", title: "Context & Reducers", description: "Sharing state", content: "useContext, useReducer, and when to lift state up.", completed: true },
      { id: "m4", title: "Custom Hooks", description: "Reusable logic", content: "Extract behavior into composable hooks.", completed: true },
      { id: "m5", title: "Performance", description: "Memoization & profiling", content: "useMemo, useCallback, React.memo, and the profiler.", completed: false },
      { id: "m6", title: "Suspense & Concurrent", description: "Modern React", content: "Suspense, transitions, and streaming.", completed: false },
      { id: "m7", title: "Server Components", description: "The new frontier", content: "RSC mental model and data flow.", completed: false },
      { id: "m8", title: "Testing", description: "Confidence at scale", content: "Vitest, RTL, and integration tests.", completed: false },
      { id: "m9", title: "Architecture", description: "Project structure", content: "Folder layouts, boundaries, and dependency direction.", completed: false },
      { id: "m10", title: "Capstone Project", description: "Build & ship", content: "Plan, build, and deploy a polished app.", completed: false },
    ],
    flashcardDecks: [
      { id: "d1", title: "Hooks Cheatsheet", cards: 24 },
      { id: "d2", title: "Performance Tricks", cards: 18 },
    ],
  },
  {
    id: "spanish-a2",
    title: "Spanish A2",
    description: "Conversational Spanish with practical phrases.",
    topic: "Language",
    icon: Languages,
    accent: "from-teal-500 to-emerald-500",
    milestones: Array.from({ length: 8 }).map((_, i) => ({
      id: `s${i}`,
      title: `Unit ${i + 1}`,
      description: "Vocabulary & grammar",
      content: "Practice dialogues, grammar drills, and listening exercises.",
      completed: i < 3,
    })),
    flashcardDecks: [{ id: "ds1", title: "Common Verbs", cards: 50 }],
  },
  {
    id: "design-systems",
    title: "Design Systems",
    description: "Tokens, components, and scalable UI foundations.",
    topic: "Design",
    icon: Palette,
    accent: "from-pink-500 to-rose-500",
    milestones: Array.from({ length: 6 }).map((_, i) => ({
      id: `d${i}`,
      title: `Chapter ${i + 1}`,
      description: "Design fundamentals",
      content: "Build the system one layer at a time.",
      completed: i < 1,
    })),
    flashcardDecks: [],
  },
];

export const topicIcons = { BookOpen, Code2, Languages, Palette, Brain, Music };