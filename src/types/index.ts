export type IdeaStatus = 'Draft' | 'Exploring' | 'Building' | 'Submitted';
export type HackathonStatus = 'Planned' | 'Active' | 'Submitted';
export type MemberRole = 'Frontend' | 'Backend' | 'Design' | 'Product' | 'Lead';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  members: Member[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface IdeaSections {
  problem: string;
  solution: string;
  targetUsers: string;
  valueProp: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: IdeaStatus;
  level: number; // 1-10
  progress: number; // 0-100
  hackathonId?: string;
  sections: IdeaSections;
  updatedAt: string;
  tasks: Task[];
  comments: Comment[];
}

export interface PRD {
  ideaId: string;
  overview: string;
  goals: string;
  nonGoals: string;
  userStories: string[];
  mvpScope: string[];
  successMetrics: string[];
  risks: string[];
  openQuestions: string[];
}

export interface TechStack {
  ideaId: string;
  frontend: string[];
  backend: string[];
  infra: string[];
  apis: string[];
  notes: string;
}

export interface Hackathon {
  id: string;
  name: string;
  deadline: string;
  theme: string;
  prizes?: string;
  status: HackathonStatus;
  linkedIdeaIds: string[];
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}