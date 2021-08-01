import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userMyProfileAction } from "../actions/userActions";
import { Row, Col, Image } from "react-bootstrap";
import Fade from "react-reveal/Fade";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Place from "../components/PlaceProfile";
import UserFollow from "../components/UserFollow";
import Accounts from "../components/Accounts";
import { Facebook } from "react-content-loader";
import io from "socket.io-client";
import getUserInfo from "../utils/getUserInfo";
import MessageNotificationModal from "../components/ModalPopUp";
import newMsgReceived from "../utils/newMsgSound";
import Notification from "../components/NotificationAlert";
import Meta from "../components/Meta";

function TabPanel(props) {
  const { profile, children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { profile, history } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          style={{ backgroundColor: "rgb(52,58,64)", color: "white" }}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="My Campgrounds" {...a11yProps(0)} />
          <Tab label="Accounts Linked" {...a11yProps(1)} />
          <Tab label="Followers" {...a11yProps(2)} />
          <Tab label="Following" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Row>
          {profile && profile.campgrounds.length === 0 ? (
            <p>You have not posted any places</p>
          ) : null}
          {profile &&
            profile.campgrounds.map((campground) => {
              return (
                <Col key={campground._id} sm={12} md={6} lg={4}>
                  <Fade bottom>
                    <Place place={campground} history={history} />
                  </Fade>
                </Col>
              );
            })}
        </Row>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Row>{profile && <Accounts profile={profile.user} />}</Row>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Row>
          <center>
            <h4>{profile && profile.followers.length} followers</h4>
          </center>
          {profile && profile.followers.length === 0 ? (
            <p>You do not have any followers</p>
          ) : (
            <Row>
              {profile.followers.map((followerData) => {
                return (
                  <Col key={followerData._id} sm={12}>
                    <Fade bottom>
                      <UserFollow
                        username={followerData.follower.username}
                        profilePic={followerData.follower.profilePic}
                        email={followerData.follower.email}
                      />
                    </Fade>
                  </Col>
                );
              })}
            </Row>
          )}
        </Row>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Row>
          <center>
            <h4>{profile && profile.following.length} following</h4>
          </center>
          {profile && profile.following.length === 0 ? (
            <p>You are not following anyone</p>
          ) : (
            <Row>
              {profile.following.map((followingData) => {
                return (
                  <Col key={followingData._id} sm={12}>
                    <Fade bottom>
                      <UserFollow
                        username={followingData.following.username}
                        profilePic={followingData.follower.profilePic}
                        email={followingData.follower.email}
                      />
                    </Fade>
                  </Col>
                );
              })}
            </Row>
          )}
        </Row>
      </TabPanel>
    </div>
  );
}

const ProfileScreen = ({ history }) => {
  const myProfile = useSelector((state) => state.myProfile);
  const { loading, profile } = myProfile;

  const dispatch = useDispatch();

  const userStatus = useSelector((state) => state.status);
  const { isLoggedIn, userInfo } = userStatus;

  const googleLinkStore = useSelector((state) => state.googleLink);
  const googleUnLinkStore = useSelector((state) => state.googleUnLink);
  const facebookLinkStore = useSelector((state) => state.facebookLink);
  const facebookUnLinkStore = useSelector((state) => state.facebookUnLink);

  const { success: googleLinkSuccess } = googleLinkStore;
  const { success: googleUnLinkSuccess } = googleUnLinkStore;
  const { success: facebookLinkSuccess } = facebookLinkStore;
  const { success: facebookUnLinkSuccess } = facebookUnLinkStore;

  const socket = useRef();
  const [newMessageReceived, setNewMessageReceived] = useState();
  const [newMessageModal, showNewMessageModal] = useState(false);

  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopUp, setNotificationPopUp] = useState(false);
  const [open, setOpen] = useState(false);

  const [newNotificationComment, setNewNotificationComment] = useState(null);
  const [notificationCommentPopUp, setNotificationCommentPopup] =
    useState(false);

  const [newNotificationFollower, setNewNotificationFollower] = useState(null);
  const [notificationFollowerPopUp, setNotificationFollowerPopup] =
    useState(false);

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
            console.log("receiver event ");
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

      return () => {
        if (socket.current) {
          socket.current.emit("disconnect");
          socket.current.off(); //removes the event listener
        }
      };
    }
  }, [userInfo]);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/signin?redirect=/my-profile");
    }
    dispatch(userMyProfileAction());
    // eslint-disable-next-line
  }, [
    googleLinkSuccess,
    googleUnLinkSuccess,
    facebookLinkSuccess,
    facebookUnLinkSuccess,
  ]);
  return (
    <>
      <Meta title="My profile" />
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
      {loading ? (
        <Facebook />
      ) : (
        <>
          <Row>
            <Col
              xs={12}
              className="profilePic d-flex flex-column justify-content-center align-items-center"
            >
              {profile && profile.user.profilePic ? (
                <Image
                  className=""
                  width="200px"
                  src={profile.user.profilePic}
                  fluid
                  rounded
                />
              ) : profile ? (
                <Image
                  className=""
                  width="200px"
                  src={`https://avatars.dicebear.com/4.5/api/bottts/${profile.user._id}.svg`}
                  fluid
                  rounded
                />
              ) : null}

              <h4 className="mt-3">{profile && profile.user.username}</h4>
              <p>{profile && profile.user.email}</p>
              <p>{profile && profile.user.description}</p>
              <Link style={{ textDecoration: "none" }} to="/edit-profile">
                Edit <i class="fas fa-edit"></i>
              </Link>
            </Col>
          </Row>
          <Row className="mt-5">
            {profile && <SimpleTabs profile={profile} history={history} />}
          </Row>
        </>
      )}
    </>
  );
};

export default ProfileScreen;
