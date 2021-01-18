import React,{useEffect} from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import {signout,status} from '../actions/userActions'
const Header = () => {

  const dispatch = useDispatch()
  const userStatus = useSelector(state => state.status)
  const {userInfo} = userStatus

  const signOutDetails = useSelector(state => state.signOut)
  const {success,error} = signOutDetails

  useEffect(() => {
    dispatch(status())
  },[success,error,dispatch])

  const logoutHandler = () => {
    dispatch(signout())
  }
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>TrekNTravel</Navbar.Brand>
          </LinkContainer> 
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav>
                <LinkContainer to='/' exact>
                    <Nav.Link>
                        <i class="fas fa-home"></i> Home
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer  to='/newcampground'>
                    <Nav.Link>
                      <i class="fas fa-plus-square"></i> New Place
                    </Nav.Link>
                </LinkContainer>
            </Nav>
            <Nav className='ml-auto'>
              

              {userInfo ? (
              <NavDropdown title={userInfo.user.email} id='username'>
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>Sign Out</NavDropdown.Item>
              </NavDropdown>  ) : (
                <>
                <LinkContainer to='/signup' >
                  <Nav.Link>
                    <i class="fas fa-user-plus"></i> Sign Up
                  </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/signin' >
                  <Nav.Link>
                    <i class="fas fa-user"></i> Sign In
                  </Nav.Link>
              </LinkContainer>
              </>
              )}



            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header