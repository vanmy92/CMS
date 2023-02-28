import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name:'product',
    initialState:{
        products:{
                allProduct:null,
                isFetching:false,
                error:false,
        },
        create:{
            isFetching:false,
            error:false,
            success:false,
        }
    },
    reducers:{
        getAllProductStart:(state)=>{
            state.products.isFetching=true
        },
        getAllProductSuccess:(state,action)=>{
            state.products.isFetching=false
            state.products.allProduct = action.payload
        },
        getAllProductFail: (state)=>{
            state.products.error = true
           

        },
        createProductStart:(state)=>{
            state.create.isFetching=true
            state.products.error=false
            state.create.success=false
        },
        createProductSuccess:(state)=>{
            state.create.isFetching=false
            state.products.error=false
            state.create.success=true
        },
        createProductFail:(state)=>{
            state.create.isFetching=false
            state.create.success=true
            state.create.error=false

        },

    }
})

export const {getAllProductFail,getAllProductStart,getAllProductSuccess,createProductFail,createProductStart,createProductSuccess}  =  productSlice.actions
export default productSlice.reducer