import React, { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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
                setUserData(response.data.map((user) => ({
                    ...user,
                    createdAtDate: dayjs(user.createdAt).startOf('day'),
                    count: 1,
                    loginSuccess: user.loginSuccess || 0,
                })));
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
            const createdAtDate = user.createdAtDate.format('D MMMM YYYY');
            if (!result[createdAtDate]) {
                result[createdAtDate] = {
                    date: createdAtDate,
                    count: 1,
                    loginSuccess: user.loginSuccess,
                };
            } else {
                result[createdAtDate].count++;
                result[createdAtDate].loginSuccess += user.loginSuccess;
            }
            return result;
        }, {});

        return Object.values(groupedData);
    };

    const chartData = allData(userData);

    // Just to check if the user database is empty
    if (chartData.length === 0) {
        return <Box>There is no User Data to be displayed!😒</Box>;
    }

    return (
        <Box>
            <Typography variant="h4">Users Registration & Login Statistics</Typography>
            <Box className='graph-con'>
                <BarChart width={800} height={400} data={chartData} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" type="category" tickFormatter={(dateStr) => dateStr} />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => `Date: ${label}`} />
                    <Legend />
                    <Bar dataKey="count" name="Total User Registrations" fill="#8884d8" />
                    <Bar dataKey="loginSuccess" name="Login Success" fill="#82ca9d" />
                </BarChart>
            </Box>
        </Box>
    );
}

export default UserCreationDashboard;
