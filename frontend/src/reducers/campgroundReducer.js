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
    PLACE_CREATE_RESET,
    PLACE_LIST_ADDED_PLACE,
    PLACE_LIST_ADDED_PLACE_REMOVE
} from '../constants/campgroundConstants'

//SET THE DETAILS ABOUT ALL THE PLACES
export const placeListReducer = (state={places:[],addedPlace:false} , action) => {
    switch(action.type){
        case PLACE_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                places:[],
                error: null
            }
        case PLACE_LIST_SUCCESS:
            return{
                ...state,
                loading: false,
                places: action.payload,
                error: null
            }
        case PLACE_LIST_FAIL:
            return{
                ...state,
                error:action.payload,
                loading: false,
                places:[]
            }
        case PLACE_LIST_ADDED_PLACE:
            return{
                ...state,
                addedPlace: true
            }
        case PLACE_LIST_ADDED_PLACE_REMOVE:
            return{
                ...state,
                addedPlace: false
            }
        default: return state
    }
}

//SET THE DETAILS ABOUT A PARTICULAR PLACE
export const placeListDetailReducer = (state={place:{}} , action) => {
    switch(action.type){
        case PLACE_DETAIL_REQUEST:
            return {
                loading: true,
                place:{}
            }
        case PLACE_DETAIL_SUCCESS:
            return{
                loading: false,
                place: action.payload
            }
        case PLACE_DETAIL_FAIL:
            return{
                error:action.payload,
                loading: false
            }
        default: return state
    }
}

//ADD NEW PLACE
export const placeAddReducer = (state={} , action) => {
    switch(action.type){
        case PLACE_CREATE_REQUEST:
            return {
                loading: true,
            }
        case PLACE_CREATE_SUCCESS:
            return{
                loading: false,
                success: true,
                place: action.payload
            }
        case PLACE_CREATE_FAIL:
            return{
                error:action.payload,
                loading: false,
                success: false
            }
        case PLACE_CREATE_RESET:
            return {}
        default: return state
    }
}