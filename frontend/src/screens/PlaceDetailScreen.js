import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {placeDetails} from '../actions/campgroundActions'
import {Link} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {Row,Col,Image} from 'react-bootstrap'
import {addReview} from '../actions/campgroundActions'
import ReactStars from "react-rating-stars-component";

const PlaceDetailScreen = ({match}) => {

    const dispatch = useDispatch()

    const placeDetail = useSelector(state => state.placeDetail)
    const {loading,place,error} = placeDetail 
    
    const userStatus = useSelector(state => state.status)
    const {isLoggedIn,userInfo} = userStatus
   
    const newReview = useSelector(state => state.newReview)
    const {loading:loadingNewReview,error:errorNewReview,success:successNewReview} = newReview

    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState('')

    const starRating = {
        size: 25,
        count: 5,
        activeColor: "gold",
        value: 4.8,
        a11y: true,
        isHalf: true,
        emptyIcon: <i className="far fa-star" />,
        halfIcon: <i className="fa fa-star-half-alt" />,
        filledIcon: <i className="fa fa-star" />,
        onChange: (newValue) => {
            console.log(`${newValue}`);
        },
        edit:false  //MAKES COMPONENT READ ONLY
    };


    let showEdit = false
    if(!isLoggedIn){
        showEdit = false;
    }else{
        if(!loading && isLoggedIn){
            {
                if(userInfo.user._id === place.author._id)
                    showEdit = true
            }
    }
    }
    

    useEffect(() => {
        if(successNewReview){
            setComment('')
            setRating(0)
        }
        dispatch(placeDetails(match.params.id))
    },[match,dispatch,successNewReview])

    const reviewSubmithandler = (e) => {
        e.preventDefault()
        dispatch(addReview(comment,rating,match.params.id))
    }

    return (
        <div>
            <Link className='btn btn-light my-3' to='/'>
                Go Back
            </Link>
            {showEdit && <Link className='btn btn-light my-3' to={`/campground/${match.params.id}/edit`}>
                Edit
            </Link>}
            
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                <Row>
                    <Col md={5}>
                        <Image src={place.image} alt={place.name} fluid />
                        <h1>{place.title}</h1>
                    </Col>
                    
                </Row>
                <ReactStars {...starRating} />
                {isLoggedIn && (
                <Row>
                   <Col>
                    <h3>Reviews</h3>

                    <div>
                        Rating
                    <input type='text' value={rating} onChange={(e) => setRating(e.target.value)} />
                    </div>
                    <div><p>Comment</p> <input type='text' value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                   {loadingNewReview ? <Loader /> : errorNewReview ? <Message variant='danger'>{errorNewReview}</Message> : null}
                    <button onClick = {reviewSubmithandler}>Submit</button>
                </Col>
                </Row> )}
                <Row>
                    <h3>Reviews</h3>
                    {place.reviews.map(review => {
                        return (
                            <Col key={review._id} md={12}>
                                {review.body} - 
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