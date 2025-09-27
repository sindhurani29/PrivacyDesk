import type { Request } from '../types';

export const seedRequests: Request[] = [
  { id: 'REQ-1001', type: 'access',
    requester: { email: 'mina@example.com', name: 'Mina Kim', country: 'US' },
    submittedAt: '2025-09-10T14:20:00Z', dueAt: '2025-10-10T00:00:00Z',
    status: 'in_progress', owner: 'Alex' },
  { id: 'REQ-1002', type: 'delete',
    requester: { email: 'lee@example.com', name: 'Lee Wong', country: 'CA' },
    submittedAt: '2025-09-08T09:12:00Z', dueAt: '2025-10-23T00:00:00Z',
    status: 'new', owner: 'Priya' },
  { id: 'REQ-1003', type: 'export',
    requester: { email: 'ravi@example.com', name: 'Ravi Rao', country: 'UK' },
    submittedAt: '2025-09-12T18:40:00Z', dueAt: '2025-10-12T00:00:00Z',
    status: 'waiting', owner: 'Jordan' },
  { id: 'REQ-1004', type: 'correct',
    requester: { email: 'ana@example.com', name: 'Ana Silva', country: 'PT' },
    submittedAt: '2025-09-05T11:00:00Z', dueAt: '2025-10-05T00:00:00Z',
    status: 'done', owner: 'Sam' },
  { id: 'REQ-1005', type: 'delete',
    requester: { email: 'chris@example.com', name: 'Chris Lee', country: 'US' },
    submittedAt: '2025-09-02T08:05:00Z', dueAt: '2025-10-17T00:00:00Z',
    status: 'rejected', owner: 'Taylor' }
];
