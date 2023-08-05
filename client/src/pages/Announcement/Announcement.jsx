import { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import "../../Announcement.css";

const Announcement = ({ announcement, onClose, closeAllAnnouncements }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose(announcement.id);
    };

    const handleCloseAll = () => {
        closeAllAnnouncements();
    };

    if (!announcement) {
        return null;
    }

    return (
        isVisible && (
            <Box className="announcement-box">
                <Typography variant="h6" gutterBottom className="tt">
                    {announcement.title}
                </Typography>
                <Typography className="description" variant="body1">{announcement.description}</Typography>
                {/* <Button onClick={handleClose} variant="contained" color="primary">
                    Close
                </Button> */}
                <IconButton onClick={handleCloseAll} variant="outlined" color="secondary"><CloseIcon /></IconButton>
            </Box>
        )
    );
};

export default Announcement;
