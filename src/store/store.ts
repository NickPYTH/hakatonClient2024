import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userAPI} from "../service/UserService";
import userSlice, {CurrentUserModelStateType} from "./slice/UserSlice";
import {logAPI} from "../service/LogService";
import {authAPI} from "../service/AuthService";

export type RootStateType = {
    currentUser: CurrentUserModelStateType
};

const rootReducer = combineReducers({
    currentUser: userSlice,
    [userAPI.reducerPath]: userAPI.reducer,
    [logAPI.reducerPath]: logAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(userAPI.middleware)
                .concat(logAPI.middleware)
                .concat(authAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
