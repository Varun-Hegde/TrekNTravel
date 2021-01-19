import {
    USER_SIGNEDIN,
    USER_SIGNEDIN_RESET,
    PLACE_LIST_ADDED_PLACE,
    PLACE_LIST_ADDED_PLACE_REMOVE,
    PLACE_DETAIL_EDITED_PLACE,
    PLACE_DETAIL_EDITED_PLACE_REMOVE,
    USER_SIGNEDUP,
    USER_SIGNEDUP_RESET,
    USER_SIGNOUT,
    USER_SIGNOUT_RESET,
    USER_LOGIN_REQUIRED,
    USER_LOGIN_REQUIRED_RESET
} from '../constants/appConstants'



export const app = (state={},action) => {
    switch(action.type){
        case USER_SIGNEDIN: 
            return {
                ...state,
                signInPopUp : true
            }
        case USER_SIGNEDIN_RESET: 
            return {
                ...state,
                signInPopUp : false
            }
        case PLACE_LIST_ADDED_PLACE: 
            return {
                ...state,
                addedPlacePopup:true
            }
        case PLACE_LIST_ADDED_PLACE_REMOVE:
            return{
                ...state,
                addedPlacePopup: false
            }
        case PLACE_DETAIL_EDITED_PLACE:
            return{
                ...state,
                editedPlacePopup: true
            }
        case PLACE_DETAIL_EDITED_PLACE_REMOVE:
            return{
                ...state,
                editedPlacePopup: false
            }
        case USER_SIGNEDUP: 
            return {
                ...state,
                signUpPopUp : true
            }
        case USER_SIGNEDUP_RESET: 
            return {
                ...state,
                signUpPopUp : false
            }
        case USER_SIGNOUT:
            return{
                ...state,
                signOutPopUp:true
            }
        case USER_SIGNOUT_RESET:
            return{
                ...state,
                signOutPopUp:false
            }
        case USER_LOGIN_REQUIRED:
            return{
                ...state,
                userLoginPopUp:true
            }
        case USER_LOGIN_REQUIRED_RESET:
            return{
                ...state,
                userLoginPopUp:false
            }
        default: return state
    }    
}