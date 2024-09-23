import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInAndSignUp from './LoginAndSignUp/login_signup';
import UserComponent from './profile/component_profile';
import { ReadOnlyDetails } from './profile/read_profile';
import HomePage from './Home/home_page';
import NavigationBar from './Home/navigationbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<NavigationBar />}>
            <Route exact path="/"  element={<LogInAndSignUp/>} />
            <Route exact path="/profile"  element={<UserComponent/>} />
            <Route exact path="/read"  element={<ReadOnlyDetails/>} />
            <Route exact path="/home"  element={<HomePage/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
