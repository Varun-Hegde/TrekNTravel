import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Row,Col} from 'react-bootstrap'
import Place from '../components/Place'
import {listPlaces} from '../actions/campgroundActions'
import {Link} from 'react-router-dom'
import Fade from 'react-reveal/Fade';

import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = ({history}) => {

    const dispatch = useDispatch()
    const placeList = useSelector(state => state.placeList)
    const {loading,error,places} = placeList
    
    useEffect(()=>{
        dispatch(listPlaces())
    },[dispatch])



    return (
        <>
            <h1>Welcome to Trek-N-Travel</h1>
            
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Row>
                    {places.length>0 ? places.map(place => (
                        <Col  key={place._id} sm={12} md={6} lg={4} >
                            <Fade bottom>
                                <Place place={place} history={history} />
                            </Fade>                        
                        </Col>
                        
                    )) : ( 
                        <Message variant='info'>No product found. <Link to='/'>Go Back</Link> </Message>
                    )}
                </Row>
            )}
            
            
        </>
    )
}

export default HomeScreen