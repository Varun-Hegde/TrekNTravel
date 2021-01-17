import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Form, FormGroup, Label, Input,FormFeedback} from 'reactstrap';
import FormContainer from '../components/FormContainer';
import { Button } from 'react-bootstrap';
import { useDispatch,useSelector} from 'react-redux'

import {signup,status} from '../actions/userActions'

const SignUpScreen = ({location,history}) => {

    const redirect = location.search ? location.search.split('=')[1] : '/'
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    
    const [touchedEmail,setTouchedEmail] = useState(false)
    const [touchedPassword,setTouchedPassword] = useState(false)

    const dispatch = useDispatch()
    const userSignUp = useSelector(state => state.signUp)
    const {error,loading,userInfo,success} = userSignUp

    const statusState = useSelector(state => state.status)
    const {userInfo: userStatus,isLoggedIn} = statusState
    console.log("STATUS STATE IS",statusState);
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signup(email,password))
    }

    useEffect(() => {
        if(userInfo || userStatus || success || isLoggedIn){
            dispatch(status())
            history.push(redirect)
        }
    },[success,history,redirect,userInfo,isLoggedIn])

    function validate(){
        const errors = {
            email: '',
            password: ''
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
        return errors;
    }

    const errors = validate();
    return (
        <>
            <Link to={redirect} className='btn btn-light my-3'>
                    Go Back
            </Link>
            <FormContainer>
                <h1>Sign Up</h1>
                
                <Form onSubmit={submitHandler}>
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
            </FormContainer>
        </>
    )
}

export default SignUpScreen