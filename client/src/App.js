import React, { Component } from 'react';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { clearCurrentProfile } from './actions/profileActions';
import PrivateRoute from "./components/common/PrivateRoute";
import CreateProfile from "./components/create-profile/CreateProfile"
import EditProfile from "./components/edit-profile/EditProfile"
import AddExperience from "./components/add-credentials/AddExperience"
import AddEducation from "./components/add-credentials/AddEducation"
import Profiles from "./components/profiles/Profiles"
import Profile from "./components/profile/Profile"
import NotFound from "./components/not-found/NotFound"
import Posts from "./components/posts/Posts"
// import PostForm from "./components/posts/PostForm"
import Post from "./components/post/Post"




import './App.css';
// import { clearCurrentProfile } from './actions/profileActions';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
console.log("ees");
// clear current  profile
store.dispatch(clearCurrentProfile());

    // TODO: Clear current Profile

    // Redirect to login
    window.location.href = '/login';
    // window.open('/login');
    
      // window.location.href = "https://www.google.com";
    
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:handle" component={Profile} />

              <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              </Switch>

               <Switch>
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
              </Switch>

               <Switch>
              <PrivateRoute exact path="/add-experience" component={AddExperience} />
              </Switch>

               <Switch>
              <PrivateRoute exact path="/add-education" component={AddEducation} />
              </Switch>

              <Switch>
              <PrivateRoute exact path="/feed" component={Posts} />
              </Switch>
              
              <Switch>
              <PrivateRoute exact path="/post/:id" component={Post} />
              </Switch>
              

               <Route exact path="/not-found" component={NotFound} />

            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
