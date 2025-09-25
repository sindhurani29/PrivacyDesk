import { create } from 'zustand/react';
import type { Request, RequestType, Status } from './types';
import { seedRequests } from './data/seed';

export interface Settings {
  slaDays: Record<RequestType, number>;
}

export interface DsrRequest extends Request {
  notes?: string;
  idProofReceived?: boolean;
  notesList: string[];
  evidence: string[];
  history: string[];
}

interface StoreState {
  requests: DsrRequest[];
  settings: Settings;
  addRequest: (input: Omit<DsrRequest, 'id' | 'submittedAt' | 'dueAt' | 'status'> & Partial<Pick<DsrRequest, 'status'>>) => DsrRequest;
  setOwner: (id: string, owner: string) => void;
  addNote: (id: string, note: string) => void;
  closeRequest: (id: string, decision: Extract<Status, 'done' | 'rejected'>, rationale: string, citationUrl: string) => void;
}

function nextId(existing: { id: string }[]): string {
  const max = existing
    .map((r) => Number(String(r.id).replace(/[^0-9]/g, '')) || 0)
    .reduce((a, b) => Math.max(a, b), 1000);
  return `REQ-${max + 1}`;
}

export const useStore = create<StoreState>((set, get) => ({
  requests: (seedRequests as Request[]).map((r) => ({
    ...(r as any),
    notesList: [],
    evidence: [],
    history: [],
  })) as DsrRequest[],
  settings: {
    slaDays: {
      access: 30,
      delete: 30,
      export: 30,
      correct: 30,
    },
  },
  addRequest: (input) => {
    const { requests } = get();
    const id = nextId(requests);
    const submittedAt = new Date().toISOString();
    const status: Status = (input.status as Status) ?? 'new';
    const created: DsrRequest = {
      ...input,
      id,
      submittedAt,
      status,
      // ensure dueAt provided by caller; can be filled before calling
      dueAt: (input as any).dueAt,
      notesList: (input as any).notesList ?? [],
      evidence: (input as any).evidence ?? [],
      history: (input as any).history ?? [],
    } as DsrRequest;
    set({ requests: [created, ...requests] });
    return created;
  },
  setOwner: (id, owner) => {
    set((state) => ({
      requests: state.requests.map((r) => (r.id === id ? { ...r, owner } : r)),
    }));
  },
  addNote: (id, note) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? { ...r, notesList: [note, ...(r.notesList ?? [])], history: [`Note added: ${new Date().toISOString()}`, ...(r.history ?? [])] }
          : r
      ),
    }));
  },
  closeRequest: (id, decision, rationale, citationUrl) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: decision,
              history: [
                `Closed as ${decision} @ ${new Date().toISOString()} | rationale: ${rationale} | citation: ${citationUrl}`,
                ...(r.history ?? []),
              ],
            }
          : r
      ),
    }));
  },
}));
