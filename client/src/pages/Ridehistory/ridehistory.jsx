import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import http from "../../http";
import dayjs from "dayjs";
import global from "../../global";
import { Link } from "react-router-dom";
import SplitButton from "../../assets/button";
import '../../ridehistory.css'

function Ridehistory() {
  const [ridehistorylist, setRidehistorylist] = useState([]);

  useEffect(() => {
    http.get("/ridehistory").then((res) => {
      console.log(res.data);
      setRidehistorylist(res.data);
    });
  }, []);

  
  const userRole = "rider"; 

  const filteredRideHistory = ridehistorylist.filter((ridehistory) => {
    
    return ridehistory.role === userRole;
  });

  return (
    <Box>
      <SplitButton />
      <Grid container spacing={8}>
        <Grid item xs={8}>
          <Typography variant="h2" sx={{ my: 2, fontWeight: "bold" }}>
            Ride History
          </Typography>

          {filteredRideHistory.length > 0 ? (
            filteredRideHistory.map((ridehistory) => (
              <Card key={ridehistory.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 1,
                          color: "red",
                          justifyContent: "space-between",
                        }}
                      >
                        {dayjs(ridehistory.createdAt).format(
                          global.datetimeFormat
                        )}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          whiteSpace: "pre-wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        {ridehistory.driver}'s car
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          whiteSpace: "pre-wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        {ridehistory.start} to {ridehistory.end}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontStyle: "italic",
                          color: "gray",
                          justifyContent: "space-between",
                        }}
                      >
                        {ridehistory.description}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          whiteSpace: "pre-wrap",
                          color: "limegreen",
                          justifyContent: "space-between",
                        }}
                      >
                        +{ridehistory.points}pts

                      </Typography>
                    </Box>
                    <Link to={`/editridehistory/${ridehistory.id}`} style={{height: "52px"}}>
                      <IconButton
                        color="primary"
                        sx={{ padding: "4px", justifyContent: "flex-end", marginLeft:"20px"}}
                      >
                        <Edit />
                      </IconButton>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h4">No ride history found.</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Ridehistory;
