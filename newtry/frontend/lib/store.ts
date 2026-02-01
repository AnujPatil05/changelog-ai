/**
 * ZUSTAND STATE MANAGEMENT
 * 
 * Global store for managing application state across components.
 * Demonstrates: typed state, actions, async operations, and persist middleware.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRepos, getJobStatus, JobStatus } from './api';

// ============================================
// TYPES
// ============================================

interface Repository {
    name: string;
    addedAt: string;
    lastSync?: string;
}

interface ActiveJob {
    id: string;
    repoName: string;
    status: JobStatus['status'];
    progress: number;
    error?: string;
}

interface AppState {
    // Repository State
    repositories: Repository[];
    isLoadingRepos: boolean;
    repoError: string | null;

    // Active Jobs State (for changelog generation)
    activeJobs: Record<string, ActiveJob>;

    // UI State
    commandPaletteOpen: boolean;
    sidebarCollapsed: boolean;

    // Repository Actions
    fetchRepositories: () => Promise<void>;
    addRepository: (name: string) => void;
    removeRepository: (name: string) => void;

    // Job Actions
    startJob: (jobId: string, repoName: string) => void;
    updateJobStatus: (jobId: string, status: Partial<ActiveJob>) => void;
    clearJob: (jobId: string) => void;
    pollJobStatus: (jobId: string) => Promise<JobStatus | null>;

    // UI Actions
    toggleCommandPalette: () => void;
    setCommandPaletteOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            repositories: [],
            isLoadingRepos: false,
            repoError: null,
            activeJobs: {},
            commandPaletteOpen: false,
            sidebarCollapsed: false,

            // ----------------------------------------
            // REPOSITORY ACTIONS
            // ----------------------------------------

            fetchRepositories: async () => {
                set({ isLoadingRepos: true, repoError: null });
                try {
                    const repos = await getRepos();
                    set({
                        repositories: repos.map(name => ({
                            name,
                            addedAt: new Date().toISOString(),
                        })),
                        isLoadingRepos: false,
                    });
                } catch (error) {
                    set({
                        repoError: error instanceof Error ? error.message : 'Failed to fetch repositories',
                        isLoadingRepos: false,
                    });
                }
            },

            addRepository: (name: string) => {
                set(state => ({
                    repositories: [
                        ...state.repositories,
                        { name, addedAt: new Date().toISOString() }
                    ],
                }));
            },

            removeRepository: (name: string) => {
                set(state => ({
                    repositories: state.repositories.filter(r => r.name !== name),
                }));
            },

            // ----------------------------------------
            // JOB ACTIONS (Async Changelog Generation)
            // ----------------------------------------

            startJob: (jobId: string, repoName: string) => {
                set(state => ({
                    activeJobs: {
                        ...state.activeJobs,
                        [jobId]: {
                            id: jobId,
                            repoName,
                            status: 'pending',
                            progress: 0,
                        },
                    },
                }));
            },

            updateJobStatus: (jobId: string, status: Partial<ActiveJob>) => {
                set(state => {
                    const existingJob = state.activeJobs[jobId];
                    if (!existingJob) return state;

                    return {
                        activeJobs: {
                            ...state.activeJobs,
                            [jobId]: { ...existingJob, ...status },
                        },
                    };
                });
            },

            clearJob: (jobId: string) => {
                set(state => {
                    const { [jobId]: removed, ...rest } = state.activeJobs;
                    return { activeJobs: rest };
                });
            },

            pollJobStatus: async (jobId: string) => {
                const status = await getJobStatus(jobId);
                if (status) {
                    get().updateJobStatus(jobId, {
                        status: status.status,
                        progress: status.progress || 0,
                        error: status.error,
                    });
                }
                return status;
            },

            // ----------------------------------------
            // UI ACTIONS
            // ----------------------------------------

            toggleCommandPalette: () => {
                set(state => ({ commandPaletteOpen: !state.commandPaletteOpen }));
            },

            setCommandPaletteOpen: (open: boolean) => {
                set({ commandPaletteOpen: open });
            },

            toggleSidebar: () => {
                set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
            },
        }),
        {
            name: 'changelog-ai-store',
            // Only persist UI preferences, not transient data
            partialize: (state) => ({
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);

// ============================================
// SELECTOR HOOKS (for optimized re-renders)
// ============================================

export const useRepositories = () => useAppStore(state => state.repositories);
export const useIsLoadingRepos = () => useAppStore(state => state.isLoadingRepos);
export const useActiveJobs = () => useAppStore(state => state.activeJobs);
export const useCommandPaletteOpen = () => useAppStore(state => state.commandPaletteOpen);

// Get a specific job by ID
export const useJobById = (jobId: string) =>
    useAppStore(state => state.activeJobs[jobId]);

// Check if any jobs are currently processing
export const useHasActiveJobs = () =>
    useAppStore(state =>
        Object.values(state.activeJobs).some(job =>
            job.status === 'pending' || job.status === 'processing'
        )
    );
