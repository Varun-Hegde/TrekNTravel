import React,{useEffect} from 'react'
import './LandingScreen.css'
import { useDispatch,useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import {signout,status} from '../actions/userActions'
const LandingScreen = () => {
  
    const signOutDetails = useSelector(state => state.signOut)
    const {success,error} = signOutDetails
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(status())
    },[success,error,dispatch])
    
    const logoutHandler = () => {
        dispatch(signout())
    }

    const statusState = useSelector(state => state.status)
    const {userInfo: userStatus,isLoggedIn} = statusState

    return (
        <div  className="d-flex text-center text-white bg-dark body">
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="mb-auto">
            <div className="landing-navbar">
                <h3 style={{color: "white"}} className="float-md-left mb-0">Trek-N-Travel</h3>
                <nav className="nav nav-masthead justify-content-center float-md-right">
                    <a className="nav-link active" aria-current="page" href='/'><i class="fas fa-home"></i> Home</a>
                    <a className="nav-link" href="/campgrounds"><i class="fas fa-campground"></i> Campgrounds</a>
                    {isLoggedIn ? (
                        <a className="nav-link" href="#" onClick={logoutHandler}>Logout</a>
                    ) : (
                        <>
                        
                        <a className="nav-link" href="/signup"><i class="fas fa-user-plus"></i>  Register</a>
                        <a className="nav-link" href="/signin"><i class="fas fa-user"></i>  Login</a>
                        </>
                    )}
                    
             
                    
              
                </nav>
            </div>
        </header>
        <main className="px-3 py-5 landing-header">
            <h1 style={{color: "white"}}>Trek-N-Travel</h1>
            <p className="lead"> Welcome to Trek-N-Travel! <br /> Jump right in and explore our many campgrounds. <br />
                Feel free to share some of your own and comment on others!</p>
            <a href="/campgrounds" className="btn btn-lg btn-secondary font-weight-bold border-white bg-white">View
                Campgrounds</a>
        </main>

        <footer className="mt-auto text-white-50">
            <p>&copy; 2020 </p>
        </footer>


    </div>
    <ul class="slideshow">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
        </div>
    )
}

export default LandingScreen
