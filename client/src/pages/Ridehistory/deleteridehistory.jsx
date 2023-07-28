import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../../http";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import dayjs from "dayjs";
import global from "../../global";

function Deleteridehistory() {
  const [ridehistory, setRidehistory] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    http.get(`/ridehistory/${id}`).then((res) => {
      setRidehistory(res.data);
    });
  }, [id]);

  const deleteridehistory = () => {
    http.delete(`/ridehistory/${id}`).then((res) => {
      console.log(res.data);
      navigate("/ridehistory");
    });
  };

  if (!ridehistory) {
    return <p>Loading...</p>;
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ justifyContent: "align-center" }}>
        Delete Ride History
      </Typography>
      <Typography variant="h4" sx={{ justifyContent: "align-center", color:"red" }}>
        Are you sure you want to delete this entry?
      </Typography>

      <Card key={ridehistory.id} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {dayjs(ridehistory.createdAt).format(global.datetimeFormat)}
              </Typography>
              <Typography variant="h5" sx={{ whiteSpace: "pre-wrap" }}>
                {ridehistory.driver}'s car
              </Typography>
              <Typography variant="h5" sx={{ whiteSpace: "pre-wrap" }}>
                {ridehistory.start} to {ridehistory.end}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  whiteSpace: "pre-wrap",
                  fontStyle: "italic",
                  color: "gray",
                }}
              >
                {ridehistory.description}
              </Typography>
              
            </Box>
            
          </Box>
          
        </CardContent>
      </Card>
      <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate("/adminridehistory")}
                sx={{ whiteSpace: "pre-wrap", justifyContent:"space-between"   }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={deleteridehistory}
                sx={{ whiteSpace: "pre-wrap", justifyContent:"space-between" }}
              >
                Delete
              </Button>
    </Box>
  );
}

export default Deleteridehistory;
