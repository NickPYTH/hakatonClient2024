import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {UserModel} from "../model/UserModel";

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/users`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['User'],
    endpoints: (build) => ({
        getUsers: build.mutation<UserModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['User']
        }),
        createUser: build.mutation<any, UserModel>({
            query: (post) => ({
                url: `/create`,
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['User']
        }),
        updateUser: build.mutation<any, UserModel>({
            query: (post) => ({
                url: `/update`,
                method: 'POST',
                body: post
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: build.mutation<string, string>({
            query: (username) => ({
                url: `/${username}`,
                method: 'DELETE',
            }),
            transformErrorResponse: (
                response: { status: string | number },
                meta,
                arg
            ) => response.status,
            invalidatesTags: ['User']
        }),
    })
});