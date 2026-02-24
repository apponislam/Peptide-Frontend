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

type LoginRequest = {
    email: string;
    password: string;
};

type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    referralCode?: string;
};

type UpdateReferralCodeResponse = {
    success: boolean;
    message: string;
    data: TUser;
};

type UpdateReferralCodeRequest = {
    newCode: string;
};

type CheckReferralCodeResponse = {
    success: boolean;
    message: string;
    data: {
        available: boolean;
    };
};

// New types for password reset
type ForgotPasswordRequest = {
    email: string;
};

type ForgotPasswordResponse = {
    success: boolean;
    message: string;
    data?: {
        message: string;
        email?: string;
    };
};

type VerifyOTPRequest = {
    email: string;
    otp: string;
};

type VerifyOTPResponse = {
    success: boolean;
    message: string;
    data?: {
        message: string;
        email?: string;
    };
};

type ResetPasswordRequest = {
    email: string;
    otp: string;
    newPassword: string;
};

type ResetPasswordResponse = {
    success: boolean;
    message: string;
    data?: {
        message: string;
    };
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
            invalidatesTags: ["User"],
        }),

        adminLogin: builder.mutation<LoginResponse, LoginRequest>({
            query: (userInfo) => ({
                url: "/auth/admin/login",
                method: "POST",
                body: userInfo,
            }),
            invalidatesTags: ["User"],
        }),

        // Register endpoint
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (userInfo) => ({
                url: "/auth/register",
                method: "POST",
                body: userInfo,
            }),
            invalidatesTags: ["User"],
        }),

        // Refresh token endpoint
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        // Logout endpoint
        logout: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        // Get current user (me) endpoint
        getMe: builder.query<GetMeResponse, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),
            providesTags: ["User"],
        }),

        // NEW: Update referral code endpoint
        updateReferralCode: builder.mutation<UpdateReferralCodeResponse, UpdateReferralCodeRequest>({
            query: (data) => ({
                url: "/auth/update-referral-code",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        // NEW: Check referral code availability endpoint
        checkReferralCode: builder.query<CheckReferralCodeResponse, string>({
            query: (code) => ({
                url: `/auth/check-referral-code/${code}`,
                method: "GET",
            }),
        }),
        // NEW: Forgot Password endpoint
        forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
            query: (data) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body: data,
            }),
        }),

        // NEW: Verify OTP endpoint
        verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
            query: (data) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body: data,
            }),
        }),

        // NEW: Reset Password endpoint
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useLoginMutation, useAdminLoginMutation, useRegisterMutation, useRefreshTokenMutation, useLogoutMutation, useGetMeQuery, useUpdateReferralCodeMutation, useCheckReferralCodeQuery } = authApi;
