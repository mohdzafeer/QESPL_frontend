import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface NotificationItem {
  id: string | number;
  user?: string;
  time: string;
  message: string;
}


interface NotificationState {
  notifications: NotificationItem[];
  showAll: boolean;
}


const initialState: NotificationState = {
  notifications: [],
  showAll: false,
};




const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.notifications.unshift(action.payload); // Add new notification at the start
    },
    removeNotification(state, action: PayloadAction<string | number>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications(state) {
      state.notifications = [];
    },
     toggleShowAll(state) {
      state.showAll = !state.showAll;
    },
  },
});
export const { addNotification, removeNotification, clearNotifications, toggleShowAll } = notificationSlice.actions;
export default notificationSlice.reducer;

