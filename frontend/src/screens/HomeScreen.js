import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Row,Col} from 'react-bootstrap'
import Place from '../components/Place'
import {listPlaces} from '../actions/campgroundActions'
import {Link} from 'react-router-dom'
import Fade from 'react-reveal/Fade';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {PLACE_LIST_ADDED_PLACE_REMOVE} from '../constants/campgroundConstants'
import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = ({history}) => {

    const dispatch = useDispatch()
    const placeList = useSelector(state => state.placeList)
    const {loading,error,places,addedPlace,editedPlace} = placeList
    
    useEffect(()=>{
        dispatch(listPlaces())
        if(addedPlace){
            toast.success('Added new campground', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            dispatch({type:PLACE_LIST_ADDED_PLACE_REMOVE})
        }
        
        
    },[dispatch,addedPlace])



    return (
        <>
            <h1>Welcome to Trek-N-Travel</h1>
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
