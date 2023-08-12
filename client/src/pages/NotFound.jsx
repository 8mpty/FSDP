import React from "react";
import { Typography, Box } from "@mui/material";
import "../NotFound.css";

function NotFound() {
    return (
        <Box className="not-found-container">
            <Typography className="not-found-heading" variant="h1">
                404
            </Typography>
            <Typography className="not-found-subheading" variant="h4">
                Oops! Page Not Found
            </Typography>
        </Box>
    );
}

export default NotFound;