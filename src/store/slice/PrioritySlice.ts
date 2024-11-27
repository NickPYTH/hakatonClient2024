import {createSlice} from "@reduxjs/toolkit";
import {StatusModel} from "../../model/StatusModel";
import {PriorityModel} from "../../model/PriorityModel";

export type PriorityModelStateType = {
    priorities: StatusModel[]
}

const initialState: PriorityModelStateType = {
    priorities: []
};

const prioritySlice = createSlice({
    name: 'prioritySlice',
    initialState,
    reducers: {
        setPriorities: (state, action: { type: string, payload: PriorityModel[] }) => {
            state.priorities = action.payload;
        }
    }
});

export const {setPriorities} = prioritySlice.actions;

export default prioritySlice.reducer;