import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    email:string|null;
    id:string|null;
}

const initialState: AuthState = {
    id:null,
    email: null,

};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.email = null;
            
        },
        
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload; 
            
        },
        setId:(state,action:PayloadAction<string>)=>{
            state.id = action.payload;
        }
    },
});

export const {setEmail,setId, resetAuth } = authSlice.actions;
export default authSlice.reducer;
