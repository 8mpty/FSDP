import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import http from "../../http";
import dayjs from "dayjs";
import global from "../../global";
import { Link } from "react-router-dom";
import SplitButton from "../../assets/button";
import "../../ridehistory.css";

function Drivehistory({ role }) {
  const [ridehistorylist, setRidehistorylist] = useState([]);

  useEffect(() => {
    http.get("/ridehistory").then((res) => {
      console.log(res.data);
      setRidehistorylist(res.data);
    });
  }, []);

  const userRole = "driver";

  const filteredDriveHistory = ridehistorylist.filter((ridehistory) => {
    
    return ridehistory.role === userRole;
  });

  return (
    <Box className='history-page'>
      <SplitButton />
          <Typography variant="h2" sx={{ my: 2, textAlign: "left", marginLeft: 3 }}>
            Drive History
          </Typography>
          <Box className="history-container">

          {filteredDriveHistory.length > 0 ? (
            filteredDriveHistory.map((ridehistory) => (
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
                          fontFamily: "poppins-regular",
                        textAlign:"left"
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
                          fontFamily: "poppins-regular",
                        textAlign:"left"
                        }}
                      >
                        Drove {ridehistory.rider} from
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          whiteSpace: "pre-wrap",
                          justifyContent: "space-between",
                          fontFamily: "poppins-regular",
                        textAlign:"left"
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
                          fontFamily: "poppins-regular",
                        textAlign:"left"
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
                          fontFamily: "poppins-regular",
                        textAlign:"left"
                        }}
                      >
                        +{ridehistory.points}pts
                      </Typography>
                    </Box>
                    <Link
                      to={`/editridehistory/${ridehistory.id}`}
                      style={{ height: "52px" }}
                    >
                      <IconButton
                        color="primary"
                        sx={{
                          padding: "4px",
                          justifyContent: "flex-end",
                          marginLeft: "20px",
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h4" sx={{ my: 2 }}>
              No Drive History Found
            </Typography>
          )}
        </Box>
    </Box>
  );
}

export default Drivehistory;
