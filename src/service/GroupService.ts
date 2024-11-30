import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {GroupModel} from "../model/GroupModel";

export const groupAPI = createApi({
    reducerPath: 'groupAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/groups`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['Group'],
    endpoints: (build) => ({
        getAll: build.mutation<GroupModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['Group']
        }),
        get: build.mutation<GroupModel, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['Group']
        }),
        create: build.mutation<GroupModel, GroupModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Group']
        }),
        update: build.mutation<GroupModel, GroupModel>({
            query: (body) => ({
                url: `/update`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Group']
        }),
        delete: build.mutation<GroupModel, number>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Group']
        }),
    })
});