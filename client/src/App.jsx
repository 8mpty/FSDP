import "./App.css";
import { useState, useEffect } from "react";
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem, IconButton } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RegisterAdmin from "./pages/Admins/RegisterAdmin";
import LoginAdmin from "./pages/Admins/LoginAdmin";
import ProfileAdmin from "./pages/Admins/ProfileAdmin";
import AccountRecoveryAdmin from "./pages/Admins/AccountRecoveryAdmin";
import AdminPanel from "./pages/Admins/AdminPanel";
import UserCreationDashboard from "./pages/Admins/UserCreationDashboard";

import RegisterUser from "./pages/Users/RegisterUser";
import LoginUser from "./pages/Users/LoginUser";
import ProfileUser from "./pages/Users/ProfileUser";
import AccountRecoveryUser from "./pages/Users/AccountRecoveryUser";

import Ridehistory from "./pages/Ridehistory/ridehistory";
import Adminridehistory from "./pages/Ridehistory/adminridehistory";
import Editridehistory from "./pages/Ridehistory/editridehistory";
import Deleteridehistory from "./pages/Ridehistory/deleteridehistory";
import Drivehistory from "./pages/Ridehistory/drivehistory";
import Admindashboard from "./pages/Ridehistory/admindashboard";

import Bookings from './pages/Bookings/Bookings';
import AdminBookings from './pages/Bookings/AdminBookings';
import AddBooking from './pages/Bookings/AddBooking';
import EditBooking from './pages/Bookings/EditBooking';
import AddAdminBooking from './pages/Bookings/AddAdminBooking';
import EditAdminBooking from './pages/Bookings/EditAdminBooking';

import Announcement from "./pages/Announcement/Announcement";
import UpdateAnnouncement from "./pages/Announcement/UpdateAnnouncement";
import AnnouncementPanel from "./pages/Announcement/AnnouncementPanel";
import AddAnnouncement from "./pages/Announcement/AddAnnouncement";

import Rewards from './pages/Rewards/Rewards';
import AddReward from './pages/Rewards/AddReward';
import EditReward from './pages/Rewards/EditReward';


import http from "./http";

import { AdminContext, UserContext } from "./contexts/AccountContext";
import { AllOut } from "@mui/icons-material";

