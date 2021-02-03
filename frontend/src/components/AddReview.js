import React,{useState,useEffect} from 'react'
import { Accordion,Button,Card } from 'react-bootstrap'
import FormContainer from './FormContainer'
import ReactStars from "react-rating-stars-component";
import { Form, FormGroup, Label, Input,FormFeedback,FormText} from 'reactstrap';
import './AddReview.css'
import {useDispatch,useSelector} from 'react-redux'
import {addReview} from '../actions/campgroundActions'
import { Link } from 'react-router-dom';


const AddReview = ({id}) => {

    const dispatch = useDispatch()
    const [rating,setRating] = useState(0.5)
    const [comment,setComment] = useState('')
    const [touchedComment,setTouchedComment] = useState(false)

    const userStatus = useSelector(state => state.status)
    const {isLoggedIn,userInfo} = userStatus

    const ratingChanged = (newRating) => {
        setRating(newRating);
    };

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
        dispatch(addReview(comment,rating,id))
    }

    
    return (
        <div>
            <Accordion style={{maxWidth:"500px",paddingBottom:'20px'}} defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle className='cursor' as={Card.Header} eventKey="0">
                    Add Review
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        {isLoggedIn ? ( 
                            <Card.Body>
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
                            <Button
                                block
                                type='submit'
                                color="primary"
                                disabled={!comment.length>0}
                                onClick={(e) => submitHandler(e)}
                            >
                                Add Review
                            </Button>
                        
                        </Card.Body>
                        ) : ( 
                            <Card.Body>
                                You need to be signed in to add a review.<Link  to={`/signin?redirect=/campground/${id}`}> Click here to sign in.</Link>
                            </Card.Body>
                        )}
                        
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}

export default AddReview
