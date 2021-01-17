import React,{useState,useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { Button } from 'react-bootstrap';
import { Form, FormGroup, Label, Input,FormFeedback} from 'reactstrap';
import Zoom from 'react-reveal/Zoom';
import Message from '../components/Message'
import {editPlace} from '../actions/campgroundActions'
import {PLACE_EDIT_RESET,} from '../constants/campgroundConstants'
import Loader from '../components/Loader'

const EditCampgroundDetails = ({history,match}) => {
    const placeId = match.params.id

    const placeDetail = useSelector(state => state.placeDetail)
    const {loading,place,error} = placeDetail
    const dispatch = useDispatch()

    const placeEdit = useSelector(state => state.placeEdit)
    const {loading:loadingEdit,success:successEdit,error:errorEdit} = placeEdit

    const [title,setTitle] = useState('')
    const [price,setPrice] = useState();
    const [description,setDescription] = useState('')
    const [location,setLocation] = useState('')
    const [image,setImage] = useState('')

    const [touchedTitle,setTouchedTitle] = useState(false)
    const [touchedPrice,setTouchedPrice] = useState(false);
    const [touchedDescription,setTouchedDescription] = useState(false)
    const [touchedLocation,setTouchedLocation] = useState(false)
    const [touchedImage,setTouchedImage] = useState(false)

    useEffect(()=>{
        if(!place.title){
            history.push(`/campground/${placeId}`)
        }
        if(successEdit){
            dispatch({type: PLACE_EDIT_RESET,})
            history.push(`/campground/${placeId}`)
        }
        setTitle(place.title)
        setImage(place.image)
        setDescription(place.description)
        setPrice(place.price)
        setLocation(place.location)
    },[dispatch,match,history,placeId,place,successEdit])

    function validate() {
        const errors = {
            title: '',
            price: '',
            location: '',
            image: '',
            desc: ''
        };

        if (touchedTitle && title.length < 3)
            errors.title = 'Title should be >= 3 characters';
        
        const reg = /^\d+$/;
        if (touchedPrice && !reg.test(price))
            errors.price = 'Price should contain only numbers';
        if(touchedPrice && price<0)
            errors.price = 'Price should be greater than zero';
        
        if(touchedLocation && location.length<3){
            errors.location = 'Location should be >= 3 characters'
        }

        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        
        if(touchedImage && !pattern.test(image)){
            errors.image = 'Not a valid URL'
        }

        if(touchedDescription && description.length<=0)
            errors.desc = 'No Description'

        return errors;
    }
    
    const errors = validate(title);

    const submitHandler = (e) => {
       e.preventDefault()
        const campgroundDetails = {
            title,
            price,
            description,
            location,
            image,
            
        }
      dispatch(editPlace(campgroundDetails,placeId))
   }

    return (
        <Zoom bottom>
            <Link to={`/${placeId}`} className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
            <h1>Edit Campground</h1>
            {loadingEdit ? <Loader /> : errorEdit ? <Message variant='danger'>{errorEdit}</Message> : null}
            <Form onSubmit={submitHandler}>
                <FormGroup>
                    <Label htmlFor="title">Title</Label>
                        <Input type="text" id="title" name="title"
                            placeholder="Campground title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                            onBlur = {() => setTouchedTitle(true)}
                            valid={ errors.title==='' && title.length>=3}
                            invalid={errors.title !== ''}
                        />
                        <FormFeedback>{errors.title}</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="price">Price</Label>
                        <Input type="text" id="price" name="price"
                            placeholder="Campground price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)} 
                            onBlur = {() => setTouchedPrice(true)}
                            valid={errors.price === '' && parseInt(price)}
                            invalid={errors.price !== ''}
                        />
                        <FormFeedback>{errors.price}</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="location">Location</Label>
                        <Input type="text" id="location" name="location"
                            placeholder="Campground location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)} 
                            onBlur = {() => setTouchedLocation(true)}
                            valid={errors.location === '' && location.length>=3}
                            invalid={errors.location !== ''}
                        />
                        <FormFeedback>{errors.location}</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="image">Image</Label>
                        <Input type="text" id="image" name="image"
                            placeholder="Campground image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)} 
                            onBlur = {() => setTouchedImage(true)}
                            valid={errors.image === '' && image}
                            invalid={errors.image !== ''}
                        />
                        <FormFeedback>{errors.image}</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor='desc' id='desc'>Description</Label>
                    <Input 
                        type='textarea' 
                        name='desc' 
                        id='desc' 
                        placeholder="Campground description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur = {() => setTouchedDescription(true)}
                        valid={errors.desc === '' && description}
                        invalid={errors.desc !== ''}
                        />
                        <FormFeedback>{errors.desc}</FormFeedback>
                </FormGroup>

                <Button  
                    block 
                    type="submit" 
                    color="primary"
                    disabled = {errors.title || errors.price || errors.location
                        || errors.image || errors.desc || !title || !image || !price || !location || !description}
                >
                    Edit campground
                </Button>
            </Form>

            </FormContainer>
            
        </Zoom>
    )
}

export default EditCampgroundDetails
