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
