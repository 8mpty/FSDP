import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import "../../Announcement.css";

const Announcement = ({ announcement, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Function to handle the close button click
    const handleClose = () => {
        setIsVisible(false);
        // Call the provided onClose callback to inform the parent component that this announcement is closed
        onClose(announcement.id);
    };

    if (!announcement) {
        return null;
    }

    return (
        isVisible && (
            <Box className="announcement-box">
                <Typography variant="h6" gutterBottom>
                    {announcement.title}
                </Typography>
                <Typography variant="body1">{announcement.description}</Typography>
                <Button onClick={handleClose} variant="contained" color="primary">
                    Close
                </Button>
            </Box>
        )
    );
};

export default Announcement;
