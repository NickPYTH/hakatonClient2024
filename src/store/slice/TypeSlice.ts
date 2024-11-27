import {createSlice} from "@reduxjs/toolkit";
import {TypeModel} from "../../model/TypeModel";

export type TypeModelStateType = {
    types: TypeModel[]
}

const initialState: TypeModelStateType = {
    types: []
};

const typeSlice = createSlice({
    name: 'typeSlice',
    initialState,
    reducers: {
        setTypes: (state, action: { type: string, payload: TypeModel[] }) => {
            state.types = action.payload;
        }
    }
});

export const {setTypes} = typeSlice.actions;

export default typeSlice.reducer;