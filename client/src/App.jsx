import { useState, useEffect } from 'react';
import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';

import RegisterAdmin from './pages/Admins/RegisterAdmin';
import LoginAdmin from './pages/Admins/LoginAdmin';
import ProfileAdmin from './pages/Admins/ProfileAdmin';

import RegisterUser from './pages/Users/RegisterUser';
import LoginUser from './pages/Users/LoginUser';
import ProfileUser from './pages/Users/ProfileUser';

import http from './http';

import { AdminContext, UserContext } from './contexts/AccountContext';

function App() {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      http.get('/admin/auth').then((res) => {
        setAdmin(res.data.admin);
      }).catch((error) => {
        // Handle errors here if needed
      });

      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      }).catch((error) => {
        // Handle errors here if needed
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <AppBar position="static" className='AppBar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">ShareKar</Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>

                {user ? (
                  <>
                    <Link to="/profile"><Typography>{user.name}</Typography></Link>
                    <Button onClick={logout}>Logout</Button>
                  </>
                ) : admin ? (
                  <>
                    <Link to="/profileAdmin"><Typography>{admin.name}</Typography></Link>
                    <Button onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    {/* <Link to="/register"><Typography>Register</Typography></Link> */}
                    <Link to="/login"><Typography>Login</Typography></Link>
                  </>
                )}

              </Toolbar>
            </Container>
          </AppBar>
          <Container>
            <Routes>
              <Route path={"/"} />


              {/* User Stuff */}
              <Route path={"/register"} element={<RegisterUser />} />
              <Route path={"/login"} element={<LoginUser />} />
              <Route path={"/profile"} element={<ProfileUser />} />


              {/* Admin Stuff */}
              <Route path={"/registerAdmin"} element={<RegisterAdmin />} />
              <Route path={"/loginAdmin"} element={<LoginAdmin />} />
              <Route path={"/profileAdmin"} element={<ProfileAdmin />} />


            </Routes>
          </Container>
        </Router>
      </UserContext.Provider>
    </AdminContext.Provider>
  );
}
export default App;