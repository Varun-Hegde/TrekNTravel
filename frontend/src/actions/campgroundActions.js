import {
    PLACE_LIST_FAIL,
    PLACE_LIST_REQUEST,
    PLACE_LIST_SUCCESS,
    PLACE_DETAIL_FAIL,
    PLACE_DETAIL_REQUEST,
    PLACE_DETAIL_SUCCESS,
    PLACE_CREATE_FAIL,
    PLACE_CREATE_REQUEST,
    PLACE_CREATE_SUCCESS,
    PLACE_EDIT_FAIL,
    PLACE_EDIT_REQUEST,
    PLACE_EDIT_SUCCESS,
    PLACE_REVIEW_ADD_FAIL,
    PLACE_REVIEW_ADD_REQUEST,
    PLACE_REVIEW_ADD_SUCCESS,
    PLACE_LIKE_FAIL,
    PLACE_LIKE_REQUEST,
    PLACE_LIKE_SUCCESS
} from '../constants/campgroundConstants'

import {
    PLACE_LIST_ADDED_PLACE,
    PLACE_DETAIL_EDITED_PLACE
} from '../constants/appConstants'

import axios from 'axios'

//GET ALL PLACES
export const listPlaces = (pageNumber='') => async (dispatch) => {
    try{
        dispatch({
            type: PLACE_LIST_REQUEST
        })

        const {data} = await axios.get(`/api/campgrounds?pageNumber=${pageNumber}`)

        dispatch({
            type: PLACE_LIST_SUCCESS,
            payload: data
        })
    }catch(error){
        dispatch({
            type: PLACE_LIST_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

//GET A PARTICULAR PLACE DETAIL
export const placeDetails = (id) => async (dispatch) => {
    try{
        dispatch({
            type:PLACE_DETAIL_REQUEST
        })

        const {data} = await axios.get(`/api/campgrounds/${id}`)
        dispatch({
            type: PLACE_DETAIL_SUCCESS,
            payload: data
        })
    }catch(error){
        dispatch({
            type: PLACE_DETAIL_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

//ADD NEW PLACE
export const addPlace = (campground) =>async (dispatch) => {
    try{
        dispatch({
            type: PLACE_CREATE_REQUEST
        })

        const config = {
            headers : {
                'Content-Type' :'application/json'
            }
        }
        const {data} = await axios.post('/api/campgrounds/',campground,config)

        dispatch({
            type: PLACE_CREATE_SUCCESS,
            payload: data
        })
        dispatch({
            type: PLACE_LIST_ADDED_PLACE
        })
        
    }catch(error){
        dispatch({   
            type:PLACE_CREATE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

//EDIT PLACE
export const editPlace = (campground,id) => async (dispatch) => {
    try{
        dispatch({
            type:PLACE_EDIT_REQUEST
        })

        const config = {
            headers : {
                'Content-Type' :'application/json'
            }
        }
        const {data} = await axios.put(`/api/campgrounds/${id}`,campground,config)

        dispatch({
            type:PLACE_EDIT_SUCCESS,
            payload: data
        })
        dispatch({
            type:PLACE_DETAIL_EDITED_PLACE
        })

    }catch(error){
        dispatch({   
            type:PLACE_EDIT_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}

//ADD NEW REVIEW TO A PLACE
export const addReview = (body,rating,campId) =>async (dispatch) => {
    try{
        dispatch({
            type: PLACE_REVIEW_ADD_REQUEST
        })

        const config = {
            headers : {
                'Content-Type' :'application/json'
            }
        }
        const {data} = await axios.post(`/api/campgrounds/${campId}/reviews`,{body,rating},config)

        dispatch({
            type: PLACE_REVIEW_ADD_SUCCESS,
            payload: data
        })
       
    }catch(error){
        dispatch({   
            type:PLACE_REVIEW_ADD_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
}


//LIKE
export const likeAction = (id) => async(dispatch) => {
    try{
        dispatch({
            type: PLACE_LIKE_REQUEST
        })

        const data = await axios.post(`/api/campgrounds/${id}/like`)

        dispatch({
            type: PLACE_LIKE_SUCCESS
        })
    }catch(error){
        dispatch({   
            type:PLACE_LIKE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message : error.message
        })
    }
} 