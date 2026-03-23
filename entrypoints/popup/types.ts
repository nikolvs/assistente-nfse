export type PageInfo = { total: number; count: number; totalPages: number };

export type AppState =
  | { phase: 'loading' }
  | { phase: 'unsupported' }
  | { phase: 'file-access-needed' }
  | { phase: 'site-access-needed' }
  | { phase: 'ready'; info: PageInfo }
  | { phase: 'summing'; info: PageInfo; current: number; total: number; accumulated: number }
  | { phase: 'done'; info: PageInfo; grandTotal: number; grandCount: number; pages: number }
  | { phase: 'error'; info?: PageInfo; message: string };
