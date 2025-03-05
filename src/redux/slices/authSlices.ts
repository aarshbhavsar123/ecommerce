import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    email: string | null;
    id: string | null;
    selectedAddressIndex: string | null;
    quantityRed: number|null;
}

const initialState: AuthState = {
    id: null,
    email: null,
    selectedAddressIndex: null,
    quantityRed:null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.email = null;
            state.id = null;
            state.selectedAddressIndex = null;
        },
        setSelectedAddressIndex: (state, action: PayloadAction<string>) => {
            state.selectedAddressIndex = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload; 
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setQuantityRed:(state,action:PayloadAction<number>)=>{
            state.quantityRed = action.payload;
        }
        
    },
});

export const { setEmail, setId, resetAuth, setSelectedAddressIndex, setQuantityRed } = authSlice.actions;
export default authSlice.reducer;
