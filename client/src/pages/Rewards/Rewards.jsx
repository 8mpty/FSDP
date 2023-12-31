//when you open this again, START from practical 5 FSDP - Search and Add data

import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../contexts/AccountContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import http from '../../http';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';

import dayjs from 'dayjs';
import global from '../../global';
import AspectRatio from '@mui/joy/AspectRatio';

function Rewards() {
    const [rewardList, setRewardList] = useState([]);
    const [search, setSearch] = useState('');
    const { admin } = useContext(AdminContext);


    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getRewards = () => {
        http.get('/rewards').then((res) => {
            setRewardList(res.data);
        });
    };
    const searchRewards = () => {
        http.get(`/rewards?search=${search}`).then((res) => {
            setRewardList(res.data);
        });
    };
    useEffect(() => {
        getRewards();
    }, []);
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRewards();
        }
    };
    const onClickSearch = () => {
        searchRewards();
    };
    const onClickClear = () => {
        setSearch('');
        getRewards();
    };

    useEffect(() => {
        http.get('/rewards').then((res) => {
            console.log(res.data);
            setRewardList(res.data);
        });
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Rewards
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    admin && (
                        <Link to="/addreward" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }

            </Box>

            <Grid container spacing={2}>
                {
                    rewardList.map((reward, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={reward.id}>
                                <Card>
                                    {
                                        reward.imageFile && (
                                            <AspectRatio>
                                                <Box component="img"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}
                                                    alt="reward">
                                                </Box>
                                            </AspectRatio>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {reward.Reward_Name}
                                            </Typography>
                                            {
                                                admin && admin.id == reward.adminId && (
                                                    <Link to={`/editreward/${reward.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                )
                                            }

                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(reward.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Points Required: {reward.Points_Required}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Reward Amount: {reward.Reward_Amount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>

        </Box>
    )
}

export default Rewards