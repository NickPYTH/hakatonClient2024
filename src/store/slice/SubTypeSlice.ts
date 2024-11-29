import {createSlice} from "@reduxjs/toolkit";
import {TypeModel} from "../../model/TypeModel";
import {SubTypeModel} from "../../model/SubTypeModel";

export type SubTypeModelStateType = {
    subTypes: SubTypeModel[]
}

const initialState: SubTypeModelStateType = {
    subTypes: []
};

const subTypeSlice = createSlice({
    name: 'subTypeSlice',
    initialState,
    reducers: {
        setSubTypes: (state, action: { type: string, payload: SubTypeModel[] }) => {
            state.subTypes = action.payload;
        }
    }
});

export const {setSubTypes} = subTypeSlice.actions;

export default subTypeSlice.reducer;