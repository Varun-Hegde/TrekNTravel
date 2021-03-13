import React from 'react'
import {Image} from 'react-bootstrap'
const UserFollow = ({username,profilePic,email}) => {
    return (
        <div className='mt-2'>
            {profilePic ? (
                <Image className='mr-4' width="50px" src={`${profilePic}`} fluid rounded/>
            ) : (
                <Image className='mr-4' width="50px" src={`https://avatars.dicebear.com/4.5/api/bottts/${username}.svg`} fluid rounded/>
            )}
            {username}
            
        </div>
    )
}

export default UserFollow
