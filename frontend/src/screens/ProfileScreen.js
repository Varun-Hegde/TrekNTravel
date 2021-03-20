import React,{useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {userMyProfileAction} from '../actions/userActions'
import {Row,Col,Image,Nav} from 'react-bootstrap'
import Loader from '../components/Loader'
import Fade from 'react-reveal/Fade';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Place from '../components/Place'
import UserFollow from '../components/UserFollow'
import Accounts from '../components/Accounts'

function TabPanel(props) {
  const { profile,children, value, index, ...other } = props;
    
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
    'aria-controls': `simple-tabpanel-${index}`,
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
  const {profile,history} = props
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} style={{ backgroundColor: "rgb(52,58,64)","color":"white" }} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="My Campgrounds" {...a11yProps(0)} />
          <Tab label="Accounts Linked" {...a11yProps(1)} />
          <Tab label="Followers" {...a11yProps(2)} />
          <Tab label="Following" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Row>

            {profile && profile.campgrounds.length ===0 ? <p>You have not posted any places</p> : (null)}
            {profile && profile.campgrounds.map(campground => {
                return (
                   
                   <Col  key={campground._id} sm={12} md={6} lg={4} >
                            <Fade bottom>
                                <Place place={campground} history={history} />
                            </Fade>                        
                    </Col>
                )
            })}
        </Row>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Row>
          
          {profile && profile.user.methods.length === 1 && profile.user.methods[0] === 'local' ? (<center><h5>You haven't linked any accounts. Link Now?</h5></center>) : (null)}
          {profile && <Accounts profile={profile.user}/> }
          <center><h4> </h4></center>
        </Row>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Row>
          <center><h4>{profile && profile.followers.length} followers</h4></center>
          {profile && profile.followers.length === 0 ? <p>You do not have any followers</p> : (
            <Row>
              {profile.followers.map(followerData => {
                return (
                  <Col key={followerData._id} sm={12}>
                            <Fade bottom>
                                <UserFollow username={followerData.follower.username} profilePic={followerData.follower.profilePic} email={followerData.follower.email} />
                            </Fade>                        
                    </Col>
                )
              })}
            </Row>
          )}
            
        </Row>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Row>
          <center><h4>{profile && profile.following.length} following</h4></center>
          {profile && profile.following.length === 0 ? <p>You are not following anyone</p> : (
            <Row>
              {profile.following.map(followingData => {
                return (
                  <Col key={followingData._id} sm={12}>
                            <Fade bottom>
                                <UserFollow username={followingData.following.username} profilePic={followingData.follower.profilePic} email={followingData.follower.email} />
                            </Fade>                        
                  </Col>
                )
              })}
            </Row>
          )}
            
        </Row>
      </TabPanel>
    </div>
  );
}


const ProfileScreen = ({history}) => {

    const myProfile = useSelector(state => state.myProfile)
    const {loading,profile,error} = myProfile
    
    const dispatch = useDispatch()

    const userStatus = useSelector(state => state.status)
    const {isLoggedIn,userInfo} = userStatus

    useEffect(() => {
        if(!isLoggedIn){
          history.push('/signin?redirect=/my-profile')
        }
        dispatch(userMyProfileAction())
        
      
    },[])
    return (
        <>
        
        {loading ? <Loader /> : (
            <>
            <Row >
                <Col xs={12} className='profilePic d-flex flex-column justify-content-center align-items-center'>
                    {profile && profile.user.profilePic ? (<Image className='' width="200px" src={profile.user.profilePic} fluid rounded/>) : profile ? 
                    (<Image className='' width="200px" src={`https://avatars.dicebear.com/4.5/api/bottts/${profile.user._id}.svg`} fluid rounded/>) : (null)}
                      
                    <h4 className='mt-3'>{profile && profile.user.username}</h4>
                    <p>{profile && profile.user.email}</p>
                    <p>Edit <i class="fas fa-edit"></i></p>
                </Col>
                    
            </Row>
            <Row className='mt-5'>
               {profile && <SimpleTabs profile={profile} history={history}/>}
            </Row>
            </>   
        )}
                        
        </>
    )
}

export default ProfileScreen
