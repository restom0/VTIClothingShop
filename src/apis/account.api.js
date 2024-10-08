import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SHOP_LOCAL_URL, SHOP_URL, api_routes } from "../configs/api.config";

export const accountApi = createApi({
  reducerPath: "AccountApi",
  baseQuery: fetchBaseQuery({ baseUrl: SHOP_URL + api_routes.users }),
  tagTypes: ["Account"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, username, phoneNumber, password }) => ({
        url: "login",
        method: "POST",
        body: { email, username, phoneNumber, password },
      }),
      invalidatesTags: ["Account"],
    }),
    register: builder.mutation({
      query: ({
        name,
        username,
        password,
        phone_number,
        email,
        birthday,
        avatar_url,
        public_id_avatar_url,
        address,
        gender,
      }) => ({
        url: "register",
        method: "POST",
        body: {
          name,
          username,
          password,
          phone_number,
          email,
          birthday,
          avatar_url,
          public_id_avatar_url,
          address,
          gender,
        },
      }),
      invalidatesTags: ["Account"],
    }),
    getAccount: builder.query({
      query: () => api_routes.users + " profile",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      providesTags: ["Account"],
    }),
    updateAccount: builder.mutation({
      query: ({ email, username, phoneNumber, password }) => ({
        url: "",
        method: "PUT",
        body: { email, username, phoneNumber, password },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      invalidatesTags: ["Account"],
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "password",
        method: "PUT",
        body: { oldPassword, newPassword },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      invalidatesTags: ["Account"],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: "",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useUpdatePasswordMutation,
} = accountApi;