function App() {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropMenu, setdropMenu] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [displayedAnnouncementIndex, setDisplayedAnnouncementIndex] = useState(0);

  const closeAnnouncement = () => {
    setDisplayedAnnouncementIndex((prevIndex) => prevIndex + 1);
  };

  const getAllAnnouncements = () => {
    http.get("/announcement/getAllAnnouncements")
      .then((response) => {
        setAnnouncements(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const role = localStorage.getItem("role");

      if (role === "admin") {
        http
          .get("/admin/auth")
          .then((res) => {
            setIsLoggedIn(true);
            setAdmin(res.data.admin);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (role === "user") {
        http
          .get("/user/auth")
          .then((res) => {
            setIsLoggedIn(true);
            setUser(res.data.user);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (admin) {
      localStorage.setItem("role", "admin");
    } else if (user) {
      localStorage.setItem("role", "user");
    }
  }, [admin, user]);

  useEffect(() => {
    getAllAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 0 && displayedAnnouncementIndex < announcements.length) {
      const interval = setInterval(() => {
        closeAnnouncement();

        if (displayedAnnouncementIndex + 1 >= announcements.length) {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [announcements, displayedAnnouncementIndex]);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
    toast.success("Logout Successfull!!");
  };

  const handleMenuOpen = (event) => {
    setdropMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setdropMenu(null);
  };

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <AppBar position="sticky" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    ShareKar
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>

                {/* Normal Toolbar */}
                {user && !admin ? (
                  <>
                    <Link to="/ridehistory">
                      <Typography className="a">Ride history</Typography>
                    </Link>
                    <Link to="/bookings">
                      <Typography style={{ fontFamily: "system-ui" }}>Bookings</Typography>
                    </Link>
                    <Button onClick={handleMenuOpen}>
                      <Typography className="a">Account</Typography>
                    </Button>
                    <Menu anchorEl={dropMenu} open={Boolean(dropMenu)} onClose={handleMenuClose}>
                      <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                        Profile
                      </MenuItem>
                      <MenuItem>
                        <Button onClick={logout}>Logout</Button>
                      </MenuItem>
                    </Menu>
                  </>
                ) : admin ? (
                  <>
                    <Link to="/adminPanel"><IconButton><AdminPanelSettingsIcon /></IconButton></Link>
                    <Button onClick={handleMenuOpen}>
                      <Typography className="a">Admin {admin.id}</Typography>
                    </Button>
                    <Menu anchorEl={dropMenu} open={Boolean(dropMenu)} onClose={handleMenuClose}>
                      <MenuItem component={Link} to="/profileAdmin" onClick={handleMenuClose}>
                        Profile
                      </MenuItem>
                      <MenuItem>
                        <Button onClick={logout}>Logout</Button>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          {/* Admin Toolbar */}
          {admin && !user ? (
            <AppBar position="sticky" className="AppBar">
              <Container>
                <Toolbar disableGutters={true}>
                  <Link to="/adminridehistory" className="tabs">
                    <Typography className="a">Ride Histories</Typography>
                  </Link>

                  <Link to="/admindashboard" className="tabs">
                    <Typography className="a">Dashboard</Typography>
                  </Link>


                  <Link to="/rewards" className="tabs" >
                    <Typography>Rewards</Typography>
                  </Link>

                  <Link to="/adminbookings" className="tabs">
                    <Typography style={{ fontFamily: "system-ui" }}>Admin Bookings</Typography>
                  </Link>

                  <Link to="/announcementPanel" className="tabs">
                    <Typography style={{ fontFamily: "system-ui" }}>Announcement Panel</Typography>
                  </Link>

                </Toolbar>
              </Container>
            </AppBar>
          ) : null}

          {(admin === null || user !== null) && (
            <Box className="announcement-container">
              {announcements.length > 0 && displayedAnnouncementIndex < announcements.length && (
                <Announcement
                  key={announcements[displayedAnnouncementIndex].id}
                  announcement={announcements[displayedAnnouncementIndex]}
                  onClose={closeAnnouncement}
                />
              )}
            </Box>
          )}

          <Container>
            <Routes>
              <Route path={"/"} />
              {/* User Stuff */}
              {user ? (
                <>
                  <Route path={"/ridehistory"} element={<Ridehistory />} />
                  <Route path={"/profile"} element={<ProfileUser />} />

                  {/* User Ride History Stuff */}
                  <Route path={"/ridehistory"} element={<Ridehistory />} />
                  <Route path={"/ridehistory/:id"} element={<Ridehistory />} />
                  <Route path={"/drivehistory"} element={<Drivehistory />} />
                  <Route path={"/drivehistory/:id"} element={<Drivehistory />} />
                  <Route path={"/editridehistory/:id"} element={<Editridehistory />} />

                  {/* User Booking Stuff */}
                  <Route path={"/addbooking"} element={<AddBooking />} />
                  <Route path={"/editbooking/:id"} element={<EditBooking />} />
                  <Route path={"/bookings"} element={<Bookings />} />
                </>
              ) : null}

              {admin && !user ? (
                <>
                  <Route path={"/adminridehistory"} element={<Adminridehistory />} />
                  <Route path={"/profileAdmin"} element={<ProfileAdmin />} />
                  <Route path={"/registerAdmin"} element={<RegisterAdmin />} />

                  {/* Admin Booking Stuff */}
                  <Route path={"/addadminbooking"} element={<AddAdminBooking />} />
                  <Route path={"/editadminbooking/:id"} element={<EditAdminBooking />} />
                  <Route path={"/adminPanel"} element={<AdminPanel />} />

                  {/* Admin Ride History Stuff */}
                  <Route path={"/adminridehistory"} element={<Adminridehistory />} />
                  <Route path={"/adminridehistory/:id"} component={<Adminridehistory />} />
                  <Route path={"/deleteridehistory/:id"} element={<Deleteridehistory />} />
                  <Route path={"/admindashboard"} element={<Admindashboard />} />

                  {/* Admin Booking Stuff */}
                  <Route path={"/adminbookings"} element={<AdminBookings />} />

                  {/* Admin Announcement Stuff */}
                  <Route path={"/editAnnouncement/:id"} element={<UpdateAnnouncement />} />
                  <Route path={"/announcementPanel"} element={<AnnouncementPanel />} />
                  <Route path={"/addAnnouncement"} element={<AddAnnouncement />} />

                  {/* Admin Rewards Stuff */}
                  <Route path={"/rewards"} element={<Rewards />} />
                  <Route path={"/addreward"} element={<AddReward />} />
                  <Route path={"/editreward/:id"} element={<EditReward />} />

                  <Route path={"/userCreationDashboard"} element={<UserCreationDashboard />} />

                </>
              ) : null}
              {/* Common Routes Accessible By Anyone */}

              {/* User Stuff */}
              <Route path={"/register"} element={<RegisterUser />} />
              <Route path={"/login"} element={<LoginUser />} />
              <Route path={"/accountRecoveryUser"} element={<AccountRecoveryUser />} />

              {/* Admin Stuff */}
              <Route path={"/loginAdmin"} element={<LoginAdmin />} />
              <Route path={"/accountRecoveryAdmin"} element={<AccountRecoveryAdmin />} />

              {/* Announcement Stuff */}
              <Route path={"/announcement"} element={<Announcement />} />

            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </AdminContext.Provider>
  );
}

export default App;