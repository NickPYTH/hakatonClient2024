import {createSlice} from "@reduxjs/toolkit";
import {StatusModel} from "../../model/StatusModel";

export type StatusModelStateType = {
    statuses: StatusModel[]
}

const initialState: StatusModelStateType = {
    statuses: []
};

const statusSlice = createSlice({
    name: 'statusSlice',
    initialState,
    reducers: {
        setStatuses: (state, action: { type: string, payload: StatusModel[] }) => {
            state.statuses = action.payload;
        }
    }
});

export const {setStatuses} = statusSlice.actions;

export default statusSlice.reducer;