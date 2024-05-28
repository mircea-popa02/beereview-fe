import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Discover from "./components/Discover";
import Search from "./components/Search";
import Profile from "./components/Profile";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const PrivateRoute = ({element}) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login"/>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/discover" element={<PrivateRoute element={<Discover/>}/>}/>
                <Route path="/search" element={<PrivateRoute element={<Search/>}/>}/>
                <Route path="/home" element={<PrivateRoute element={<Home/>}/>}/>
                <Route path="/profile" element={<PrivateRoute element={<Profile/>}/>}/>
                <Route path="*" element={<h1>Not Found</h1>}/>
            </Routes>
        </Router>
    </React.StrictMode>
);
