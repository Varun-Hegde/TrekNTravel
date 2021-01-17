import {createStore,applyMiddleware,combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {
    placeListReducer,
    placeListDetailReducer,
    placeAddReducer,
    editPlaceReducer
} from './reducers/campgroundReducer'

import {
    signUpReducer,
    statusReducer,
    signInReducer,
    signOutReducer
} from './reducers/userReducer'

const reducer = combineReducers({
    placeList: placeListReducer,
    placeDetail: placeListDetailReducer,
    placeAdd: placeAddReducer,
    placeEdit: editPlaceReducer,
    signUp: signUpReducer,
    signIn: signInReducer,
    signOut: signOutReducer,
    status: statusReducer
})

const initialState = {}

const middlewear = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewear))
)

export default store;