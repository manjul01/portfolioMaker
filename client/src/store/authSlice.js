import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userdata : null,
  status : false
}

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        storeLogin : (state , action) => {
            state.userdata = action.payload
            state.status = true
        },
        storeLogout : (state , action) => {
            state.userdata = null
            state.status = false
        }
    }
})

export const {storeLogin , storeLogout} = authSlice.actions
export default authSlice.reducer
