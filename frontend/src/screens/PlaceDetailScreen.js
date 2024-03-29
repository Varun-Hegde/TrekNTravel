import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  placeDetails,
  likeAction,
  deletePlace,
} from "../actions/campgroundActions";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col, Image, Carousel, ListGroup, Button } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import Map from "../components/Map";
import Comment from "../components/Comment";
import AddReview from "../components/AddReview";
import Fade from "react-reveal/Fade";
import {
  followUserAction,
  unfollowUserAction,
  followUserStatusAction,
} from "../actions/userActions";
import { PLACE_DELETE_RESET } from "../constants/campgroundConstants";
import NumberFormat from "react-number-format";
import moment from "moment";
import io from "socket.io-client";
import getUserInfo from "../utils/getUserInfo";
import MessageNotificationModal from "../components/ModalPopUp";
import newMsgReceived from "../utils/newMsgSound";
import Notification from "../components/NotificationAlert";
import Meta from "../components/Meta";

const PlaceDetailScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const placeDetail = useSelector((state) => state.placeDetail);
  const { loading, place, error } = placeDetail;
  const [userLiked, setUserLiked] = useState(false);

  const deleteReview = useSelector((state) => state.deleteReview);
  const { success: successDeleteReview } = deleteReview;

  const [totalLikes, setTotalLikes] = useState(0);

  const userStatus = useSelector((state) => state.status);
  const { isLoggedIn, userInfo } = userStatus;

  const newReview = useSelector((state) => state.newReview);
  const { success: successNewReview } = newReview;

  const followUserStatus = useSelector((state) => state.followUserStatus);
  const { follow: followUserFollowing } = followUserStatus;

  const followUserReducer = useSelector((state) => state.followUser);
  const { success: fuSuccess } = followUserReducer;

  const unfollowUserReducer = useSelector((state) => state.unfollowUser);
  const { success: ufuSuccess } = unfollowUserReducer;

  const deletedPlace = useSelector((state) => state.placeDelete);
  const { success: successDelete } = deletedPlace;

  // eslint-disable-next-line
  const [rating, setRating] = useState(0);
  // eslint-disable-next-line
  const [comment, setComment] = useState("");

  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const [open, setOpen] = useState(false);

  const [newNotificationComment, setNewNotificationComment] = useState(null);
  const [notificationCommentPopUp, setNotificationCommentPopup] =
    useState(false);

  const [newNotificationFollower, setNewNotificationFollower] = useState(null);
  const [notificationFollowerPopUp, setNotificationFollowerPopup] =
    useState(false);

  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  let showEdit = false;
  if (!isLoggedIn) {
    showEdit = false;
  } else {
    if (!loading && isLoggedIn && userInfo && place) {
      if (userInfo.user._id === place.author._id || userInfo.user.isAdmin)
        showEdit = true;
    }
  }
  const socket = useRef();
  const [newMessageReceived, setNewMessageReceived] = useState();
  const [newMessageModal, showNewMessageModal] = useState(false);

  //SOCKETS
  useEffect(() => {
    if (userInfo && userInfo.user) {
      if (!socket.current) {
        socket.current = io("http://localhost:5000");
      }
      if (socket.current) {
        socket.current.emit("join", { userId: userInfo.user._id });

        socket.current.on("newMsgReceived", async ({ newMsg }) => {
          const { name, profilePic } = await getUserInfo(newMsg.sender);

          if (userInfo.user.newMessagePopUp) {
            setNewMessageReceived({
              ...newMsg,
              senderName: name,
              senderProfilePic: profilePic,
            });
            showNewMessageModal(true);
          }
          newMsgReceived(name);
        });
      }

      return () => {
        if (socket.current) {
          socket.current.emit("disconnect");
          socket.current.off(); //removes the event listener
        }
      };
    }
  }, [userInfo]);

  //NOTIFICATIONS
  useEffect(() => {
    if (userInfo && userInfo.user) {
      if (socket.current) {
        //LIKE NOTIFICATION
        socket.current.on(
          "newNotificationReceived",
          ({ username, profilePic, postId }) => {
            setNewNotification({ username, profilePic, postId });

            setNotificationPopUp(true);
            setOpen(true);
          }
        );

        //COMMENT NOTIFICATION
        socket.current.on(
          "newCommentNotificationReceived",
          ({ username, postId }) => {
            setNewNotificationComment({ username, postId });
            setNotificationCommentPopup(true);
            setOpen(true);
          }
        );

        //FOLLOWER NOTIFICATION
        socket.current.on("newFollowerNotificationReceived", ({ username }) => {
          setNewNotificationFollower({ username });
          setNotificationFollowerPopup(true);
          setOpen(true);
        });
      }
    }
  }, [userInfo]);

  //Send new notification on comment added
  useEffect(() => {
    if (place && place.author && userInfo) {
      if (successNewReview === true) {
        if (socket.current) {
          socket.current.emit("newComment", {
            postId: place._id,
            userId: userInfo.user._id,
            postAuthor: place.author._id,
            username: userInfo.user.username,
          });
        }
      }
    }
  }, [successNewReview, userInfo, place]);

  //Send new notification on follow
  useEffect(() => {
    if (place && place.author && userInfo) {
      if (fuSuccess) {
        if (socket.current) {
          socket.current.emit("newFollower", {
            userId: userInfo.user._id,
            userToFollow: place.author._id,
            username: userInfo.user.username,
          });
        }
      }
    }
  }, [fuSuccess, userInfo, place]);

  useEffect(() => {
    setUserLiked(false);
    dispatch(placeDetails(match.params.id));
  }, [successNewReview, match, dispatch, match.params.id, successDeleteReview]);

  useEffect(() => {
    if (isLoggedIn && place && place.author) {
      dispatch(followUserStatusAction(place.author.username));
    }
  }, [place, ufuSuccess, fuSuccess, dispatch, isLoggedIn]);

  useEffect(() => {
    if (successNewReview) {
      setComment("");
      setRating(0.5);
    }
    if (isLoggedIn && place && place.likes && place.likes.length > 0) {
      for (let p of place.likes) {
        if (p === userInfo.user._id) {
          setUserLiked(true);
          break;
        }
      }
    }
    if (place && place.likes) {
      setTotalLikes(place.likes.length);
    }
    // eslint-disable-next-line
  }, [match, dispatch, match.params.id, place, isLoggedIn, successNewReview]);

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: PLACE_DELETE_RESET });
      history.push("/campgrounds");
    }
  }, [successDelete, dispatch, history]);

  const userReviewAdded = () => {
    if (!isLoggedIn) return false;
    for (let rev of place.reviews) {
      if (rev.author._id.toString() === userInfo.user._id.toString()) {
        return true;
      }
    }
    return false;
  };

  const likePlace = () => {
    if (userLiked) {
      setTotalLikes((prev) => prev - 1);
    } else {
      setTotalLikes((prev) => prev + 1);
    }
    if (socket.current) {
      socket.current.emit("likePost", {
        postId: place._id,
        userId: userInfo.user._id,
        like: userLiked ? false : true,
      });

      socket.current.on("postLiked", () => {
        if (userLiked) {
          setUserLiked(false);
        } else {
          setUserLiked(true);
        }
      });
    } else {
      dispatch(likeAction(match.params.id));
      if (userLiked) {
        setUserLiked(false);
      } else {
        setUserLiked(true);
      }
    }
  };

  const followUserHandler = () => {
    dispatch(followUserAction(place.author.username));
  };

  const unfollowUserHandler = () => {
    dispatch(unfollowUserAction(place.author.username));
  };

  const deletePlaceHandler = () => {
    dispatch(deletePlace(match.params.id));
  };

  return (
    <Fade bottom>
      {place && <Meta title={place.title} />}
      <div>
        {notificationPopUp && newNotification != null && (
          <Notification
            open={open}
            setOpen={setOpen}
            newNotification={newNotification}
            notificationPopUp={notificationPopUp}
            showNotificationPopUp={setNotificationPopUp}
            msg={`${newNotification.username} liked your post`}
          />
        )}

        {notificationCommentPopUp && newNotificationComment != null && (
          <Notification
            open={open}
            setOpen={setOpen}
            newNotification={newNotificationComment}
            notificationPopUp={notificationCommentPopUp}
            showNotificationPopUp={setNotificationCommentPopup}
            msg={`${newNotificationComment.username} commented on your post`}
          />
        )}

        {notificationFollowerPopUp && newNotificationFollower != null && (
          <Notification
            open={open}
            setOpen={setOpen}
            newNotification={newNotificationFollower}
            notificationPopUp={notificationFollowerPopUp}
            showNotificationPopUp={setNotificationFollowerPopup}
            msg={`${newNotificationFollower.username} started following you`}
          />
        )}

        {newMessageModal && newMessageReceived !== null && (
          <MessageNotificationModal
            socket={socket}
            showNewMessageModal={showNewMessageModal}
            newMessageModal={newMessageModal}
            newMessageReceived={newMessageReceived}
            user={userInfo.user}
          />
        )}

        <Link className="btn btn-light my-3" to="/campgrounds">
          Go Back
        </Link>

        {showEdit && (
          <Link
            className="btn btn-light my-3"
            to={`/campground/${match.params.id}/edit`}
          >
            Edit
          </Link>
        )}

        {showEdit && (
          <Button className="btn btn-light my-3" onClick={deletePlaceHandler}>
            Delete
          </Button>
        )}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">No Information found</Message>
        ) : (
          <Fade bottom>
            <Row>
              <Col md={7}>
                <Carousel className="px-3">
                  {place &&
                    place.image &&
                    place.image.length >= 1 &&
                    place.image.map((pic) => {
                      return (
                        <Carousel.Item interval={3000}>
                          <Image src={pic} width="800px" rounded fluid />
                        </Carousel.Item>
                      );
                    })}
                </Carousel>
              </Col>
              <Col md={5}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{place.title}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex  align-items-center">
                    <ReactStars
                      size={25}
                      count={5}
                      activeColor="gold"
                      value={place.rating}
                      a11y={true}
                      isHalf={true}
                      emptyIcon={<i className="far fa-star" />}
                      halfIcon={<i className="fa fa-star-half-alt" />}
                      filledIcon={<i className="fa fa-star" />}
                      onChange={ratingChanged}
                      edit={false} //MAKES COMPONENT READ ONLY
                    />
                    <div className="pl-2">{place.numReviews} reviews</div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b style={{ fontSize: "20px", fontWeight: "bold" }}>
                      Tags:
                    </b>
                    {place.tags && place.tags.length > 0
                      ? place.tags.map((tag) => {
                          return " " + tag.tag + ", ";
                        })
                      : null}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b style={{ fontSize: "20px", fontWeight: "bold" }}>
                      Price:
                    </b>
                    <NumberFormat
                      style={{ border: "none" }}
                      className={"ml-2"}
                      thousandSeparator={true}
                      thousandsGroupStyle="lakh"
                      prefix={"₹"}
                      value={place.price}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {moment(place.createdAt).format("MMMM Do YYYY, h:mm a")}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b style={{ fontSize: "20px", fontWeight: "bold" }}>
                      Description:
                    </b>{" "}
                    {place.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center">
              <Col md={10} className="pt-5 px-3 d-flex justify-content-center">
                {place &&
                  place.geometry &&
                  place.geometry.coordinates.length === 2 && (
                    <Map
                      campground={place}
                      coOrd={place.geometry.coordinates}
                    />
                  )}
              </Col>
            </Row>

            <div className="mt-3 d-flex">
              {isLoggedIn ? (
                <div className="likeHover" onClick={isLoggedIn && likePlace}>
                  {userLiked ? (
                    <h3>
                      <i
                        style={{ color: "#318CE7" }}
                        class="fas fa-thumbs-up"
                      ></i>{" "}
                      {totalLikes}
                    </h3>
                  ) : (
                    <h3>
                      <i class="far fa-thumbs-up"></i> {totalLikes}
                    </h3>
                  )}
                </div>
              ) : (
                <div>
                  <h3>
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/signin?redirect=/campground/${match.params.id}`}
                    >
                      <i class="far fa-thumbs-up"></i> {totalLikes}
                    </Link>
                  </h3>
                </div>
              )}
              <div className="ml-5">
                <h3>
                  <i class="far fa-comment-alt"></i>{" "}
                  {place.reviews && place.reviews.length}
                </h3>
              </div>
            </div>
            <Row className="authorDetails">
              <h3>Written By</h3>
              <div className="d-flex justify-content-between">
                <div>
                  <Link to={`/user-profile/${place.author.username}`}>
                    <p className="heading">{place.author.username}</p>
                  </Link>
                  <p>{place.author.description} </p>
                </div>
                <div className="ml-4">
                  {!isLoggedIn ? (
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/signin?redirect=/campground/${match.params.id}`}
                    >
                      <Button variant="success">Follow</Button>
                    </Link>
                  ) : (
                    <>
                      {isLoggedIn &&
                      place.author.username ===
                        userInfo.user.username ? null : (
                        <>
                          {followUserFollowing ? (
                            <Button
                              onClick={unfollowUserHandler}
                              variant="outline-success"
                            >
                              Following
                            </Button>
                          ) : (
                            <Button
                              onClick={followUserHandler}
                              variant="success"
                            >
                              Follow
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Row>
            <Row className="pt-4">
              <Col>
                <h2>Reviews</h2>
                {!userReviewAdded() && (
                  <AddReview
                    socket={socket}
                    id={match.params.id}
                    author={place.author._id}
                  />
                )}
                {place.reviews && place.reviews.length === 0 && (
                  <Message>No Reviews</Message>
                )}
                <ListGroup variant="flush">
                  {place.reviews.length > 0 ? (
                    <>
                      {place.reviews.map((review) => {
                        return (
                          <ListGroup.Item style={{ maxWidth: "380px" }}>
                            {isLoggedIn &&
                            (review.author._id === userInfo.user._id ||
                              userInfo.user.isAdmin) ? (
                              <Comment review={review} reviewAuthor={true} />
                            ) : (
                              <Comment
                                review={review}
                                reviewAuthor={false}
                                id={match.params.id}
                              />
                            )}
                          </ListGroup.Item>
                        );
                      })}
                    </>
                  ) : null}
                </ListGroup>
              </Col>
            </Row>
          </Fade>
        )}
      </div>
    </Fade>
  );
};

export default PlaceDetailScreen;
