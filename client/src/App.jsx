import "./App.css";
import { useState, useEffect } from "react";
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem, IconButton } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import RegisterAdmin from "./pages/Admins/RegisterAdmin";
import LoginAdmin from "./pages/Admins/LoginAdmin";
import ProfileAdmin from "./pages/Admins/ProfileAdmin";
import AccountRecoveryAdmin from "./pages/Admins/AccountRecoveryAdmin";
import AdminPanel from "./pages/Admins/AdminPanel";
import UserCreationDashboard from "./pages/Admins/UserCreationDashboard";
import ContactAdmin from "./pages/Admins/ContactAdmin";

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
import DriverBookings from './pages/Bookings/DriverBookings';
import AddBooking from './pages/Bookings/AddBooking';
import EditBooking from './pages/Bookings/EditBooking';
import AddDriverBooking from './pages/Bookings/AddDriverBooking';
import EditDriverBooking from './pages/Bookings/EditDriverBooking';
import Context from './pages/Bookings/Context';

import Announcement from "./pages/Announcement/Announcement";
import UpdateAnnouncement from "./pages/Announcement/UpdateAnnouncement";
import AnnouncementPanel from "./pages/Announcement/AnnouncementPanel";
import AddAnnouncement from "./pages/Announcement/AddAnnouncement";

import Rewards from './pages/Rewards/Rewards';
import AddReward from './pages/Rewards/AddReward';
import EditReward from './pages/Rewards/EditReward';

import NotFound from "./pages/NotFound";

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
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const store = {
    user,
    setUser,
  };

  const userRoutes = [
    { path: "/profile", component: <ProfileUser /> },
    { path: "/ridehistory", component: <Ridehistory /> },
    { path: "/ridehistory/:id", component: <Ridehistory /> },
    { path: "/drivehistory", component: <Drivehistory /> },
    { path: "/drivehistory/:id", component: <Drivehistory /> },
    { path: "/editridehistory/:id", component: <Editridehistory /> },
    { path: "/addbooking", component: <AddBooking /> },
    { path: "/editbooking/:id", component: <EditBooking /> },
    { path: "/adddriverbooking", component: <AddDriverBooking /> },
    { path: "/editdriverbooking/:id", component: <EditDriverBooking /> },
    { path: "/driverbookings", component: <DriverBookings /> },
    { path: "/bookings", component: <Bookings /> },
  ];

  const adminRoutes = [
    { path: "/profileAdmin", component: <ProfileAdmin /> },
    { path: "/registerAdmin", component: <RegisterAdmin /> },
    { path: "/adminPanel", component: <AdminPanel /> },
    { path: "/adminridehistory", component: <Adminridehistory /> },
    { path: "/adminridehistory/:id", component: <Adminridehistory /> },
    { path: "/deleteridehistory/:id", component: <Deleteridehistory /> },
    { path: "/admindashboard", component: <Admindashboard /> },
    { path: "/adminbookings", component: <AdminBookings /> },
    { path: "/editAnnouncement/:id", component: <UpdateAnnouncement /> },
    { path: "/announcementPanel", component: <AnnouncementPanel /> },
    { path: "/addAnnouncement", component: <AddAnnouncement /> },
    { path: "/rewards", component: <Rewards /> },
    { path: "/addreward", component: <AddReward /> },
    { path: "/editreward/:id", component: <EditReward /> },
    { path: "/userCreationDashboard", component: <UserCreationDashboard /> },
  ];

  const closeAnnouncement = () => {
    setDisplayedAnnouncementIndex((prevIndex) => prevIndex + 1);
  };
  const closeAllAnnouncements = () => {
    setDisplayedAnnouncementIndex(announcements.length);
    setShowAllAnnouncements(false);
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
            console.log(res.data.user);
            setIsDriver(res.data.user.driverStatus);
            // console.log(res.data.user);
            setUserLoggedIn(true);
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
                    <Link to="/ridehistory" className="tabs">
                      <Typography className="a">Ride history</Typography>
                    </Link>
                    <Link to="/bookings" className="tabs">
                      <Typography style={{ fontFamily: "system-ui" }}>Bookings</Typography>
                    </Link>
                    {isDriver && (
                      <Link to="/driverbookings">
                        <Typography style={{ fontFamily: "system-ui" }}>Driver Bookings</Typography>
                      </Link>
                    )}


                    <Button onClick={handleMenuOpen}>
                      <AccountCircleIcon />
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
                      <AccountCircleIcon />
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
            <AppBar position="sticky" className="AppBar admin">
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
          {(admin === null || user !== null) && showAllAnnouncements && (
            <Box className="announcement-container">
              {announcements.length > 0 &&
                displayedAnnouncementIndex < announcements.length && (
                  <Announcement
                    key={announcements[displayedAnnouncementIndex].id}
                    announcement={announcements[displayedAnnouncementIndex]}
                    closeAllAnnouncements={closeAllAnnouncements}
                  />
                )}
            </Box>
          )}

          <Container>
            <Routes>
              {/* Common Routes Accessible By Anyone */}
              <Route path={"/"} />

              {/* User Stuff */}
              <Route path={"/register"} element={<RegisterUser />} />
              <Route path={"/login"} element={<LoginUser />} />
              <Route path={"/accountRecoveryUser"} element={<AccountRecoveryUser />} />

              {/* Admin Stuff */}
              <Route path={"/loginAdmin"} element={<LoginAdmin />} />
              <Route path={"/accountRecoveryAdmin"} element={<AccountRecoveryAdmin />} />

              {/* Announcement Stuff */}
              <Route path={"/announcement"} element={<Announcement />} />

              {/* Redirects anyone that goes to a non-existent or unauthorized page */}
              <Route path={"*"} element={<NotFound />} />

              <Route path={"/contactus"} element={<ContactAdmin />} />

              {/* User Stuff */}
              {user ? (
                <>
                  {userRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.component} />
                  ))}
                </>
              ) : null}

              {/* Admin Stuff */}
              {admin && !user ? (
                <>
                  {adminRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.component} />
                  ))}
                </>
              ) : null}
            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </AdminContext.Provider>
  );
}

export default App;