import { create } from 'zustand';
import toast from 'react-hot-toast';
import { Activity, Comment, Hackathon, HackathonStatus, Idea, IdeaSections, IdeaStatus, Member, MemberRole, PRD, Task, TechStack } from '../types';
import { supabase } from '../lib/supabase';

type NewIdeaInput = {
  title: string;
  description: string;
  tags?: string[];
  status?: IdeaStatus;
  level?: number;
  progress?: number;
  sections?: IdeaSections;
};

type NewHackathonInput = {
  name: string;
  theme?: string;
  prizes?: string;
  deadline?: string;
  status?: HackathonStatus;
};

const defaultIdeaSections: IdeaSections = {
  problem: '',
  solution: '',
  targetUsers: '',
  valueProp: ''
};

const toMemberRole = (role?: string): MemberRole => {
  if (!role) return 'Frontend';
  const normalized = role as MemberRole;
  return ['Frontend', 'Backend', 'Design', 'Product', 'Lead'].includes(normalized) ? normalized : 'Frontend';
};

const mapProfile = (row: any): Member => ({
  id: row.id,
  name: row.name,
  role: toMemberRole(row.role),
  avatarUrl: row.avatar_url ?? undefined
});

const mapIdeaRow = (row: any): Idea => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  tags: row.tags ?? [],
  status: (row.status ?? 'Draft') as IdeaStatus,
  level: typeof row.level === 'number' ? row.level : 1,
  progress: typeof row.progress === 'number' ? row.progress : 0,
  hackathonId: row.hackathon_id ?? undefined,
  sections: row.sections ?? defaultIdeaSections,
  updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
  tasks: [],
  comments: []
});

const mapTaskRow = (row: any): Task => ({
  id: row.id,
  text: row.text,
  completed: Boolean(row.completed),
  createdAt: row.created_at ?? new Date().toISOString()
});

const mapCommentRow = (row: any, memberById: Record<string, Member>): Comment => ({
  id: row.id,
  userId: row.user_id,
  userName: memberById[row.user_id]?.name ?? 'Unknown',
  text: row.text,
  createdAt: row.created_at ?? new Date().toISOString()
});

const mapPrdRow = (row: any): PRD => ({
  ideaId: row.idea_id,
  overview: row.overview ?? '',
  goals: row.goals ?? '',
  nonGoals: row.non_goals ?? '',
  userStories: row.user_stories ?? [],
  mvpScope: row.mvp_scope ?? [],
  successMetrics: row.success_metrics ?? [],
  risks: row.risks ?? [],
  openQuestions: row.open_questions ?? []
});

const mapStackRow = (row: any): TechStack => ({
  ideaId: row.idea_id,
  frontend: row.frontend ?? [],
  backend: row.backend ?? [],
  infra: row.infra ?? [],
  apis: row.apis ?? [],
  notes: row.notes ?? ''
});

const mapHackathonRow = (row: any): Hackathon => ({
  id: row.id,
  name: row.name,
  deadline: row.deadline,
  theme: row.theme ?? '',
  prizes: row.prizes ?? undefined,
  status: (row.status ?? 'Planned') as HackathonStatus,
  linkedIdeaIds: []
});

const mapActivityRow = (row: any): Activity => ({
  id: row.id,
  userId: row.user_id ?? '',
  userName: row.user_name ?? 'Unknown',
  action: row.action,
  target: row.target,
  timestamp: row.timestamp ?? new Date().toISOString()
});

const buildHackathonLinks = (ideas: Idea[], hackathons: Hackathon[]) => {
  const links: Record<string, string[]> = {};
  ideas.forEach((idea) => {
    if (!idea.hackathonId) return;
    if (!links[idea.hackathonId]) links[idea.hackathonId] = [];
    links[idea.hackathonId].push(idea.id);
  });
  return hackathons.map((hackathon) => ({
    ...hackathon,
    linkedIdeaIds: links[hackathon.id] ?? []
  }));
};

