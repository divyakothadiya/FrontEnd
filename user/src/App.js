import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInAndSignUp from './LoginAndSignUp/login_signup';

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/login"  element={<LogInAndSignUp/>} />
      </Routes>
    </Router>
  );
}

export default App;
