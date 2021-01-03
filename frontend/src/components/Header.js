import React from 'react'
import {Route} from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const Header = () => {
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header