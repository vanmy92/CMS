import {createSlice} from '@reduxjs/toolkit'


const BillSlice = createSlice({
    name:'bill',
    initialState:{
        bills:{
                allBills:null,
                isFetching:false,
                error:false,
        },
        totalDashboard:{
            isFetching:false,
            error:false,
            total:null,
        },
        billUserActive:{
            userBill:null,
            error:false,
            isFetching:false
        }
    },
    reducers:{
       getTotalDashboardStart: (state)=>{
        state.totalDashboard.isFetching = true
       },
       getTotalDashboardSuccess: (state,action)=>{
        state.totalDashboard.isFetching = false
        state.totalDashboard.total = action.payload
       },
       getTotalDashboardFail: (state)=>{
        state.totalDashboard.error = false
       },
       getAllBillStart:(state) =>{
        state.bills.isFetching = true
       },
       getAllBillSuccess:(state,action) =>{
        state.bills.isFetching = false
        state.bills.allBills =  action.payload
       },
       getAllBillFail:(state) =>{
        state.bills.error = true
       },
       getBillUserStart: (state)=>{
        state.billUserActive.isFetching = true
       },
       getBillUserSuccess: (state,action)=>{
        state.billUserActive.isFetching = false
        state.billUserActive.userBill = action.payload
       }, 
       getBillUserFail: (state)=>{
        state.billUserActive.error = true
       },
    }
})

export const {getBillUserFail,getBillUserStart,getBillUserSuccess,getAllBillFail,getAllBillStart,getAllBillSuccess,getTotalDashboardStart,getTotalDashboardSuccess,getTotalDashboardFail}  =  BillSlice.actions
export default BillSlice.reducer