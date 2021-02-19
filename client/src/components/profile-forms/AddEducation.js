import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { addEducation } from '../../actions/profile';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

const AddEducation = ({ addEducation, history }) => {

    const [formData, setFormData] = useState({   //setting initial state/data
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });

    //toggling to date field   
    const [toDateDisabled, toggleDisabled] = useState(false);

    //extracting data from formdata
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });   // updating state

    const onSubmit = e => {
        e.preventDefault();
        document.documentElement.scrollTop = 0; // on submitting form, scrolling page to top
        addEducation(formData, history);
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Add Your Education
            </h1>
            <p className="lead">
                <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* School"
                        name="school"
                        value={school}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* degree"
                        name="degree"
                        value={degree}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Field Of Study"
                        name="fieldofstudy"
                        value={fieldofstudy}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <h4>* From Date</h4>
                    <input
                        type="date"
                        name="from"
                        value={from}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <p>
                        <input
                            type="checkbox"
                            name="current"
                            checked={current}
                            value={current}
                            onChange={() => {
                                setFormData({ ...formData, current: !current });
                                toggleDisabled(!toDateDisabled);
                            }}
                        />{' '} Current School
                    </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input
                        type="date"
                        name="to"
                        value={to}
                        onChange={e => onChange(e)}
                        disabled={toDateDisabled ? 'disabled' : ''}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        value={description}
                        onChange={e => onChange(e)}
                        placeholder="Program Description"
                    ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link to='/dashboard' className="btn btn-light my-1">Go Back</Link>
            </form>
        </Fragment>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { addEducation })(withRouter(AddEducation));
