import axios from 'axios'

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
    USER_PROFILE_FAIL,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_GOOGLE_FAIL,
    USER_GOOGLE_REQUEST,
    USER_GOOGLE_SUCCESS,
    USER_FOLLOW_FAIL,
    USER_FOLLOW_REQUEST,
    USER_FOLLOW_SUCCESS,
    USER_UNFOLLOW_FAIL,
    USER_UNFOLLOW_REQUEST,
    USER_UNFOLLOW_SUCCESS,
    USER_FOLLOW_STATUS_FAIL,
    USER_FOLLOW_STATUS_REQUEST,
    USER_FOLLOW_STATUS_SUCCESS,
    USER_MY_PROFILE_REQUEST,
    USER_MY_PROFILE_FAIL,
    USER_MY_PROFILE_SUCCESS
} from '../constants/userConstants'

import {
    USER_SIGNEDIN,
    USER_SIGNEDUP,
    USER_SIGNOUT
} from '../constants/appConstants'

//SIGN UP
export const signup = (email,password,username) => async (dispatch) => {
    try{
        dispatch({
            type: USER_SIGNUP_REQUEST
        })

        const {data} = await axios.post('/api/users/signup',{email,password,username})

        dispatch({
            type: USER_SIGNUP_SUCCESS,
            payload: data
        })
        dispatch({
            type: USER_SIGNEDUP
        })
        /* const newData = {
            loggedIn: true,
            user: {
                _id: data.createdUser._id,
                email: data.createdUser.email,
                username: data.createdUser.username
            }
        }
        dispatch({
            type: USER_STATUS_SUCCESS,
            payload: newData
        }) */
    }catch(error){
        dispatch({   
            type:USER_SIGNUP_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

//STATUS
export const status = () => async (dispatch) => {
    try{
        dispatch({
            type:USER_STATUS_REQUEST
        })

        const {data} = await axios.get('/api/users/status')

        dispatch({
            type: USER_STATUS_SUCCESS,
            payload: data
        })
    }catch(error){
        dispatch({   
            type:USER_STATUS_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}



//SIGN IN
export const signin = (email,password) => async (dispatch) => {
    try{
        dispatch({
            type:USER_SIGNIN_REQUEST
        })

        const {data} = await axios.post('/api/users/signin',{email,password})

        dispatch({
            type: USER_SIGNEDIN
        })
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        })
    }catch(error){
        dispatch({   
            type:USER_SIGNIN_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}



//SIGN OUT
export const signout = () => async (dispatch) => {
    try{
        dispatch({
            type:USER_SIGNOUT_REQUEST
        })

        const {data} = await axios.get('/api/users/signout')

        dispatch({
            type: USER_SIGNOUT_SUCCESS,
            payload: data
        })
        dispatch({
            type: USER_SIGNOUT,
        })
    }catch(error){
        dispatch({   
            type:USER_SIGNOUT_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

//PROFILE SCREEN DETAILS
export const profile = (username) => async (dispatch) => {
    try{
        dispatch({
            type: USER_PROFILE_REQUEST
        })

        const {data} = await axios.get(`/api/users/user-profile/${username}`)

        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload : data
        })

    }catch(error){
        console.log(error);
        dispatch({   
            
            type:USER_PROFILE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

//GOOGLE OAUTH
export const googleOauth = (token) =>async (dispatch) => {
    try{
        dispatch({
            type: USER_GOOGLE_REQUEST
        })

        const {data} = await axios.post('/api/users/oauth/google',token)

        dispatch({
            type: USER_GOOGLE_SUCCESS,
            payload: data
        })
        dispatch({
            type: USER_SIGNEDIN
        })
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        })
    }catch(error){
        dispatch({   
            type:USER_GOOGLE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

export const followUserAction = (username) => async(dispatch) => {
    try{
        dispatch({
            type: USER_FOLLOW_REQUEST
        })

        const {data} = await axios.post(`/api/follow/${username}`)

        dispatch({
            type: USER_FOLLOW_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({   
            type:USER_FOLLOW_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

export const unfollowUserAction = (username) => async(dispatch) => {
    try{
        dispatch({
            type: USER_UNFOLLOW_REQUEST
        })

        const {data} = await axios.delete(`/api/unfollow/${username}`)

        dispatch({
            type: USER_UNFOLLOW_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({   
            type:USER_UNFOLLOW_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

export const followUserStatusAction = (username) => async(dispatch) => {
    try{
        dispatch({
            type: USER_FOLLOW_STATUS_REQUEST
        })

        const {data} = await axios.get(`/api/status/${username}`)

        dispatch({
            type: USER_FOLLOW_STATUS_SUCCESS,
            payload: data.follow
        })

    }catch(error){
        dispatch({   
            type: USER_FOLLOW_STATUS_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

export const userMyProfileAction = () => async (dispatch) => {
    try{
        dispatch({
            type: USER_MY_PROFILE_REQUEST
        })

        const {data} = await axios.get('/api/users/myprofile')
        
        dispatch({
            type: USER_MY_PROFILE_SUCCESS,
            payload: data
        })

    }catch(error){
        dispatch({   
            type: USER_MY_PROFILE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}