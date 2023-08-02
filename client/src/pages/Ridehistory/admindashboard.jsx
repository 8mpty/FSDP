import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import http from "../../http";
import { format } from "date-fns";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
  } from "@mui/material";
import "../../dashboard.css"

  
function Admindashboard() {
  const [ridehistoryList, setRidehistoryList] = useState([]);
  const isAdmin = true; // Set this to true if the user is an admin, otherwise set it to false

  const getRidehistory = () => {
    const headers = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "isAdmin": isAdmin
      }
    };

    const endpoint = isAdmin ? '/ridehistory' : '/ridehistory';

    http.get(endpoint, headers)
      .then((response) => {
        // Process the data as before (grouping by day and counting bookings)
        const bookingCountByDay = response.data.reduce((acc, item) => {
          const day = format(new Date(item.createdAt), "yyyy-MM-dd");
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        // Convert the bookingCountByDay object to an array of objects with name (day) and Day (booking count) properties
        const formattedData = Object.keys(bookingCountByDay).map((day) => ({
          name: `Day ${day}`, // Format the day label as "Day YYYY-MM-DD"
          Rides: bookingCountByDay[day], // Number of bookings for the day
        }));

        setRidehistoryList(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    // Fetch ride history data
    getRidehistory();
  }, [isAdmin]);

  // Check if data is empty
  if (ridehistoryList.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <Box className='dashboard'>
    <Typography variant="h4" sx={{fontFamily:"poppins-regular"}}>Ride history entries made per day</Typography>
    <Box className='graph' sx={{display:"flex", justifyContent:"center"}}>
    <LineChart width={600} height={400} data={ridehistoryList}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Rides" stroke="#8884d8" />
    </LineChart>
    </Box>
    </Box>
  );
}

export default Admindashboard;
