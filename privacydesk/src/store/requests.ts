import { create } from 'zustand/react';
import type { DsrRequest, ConsentRecord } from '../types';
import { db } from '../lib/db';

export interface SettingsState {
  slaDays: Record<'access'|'delete'|'export'|'correct', number>;
  owners: string[];
  templates: string;
}

interface RequestsStore {
  requests: DsrRequest[];
  consents: ConsentRecord[];
  settings: SettingsState;
  load: () => Promise<void>;
  addRequest: (r: Omit<DsrRequest, 'id'|'submittedAt'|'history'|'notes'|'attachments'|'status'> & { status?: DsrRequest['status'] }) => Promise<DsrRequest>;
  updateRequest: (r: DsrRequest) => Promise<void>;
  setOwner: (id: string, owner: string) => Promise<void>;
  addNote: (id: string, text: string, who?: string) => Promise<void>;
  closeRequest: (id: string, status: 'done'|'rejected', details: string, citation?: string) => Promise<void>;
  saveSettings: (s: Partial<SettingsState>) => Promise<void>;
}

export const useRequestsStore = create<RequestsStore>((set, get) => ({
  requests: [],
  consents: [],
  settings: { slaDays: { access: 30, delete: 30, export: 30, correct: 30 }, owners: ['Alex','Priya','Jordan','Sam','Taylor'], templates: '' },
  load: async () => {
    await db.loadSeed();
    // try localStorage first for preview persistence
    const cached = localStorage.getItem('privacydesk-state');
    if (cached) {
      const parsed = JSON.parse(cached);
      set({ requests: parsed.requests ?? [], consents: parsed.consents ?? [], settings: parsed.settings ?? get().settings });
    } else {
      const [requests, consents, settings] = await Promise.all([
        db.requests.getAll(),
        db.consents.getAll(),
        db.settings.get(),
      ]);
      set({ requests, consents, settings: settings ?? get().settings });
    }

    // Ensure demo dataset used in screenshots is present for a consistent preview
    const have = new Set(get().requests.map(r => r.id));
    const toAdd: DsrRequest[] = [];
    const mk = (id: string, type: DsrRequest['type'], submittedAt: string, dueAt: string, status: DsrRequest['status'], owner: string, history: DsrRequest['history']): DsrRequest => ({
      id, type,
      requester: { name: id, email: `${id.split('-')[1].toLowerCase()}@example.com` },
      submittedAt, dueAt, status, owner,
      notes: [], attachments: [], history
    });
    if (!have.has('REQ-1003')) {
      toAdd.push(mk('REQ-1003','export','2025-09-12T18:00:00.000Z','2025-10-12T00:00:00.000Z','waiting','Jordan',[
        { at: '2025-09-12T13:40:00.000Z', who: 'System', action: 'created' },
        { at: '2025-09-12T14:00:00.000Z', who: 'Jordan', action: 'status_changed', details: 'waiting' },
      ]));
    }
    if (!have.has('REQ-1001')) {
      toAdd.push(mk('REQ-1001','access','2025-09-10T10:00:00.000Z','2025-10-10T00:00:00.000Z','in_progress','Alex',[
        { at: '2025-09-11T04:30:00.000Z', who: 'Alex', action: 'status_changed', details: 'in_progress' },
      ]));
    }
    if (!have.has('REQ-1002')) {
      toAdd.push(mk('REQ-1002','delete','2025-09-08T10:00:00.000Z','2025-10-23T00:00:00.000Z','new','Priya',[
        { at: '2025-09-08T10:00:00.000Z', who: 'System', action: 'created' },
      ]));
    }
    if (!have.has('REQ-1004')) {
      toAdd.push(mk('REQ-1004','correct','2025-09-05T10:00:00.000Z','2025-10-05T00:00:00.000Z','done','Sam',[
        { at: '2025-09-20T09:00:00.000Z', who: 'Sam', action: 'closed' },
      ]));
    }
    if (!have.has('REQ-1005')) {
      toAdd.push(mk('REQ-1005','delete','2025-09-02T10:00:00.000Z','2025-10-17T00:00:00.000Z','rejected','Taylor',[
        { at: '2025-09-15T06:00:00.000Z', who: 'Taylor', action: 'rejected' },
      ]));
    }
    if (toAdd.length) {
      for (const r of toAdd) await db.requests.put(r);
      const next = [...get().requests, ...toAdd];
      set({ requests: next });
      localStorage.setItem('privacydesk-state', JSON.stringify({ ...get(), requests: next }));
    }
  },
  addRequest: async (partial) => {
    const now = new Date();
    const id = crypto.randomUUID();
    const req: DsrRequest = {
      id,
      type: partial.type,
      requester: partial.requester,
      submittedAt: now.toISOString(),
      dueAt: partial.dueAt,
      status: partial.status ?? 'new',
      owner: partial.owner,
      notes: [],
      attachments: [],
      history: [{ at: now.toISOString(), who: 'system', action: 'created' }]
    };
    await db.requests.put(req);
  const next = [...get().requests, req];
  set({ requests: next });
  localStorage.setItem('privacydesk-state', JSON.stringify({ ...get(), requests: next }));
    return req;
  },
  updateRequest: async (r) => {
    await db.requests.put(r);
  const next = get().requests.map(x => x.id === r.id ? r : x);
  set({ requests: next });
  localStorage.setItem('privacydesk-state', JSON.stringify({ ...get(), requests: next }));
  },
  setOwner: async (id, owner) => {
    const req = get().requests.find(r => r.id === id);
    if (!req) return;
    const now = new Date().toISOString();
    const updated: DsrRequest = { ...req, owner, history: [...req.history, { at: now, who: 'you', action: 'owner_set', details: owner }] };
    await db.requests.put(updated);
  const next = get().requests.map(r => r.id === id ? updated : r);
  set({ requests: next });
  localStorage.setItem('privacydesk-state', JSON.stringify({ ...get(), requests: next }));
  },
  addNote: async (id, text, who = 'you') => {
    const req = get().requests.find(r => r.id === id);
    if (!req) return;
    const note = { at: new Date().toISOString(), who, text };
    const updated: DsrRequest = { ...req, notes: [...req.notes, note] };
    await db.requests.put(updated);
    const next = get().requests.map(r => r.id === id ? updated : r);
    set({ requests: next });
    localStorage.setItem('privacydesk-state', JSON.stringify({ ...get(), requests: next }));
  },
  closeRequest: async (id, status, details, citation) => {
    const req = get().requests.find(r => r.id === id);
    if (!req) return;
    const now = new Date().toISOString();
    const updated: DsrRequest = { ...req, status, history: [...req.history, { at: now, who: 'you', action: status === 'done' ? 'closed' : 'rejected', details: `${details}${citation ? ` (${citation})` : ''}` }] };
    await db.requests.put(updated);
  const next = get().requests.map(r => r.id === id ? updated : r);
  set({ requests: next });
  localStorage.setItem('privacydesk-state', JSON.stringify({ ...get(), requests: next }));
  },
  saveSettings: async (s) => {
    const next = { ...get().settings, ...s, slaDays: { ...get().settings.slaDays, ...(s.slaDays ?? {}) } };
    await db.settings.put(next);
    set({ settings: next });
  localStorage.setItem('privacydesk-state', JSON.stringify({ ...get(), settings: next }));
  },
}));
