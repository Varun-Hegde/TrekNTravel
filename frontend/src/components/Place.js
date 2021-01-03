import {Card} from 'react-bootstrap'
import React from 'react'
import './Place.css'

const Place = ({place,history}) => {

    const clickhandler = () => {
        history.push(`/${place._id}`)
    }

    return(
        <>
            <Card onClick={clickhandler} className='my-5 mx-2 p-1 rounded place'>
                <Card.Img variant="top" src={place.image} fluid />
                <Card.Body>
                    <Card.Title>{place.title}</Card.Title>
                    <Card.Text>
                        
                        {place.description.substring(0,50)} ......
                        
                    </Card.Text>
                    <Card.Text>
                        <i class="fas fa-map-marker-alt"></i> {place.location}
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}

export default  Place