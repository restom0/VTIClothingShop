import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { isDemoModeEnabled } from "../demo/demoMode";
import { getDemoMutationResponse, getDemoReadResponse } from "../mocks/demo_data.mock";

/** Handles clone. */
const clone = (value) => structuredClone(value);
const isTruthyFlag = (value) => ["1", "true", "yes"].includes(String(value ?? "").toLowerCase());

/** Checks whether dummy fallback is enabled outside demo mode. */
export const isDummyFallbackEnabled = () =>
  isTruthyFlag(import.meta.env?.VITE_ENABLE_DUMMY_FALLBACK);

/** Checks whether read request. */
const isReadRequest = (args) => {
  if (typeof args === "string") return true;
  return !args?.method || String(args.method).toUpperCase() === "GET";
};

/** Creates base query with dummy fallback. */
export const createBaseQueryWithDummyFallback = (resource, options) => {
  const rawBaseQuery = fetchBaseQuery(options);

  return async (args, api, extraOptions) => {
    const isRead = isReadRequest(args);

    if (isDemoModeEnabled()) {
      const demoResponse = isRead
        ? getDemoReadResponse(resource, api.endpoint, args)
        : getDemoMutationResponse(resource, api.endpoint, args);

      if (demoResponse) return { data: clone(demoResponse) };
    }

    const result = await rawBaseQuery(args, api, extraOptions);
    const fallbackResponse =
      isRead && isDummyFallbackEnabled() ? getDemoReadResponse(resource, api.endpoint, args) : null;

    if (!result.error || !fallbackResponse) return result;

    return { data: clone(fallbackResponse) };
  };
};
