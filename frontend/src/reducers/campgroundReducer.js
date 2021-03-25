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
    PLACE_DELETE_FAIL,
    PLACE_DELETE_REQUEST,
    PLACE_DELETE_SUCCESS,
    PLACE_DELETE_RESET,
    PLACE_REVIEW_ADD_FAIL,
    PLACE_REVIEW_ADD_REQUEST,
    PLACE_REVIEW_ADD_SUCCESS,
    PLACE_LIKE_FAIL,
    PLACE_LIKE_REQUEST,
    PLACE_LIKE_SUCCESS,
    EDIT_REVIEW_FAIL,
    EDIT_REVIEW_REQUEST,
    EDIT_REVIEW_SUCCESS,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL
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

//DELETE A PLACE
export const deletePlaceReducer = (state={success:false} , action) => {
    switch(action.type){
        case PLACE_DELETE_REQUEST:
            return {
                loading: true,
            }
        case PLACE_DELETE_SUCCESS:
            return{
                loading: false,
                success: true,
                
            }
        case PLACE_DELETE_FAIL:
            return{
                error:action.payload,
                loading: false,
                success: false
            }
        case PLACE_DELETE_RESET:
            return {success: false}
        
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

export const editReviewReducer = (state={},action) => {
    switch(action.type){
        case EDIT_REVIEW_REQUEST:
            return{
                loading: true,
            }
        case EDIT_REVIEW_SUCCESS:
            return{
                loading: false,
                success: true,
            }
        case EDIT_REVIEW_FAIL:
            return{
                loading: false,
                success: false,
                error: action.payload
            }
        default: return {}
    }
}

export const deleteReviewReducer = (state={},action) => {
    switch(action.type){
        case DELETE_REVIEW_REQUEST:
            return{
                loading: true,
            }
        case DELETE_REVIEW_SUCCESS:
            return{
                loading: false,
                success: true,
            }
        case DELETE_REVIEW_FAIL:
            return{
                loading: false,
                success: false,
                error: action.payload
            }
        default: return {}
    }
}