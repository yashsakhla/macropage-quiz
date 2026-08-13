export type BusinessGoal = "grow_customers" | "grow_revenue" | "other";

export type OptionKey = "A" | "B" | "C" | "D";

export interface Participant {
  id: string;
  sessionId: string;
  name: string;
  whatsappNumber: string;
  businessName?: string;
  businessCategory?: string;
  goal?: BusinessGoal;
  goalOther?: string;
  score?: number;
  rank?: number;
}

export interface QuizOption {
  key: OptionKey;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  order: number;
  timeLimitSeconds: number;
  dimension: string;
  options: QuizOption[];
  index: number;
  totalQuestions: number;
}

export interface LeaderboardEntry {
  participantId: string;
  name: string;
  businessName?: string;
  score: number;
  rank: number;
}

export type SessionStatus = "draft" | "registration_open" | "in_progress" | "ended";

export interface QuizSession {
  id: string;
  title: string;
  status: SessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  autoSeedQuestions?: boolean;
  createdAt?: string;
}

export interface SessionState {
  sessionId: string;
  title: string;
  status: SessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  hasAnsweredCurrentQuestion: boolean;
}

export interface ParticipantRank {
  rank: number | null;
  score: number;
}

export interface AnalysisReport {
  participantId: string;
  sessionId: string;
  generatedAt: string;
  techScore: number;
  archetype: string;
  dimensionScores: {
    growthMindset: number;
    customerRelationship: number;
    strategicThinking: number;
    investmentDiscipline: number;
    digitalReadiness: number;
  };
  reportJson: {
    headline: string;
    businessSnapshot: string;
    mindsetProfile: string;
    goalRoadmap: string[];
    techRecommendation: string;
  };
}
