import axios from 'axios'
import { setAlert } from './alert';

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE, 
    CLEAR_PROFILE, 
    ACCOUNT_DELETED,
    GET_PROFILES
} from './types';

//get current user profile
export const getCurrentProfile = () => async dispatch =>{
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status}
        })
    }
}

//create or update profile
/* 
    formdata - this is profile data we picked up from profile form
    history - when user newly create profile, then after creation we will redirect him
            to dashboard, thats why used this history object.
    edit - if true then user is modifying his profile. else creating new profile.
*/
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        //prepending https:// in front of links if user does not enter it
        {   ( formData.twitter ) && ( formData.twitter.startsWith('http') ? 
            formData.twitter = formData.twitter : 
            formData.twitter = 'https://' + formData.twitter)
        }
        {
            ( formData.facebook ) && ( formData.facebook.startsWith('http') ? 
            formData.facebook = formData.facebook : 
            formData.facebook = 'https://' + formData.facebook )
        }
        {
            ( formData.linkedin ) && ( formData.linkedin.startsWith('http') ? 
            formData.linkedin = formData.linkedin : 
            formData.linkedin = 'https://' + formData.linkedin )
        }
        {
            ( formData.youtube ) && ( formData.youtube.startsWith('http') ? 
            formData.youtube = formData.youtube : 
            formData.youtube = 'https://' + formData.youtube )
        }
        {
            ( formData.instagram ) && ( formData.instagram.startsWith('http') ? 
            formData.instagram = formData.instagram : 
            formData.instagram = 'https://' + formData.instagram )
        }

        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile has been updated' : 'Profile has been created', 'success'));
        
        if(edit === false){
            history.push('/dashboard');  
        }
    } catch (error) {
        const errors = error.response.data.error;  // data.error we are sending it from server side (routes/api/profile.js)

        //getting error msg from server, that we mentioned at server side
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText }
        });
    }
}


//Add Experience 
export const addExperience = (formData,history) => async dispatch => {

    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added!!!', 'success'));
        
        history.push('/dashboard');  

    } catch (error) {
        const errors = error.response.data.error;  // data.error we are sending it from server side (routes/api/profile.js)

        //getting error msg from server, that we mentioned at server side
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText }
        });
    }
}


// add education 

export const addEducation = (formData, history) => async dispatch => {
    try {

        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        console.log(formData)
        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added!!!', 'success'));
        
        history.push('/dashboard');  

    } catch (error) {
        const errors = error.response.data.error;  // data.error we are sending it from server side (routes/api/profile.js)

        //getting error msg from server, that we mentioned at server side
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText }
        });
    }
}

// delete experiece

export const deleteExperience = id => async dispatch => {
    try {

        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Deleted!!!', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText }
        });
    }
}

//delete education

export const deleteEducation = id => async dispatch => {
    try {

        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Deleted!!!', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText }
        });
    }
}

//delete account

export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure you want to delete this account? THIS CAN NOT BE UNDONE!!!')){
        try {

            const res = await axios.delete('/api/profile');
    
            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });
    
            dispatch(setAlert('Your account has been deleted!!!', 'success'));
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText }
            });
        }
    }  
}

//get all user's profile
export const getAllProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });   // clearing current profile data
    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText }
        });
    }
}

//get profile by user id

export const getProfileById = userid => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });   // clearing current profile data
    try {
        const res = await axios.get(`/api/profile/user/${userid}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText }
        });
    }
}