import { useState, useEffect } from 'react';
import './App.css';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link }
  from 'react-router-dom';
import RegisterAdmin from './pages/Admins/RegisterAdmin';
import LoginAdmin from './pages/Admins/LoginAdmin';
import {AdminContext, UserContext} from './contexts/AdminContext';
import http from './http';

function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/admin/auth').then((res) => {
        setAdmin(res.data.admin);
      })
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  return (
    <AdminContext.Provider value={{admin, setAdmin}}>
      <Router>
        <AppBar position="static" className='AppBar'>
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">Learning</Typography>
              </Link>
              <Box sx={{ flexGrow: 1 }}></Box>
              {admin && (
                <>
                  {/* <Typography>{admin.name}</Typography> */}
                  <Button onClick={logout}><Typography>{admin.name}</Typography></Button>
                  <Button onClick={logout}>Logout</Button>
                </>
              )
              }
              {!admin && (
                <>
                  <Link to="/registeradmin" ><Typography>Register</Typography></Link>
                  <Link to="/loginadmin" ><Typography>Login</Typography></Link>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>
        <Container>
          <Routes>
            <Route path={"/"} />
            <Route path={"/registerAdmin"} element={<RegisterAdmin />} />
            <Route path={"/loginAdmin"} element={<LoginAdmin />} />
          </Routes>
        </Container>
      </Router>
    </AdminContext.Provider>
  );
}
export default App;