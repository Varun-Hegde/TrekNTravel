import React from 'react'
import GoogleLogin from 'react-google-login'
import {useDispatch} from 'react-redux'
import {googleOauth} from '../actions/userActions'
import {Button} from 'react-bootstrap'

const GoogleLoginButton = () => {
    const dispatch = useDispatch()
    const responseGoogle = (res) => {
        
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
                render={renderProps => (
                <Button variant='danger'className='google' onClick={renderProps.onClick} disabled={renderProps.disabled}><i style={{fontSize: '20px'}} class="fab fa-google pr-2"></i> Google</Button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                className="btn btn-outline-danger"
            />
        </>
    )
}

export default GoogleLoginButton
