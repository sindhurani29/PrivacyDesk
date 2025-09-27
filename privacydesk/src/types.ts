export type Status = 'new'|'in_progress'|'waiting'|'done'|'rejected';
export type RequestType = 'access'|'delete'|'export'|'correct';

export interface Request {
  id: string;
  type: RequestType;
  requester: { email: string; name?: string; country?: string };
  submittedAt: string;
  dueAt: string;
  status: Status;
  owner?: string;
}

export interface DsrRequest {
  id: string;
  type: RequestType;
  requester: { name: string; email: string; country?: string };
  submittedAt: string;   // ISO
  dueAt: string;         // ISO (computed by SLA)
  status: 'new'|'in_progress'|'waiting'|'done'|'rejected';
  owner?: string;
  notes: { at: string; who: string; text: string }[];
  attachments: { id: string; name: string; url?: string }[];
  history: { at: string; who: string; action: string; details?: string }[];
}

export interface ConsentRecord {
  id: string; subjectEmail: string;
  purpose: 'marketing'|'analytics'|'support'|'other';
  grantedAt: string; withdrawnAt?: string; channel: 'web'|'email'|'phone'|'paper';
}

