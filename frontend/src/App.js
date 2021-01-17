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

import {status} from './actions/userActions'

function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(status())
  },[])

  return (
    <Router>
      <Header />
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
