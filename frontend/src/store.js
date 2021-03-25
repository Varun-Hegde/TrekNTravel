import {createStore,applyMiddleware,combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {
    placeListReducer,
    placeListDetailReducer,
    placeAddReducer,
    editPlaceReducer,
    reviewAddReducer,
    likeReducer,
    editReviewReducer,
    deleteReviewReducer,
    deletePlaceReducer
} from './reducers/campgroundReducer'

import {
    signUpReducer,
    statusReducer,
    signInReducer,
    signOutReducer,
    profileReducer,
    googleOauth,
    facebookOauth,
    followUserReducer,
    unfollowUserReducer,
    followUserStatusReducer,
    myProfileReducer,
    googleLink,
    googleUnLink,
    facebookLink,
    facebookUnLink
} from './reducers/userReducer'

import {
    app
} from './reducers/appReducer'

const reducer = combineReducers({
    placeList: placeListReducer,
    placeDetail: placeListDetailReducer,
    placeAdd: placeAddReducer,
    placeEdit: editPlaceReducer,
    placeDelete : deletePlaceReducer,
    signUp: signUpReducer,
    signIn: signInReducer,
    signOut: signOutReducer,
    status: statusReducer,
    appDetails: app,
    newReview: reviewAddReducer,
    profile: profileReducer,
    like: likeReducer,
    editReview: editReviewReducer,
    deleteReview: deleteReviewReducer,
    googleSignIn: googleOauth,
    facebookSignIn : facebookOauth,
    followUser: followUserReducer,
    unfollowUser: unfollowUserReducer,
    followUserStatus: followUserStatusReducer,
    myProfile: myProfileReducer,
    googleLink: googleLink,
    googleUnLink: googleUnLink,
    facebookLink: facebookLink,
    facebookUnLink: facebookUnLink
})



const initialState = {}

const middlewear = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewear))
)

export default store;