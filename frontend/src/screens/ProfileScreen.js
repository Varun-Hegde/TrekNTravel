import React,{useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {profile } from '../actions/userActions'
import {Row,Col,Image,ListGroup} from 'react-bootstrap'


const ProfileScreen = () => {
    
    const dispatch = useDispatch()

    const data = useSelector(state => state.profile)
    const {loading,error,profile:userProfile} = data
    
    
    useEffect(() => {
        dispatch(profile())
    },[dispatch])
    
    return (
        <div>
            {userProfile ? (
                <>
                <Row>
                    <Col md={5}>
                        <ListGroup className='d-flex align-content-center'>
                            <ListGroup.Item>
                                <Image className='' width="100px" src={`https://avatars.dicebear.com/4.5/api/human/${userProfile.user._id}.svg`} fluid rounded/>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                
                            </ListGroup.Item>
                        </ListGroup>
                        
                    </Col>
                </Row>
                </>
            ) : (null)}
        </div>
    )
}

export default ProfileScreen
