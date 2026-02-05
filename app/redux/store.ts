import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import authReducer from "./features/auth/authSlice";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import cartReducer from "./features/cart/cartSlice";

const persistConfigure = {
    key: "auth",
    storage,
    whitelist: ["user", "token", "isAuthenticated", "redirectPath", "demoUser"],
};

const cartPersistConfig = {
    key: "cart",
    storage,
    whitelist: ["items"],
};

const persistAuthReducer = persistReducer(persistConfigure, authReducer);
const persistCartReducer = persistReducer(cartPersistConfig, cartReducer);

const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: persistAuthReducer,
        cart: persistCartReducer,
    },
    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

export const persistor = persistStore(store);
