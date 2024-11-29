import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host, port, secure} from "../config/constants";
import {SubTypeModel} from "../model/SubTypeModel";

export const subTypeAPI = createApi({
    reducerPath: 'subTypeAPI',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${secure}://${host}${port}/subtypes`,
            prepareHeaders: (headers, {getState}) => {
                headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
                return headers
            },
        }
    ),
    tagTypes: ['SubType'],
    endpoints: (build) => ({
        getAll: build.mutation<SubTypeModel[], void>({
            query: () => ({
                url: `/all`,
                method: 'GET',
            }),
            invalidatesTags: ['SubType']
        }),
        create: build.mutation<SubTypeModel, SubTypeModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['SubType']
        }),
        update: build.mutation<SubTypeModel, SubTypeModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['SubType']
        }),
        delete: build.mutation<SubTypeModel, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SubType']
        }),
    })
});