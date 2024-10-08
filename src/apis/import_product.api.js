import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api_routes, SHOP_LOCAL_URL, SHOP_URL } from "../configs/api.config";

export const importedProductApi = createApi({
  reducerPath: "importedProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SHOP_URL + api_routes.imported_products,
  }),
  tagTypes: ["ImportedProduct"],
  endpoints: (builder) => ({
    getImportedProducts: builder.query({
      query: () => ({
        url: "",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),

      providesTags: ["ImportedProduct"],
    }),
    getImportedProduct: builder.query({
      query: ({ filter, id }) => ({
        url: `${filter}/${id || 0}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),

      providesTags: (result, error, id) => [{ type: "ImportedProduct", id }],
    }),
    addImportedProduct: builder.mutation({
      query: ({
        product_id,
        color_code,
        color_name,
        size,
        height,
        weight,
        material,
        gender,
        importPrice,
        image_url,
        slider_url_1,
        slider_url_2,
        slider_url_3,
        slider_url_4,
        public_id_url,
        public_id_slider_url_1,
        public_id_slider_url_2,
        public_id_slider_url_3,
        public_id_slider_url_4,
        importNumber,
      }) => ({
        url: "",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "POST",
        body: {
          product_id,
          color_code,
          color_name,
          size,
          height,
          weight,
          material,
          gender,
          importPrice,
          image_url,
          slider_url_1,
          slider_url_2,
          slider_url_3,
          slider_url_4,
          public_id_url,
          public_id_slider_url_1,
          public_id_slider_url_2,
          public_id_slider_url_3,
          public_id_slider_url_4,
          importNumber,
        },
      }),
      invalidatesTags: ["ImportedProduct"],
    }),
    updateImportedProduct: builder.mutation({
      query: ({
        id,
        product_id,
        color_code,
        color_name,
        size,
        height,
        weight,
        material,
        gender,
        importPrice,
        image_url,
        slider_url_1,
        slider_url_2,
        slider_url_3,
        slider_url_4,
        public_id_url,
        public_id_slider_url_1,
        public_id_slider_url_2,
        public_id_slider_url_3,
        public_id_slider_url_4,
        importNumber,
        color_id,
        size_id,
        material_id,
      }) => ({
        url: `${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "PUT",
        body: {
          product_id,
          color_code,
          color_name,
          size,
          height,
          weight,
          material,
          gender,
          importPrice,
          image_url,
          slider_url_1,
          slider_url_2,
          slider_url_3,
          slider_url_4,
          public_id_url,
          public_id_slider_url_1,
          public_id_slider_url_2,
          public_id_slider_url_3,
          public_id_slider_url_4,
          importNumber,
          color_id,
          size_id,
          material_id,
        },
      }),
      invalidatesTags: ["ImportedProduct"],
    }),
    deleteImportedProduct: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["ImportedProduct"],
    }),
    getColors: builder.query({
      query: () => ({
        url: "/colors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    getSizes: builder.query({
      query: () => ({
        url: "/sizes",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    getMaterials: builder.query({
      query: () => ({
        url: "/materials",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
  }),
});

export const {
  useGetImportedProductsQuery,
  useGetImportedProductQuery,
  useAddImportedProductMutation,
  useDeleteImportedProductMutation,
  useUpdateImportedProductMutation,
  useGetColorsQuery,
  useGetSizesQuery,
  useGetMaterialsQuery,
} = importedProductApi;
