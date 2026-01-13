import { baseApi } from "../../api/baseApi";
import { TUser } from "./authSlice";

type LoginResponse = {
    success: boolean;
    message: string;
    data: {
        user: TUser;
        accessToken: string;
    };
};

type RegisterResponse = {
    success: boolean;
    message: string;
    data: {
        user: TUser;
        accessToken: string;
    };
};

type RefreshTokenResponse = {
    success: boolean;
    message: string;
    data: {
        user: TUser;
        accessToken: string;
    };
};

type LogoutResponse = {
    success: boolean;
    message: string;
};

type GetMeResponse = {
    success: boolean;
    message: string;
    data: TUser;
};

// Request types
type LoginRequest = {
    email: string;
    password: string;
};

type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    referralCode?: string; // Optional referral code
};

const authApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Login endpoint
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                body: userInfo,
            }),
        }),

        // Register endpoint
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (userInfo) => ({
                url: "/auth/register",
                method: "POST",
                body: userInfo,
            }),
        }),

        // Refresh token endpoint
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
            }),
        }),

        // Logout endpoint
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        // Get current user (me) endpoint
        getMe: builder.query<GetMeResponse, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),
            providesTags: ["User"],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation, useLogoutMutation, useGetMeQuery } = authApi;
