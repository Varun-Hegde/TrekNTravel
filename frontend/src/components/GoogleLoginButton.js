import React from 'react'
import GoogleLogin from 'react-google-login'
import {useDispatch} from 'react-redux'
import {googleOauth} from '../actions/userActions'

const GoogleLoginButton = () => {
    const dispatch = useDispatch()
    const responseGoogle = (res) => {
        console.log(res);
        const data = {
            access_token: res.accessToken
        }
        console.log(data)
        dispatch(googleOauth(data))
    }
    
    return (
        <>
            <GoogleLogin
                clientId = "191396252820-3cmrdlajhok0enub0mr6ij577g2ruc7f.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                
            />
        </>
    )
}

export default GoogleLoginButton
