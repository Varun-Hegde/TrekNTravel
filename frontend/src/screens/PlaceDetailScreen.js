import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {placeDetails} from '../actions/campgroundActions'
import {Link} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {Row,Col,Image} from 'react-bootstrap'

const PlaceDetailScreen = ({match}) => {

    const placeDetail = useSelector(state => state.placeDetail)
    const {loading,place,error} = placeDetail 
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(placeDetails(match.params.id))
    },[match,dispatch])

    return (
        <div>
            <Link className='btn btn-light my-3' to='/'>
                Go Back
            </Link>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Row>
                    <Col md={5}>
                        <Image src={place.image} alt={place.name} fluid />
                        <h1>{place.title}</h1>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default PlaceDetailScreen