const fetchCurrentProfile = async (): Promise<Member | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  const user = data.user;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, role, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Failed to fetch profile:', profileError);
    return null;
  }

  if (profile) return mapProfile(profile);

  const fallbackName = user.user_metadata?.name || user.email || 'User';
  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      name: fallbackName,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      role: 'Frontend'
    })
    .select('id, name, role, avatar_url')
    .single();

  if (insertError) {
    console.error('Failed to create profile:', insertError);
    return null;
  }

  return mapProfile(created);
};

interface AppState {
  user: Member | null;
  authReady: boolean;
  members: Member[];
  ideas: Idea[];
  hackathons: Hackathon[];
  prds: Record<string, PRD>;
  stacks: Record<string, TechStack>;
  activities: Activity[];
  loading: boolean;

  // Auth
  initAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEthereum: () => Promise<void>;
  signInWithSolana: () => Promise<void>;

  // Actions
  fetchInitialData: () => Promise<void>;
  
  addIdea: (idea: NewIdeaInput) => Promise<void>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  
  getIdea: (id: string) => Idea | undefined;
  
  updatePRD: (ideaId: string, prd: Partial<PRD>) => Promise<void>;
  getPRD: (ideaId: string) => PRD | undefined;

  updateStack: (ideaId: string, stack: Partial<TechStack>) => Promise<void>;
  getStack: (ideaId: string) => TechStack | undefined;

  linkIdeaToHackathon: (hackathonId: string, ideaId: string) => Promise<void>;
  addHackathon: (hackathon: NewHackathonInput) => Promise<void>;
  updateHackathon: (id: string, updates: Partial<Hackathon>) => Promise<void>;
  deleteHackathon: (id: string) => Promise<void>;

  addTask: (ideaId: string, taskText: string) => Promise<void>;
  toggleTask: (ideaId: string, taskId: string) => Promise<void>;
  deleteTask: (ideaId: string, taskId: string) => Promise<void>;

