import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import "../../Announcement.css";

const Announcement = ({ announcement, onClose }) => {
    // State to manage whether the announcement is visible or not
    const [isVisible, setIsVisible] = useState(true);

    // Function to handle the close button click
    const handleClose = () => {
        setIsVisible(false);
        // Call the provided onClose callback to inform the parent component that this announcement is closed
        onClose(announcement.id);
    };

    // Check if the announcement object is defined
    if (!announcement) {
        return null; // Return null or any other fallback UI if announcement is undefined
    }

    return (
        // Render the announcement only if it is visible
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
