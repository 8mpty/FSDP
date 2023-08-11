import { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import global from "../../global";
import dayjs from 'dayjs';
import "../../Announcement.css";

const Announcement = ({ announcement, closeAllAnnouncements, userLoggedIn }) => {
    const [showAnnouncement, setShowAnnouncement] = useState(true);

    useEffect(() => {
        const hasClosedAnnouncement = localStorage.getItem("closedAnnouncement");

        if (hasClosedAnnouncement === "true") {
            setShowAnnouncement(false);
        }
    }, []);

    const handleCloseAll = () => {
        setShowAnnouncement(false);
        localStorage.setItem("closedAnnouncement", "true");
        closeAllAnnouncements();
    };

    useEffect(() => {
        if (userLoggedIn) {
            localStorage.setItem("closedAnnouncement", "false");
        }
    }, [userLoggedIn]);

    if (!announcement || !showAnnouncement) {
        return null;
    }

    return (
        <Box className="announcement-box">
            <Typography variant="h6" gutterBottom className="tt">
                {announcement.title}
            </Typography>
            <Typography className="description" variant="body1">{announcement.description}</Typography>
            <Box sx={{ m: 2 }}></Box>
            <Typography className="description" variant="body1">Ends At:</Typography>
            <Typography className="description" variant="body1">{dayjs(announcement.endDate).format(global.datetimeFormat)}</Typography>
            <IconButton onClick={handleCloseAll} variant="outlined" color="secondary"><CloseIcon /></IconButton>
        </Box>
    );
};

export default Announcement;