  addComment: (ideaId: string, text: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  authReady: false,
  members: [],
  ideas: [],
  hackathons: [],
  prds: {},
  stacks: {},
  activities: [],
  loading: false,

  initAuth: async () => {
    set({ authReady: false });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchCurrentProfile();
        set({ user: profile ?? null });
        await get().fetchInitialData();
      }
    } finally {
      set({ authReady: true });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    const profile = await fetchCurrentProfile();
    set({ user: profile ?? null, authReady: true });
    await get().fetchInitialData();
    toast.success('Welcome back!');
  },

  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Sign up failed');

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name: name.trim(),
      role: 'Developer'
    });
    if (profileError) throw profileError;

    const profile = await fetchCurrentProfile();
    set({ user: profile ?? null, authReady: true });
    await get().fetchInitialData();
    toast.success('Account created!');
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ 
      user: null, 
      authReady: true,
      ideas: [], 
      hackathons: [], 
      prds: {}, 
      stacks: {}, 
      members: [], 
      activities: [] 
    });
    toast.success('Signed out');
  },

  signInWithEthereum: async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask or another Ethereum wallet');
      return;
    }

    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: 'ethereum',
      statement: 'Sign in to HackBank - Your vault of brilliant ideas!'
    });

    if (error) throw error;
    
    const profile = await fetchCurrentProfile();
    set({ user: profile ?? null, authReady: true });
    await get().fetchInitialData();
    toast.success('Connected with Ethereum!');
  },

  signInWithSolana: async () => {
    if (typeof window.solana === 'undefined') {
      toast.error('Please install Phantom or another Solana wallet');
      return;
    }

    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: 'solana',
      statement: 'Sign in to HackBank - Your vault of brilliant ideas!'
    });

    if (error) throw error;
    
    const profile = await fetchCurrentProfile();
    set({ user: profile ?? null, authReady: true });
    await get().fetchInitialData();
    toast.success('Connected with Solana!');
  },

  fetchInitialData: async () => {
    set({ loading: true });
    const fetchRows = async <T>(query: PromiseLike<{ data: T[] | null; error: any }>) => {
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    };

    try {
      const [
        ideasData,
        hackathonsData,
        tasksData,
        commentsData,
        prdsData,
        stacksData,
        profilesData,
        activitiesData,
        currentProfile
      ] = await Promise.all([
        fetchRows(supabase.from('ideas').select('*').order('created_at', { ascending: false })),
        fetchRows(supabase.from('hackathons').select('*')),
        fetchRows(supabase.from('tasks').select('*').order('created_at', { ascending: true })),
        fetchRows(supabase.from('comments').select('*').order('created_at', { ascending: true })),
        fetchRows(supabase.from('prds').select('*')),
        fetchRows(supabase.from('tech_stacks').select('*')),
        fetchRows(supabase.from('profiles').select('id, name, role, avatar_url')),
        fetchRows(supabase.from('activities').select('*').order('timestamp', { ascending: false })),
        fetchCurrentProfile()
      ]);

      const members = (profilesData as any[]).map(mapProfile);
      const memberById: Record<string, Member> = {};
      members.forEach((member) => {
        memberById[member.id] = member;
      });

      if (currentProfile && !memberById[currentProfile.id]) {
        members.unshift(currentProfile);
        memberById[currentProfile.id] = currentProfile;
      }

      const tasksByIdea: Record<string, Task[]> = {};
      (tasksData as any[]).forEach((row) => {
        if (!row.idea_id) return;
        const task = mapTaskRow(row);
        if (!tasksByIdea[row.idea_id]) tasksByIdea[row.idea_id] = [];
        tasksByIdea[row.idea_id].push(task);
      });

      const commentsByIdea: Record<string, Comment[]> = {};
      (commentsData as any[]).forEach((row) => {
        if (!row.idea_id) return;
        const comment = mapCommentRow(row, memberById);
        if (!commentsByIdea[row.idea_id]) commentsByIdea[row.idea_id] = [];
        commentsByIdea[row.idea_id].push(comment);
      });

      const ideas = (ideasData as any[]).map(mapIdeaRow).map((idea) => ({
        ...idea,
        tasks: tasksByIdea[idea.id] ?? [],
        comments: commentsByIdea[idea.id] ?? []
      }));

      const prdMap: Record<string, PRD> = {};
      (prdsData as any[]).forEach((row) => {
        prdMap[row.idea_id] = mapPrdRow(row);
      });

      const stackMap: Record<string, TechStack> = {};
      (stacksData as any[]).forEach((row) => {
        stackMap[row.idea_id] = mapStackRow(row);
      });

      const hackathons = buildHackathonLinks(
        ideas,
        (hackathonsData as any[]).map(mapHackathonRow)
      );

      const activities = (activitiesData as any[]).map(mapActivityRow);

      const nextUser = currentProfile ?? get().user;
      set({
        ideas,
        hackathons,
        prds: prdMap,
        stacks: stackMap,
        members,
        activities,
        user: nextUser,
        loading: false
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data from Supabase');
      set({ loading: false });
    }
  },

  addIdea: async (ideaInput) => {
    const title = ideaInput.title?.trim();
    if (!title) {
      toast.error('Idea title is required');
      return;
    }

    const payload = {
      title,
      description: ideaInput.description?.trim() || 'New idea',
      tags: ideaInput.tags ?? [],
      status: ideaInput.status ?? 'Draft',
      level: ideaInput.level ?? 1,
      progress: ideaInput.progress ?? 0,
      sections: ideaInput.sections ?? defaultIdeaSections,
      owner_id: get().user?.id ?? null
    };

    const { data, error } = await supabase
      .from('ideas')
      .insert(payload)
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to create idea:', error);
      toast.error('Failed to create idea');
      return;
    }

    const newIdea = { ...mapIdeaRow(data), tasks: [], comments: [] };
    set((state) => ({
      ideas: [newIdea, ...state.ideas],
      hackathons: buildHackathonLinks([newIdea, ...state.ideas], state.hackathons)
    }));
    toast.success('Idea created!');
  },

  updateIdea: async (id, updates) => {
    const previousIdeas = get().ideas;
    const previousHackathons = get().hackathons;
    set((state) => {
      const ideas = state.ideas.map((idea) =>
        idea.id === id ? { ...idea, ...updates, updatedAt: new Date().toISOString() } : idea
      );
      return { ideas, hackathons: buildHackathonLinks(ideas, state.hackathons) };
    });

    const dbUpdates: any = { ...updates, updated_at: new Date().toISOString() };
    delete dbUpdates.updatedAt;
    delete dbUpdates.tasks;
    delete dbUpdates.comments;
    if (dbUpdates.hackathonId !== undefined) {
      dbUpdates.hackathon_id = dbUpdates.hackathonId;
      delete dbUpdates.hackathonId;
    }

    const { data, error } = await supabase
      .from('ideas')
      .update(dbUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to update idea:', error);
      set({ ideas: previousIdeas, hackathons: previousHackathons });
      toast.error('Failed to update idea');
      return;
    }

    const updated = mapIdeaRow(data);
    set((state) => {
      const existing = state.ideas.find((idea) => idea.id === id);
      const merged = { ...updated, tasks: existing?.tasks ?? [], comments: existing?.comments ?? [] };
      const ideas = state.ideas.map((idea) => (idea.id === id ? merged : idea));
      return { ideas, hackathons: buildHackathonLinks(ideas, state.hackathons) };
    });
    toast.success('Idea updated!');
  },

  deleteIdea: async (id) => {
    const previousIdeas = get().ideas;
    const previousHackathons = get().hackathons;
    set((state) => {
      const ideas = state.ideas.filter((idea) => idea.id !== id);
      return { ideas, hackathons: buildHackathonLinks(ideas, state.hackathons) };
    });

    const { error } = await supabase.from('ideas').delete().eq('id', id);
    if (error) {
      set({ ideas: previousIdeas, hackathons: previousHackathons });
      toast.error('Failed to delete idea');
    } else {
      toast.success('Idea deleted.');
    }
  },

  getIdea: (id) => get().ideas.find((i) => i.id === id),

  updatePRD: async (ideaId, prdUpdates) => {
    // Optimistic
    const previousPRDs = get().prds;
    set((state) => {
      const existing = state.prds[ideaId] || {
        ideaId,
        overview: '', goals: '', nonGoals: '',
        userStories: [], mvpScope: [], successMetrics: [],
        risks: [], openQuestions: []
      };
      return {
        prds: { ...state.prds, [ideaId]: { ...existing, ...prdUpdates } }
      };
    });

    // DB Update
    // Map camelCase keys to snake_case for DB
    const dbPayload: any = {};
    if (prdUpdates.overview !== undefined) dbPayload.overview = prdUpdates.overview;
    if (prdUpdates.goals !== undefined) dbPayload.goals = prdUpdates.goals;
    if (prdUpdates.nonGoals !== undefined) dbPayload.non_goals = prdUpdates.nonGoals;
    if (prdUpdates.userStories !== undefined) dbPayload.user_stories = prdUpdates.userStories;
    if (prdUpdates.mvpScope !== undefined) dbPayload.mvp_scope = prdUpdates.mvpScope;
    if (prdUpdates.successMetrics !== undefined) dbPayload.success_metrics = prdUpdates.successMetrics;
    if (prdUpdates.risks !== undefined) dbPayload.risks = prdUpdates.risks;
    if (prdUpdates.openQuestions !== undefined) dbPayload.open_questions = prdUpdates.openQuestions;

    const { data, error } = await supabase
      .from('prds')
      .upsert({ idea_id: ideaId, ...dbPayload }, { onConflict: 'idea_id' })
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to save PRD changes:', error);
      set({ prds: previousPRDs });
      toast.error('Failed to save PRD changes');
      return;
    }

    set((state) => ({
      prds: { ...state.prds, [ideaId]: mapPrdRow(data) }
    }));
  },

  getPRD: (ideaId) => get().prds[ideaId],

  updateStack: async (ideaId, stackUpdates) => {
    const previousStacks = get().stacks;
    set((state) => {
      const existing = state.stacks[ideaId] || {
        ideaId, frontend: [], backend: [], infra: [], apis: [], notes: ''
      };
      return {
        stacks: { ...state.stacks, [ideaId]: { ...existing, ...stackUpdates } }
      };
    });

    const dbPayload: any = { ...stackUpdates };
    delete dbPayload.ideaId;

    const { data, error } = await supabase
      .from('tech_stacks')
      .upsert({ idea_id: ideaId, ...dbPayload }, { onConflict: 'idea_id' })
      .select('*')
      .single();

    if (error || !data) {
      set({ stacks: previousStacks });
      toast.error('Failed to save stack');
      return;
    }

    set((state) => ({
      stacks: { ...state.stacks, [ideaId]: mapStackRow(data) }
    }));
  },

  getStack: (ideaId) => get().stacks[ideaId],

  linkIdeaToHackathon: async (hackathonId, ideaId) => {
    // Optimistic
    const previousIdeas = get().ideas;
    const previousHackathons = get().hackathons;
    set((state) => {
      const updatedIdeas = state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, hackathonId } : idea
      );
      return {
        ideas: updatedIdeas,
        hackathons: buildHackathonLinks(updatedIdeas, state.hackathons)
      };
    });

    const { data, error } = await supabase
      .from('ideas')
      .update({ hackathon_id: hackathonId, updated_at: new Date().toISOString() })
      .eq('id', ideaId)
      .select('*')
      .single();

    if (error || !data) {
      set({ ideas: previousIdeas, hackathons: previousHackathons });
      toast.error('Failed to link hackathon');
      return;
    }

    const updated = mapIdeaRow(data);
    set((state) => {
      const existing = state.ideas.find((idea) => idea.id === ideaId);
      const merged = { ...updated, tasks: existing?.tasks ?? [], comments: existing?.comments ?? [] };
      const ideas = state.ideas.map((idea) => (idea.id === ideaId ? merged : idea));
      return { ideas, hackathons: buildHackathonLinks(ideas, state.hackathons) };
    });
    toast.success('Linked to hackathon!');
  },

  addHackathon: async (hackathonInput) => {
    if (!hackathonInput.name?.trim()) {
      toast.error('Hackathon name is required');
      return;
    }

    const parsedDeadline = hackathonInput.deadline ? new Date(hackathonInput.deadline) : new Date();
    const deadline = Number.isNaN(parsedDeadline.getTime())
      ? new Date().toISOString()
      : parsedDeadline.toISOString();

    const payload = {
      name: hackathonInput.name.trim(),
      theme: hackathonInput.theme?.trim() || '',
      prizes: hackathonInput.prizes?.trim() || '',
      deadline,
      status: hackathonInput.status ?? 'Planned'
    };

    const { data, error } = await supabase
      .from('hackathons')
      .insert(payload)
      .select('*')
      .single();

    if (error || !data) {
      toast.error('Failed to add hackathon');
      return;
    }

    const newHackathon = mapHackathonRow(data);
    set((state) => ({
      hackathons: [newHackathon, ...state.hackathons]
    }));
    toast.success('Hackathon added!');
  },

  updateHackathon: async (id, updates) => {
    const previousHackathons = get().hackathons;
    set((state) => ({
      hackathons: state.hackathons.map((hackathon) =>
        hackathon.id === id ? { ...hackathon, ...updates } : hackathon
      )
    }));

    const dbUpdates: any = { ...updates };
    delete dbUpdates.linkedIdeaIds;

    const { data, error } = await supabase
      .from('hackathons')
      .update(dbUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      set({ hackathons: previousHackathons });
      toast.error('Failed to update hackathon');
      return;
    }

    const updated = mapHackathonRow(data);
    set((state) => {
      const hackathons = state.hackathons.map((hackathon) =>
        hackathon.id === id ? updated : hackathon
      );
      return { hackathons: buildHackathonLinks(state.ideas, hackathons) };
    });
    toast.success('Hackathon updated!');
  },

  deleteHackathon: async (id) => {
    const previousIdeas = get().ideas;
    const previousHackathons = get().hackathons;
    const affectedIdeas = previousIdeas.filter((idea) => idea.hackathonId === id);

    set((state) => {
      const ideas = state.ideas.map((idea) =>
        idea.hackathonId === id ? { ...idea, hackathonId: undefined } : idea
      );
      const hackathons = state.hackathons.filter((hackathon) => hackathon.id !== id);
      return { ideas, hackathons: buildHackathonLinks(ideas, hackathons) };
    });

    const unlinkPromise =
      affectedIdeas.length > 0
        ? supabase.from('ideas').update({ hackathon_id: null }).eq('hackathon_id', id)
        : Promise.resolve({ error: null });

    const [{ error: unlinkError }, { error: deleteError }] = await Promise.all([
      unlinkPromise as Promise<{ error: any }>,
      supabase.from('hackathons').delete().eq('id', id)
    ]);

    if (unlinkError || deleteError) {
      set({ ideas: previousIdeas, hackathons: previousHackathons });
      toast.error('Failed to delete hackathon');
      return;
    }

    toast.success('Hackathon deleted');
  },

  addTask: async (ideaId, taskText) => {
    const text = taskText.trim();
    if (!text) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        idea_id: ideaId,
        text,
        completed: false
      })
      .select('*')
      .single();

    if (error || !data) {
      toast.error('Failed to save task');
      return;
    }

    const newTask = mapTaskRow(data);
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, tasks: [...idea.tasks, newTask] } : idea
      )
    }));
    toast.success('Task added');
  },

  toggleTask: async (ideaId, taskId) => {
    const previousIdeas = get().ideas;
    const targetTask = previousIdeas
      .find((idea) => idea.id === ideaId)
      ?.tasks.find((task) => task.id === taskId);

    if (!targetTask) return;
    const newStatus = !targetTask.completed;

    set((state) => ({
      ideas: state.ideas.map((idea) => {
        if (idea.id !== ideaId) return idea;
        return {
          ...idea,
          tasks: idea.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: newStatus } : task
          )
        };
      })
    }));

    const { error } = await supabase.from('tasks').update({ completed: newStatus }).eq('id', taskId);
    if (error) {
      set({ ideas: previousIdeas });
      toast.error('Failed to update task');
    }
  },

  deleteTask: async (ideaId, taskId) => {
    const previousIdeas = get().ideas;
    set((state) => ({
      ideas: state.ideas.map(idea => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            tasks: idea.tasks.filter(t => t.id !== taskId)
          };
        }
        return idea;
      })
    }));

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      set({ ideas: previousIdeas });
      toast.error('Failed to delete task');
    }
  },

  addComment: async (ideaId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const user = get().user;
    if (!user) {
      toast.error('Sign in to post a comment');
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        idea_id: ideaId,
        user_id: user.id,
        text: trimmed
      })
      .select('*')
      .single();

    if (error || !data) {
      toast.error('Failed to post comment');
      return;
    }

    const newComment = mapCommentRow(data, { [user.id]: user });
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, comments: [...idea.comments, newComment] } : idea
      )
    }));
    toast.success('Comment posted');
  }
}));
