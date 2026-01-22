// Redux Offline Support Slice
// Note: This requires @reduxjs/toolkit to be installed in your project
// For now, we'll provide the interface and implementation pattern

export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
}

export interface OfflineState {
  isOnline: boolean;
  queue: OfflineAction[];
  lastSyncTime: number | null;
  syncInProgress: boolean;
}

export const initialOfflineState: OfflineState = {
  isOnline: true,
  queue: [],
  lastSyncTime: null,
  syncInProgress: false,
};

// Reducer functions for use with Redux
export const offlineReducers = {
  setOnlineStatus: (state: OfflineState, isOnline: boolean) => {
    state.isOnline = isOnline;
  },
  queueAction: (state: OfflineState, action: Omit<OfflineAction, 'id' | 'timestamp' | 'status'>) => {
    const newAction: OfflineAction = {
      id: `${Date.now()}-${Math.random()}`,
      ...action,
      timestamp: Date.now(),
      status: 'pending',
    };
    state.queue.push(newAction);
  },
  removeQueuedAction: (state: OfflineState, actionId: string) => {
    state.queue = state.queue.filter((action) => action.id !== actionId);
  },
  updateQueuedActionStatus: (state: OfflineState, { id, status }: { id: string; status: 'synced' | 'failed' }) => {
    const queuedAction = state.queue.find((a) => a.id === id);
    if (queuedAction) {
      queuedAction.status = status;
    }
  },
  clearQueue: (state: OfflineState) => {
    state.queue = state.queue.filter((action) => action.status !== 'synced');
  },
  setSyncInProgress: (state: OfflineState, inProgress: boolean) => {
    state.syncInProgress = inProgress;
  },
  setLastSyncTime: (state: OfflineState) => {
    state.lastSyncTime = Date.now();
  },
};

export default initialOfflineState;
