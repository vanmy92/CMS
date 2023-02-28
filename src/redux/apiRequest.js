import axios from "axios";
import { getAllBillFail, getAllBillStart, getAllBillSuccess, getBillUserFail, getBillUserStart, getBillUserSuccess, getTotalDashboardFail, getTotalDashboardStart, getTotalDashboardSuccess } from "./billSlice";
import { createProductFail, createProductStart, createProductSuccess, getAllProductFail, getAllProductStart, getAllProductSuccess } from "./productSlice";
import { getAllUserFail, getAllUserStart, getAllUserSuccess, loginFail, loginStart, loginSuccess, logOutFail, logOutStart, logOutSuccess, registerFail, registerStart, registerSuccess } from "./userSlice";


const host = 'http://localhost:9000'

export const loginUser = async (user, dispatch) => {
    dispatch(loginStart())
    try {
        const res = await axios.post(`${host}/v1/user/login`, user)
        if (res.data.isAdmin) {
            dispatch(loginSuccess(res.data))
        }else{
            dispatch(loginSuccess())
        }
    } catch (error) {
        dispatch(loginFail())
    }
}


export const logoutUser = async(accessToken,user,dispatch)=>{
    dispatch(logOutStart())
    try {
        await axios.post(`${host}/v1/user/logout`,user,{
            headers:{token: `Bearer ${accessToken}`}
        })
        dispatch(logOutSuccess())
    } catch (error) {
        dispatch(logOutFail())
    }
}

export const getAllUser = async(accessToken,dispatch) =>{
    dispatch(getAllUserStart())
    try {
        const res = await axios.get(`${host}/v1/user`,{
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(getAllUserSuccess(res.data))
    } catch (error) {
        dispatch(getAllUserFail())
    }
}

export const updateUser = async(id,accessToken,userUpdate,dispatch) =>{
    dispatch(registerStart())
    try {
       await axios.put(`${host}/v1/user/${id}`,userUpdate,{
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(registerSuccess())
    } catch (error) {
        dispatch(registerFail())
    }
}

export const getAllProduct = async (dispatch) =>{
    dispatch(getAllProductStart())
    try {
        const res = await axios.get(`${host}/v2/product`);
        dispatch(getAllProductSuccess(res.data));
    } catch (error) {
        dispatch(getAllProductFail())
    }
}
export const createProduct = async (dispatch,product)=>{
    dispatch(createProductStart())
    try {
        await axios.post(`${host}/v2/product`,product)
        dispatch(createProductSuccess())
    } catch (error) {
        dispatch(createProductFail())
    }
}
export const updateProduct = async (id,dispatch,product)=>{
    dispatch(createProductStart())
    try {
        await axios.post(`${host}/v2/product/${id}`,product)
        dispatch(createProductSuccess())
    } catch (error) {
        dispatch(createProductFail())
    }
}

export const getTotalDashboard = async (dispatch,payload)=>{
    dispatch(getTotalDashboardStart())
    try {
        const arrChart = await axios.post(`${host}/v3/bill/get-chart`,payload)
        const countUser = await axios.get(`${host}/v1/user/count-user`)
        const countProduct = await axios.get(`${host}/v2/product/count-product`)
        const countBill = await axios.post(`${host}/v3/bill/total-price`,payload)
        const chartProduct = await axios.get(`${host}/v2/product/total-sell-product`)

        let data = {
            countUser: countUser.data,
            countProduct:countProduct.data,
            countBill:countBill.data,
            arrChart: arrChart.data,
            chartProduct:chartProduct.data
        }
        console.log(arrChart.data);
        dispatch(getTotalDashboardSuccess(data))
    } catch (error) {
    dispatch(getTotalDashboardFail())
        
    }
}

export const getAllBill = async (token,dispatch,payload) =>{
    dispatch(getAllBillStart())
    try {
        const res = await axios.post(`${host}/v3/bill/find`,payload,{
            headers: {token: `Bearer ${token}`}
        })
        dispatch(getAllBillSuccess(res.data))
    } catch (error) {
        dispatch(getAllBillFail())
    }
}

export const getAllBillUser = async (token,dispatch,id,payload) =>{
    dispatch(getBillUserStart())
    try {
        console.log(payload);
        const res = await axios.post(`${host}/v3/bill/a/${id}`,payload,{
            headers: {token: `Bearer ${token}`}
        })
        console.log(res.data);
        dispatch(getBillUserSuccess(res.data))
    } catch (error) {
        dispatch(getBillUserFail())
    }
}
