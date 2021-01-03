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
    PLACE_LIST_ADDED_PLACE
} from '../constants/campgroundConstants'

import axios from 'axios'

//GET ALL PLACES
export const listPlaces = () => async (dispatch) => {
    try{
        dispatch({
            type: PLACE_LIST_REQUEST
        })

        const {data} = await axios.get('/api/campgrounds')

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