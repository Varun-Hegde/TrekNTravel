import React from 'react'
import {Row,Col} from 'react-bootstrap'
import ReactStars from "react-rating-stars-component";

const Comment = ({review}) => {

    return (
        <div >
            {review  ? (
              <>
                <Row style={{width: "420px"}}>
                    <Col md={7} style={{fontSize:"20px", fontWeight:"700"}}>{review.author.username}</Col>
                    <Col md={5}>
                        <ReactStars 
                            size =  {15}
                            count = {5}
                            activeColor = "gold"
                            value = {review.rating}
                            a11y = {true}
                            isHalf = {true}
                            emptyIcon = {<i className="far fa-star" />}
                            halfIcon = {<i className="fa fa-star-half-alt" />}
                            filledIcon = {<i className="fa fa-star" />}
                            edit = {false}  //MAKES COMPONENT READ ONLY
                        />
                    </Col>
                </Row>
                <Row >
                    <Col>{review.body}</Col>
                </Row>
                </>
            ) : (null)}
            
        </div>
    )
}

export default Comment
