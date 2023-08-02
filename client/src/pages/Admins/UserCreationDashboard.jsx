import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import http from "../../http";
import dayjs from "dayjs";
import global from '../../global';
import { Box, Typography } from "@mui/material";
import "../../dashboard.css";

function UserCreationDashboard() {
    const [userData, setUserData] = useState([]);

    const getUserData = () => {
        http.get('/user/getAllUsers')
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data from user database:', error);
            });
    };

    useEffect(() => {
        getUserData();
    }, []);

    const allData = (data) => {
        const groupedData = data.reduce((result, user) => {
            const createdAtDate = dayjs(user.createdAt).format(global.datetimeFormat);
            if (!result[createdAtDate]) {
                result[createdAtDate] = 1;
            } else {
                result[createdAtDate]++;
            }
            return result;
        }, {});

        return Object.keys(groupedData).map((date) => ({
            date,
            count: groupedData[date],
        }));
    };

    const chartData = allData(userData);

    // Just to check if the user database is empty
    if (chartData.length === 0) {
        return <Box>There is no User Data to be displayed!😒</Box>;
    }

    return (
        <Box>
            <Typography variant="h4">Users Registration Statistics</Typography>
            <Box className='graph-con'>
                <LineChart width={800} height={400} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" type="category" tickFormatter={(dateStr) => dayjs(dateStr).format(global.datetimeFormat)}/>
                    <YAxis domain={[1]} /> 
                    <Tooltip labelFormatter={(label) => `Date: ${dayjs(label).format(global.datetimeFormat)}`}formatter={(value) => [`Registrations: ${value}`]}/>
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Total User Registrations" stroke="#8884d8" />
                </LineChart>
            </Box>
        </Box>
    );
}

export default UserCreationDashboard;
