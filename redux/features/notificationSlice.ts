import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface NotificationState {
  unreadCount: number;
}

const initialState: NotificationState = {
  unreadCount: 0,
};
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    markAsRead: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markAsUnread: (state) => {
      console.log('the mark as unread count is called in the cart slice')
      state.unreadCount = state.unreadCount+1
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadCount, markAsRead, markAllAsRead, clearNotifications,markAsUnread } =
  notificationSlice.actions;

export default notificationSlice.reducer;
