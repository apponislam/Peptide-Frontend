import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const roles = {
    USER: "USER" as const,
    ADMIN: "ADMIN" as const,
};

export type Role = (typeof roles)[keyof typeof roles];

export type TUser = {
    id: string;
    name: string;
    email: string;
    role: Role;
    referralCode: string;
    tier: string;
    storeCredit: number;
    referralCount: number;
    createdAt: string;
    profileImg?: string;
    shippingCredit?: number;
    orders?: any[];
};

type TAuthState = {
    user: null | TUser;
    demoUser: null | TUser;
    token: null | string;
    redirectPath: string | null;
    isAuthenticated: boolean;
};

const initialState: TAuthState = {
    user: null,
    demoUser: null,
    token: null,
    redirectPath: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        setDemoUser: (state, action: PayloadAction<TUser>) => {
            state.demoUser = action.payload;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        demoLogOut: (state) => {
            state.demoUser = null;
        },
        setRedirectPath: (state, action: PayloadAction<string | null>) => {
            state.redirectPath = action.payload;
        },
    },
});

export const { setUser, setDemoUser, logOut, setRedirectPath, demoLogOut } = authSlice.actions;
export default authSlice.reducer;

export const currentToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;
export const redirectPath = (state: RootState) => state.auth.redirectPath;
export const demoUser = (state: RootState) => state.auth.demoUser;
