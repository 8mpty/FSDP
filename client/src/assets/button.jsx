import React from "react";
import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function SplitButton() {
  return (
    <Box>
      <Button
        component={Link}
        to="/ridehistory"
        variant="contained"
        sx={{
          width: "50%",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        Rider
      </Button>
      <Button
        component={Link}
        to="/drivehistory"
        variant="contained"
        sx={{
          width: "50%",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        Driver
      </Button>
    </Box>
  );
}

export default SplitButton;
