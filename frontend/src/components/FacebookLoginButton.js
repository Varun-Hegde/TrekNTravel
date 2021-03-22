import React from 'react'
import FacebookLogin from 'react-facebook-login';
import {useDispatch} from 'react-redux'
import {facebookOauth} from '../actions/userActions'


const FacebookLoginButton = () => {
    const dispatch = useDispatch()

    const responseFacebook = (res) => {
        const data = {
            access_token: res.accessToken
        }
        console.log(data)
        dispatch(facebookOauth(data))
    }

    return (
        <FacebookLogin
            appId="188326146161766"
            autoLoad={true}
            fields="name,email,picture"
            
            callback={responseFacebook} 
        />
    )
}

export default FacebookLoginButton
