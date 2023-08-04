import React, { useEffect, useState } from "react";
import { BarChart, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import http from "../../http";
import dayjs from "dayjs";
import { Box, Typography, Button } from "@mui/material";
import "../../dashboard.css";

function UserCreationDashboard() {
    const [loginLogs, setLoginLogs] = useState([]);
    const [createdData, setCreatedData] = useState([]);

    const getCreatedData = () => {
        http.get('/user/getAllUsers')
            .then((response) => {
                setCreatedData(response.data.map((user) => ({
                    ...user,
                    createdAtDate: dayjs(user.createdAt).startOf('day'),
                })));
            })
            .catch((error) => {
                console.error('Error fetching Created Data:', error);
            });
    }

    const getLoginLogsForDays = () => {
        http.get('/user/loginLogs')
            .then((response) => {
                setLoginLogs(response.data);
            })
            .catch((error) => {
                console.error('Error fetching login logs:', error);
            });
    };

    useEffect(() => {
        getLoginLogsForDays();
        getCreatedData();
    }, []);

    console.log("loginLogs:", loginLogs);
    console.log("createdData:", createdData);

    const allData = (loginLogs, createdData) => {
        const groupedData = loginLogs.reduce((result, log) => {
            const logDate = dayjs(log.date).format('D MMMM YYYY');

            if (!result[logDate]) {
                result[logDate] = {
                    date: logDate,
                    loginSuccess: log.loginSuccess,
                    registration: 0,
                };
            } else {
                result[logDate].loginSuccess += log.loginSuccess;
            }
            return result;
        }, {});

        createdData.forEach((user) => {
            const createdAtDate = dayjs(user.createdAtDate).format('D MMMM YYYY');
            if (!groupedData[createdAtDate]) {
                groupedData[createdAtDate] = {
                    date: createdAtDate,
                    loginSuccess: 0,
                    registration: 1,
                };
            } else {
                groupedData[createdAtDate].registration += 1;
            }
        });

        return Object.values(groupedData);
    };

    const chartData = allData(loginLogs, createdData);

    // Check if either loginLogs or createdData has data
    if (loginLogs.length === 0 && createdData.length === 0) {
        return <Box>No data available to display!😒</Box>;
    }

    return (
        <Box>
            <Typography variant="h4">Users Registration & Login Statistics</Typography>
            <Box className='graph-con'>
                <BarChart width={800} height={400} data={chartData} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" type="category" tickFormatter={(dateStr) => dateStr} />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => `Date: ${label}`} />
                    <Legend />
                    <Bar dataKey="registration" name="Registrations" fill="#8884d8" />
                    <Bar dataKey="loginSuccess" name="Logins" fill="#82ca9d" />
                </BarChart>
            </Box>
        </Box>
    );
}

export default UserCreationDashboard;
