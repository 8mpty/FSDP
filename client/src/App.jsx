import "./App.css";
import { useState, useEffect } from "react";
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import RegisterAdmin from "./pages/Admins/RegisterAdmin";
import LoginAdmin from "./pages/Admins/LoginAdmin";
import ProfileAdmin from "./pages/Admins/ProfileAdmin";
import AccountRecoveryAdmin from "./pages/Admins/AccountRecoveryAdmin";
import AdminPanel from "./pages/Admins/AdminPanel";

import RegisterUser from "./pages/Users/RegisterUser";
import LoginUser from "./pages/Users/LoginUser";
import ProfileUser from "./pages/Users/ProfileUser";
import AccountRecoveryUser from "./pages/Users/AccountRecoveryUser";

import Ridehistory from "./pages/Ridehistory/ridehistory";
import Adminridehistory from "./pages/Ridehistory/adminridehistory";
import Editridehistory from "./pages/Ridehistory/editridehistory";
import Deleteridehistory from "./pages/Ridehistory/deleteridehistory";
import Drivehistory from "./pages/Ridehistory/drivehistory";

import Bookings from './pages/Bookings/Bookings';
import AdminBookings from './pages/Bookings/AdminBookings';
import AddBooking from './pages/Bookings/AddBooking';
import EditBooking from './pages/Bookings/EditBooking';
import AddAdminBooking from './pages/Bookings/AddAdminBooking';
import EditAdminBooking from './pages/Bookings/EditAdminBooking';

import http from "./http";

import { AdminContext, UserContext } from "./contexts/AccountContext";

function App() {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);



  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Read the role from local storage (assuming the role is stored as "admin" or "user")
      const role = localStorage.getItem("role");

      // Based on the role, set the admin or user state accordingly
      if (role === "admin") {
        http
          .get("/admin/auth")
          .then((res) => {
            setAdmin(res.data.admin);
          })
          .catch((error) => {
            // Handle errors here if needed
          });
      } else if (role === "user") {
        http
          .get("/user/auth")
          .then((res) => {
            setUser(res.data.user);
          })
          .catch((error) => {
            // Handle errors here if needed
          });
      }
    }
  }, []);

  useEffect(() => {
    // After setting admin/user states, update the role in local storage for future reference
    if (admin) {
      localStorage.setItem("role", "admin");
    } else if (user) {
      localStorage.setItem("role", "user");
    }
  }, [admin, user]);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const [dropMenu, setdropMenu] = useState(null);

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
          <AppBar position="static" className="AppBar">
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
                    <Link to="/adminPanel">
                      <Typography className="a">Admin Panel</Typography>
                    </Link>
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
            <AppBar position="static" className="AppBar">
              <Container>
                <Toolbar disableGutters={true}>
                  <Link to="/adminridehistory">
                    <Typography className="a">Ride Histories</Typography>
                  </Link>
                  <Link to="/adminbookings">
                    <Typography style={{ fontFamily: "system-ui" }}>Admin Bookings</Typography>
                  </Link>
                </Toolbar>
              </Container>
            </AppBar>
          ) : null}

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

                  {/* Admin Booking Stuff */}
                  <Route path={"/addadminbooking"} element={<AddAdminBooking />} />
                  <Route path={"/editadminbooking/:id"} element={<EditAdminBooking />} />
                  <Route path={"/adminPanel"} element={<AdminPanel />} />

                  {/* Admin Ride History Stuff */}
                  <Route path={"/adminridehistory"} element={<Adminridehistory />} />
                  <Route path={"/adminridehistory/:id"} component={<Adminridehistory />} />
                  <Route path={"/editridehistory/:id"} element={<Editridehistory />} />
                  <Route path={"/deleteridehistory/:id"} element={<Deleteridehistory />} />

                  {/* Admin Booking Stuff */}
                  <Route path={"/adminbookings"} element={<AdminBookings />} />
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
              <Route path={"/registerAdmin"} element={<RegisterAdmin />} />

            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </AdminContext.Provider>
  );

}
export default App;
