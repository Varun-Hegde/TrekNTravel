import React,{useEffect} from 'react'
import './App.css';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import { Container } from 'react-bootstrap';
import { useDispatch,useSelector} from 'react-redux'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import PlaceDetailScreen from './screens/PlaceDetailScreen'
import AddNewCampground from './screens/AddNewCampground'
import EditCampgroundDetails from './screens/EditCampgroundDetails'
import SignUpScreen from './screens/SignUpScreen'
import SignInScreen from './screens/SignInScreen'
import {ToastContainer, toast } from 'react-toastify';
import PopUp from './components/PopUp'
import {
  USER_SIGNEDIN_RESET,
  PLACE_LIST_ADDED_PLACE_REMOVE,
  PLACE_DETAIL_EDITED_PLACE_REMOVE,
  USER_SIGNEDUP_RESET

} from './constants/appConstants'
import {status} from './actions/userActions'

function App() {

  const dispatch = useDispatch()
  const appDetail = useSelector(state => state.appDetails)
  const {signInPopUp,addedPlacePopup,editedPlacePopup,signUpPopUp} = appDetail
  
  useEffect(() => {
    dispatch(status())
    // eslint-disable-next-line
  },[])

  const popUpMsg = (displayText) => {
    toast.success(displayText, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }); 
      
    
  }

  useEffect(() => {
    if(signInPopUp){  
            popUpMsg('Login Successfull')
            dispatch({type:USER_SIGNEDIN_RESET})
        }
    if(addedPlacePopup){
      popUpMsg('Added New Campground')
      dispatch({type:PLACE_LIST_ADDED_PLACE_REMOVE })
    }
    if(editedPlacePopup){
      popUpMsg('Edited campground')
      dispatch({type: PLACE_DETAIL_EDITED_PLACE_REMOVE})
    }
    if(signUpPopUp){
      popUpMsg('Successfully created an account')
      dispatch({type: USER_SIGNEDUP_RESET})
    }
  },[signInPopUp,addedPlacePopup,editedPlacePopup,signUpPopUp,dispatch])

  return (
    <Router>
      <Header />
      <PopUp />
      <main className = 'py-3'>
        <Container>
        <Switch>
          <Route exact path='/newcampground' component={AddNewCampground}  />
          <Route exact path='/campground/:id/edit' component={EditCampgroundDetails} />  
          <Route exact path='/campground/:id' component={PlaceDetailScreen}  />  
          <Route exact path='/signup' component={SignUpScreen} />
          <Route exact path='/signin' component={SignInScreen} />
          <Route exact path='/' component={HomeScreen} />  
        </Switch>    
        </Container>  
      </main>
      <Footer />
    </Router>
  );
}

export default App;
