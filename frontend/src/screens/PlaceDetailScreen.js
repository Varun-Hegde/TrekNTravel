import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {placeDetails} from '../actions/campgroundActions'
import {Link} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {Row,Col,Image} from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import {PLACE_DETAIL_EDITED_PLACE_REMOVE} from '../constants/campgroundConstants'

const PlaceDetailScreen = ({match}) => {

    const placeDetail = useSelector(state => state.placeDetail)
    const {loading,place,error,editedPlace} = placeDetail 
    const dispatch = useDispatch()

    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState('')

    useEffect(() => {
        dispatch(placeDetails(match.params.id))
        if(editedPlace){
            toast.success('Updated campground', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            dispatch({type:PLACE_DETAIL_EDITED_PLACE_REMOVE})
        }
    },[match,dispatch])

    const reviewSubmithandler = () => {

    }

    return (
        <div>
            <Link className='btn btn-light my-3' to='/'>
                Go Back
            </Link>
            {!error && <Link className='btn btn-light my-3' to={`/campground/${match.params.id}/edit`}>
                Edit
            </Link>}
            <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                <Row>
                    <Col md={5}>
                        <Image src={place.image} alt={place.name} fluid />
                        <h1>{place.title}</h1>
                    </Col>
                    
                </Row>
                <Row>
                   <Col>
                    <h3>Reviews</h3>
                    <div>
                        Rating
                    <input type='text' value={rating} onChange={(e) => setRating(e.target.value)} />
                    </div>
                    <div><p>Comment</p> <input type='text' value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                   
                    <button onClick = {reviewSubmithandler}>Submit</button>
                </Col>
                </Row>
                <Row>
                    <h3>Reviews</h3>
                    {place.reviews.map(review => {
                        return (
                            <Col md={12}>
                                {review.body}
                                {review.rating}
                            </Col>
                        )
                        }
                    )}
                </Row>
                </>
            )}
        </div>
    )
}

export default PlaceDetailScreen
