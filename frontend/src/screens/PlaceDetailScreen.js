import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {placeDetails} from '../actions/campgroundActions'
import {Link} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {Row,Col,Image,Carousel,CarouselItem,ListGroup, Accordion} from 'react-bootstrap'
import ReactStars from "react-rating-stars-component";
import Map from '../components/Map'
import Comment from '../components/Comment'
import AddReview from '../components/AddReview'
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
    

    const ratingChanged = (newRating) => {
        console.log(newRating);
    };

    const displayPic = (pic) => {
      return pic.replace('/upload','/upload/w_550')
    }

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
            setRating(0.5)
        }
        dispatch(placeDetails(match.params.id))
    },[match,dispatch,successNewReview])

    const userReviewAdded = () => {
       if(!isLoggedIn)
       return false
        for(let rev of place.reviews){
           
            
            if(rev.author._id.toString() === userInfo.user._id.toString()){
                return true
            }
        }
        return false
    }
    

    return (
        <div>
            <Link className='btn btn-light my-3' to='/campgrounds'>
                Go Back
            </Link>
            {showEdit && <Link className='btn btn-light my-3' to={`/campground/${match.params.id}/edit`}>
                Edit
            </Link>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                <Row>
                    <Col md={7}>
                        <Carousel className='px-3'>
                            {place && place.image && place.image.length>1 && place.image.map(pic => {
                                return (
                                    <Carousel.Item interval={3000}>
                                        <Image  src={pic} width="800px" rounded fluid/>
                                    </Carousel.Item>
                                )
                            }
                            )}
                        </Carousel>
                    </Col>
                    <Col md={5}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{place.title}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <ReactStars 
                                    size =  {25}
                                    count = {5}
                                    activeColor = "gold"
                                    value = {place.rating}
                                    a11y = {true}
                                    isHalf = {true}
                                    emptyIcon = {<i className="far fa-star" />}
                                    halfIcon = {<i className="fa fa-star-half-alt" />}
                                    filledIcon = {<i className="fa fa-star" />}
                                    onChange = {ratingChanged}
                                    edit = {false}  //MAKES COMPONENT READ ONLY
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <b style={{fontSize: "20px", fontWeight:"bold"}}>Price:</b> {place.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <b style={{fontSize: "20px", fontWeight:"bold"}}>Description:</b> {place.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Col md={10} className="pt-5 px-3 d-flex justify-content-center"  >
                        {place && place.geometry && place.geometry.coordinates.length===2 && <Map campground={place} coOrd = {place.geometry.coordinates}/> }
                    </Col>
                </Row>
                <Row className="pt-4">
                    <Col>
                        <h2>Reviews</h2> 
                        {!userReviewAdded() && <AddReview id={match.params.id}/>}
                        {place.reviews && place.reviews.length === 0 && <Message>No Reviews</Message>}
                        <ListGroup variant="flush">
                            {place.reviews.length > 0 ? (
                            <>
                                {place.reviews.map(review => {
                                    return (
                                        <ListGroup.Item style={{maxWidth: "380px"}}>
                                            <Comment review={review} />
                                        </ListGroup.Item>
                                    )
                                })}
                            </>
                        ) : (null)}
                       
                        </ListGroup>
                        
                        
                    </Col>
                </Row>
                </>
            )}
            
        </div>
    )
}

export default PlaceDetailScreen