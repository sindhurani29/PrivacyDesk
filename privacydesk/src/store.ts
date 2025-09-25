import { create } from 'zustand/react';
import type { Request, RequestType, Status } from './types';
import { seedRequests } from './data/seed';

export interface Settings {
  slaDays: Record<RequestType, number>;
}

export interface DsrRequest extends Request {
  notes?: string;
  idProofReceived?: boolean;
}

interface StoreState {
  requests: DsrRequest[];
  settings: Settings;
  addRequest: (input: Omit<DsrRequest, 'id' | 'submittedAt' | 'dueAt' | 'status'> & Partial<Pick<DsrRequest, 'status'>>) => DsrRequest;
}

function nextId(existing: { id: string }[]): string {
  const max = existing
    .map((r) => Number(String(r.id).replace(/[^0-9]/g, '')) || 0)
    .reduce((a, b) => Math.max(a, b), 1000);
  return `REQ-${max + 1}`;
}

export const useStore = create<StoreState>((set, get) => ({
  requests: seedRequests as DsrRequest[],
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
    } as DsrRequest;
    set({ requests: [created, ...requests] });
    return created;
  },
}));
