import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from "react-moment";
import {deleteEducation} from "../../actions/profileActions";




class  Education extends Component {
    onDeleteClick(id){
        this.props.deleteEducation(id);
    }
  render() {
      const Education=this.props.education.map(edu=>(
          <tr key={edu._id}>
          <td>{edu.school}</td>
          <td>{edu.degree}</td>
          <td><Moment format="DD/MM/YYYY">{edu.from}</Moment> -  
      {(edu.to===null)?" Now":<Moment format=" DD/MM/YYYY">{edu.to}</Moment>}</td>
          <td><button onClick={this.onDeleteClick.bind(this,edu._id)} className="btn btn-danger">Delete</button></td>
              </tr>
      ));

    return (
      <div>
          <h4 className="mb-4">Education Credentials</h4>
          <table className="table">
          <thead>
              <tr>
                  <th>School</th>
                  <th>degree</th>
                  <th>Years</th>
                  <th></th>
              </tr>
          </thead>
          <tbody>
              {Education}
          </tbody>
          </table>
        
      </div>
    )
  }
}
Education.defaultProps={
    deleteEducation:PropTypes.func.isRequired
}


export default connect(null,{deleteEducation})(Education);