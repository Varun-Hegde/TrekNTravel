import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { Button } from 'react-bootstrap';
import { Form, FormGroup, Label, Input,FormFeedback,FormText} from 'reactstrap';
import {useSelector,useDispatch} from 'react-redux'
import Zoom from 'react-reveal/Zoom';
import {addPlace} from '../actions/campgroundActions'
import {PLACE_CREATE_RESET} from '../constants/campgroundConstants'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {USER_LOGIN_REQUIRED} from '../constants/appConstants'
import axios from 'axios';


const AddNewCampground = ({history}) => {
    const [title,setTitle] = useState('')
    const [price,setPrice] = useState();
    const [description,setDescription] = useState('')
    const [location,setLocation] = useState('')
    const [image,setImage] = useState([])
    const [uploading,setUploading] = useState(false)
    const [uploadedImages,setUploadedImages] = useState('')
    const [uploadErr,setUploadErr] = useState(false)

    const [touchedTitle,setTouchedTitle] = useState(false)
    const [touchedPrice,setTouchedPrice] = useState(false);
    const [touchedDescription,setTouchedDescription] = useState(false)
    const [touchedLocation,setTouchedLocation] = useState(false)
    const [touchedImage,setTouchedImage] = useState(false)
    const [touchedUpload,setTouchedUpload] = useState(false)

    const placeAdd = useSelector(state => state.placeAdd)
    const {loading: loadingAdd,error: errorAdd, success: successAdd} = placeAdd
    const dispatch = useDispatch()

    const statusState = useSelector(state => state.status)
    const {userInfo: userStatus,isLoggedIn} = statusState

    useEffect(() => {
        if(!isLoggedIn){
            dispatch({type:USER_LOGIN_REQUIRED})
            history.push('/signin?redirect=newcampground')
        }

        if(successAdd){
            dispatch({type:PLACE_CREATE_RESET})
            history.push('/')
        }
    },[dispatch,successAdd,history,userStatus,isLoggedIn])

   
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

        
        
        if(touchedImage && image.length<1){
            errors.image = 'Image Invalid'
        }

        if(touchedDescription && description.length<=0)
            errors.desc = 'No Description'

        return errors;
    }

    const onFileChange = (e) => {
        setUploadedImages(e.target.files)
    }

    const submitHandler = async (e) => {
       e.preventDefault()
        var formData = new FormData();
        for (const key of Object.keys(uploadedImages)) {
            formData.append('image',uploadedImages[key])
        }
        setUploading(true)
        let newImageData
        try{
            const config = {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            }
            var {data} = await axios.post('/api/upload',formData,config)
            newImageData = data.filePath
            setImage(newImageData)
            setUploading(false)
            const campgroundDetails = {
                title,
                price,
                description,
                location,
                image:newImageData
            }
            dispatch(addPlace(campgroundDetails))
        }catch(err){
            setUploading(false)
            setUploadErr(true);
            setTouchedUpload(false)
        }
   }
    
    const errors = validate(title);
    return (
        <Zoom bottom>
            <Link to='/' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
            <h1>New Campground</h1>
            
            {uploadErr ? <Message variant='danger'>File must be in jpg or jpeg or png format</Message> : null}
            <Form onSubmit={submitHandler} enctype="multipart/form-data">
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
                    <Label for="exampleFile">File</Label>
                    <Input type="file" name="file" id="exampleFile" multiple={true} onChange={onFileChange} />
                    <FormText color="muted">
                    Upload images of campground
                    </FormText>
                    {uploading && <Loader />}
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
                {loadingAdd ? <Loader /> : null}
                <Button  
                    block 
                    type="submit" 
                    color="primary"
                     disabled = {errors.title || errors.price || errors.location
                        || errors.desc || !title || !uploadedImages || !price || !location || !description} 
                >
                    Add new campground
                </Button>
            </Form>

            </FormContainer>
            
        </Zoom>
    )
}

export default AddNewCampground
