import React from 'react'
import './App.css';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import { Container } from 'react-bootstrap';

import Header from './components/Header'
import Footer from './components/Footer'

import HomeScreen from './screens/HomeScreen'
import PlaceDetailScreen from './screens/PlaceDetailScreen'
import AddNewCampground from './screens/AddNewCampground'
import EditCampgroundDetails from './screens/EditCampgroundDetails'

function App() {
  return (
    <Router>
      <Header />
      <main className = 'py-3'>
        <Container>
        <Switch>
          <Route path='/newcampground' component={AddNewCampground}  />
          <Route path='/campground/:id/edit' component={EditCampgroundDetails} />  
          <Route path='/campground/:id' component={PlaceDetailScreen} exact />  
          <Route path='/' component={HomeScreen} exact />  
        </Switch>    
        </Container>  
      </main>
      <Footer />
    </Router>
  );
}

export default App;
