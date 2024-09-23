import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInAndSignUp from './LoginAndSignUp/login_signup';
import UserComponent from './profile/component_profile';
import { ReadOnlyDetails } from './profile/read_profile';

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/"  element={<LogInAndSignUp/>} />
          <Route exact path="/profile"  element={<UserComponent/>} />
          <Route exact path="/read"  element={<ReadOnlyDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;
