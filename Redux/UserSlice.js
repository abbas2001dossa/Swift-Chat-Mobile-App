import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    userId : null ,
}

export const UserSlice = createSlice({
    name :"user",
    initialState,
    reducers:{
        
        setUserId : (state,action)=>{
            state.userId = action.payload;
        }
        
    }

});

export const {setUserId} = UserSlice.actions;

// selectors - to gfet data from the store-> navSlice 
// this would give the current value 
export const SelectUserId = (state)=> state.user.userId;

export default UserSlice.reducer;

