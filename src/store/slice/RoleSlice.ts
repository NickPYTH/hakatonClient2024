import {createSlice} from "@reduxjs/toolkit";
import {RoleModel} from "../../model/RoleModel";
import {UserModel} from "../../model/UserModel";

export type RoleModelStateType = {
    roles: RoleModel[]
}

const initialState: RoleModelStateType = {
    roles: []
};

const roleSlice = createSlice({
    name: 'roleSlice',
    initialState,
    reducers: {
        setRoles: (state, action: { type: string, payload: RoleModel[] }) => {
            state.roles = action.payload;
        }
    }
});

export const {setRoles} = roleSlice.actions;

export default roleSlice.reducer;