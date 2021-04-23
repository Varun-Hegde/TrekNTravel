import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from './notificationStyles';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
const NotificationAlert = ({ open, setOpen, newNotification, notificationPopUp, showNotificationPopUp }) => {
	const classes = useStyles();

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		showNotificationPopUp(false);
		setOpen(false);
	};
	return (
		<div className={classes.root}>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={open}
				autoHideDuration={5000}
				onClose={handleClose}
			>
				<MuiAlert
					icon={<NotificationsActiveIcon fontSize="inherit" />}
					onClose={handleClose}
					severity="success"
					elevation={6}
					variant="filled"
				>
					{newNotification.username} liked your post
				</MuiAlert>
			</Snackbar>
		</div>
	);
};

export default NotificationAlert;
