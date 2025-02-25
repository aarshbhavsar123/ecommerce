import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    otp: string | null;
    email:string|null;
}

const initialState: AuthState = {
    otp: null,
    email: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.email = null;
            state.otp = null;
        },
        setOtp: (state, action: PayloadAction<string>) => {
            state.otp = action.payload; 
            
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload; 
            
        },
    },
});

export const { setOtp, setEmail, resetAuth } = authSlice.actions;
export default authSlice.reducer;
