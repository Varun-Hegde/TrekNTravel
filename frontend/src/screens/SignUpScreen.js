import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Form, FormGroup, Label, Input,FormFeedback} from 'reactstrap';
import FormContainer from '../components/FormContainer';
import { Button,Row,Col } from 'react-bootstrap';
import { useDispatch,useSelector} from 'react-redux'
import {USER_SIGNUP_RESET} from '../constants/userConstants'
import {signup,status} from '../actions/userActions'
import Fade from 'react-reveal/Fade';
import GoogleLogin from '../components/GoogleLoginButton'
import FacebookLogin from '../components/FacebookLoginButton'

const SignUpScreen = ({location,history}) => {

    const redirect = location.search ? location.search.split('=')[1] : '/campgrounds'
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [username,setUserName] = useState('')

    const [touchedEmail,setTouchedEmail] = useState(false)
    const [touchedPassword,setTouchedPassword] = useState(false)
    const [touchedUsername,setTouchedUsername] = useState(false)

    const dispatch = useDispatch()
    const userSignUp = useSelector(state => state.signUp)
    const {error,loading,userInfo,success} = userSignUp

    const statusState = useSelector(state => state.status)
    const {userInfo: userStatus,isLoggedIn} = statusState

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signup(email,password,username))
    }

    useEffect(async () => {
        if(isLoggedIn){
            history.push(redirect)
        }
        else if(userInfo || userStatus || success || isLoggedIn){
            await dispatch(status())
            dispatch({type:USER_SIGNUP_RESET})
            history.push(redirect)
        }
    },[success,history,userInfo,isLoggedIn,dispatch,userStatus,redirect])

    function validate(){
        const errors = {
            email: '',
            password: '',
            username: ''
        }
        function validateEmail(elementValue){      
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailPattern.test(elementValue); 
        } 
        if(touchedEmail && !validateEmail(email)){
            errors.email = 'Not a valid email'
        }
        if(touchedPassword && password.length < 1){
            errors.password = 'Password should be >= 1 characters'
        }
        if(touchedUsername && username.length<1){
            errors.username = 'Password should be >= 1 characters'
        }
        return errors;
    }

    const errors = validate();
    return (
        <Fade bottom>
            <Link to={redirect} className='btn btn-light my-3'>
                    Go Back
            </Link>
            <FormContainer>
                <h1>Sign Up</h1>
                
                <Form onSubmit={submitHandler}>

                    <FormGroup>
                        <Label htmlFor="username">Username</Label>
                        <Input type="input" id="username" name="username"
                            placeholder="John Doe"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)} 
                            onBlur = {() => setTouchedUsername(true)}
                            valid={ errors.username==='' && username.length>=1}
                            invalid={errors.username !== ''}
                        />
                        <FormFeedback>{errors.username}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name="email"
                            placeholder="abc@def.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            onBlur = {() => setTouchedEmail(true)}
                            valid={ errors.email==='' && email.length>=3}
                            invalid={errors.email !== ''}
                        />
                        <FormFeedback>{errors.email}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            onBlur = {() => setTouchedPassword(true)}
                            valid={ errors.password==='' && password.length>=1}
                            invalid={errors.password !== ''}
                        />
                        <FormFeedback>{errors.password}</FormFeedback>
                    </FormGroup>
                    {loading && <Loader />}
                    {error && <Message variant='danger'>{error}</Message>}
                    <Button
                        block
                        type='submit'
                        color='primary'
                        disabled = {errors.email || errors.password || !email || !password} >
                            Sign Up
                    </Button>
                </Form>
                <center style={{fontSize: '30px', margin:'10px'}}>OR</center>
                <center style={{fontSize: '20px', marginBottom:'5px'}}>Sign in using</center>
                <div className='d-flex justify-content-around'>
                    <GoogleLogin />
                    <FacebookLogin />
                </div>
                <Row className='py-3'>
                    <Col>
                    Aldready have an account? <Link to={redirect ? `/signin?redirect=${redirect}` : '/signin'}>Log in</Link>
                    </Col>
            </Row>
            </FormContainer>
        </Fade>
    )
}

export default SignUpScreen
