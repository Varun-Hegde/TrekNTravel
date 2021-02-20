import React,{useState} from 'react'
import {Row,Col,Card,Accordion,Button} from 'react-bootstrap'
import ReactStars from "react-rating-stars-component";
import { Form, FormGroup, Label, Input,FormFeedback,FormText} from 'reactstrap';
import {useDispatch,useSelector} from 'react-redux'
import {editReviewAction,deleteReviewAction} from '../actions/campgroundActions'
import Loader from './Loader';

const Comment = ({review,reviewAuthor}) => {

    const placeDetails = useSelector(state => state.placeDetail)
    const {place} = placeDetails
    const id = place._id

    const editReviewPlace = useSelector(state => state.editReview)
    const {loading,success,error} = editReviewPlace

    const dispatch = useDispatch()
    const [editReview,setEditReview] = useState(false)
    const [originalComment,setOriginalComment] = useState(review.body)
    const [originalRating,setOriginalRating] = useState(review.rating)
    const [comment,setComment] = useState(review.body)
    const [rating,setRating] = useState(review.rating)
    const editClicked = () => {
        setEditReview(prev => !prev)
    }
    const [touchedComment,setTouchedComment] = useState(false)
    const userStatus = useSelector(state => state.status)
    const {isLoggedIn,userInfo} = userStatus

    const ratingChanged = (newRating) => {
        setRating(newRating);
    };

    const deleteReviewHandler = () => {
        console.log("Hello");
        dispatch(deleteReviewAction(id,review._id))
    }

    function validate() {
        const errors = {
            comment : ''
        };

        if(comment.length<1 && touchedComment){
            errors.comment = "No Comment"
        }

        return errors;
    }
    const errors = validate(comment);
    
    const submitHandler = (e) => {
        e.preventDefault();
        const editReview = {
            body: comment,
            rating: rating
        }
        dispatch(editReviewAction(id,review._id,editReview))
        setOriginalComment(comment)
        setOriginalRating(rating)
        setEditReview(prev => !prev)
    }

    return (
        <div >
            {review  ? (
              <>
                {editReview ? (
                    <>
                        
                        <p  style={{fontSize:"20px", fontWeight:"700"}}>{review.author.username}</p>
                        <p onClick={editClicked}  className='btn btn-light '>Go Back</p>
                        
                        <FormGroup>
                                <Label htmlFor='desc' id='desc'>Description</Label>
                                <Input 
                                    type='textarea' 
                                    name='desc' 
                                    id='desc' 
                                    placeholder="Your Comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onBlur = {() => setTouchedComment(true)}
                                    valid={errors.comment === '' && comment.length > 1}
                                    invalid={errors.comment !== ''}
                                    />
                                    <FormFeedback>{errors.comment}</FormFeedback>
                            </FormGroup>    
                            <ReactStars 
                                    size =  {25}
                                    count = {5}
                                    activeColor = "gold"
                                    value = {rating}
                                    a11y = {true}
                                    isHalf = {true}
                                    emptyIcon = {<i className="far fa-star" />}
                                    halfIcon = {<i className="fa fa-star-half-alt" />}
                                    filledIcon = {<i className="fa fa-star" />}
                                    onChange = {ratingChanged}
                                   
                            />
                            {loading && <Loader />}
                            <Button
                                block
                                type='submit'
                                color="primary"
                                disabled={!comment.length>0}
                                onClick={(e) => submitHandler(e)}
                            >
                                Edit Review
                            </Button>
                    </>
                ) : (
                    <>
                    <Row >
                    <Col md={7} sm={12} style={{fontSize:"20px", fontWeight:"700"}}>{review.author.username}</Col>
                    <Col md={5} sm={12}>
                        <ReactStars 
                            size =  {15}
                            count = {5}
                            activeColor = "gold"
                            value = {originalRating}
                            a11y = {true}
                            isHalf = {true}
                            emptyIcon = {<i className="far fa-star" />}
                            halfIcon = {<i className="fa fa-star-half-alt" />}
                            filledIcon = {<i className="fa fa-star" />}
                            edit = {false}  //MAKES COMPONENT READ ONLY
                        />
                    </Col>
                </Row>
                <Row >
                    <Col>{originalComment}</Col>
                </Row>
                {reviewAuthor ? (
                    <Row>
                    <Col md={3} className='d-flex flex-row pt-2' >
                                <Button onClick={editClicked} variant='light' className='btn-sm'>
                                    <i className='fas fa-edit'></i>
                                </Button>
                                <Button
                                    onClick={deleteReviewHandler}
                                    variant='danger'
                                    className='btn-sm'
                                >
                                <i className='fas fa-trash'></i>
                            </Button>
                    </Col>
                    </Row>
                ) : (null)}
                
                </>
                )}

                
                </>
            ) : (null)}
            
        </div>
    )
}

export default Comment
