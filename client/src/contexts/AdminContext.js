import React from 'react';

const AdminContext = React.createContext({
    admin: null,
    setAdmin: () => { }
});

const UserContext = React.createContext({
    user: null,
    setUser: () => { }
});

export {AdminContext, UserContext};