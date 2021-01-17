import {
    USER_SIGNIN_FAIL,
    USER_SIGNIN_REQUEST,
    USER_SIGNIN_SUCCESS,
    USER_SIGNUP_FAIL,
    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_STATUS_FAIL,
    USER_STATUS_REQUEST,
    USER_STATUS_SUCCESS,
    USER_SIGNOUT_FAIL,
    USER_SIGNOUT_REQUEST,
    USER_SIGNOUT_SUCCESS,
    USER_SIGNIN_RESET
} from '../constants/userConstants'


//SIGN UP
export const signUpReducer = (state = {},action) => {
    switch(action.type){
        case USER_SIGNUP_REQUEST:
            return {
                loading: true,
                success: false,
            }
        case USER_SIGNUP_SUCCESS:
            return{
                loading: false,
                success: true,
                userInfo: action.payload
            }
        case USER_SIGNUP_FAIL:
            return{
                loading: false,
                success: false,
                error: action.payload
            }
        default: 
            return state
    }
}


//STATUS 
export const statusReducer = (state = {},action) => {
    switch(action.type){
        case USER_STATUS_REQUEST:
            return {
                loading: true,
                isLoggedIn: false
            }
        case USER_STATUS_SUCCESS:
            return{
                loading: false,
                isLoggedIn: true,
                userInfo: action.payload
            }
        case USER_STATUS_FAIL:
            return{
                loading: false,
                error: action.payload,
                isLoggedIn: false
            }
        default: 
            return state
    }
}


//SIGN IN
export const signInReducer = (state = {},action) => {
    switch(action.type){
        case USER_SIGNIN_REQUEST:
            return {
                loading: true,
                success: false
            }
        case USER_SIGNIN_SUCCESS:
            return{
                loading: false,
                userInfo: action.payload,
                success:  true
            }
        case USER_SIGNIN_FAIL:
            return{
                loading: false,
                error: action.payload,
                success: false
            }
        case USER_SIGNIN_RESET:
            return {}
        default: 
            return state
    }
}


//SIGN OUT
export const signOutReducer = (state={},action) => {
    switch(action.type){
        case USER_SIGNOUT_REQUEST:
            return{
                loading: true,
                success: false
            }
        case USER_SIGNOUT_SUCCESS:
            return {
                loading: false,
                success:true
            }
        case USER_SIGNOUT_FAIL:
            return{
                loading: false,
                success: false,
                error: action.payload
            }
        default: 
            return {}
    }
}