import {createSlice} from "@reduxjs/toolkit";
import {UserModel} from "../../model/UserModel";

export type CurrentUserModelStateType = {
    user: UserModel | null,
    users: UserModel[]
}

const initialState: CurrentUserModelStateType = {
    user: null,
    users: []
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setCurrentUser: (state, action: { type: string, payload: UserModel|null }) => {
            state.user = action.payload;
        },
        setUsers: (state, action: { type: string, payload: UserModel[] }) => {
            state.users = action.payload;
        }
    }
});

export const {setCurrentUser, setUsers} = userSlice.actions;

export default userSlice.reducer;