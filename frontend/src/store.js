import {createStore,applyMiddleware,combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {
    placeListReducer,
    placeListDetailReducer,
    placeAddReducer
} from './reducers/campgroundReducer'

const reducer = combineReducers({
    placeList: placeListReducer,
    placeDetail: placeListDetailReducer,
    placeAdd: placeAddReducer
})

const initialState = {}

const middlewear = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewear))
)

export default store;