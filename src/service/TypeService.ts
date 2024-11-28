import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {TypeModel} from "../model/TypeModel";

export const typeAPI = createApi({
    reducerPath: 'typeAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/types`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['Type'],
    endpoints: (build) => ({
        getAll: build.mutation<TypeModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['Type']
        }),
        create: build.mutation<TypeModel, TypeModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Type']
        }),
        update: build.mutation<TypeModel, TypeModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Type']
        }),
        delete: build.mutation<TypeModel, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Type']
        }),
    })
});