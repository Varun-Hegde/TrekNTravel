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
    PLACE_EDIT_FAIL,
    PLACE_EDIT_REQUEST,
    PLACE_EDIT_RESET,
    PLACE_EDIT_SUCCESS,
    PLACE_REVIEW_ADD_FAIL,
    PLACE_REVIEW_ADD_REQUEST,
    PLACE_REVIEW_ADD_SUCCESS,
    PLACE_LIKE_FAIL,
    PLACE_LIKE_REQUEST,
    PLACE_LIKE_SUCCESS
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
                places: action.payload.campgrounds,
                page: action.payload.page,
                pages: action.payload.pages,
                error: null
            }
        case PLACE_LIST_FAIL:
            return{
                ...state,
                error:action.payload,
                loading: false,
                places:[]
            }
        default: return state
    }
}

//SET THE DETAILS ABOUT A PARTICULAR PLACE
export const placeListDetailReducer = (state={place:{reviews:[],author:{}}}, action) => {
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

//EDIT A PLACE
export const editPlaceReducer = (state={} , action) => {
    switch(action.type){
        case PLACE_EDIT_REQUEST:
            return {
                loading: true,
            }
        case PLACE_EDIT_SUCCESS:
            return{
                loading: false,
                success: true,
                place: action.payload
            }
        case PLACE_EDIT_FAIL:
            return{
                error:action.payload,
                loading: false,
                success: false
            }
        case PLACE_EDIT_RESET:
            return {}
        default: return state
    }
}


//ADD NEW REVIEW
export const reviewAddReducer = (state={} , action) => {
    switch(action.type){
        case PLACE_REVIEW_ADD_REQUEST:
            return {
                loading: true,
                success:false
            }
        case PLACE_REVIEW_ADD_SUCCESS:
            return{
                loading: false,
                success: true,
                place: action.payload
            }
        case PLACE_REVIEW_ADD_FAIL:
            return{
                error:action.payload,
                loading: false,
                success: false
            }
        default: return state
    }
}

export const likeReducer = (state = {},action) => {
    switch(action.type){
        case PLACE_LIKE_REQUEST:
            return{
                loading: true,
                success: false
            }
        case PLACE_LIKE_SUCCESS:
            return{
                loading:false,
                success : true
            }
        case PLACE_LIKE_FAIL:
            return{
                success:false,
                error:action.payload,
            }
        default:
            return {}
    }   
}