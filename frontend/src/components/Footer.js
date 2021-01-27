import React from 'react'
import {Container,Row,Col} from 'react-bootstrap'



const Footer = () => {
    return (
        <footer>
            <Container>
                <Row className='d-flex flex-column'>
                    <Col className='text-center py-3'>
                        Copyright &copy; TrekNTravel
                    </Col>
                    <Col className='text-center pb-3'>
                        <a style={{textDecoration:'none'}} target="_blank" href='https://github.com/Varun-Hegde'>
                                Built with <i style={{color:"red"}} className="fas fa-heart"></i> by Varun
                        </a>
                    </Col>
                </Row>
                
            </Container>
        </footer>
    )
}

export default Footer
 