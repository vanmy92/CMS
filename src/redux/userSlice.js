import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name:'user',
    initialState:{
        login:{
            currentUser:null,
            isFetching:false,
            error:false,
        },
        register:{
            isFetching:false,
            error:false,
            success:false
        },
        users:{
            allUser: null,
            isFetching: false,
            error:false,
        }
    },reducers:{
        loginStart:(state)=>{
            state.login.isFetching = true;
        },
        loginSuccess:(state,action)=>{
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
        },
        loginFail:(state)=>{
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart:(state)=>{
            state.register.isFetching = true
        },
        registerSuccess:(state)=>{
            state.register.isFetching = false
            state.register.success = true
        },
        registerFail:(state)=>{
            state.register.isFetching = false
            state.register.error = true
            state.register.success = false
        },
        logOutStart:(state)=>{
            state.login.isFetching = true;
        },
        logOutSuccess:(state,action)=>{
            state.login.isFetching = false;
            state.login.currentUser = null;
        },
        logOutFail:(state)=>{
            state.login.isFetching = false;
            state.login.error = true;
        },
        getAllUserStart:(state)=>{
            state.users.isFetching = true;
        },
        getAllUserSuccess:(state,action)=>{
            state.users.isFetching = false;
            state.users.allUser = action.payload;
        },
        getAllUserFail:(state)=>{
            state.users.error = true;
        },
    }
})

export const {loginStart,loginSuccess,loginFail,logOutStart,logOutSuccess,logOutFail,registerFail,registerStart,registerSuccess,getAllUserFail,getAllUserStart,getAllUserSuccess} = userSlice.actions
export default userSlice.reducer
