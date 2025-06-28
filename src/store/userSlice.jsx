import { createSlice} from '@reduxjs/toolkit';
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: 'null',
    login: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      state.login = true;
    },
    logOutUser: (state) => {
      state.user= 'null';
      state.login = false;
    },
  },
});

export const { loginUser, logOutUser } = userSlice.actions;
export default userSlice.reducer;
