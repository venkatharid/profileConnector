import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Alert from './components/layout/Alert'
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import CreateProfile from '../src/components/profile-forms/CreateProfile'
import EditProfile from '../src/components/profile-forms/editProfile'
import AddExperience from '../src/components/profile-forms/AddExperience'
import AddEducation from '../src/components/profile-forms/AddEducation'
import Dashboard from '../src/components/dashboard/Dashboard'
import PrivateRoute from '../src/components/routing/PrivateRoute'

//Redux
import { Provider } from 'react-redux';
import store from './store';

import './App.css';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

const App =() =>{ 
  useEffect(()=> {
    store.dispatch(loadUser())
  },[]);
  
  return(
  <Provider store={store}>
  <Router>
  <Fragment>
    <Navbar />
    <Route exact path='/' component={Landing} />
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/add-education' component={AddEducation} />
        <PrivateRoute exact path='/add-experience' component={AddExperience} />
      </Switch>
    </section>
  </Fragment>
  </Router>
  </Provider>
)
}
  

export default App;


