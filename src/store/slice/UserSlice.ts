import {createSlice} from "@reduxjs/toolkit";
import {UserModel} from "../../model/UserModel";

export type CurrentUserModelStateType = {
    user: UserModel,
    users: UserModel[]
}

const initialState: CurrentUserModelStateType = {
    user: {
        id: 0,
        username: "",
        password: "",
        name: "",
        surname: "",
        secondName: "",
        email: "",
        phone: "",
        role: {
            id: 0,
            name: ""
        }
    },
    users: []
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setCurrentUser: (state, action: { type: string, payload: UserModel }) => {
            state.user = action.payload;
        },
        setUsers: (state, action: { type: string, payload: UserModel[] }) => {
            state.users = action.payload;
        }
    }
});

export const {setCurrentUser, setUsers} = userSlice.actions;

export default userSlice.reducer;