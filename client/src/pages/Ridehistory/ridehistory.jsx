import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import http from "../../http";
import dayjs from "dayjs";
import global from "../../global";
import { Link } from "react-router-dom";
import SplitButton from "../../assets/button";
import '../../ridehistory.css'
import { UserContext } from '../../contexts/AccountContext';

function Ridehistory() {
  const [ridehistorylist, setRidehistorylist] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
      const isAdmin = user.isAdmin;

      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          isAdmin: isAdmin,
        },
      };

      const bookingsPromise = http.get("/booking", headers);
      const driverBookingsPromise = http.get("/driverbooking", headers);
      const rideHistoryPromise = http.get("/ridehistory", headers);

      Promise.all([bookingsPromise, rideHistoryPromise, driverBookingsPromise])
        .then(([bookingResponse, rideHistoryResponse, driverBookingResponse]) => {
          const bookingsData = bookingResponse.data;
          const rideHistoryData = rideHistoryResponse.data;
          const driverBookingsData = driverBookingResponse.data;

          const mergedData = rideHistoryData.map(ride => {
            const booking = bookingsData.find(booking => booking.id === ride.id);
            const driverBooking = driverBookingsData.find(driverBooking => driverBooking.id === ride.id);

            return {
              id: ride.id,
              rider: booking.name,
              driver: driverBooking.drivername,
              start: booking.pickup,
              end: booking.passby,
              createdAt: ride.createdAt,
              description: ride.description,
              points: ride.points
            };
          });

          setRidehistorylist(mergedData);
        })
        .catch((error) => {
          console.error(error);
        });
    
  }, [user]);

  const sortedRideHistory = ridehistorylist.slice().sort((a, b) => {
    // Sort by createdAt in descending order (most recent first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  return (
    <Box className='history-page'>
      <SplitButton />
      <Typography variant="h2" sx={{fontFamily:"poppins-regular", my: 2, textAlign: "left", marginLeft: 3 }}>
          Ride History
        </Typography>
      <Box className="history-container">
        
        
      {sortedRideHistory.length > 0 ? (
  sortedRideHistory.map((ridehistory) => (
    <Card key={ridehistory.id} sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Box className="card-text">
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                color: "red",
                justifyContent: "space-between",
                fontFamily: "poppins-regular",
              }}
            >
              {dayjs(ridehistory.createdAt).format(global.datetimeFormat)}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                whiteSpace: "pre-wrap",
                justifyContent: "space-between",
                fontFamily: "poppins-regular",
                textAlign: "left",
              }}
            >
              {ridehistory.driver}'s car
            </Typography>
            <Typography
              variant="h5"
              sx={{
                whiteSpace: "pre-wrap",
                justifyContent: "space-between",
                fontFamily: "poppins-regular",
                textAlign: "left",
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
                textAlign: "left",
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
                textAlign: "left",
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
  <Typography variant="h4">No ride history found.</Typography>
)}
      </Box>
    </Box>
  );
}

export default Ridehistory;
