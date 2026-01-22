import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setUser, logOut, TUser } from "../features/auth/authSlice";

interface RefreshTokenResponse {
    data: {
        accessToken: string;
        user: TUser;
    };
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_API}/api/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState)?.auth?.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const url = typeof args === "string" ? args : args.url;
    const isAuthEndpoint = url === "/auth/login" || url === "/auth/admin/login" || url === "/auth/refresh-token";
    let result = await baseQuery(args, api, extraOptions);

    if (!isAuthEndpoint && (result?.error?.status === 401 || result?.error?.status === 403)) {
        console.log("Attempting to refresh token for non-auth endpoint...");

        const refreshResult = await baseQuery(
            {
                url: "/auth/refresh-token",
                method: "POST",
                credentials: "include",
            },
            api,
            extraOptions,
        );

        if (refreshResult.data && typeof refreshResult.data === "object" && "data" in refreshResult.data) {
            const backendData = (refreshResult.data as RefreshTokenResponse).data;
            const user = backendData.user;
            const accessToken = backendData.accessToken;
            if (user && accessToken) {
                api.dispatch(setUser({ user, token: accessToken }));

                // Retry the original request with new token
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logOut());
                return { error: { status: 401, data: "Session expired" } };
            }
        } else {
            api.dispatch(logOut());
            return { error: { status: 401, data: "Session expired" } };
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Terms", "Users", "Products", "DeletedProducts", "DashboardStats", "Orders"],
    endpoints: () => ({}),
});
