import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ReactSession } from 'react-client-session';

import "./profile.css"

class Profile extends Component {
  constructor () {
    super();
    this.state = {
      mem_fname:"",
      mem_lname:"",
      ORCID_ID:"",
      mem_dpt:"",
      mem_staff_email:"",
      mem_staff_id:""
    }
  }

  componentDidMount () {
    // check if user is logged, if not, redirect to Login Page
    if(ReactSession.get("logged_in_status") == "true"){
       // do nothing
    }
    else{
      // redirect to login page
      this.props.history.push("/");
    }

    // make request to get user profile info
    axios.get(`/api/user/${ReactSession.get("mem_id")}/profile`).then(response => {
      // test
      console.log(response);

      let memProfileInfo = response.data
      memProfileInfo.map((member) => {
        this.setState({
          mem_fname:member.mem_fname,
          mem_lname:member.mem_lname,
          ORCID_ID: member.ORCID_ID,
          mem_dpt:member.mem_dpt,
          mem_staff_email:member.mem_staff_email,
          mem_staff_id:member.mem_staff_id,
       });
      });
    });

    // binding 
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(event){
    this.setState({
        [event.target.name]: event.target.value
    });

  }

  onClickEditProfile(event){
    // show modal
    $("#edit-profile-modal").modal("show");
  }

  onFormSubmitEditProfile(event){
    event.preventDefault();

    // make request to update user profile info
    let updatedProfile = {
      mem_fname: this.state.mem_fname,
      mem_lname: this.state.mem_lname,
      ORCID_ID: this.state.ORCID_ID,
      mem_dpt: this.state.mem_dpt,
      mem_staff_email: this.state.mem_staff_email,
      mem_staff_id: this.state.mem_staff_id
    };

    console.log(updatedProfile);

    axios.post(`/api/user/${ReactSession.get("mem_id")}/profile/update`, updatedProfile).then(response => {
        // test
        console.log(response);
      
    }).then(()=>{
        // reload page
        location.reload();
    });


    
  }

  render () {
    return (
      /* whole thing- wrapper */
      <div id="" class="wrapper bg-grey-white">
          {/*Modals*/}
          {/*Edit Profile Modal*/}
          <div class="modal fade" id="edit-profile-modal" tabindex="-1" role="dialog" aria-labelledby="editProfileModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="addFileModalLabel">Edit Profile</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form onSubmit={(event) => this.onFormSubmitEditProfile(event)} enctype="multipart/form-data">
                    
                    <div class="form-group">
                      <input type="text" class="form-control" name="mem_fname" value={this.state.mem_fname} onChange={this.handleFieldChange} placeholder="First Name" required />
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" name="mem_lname" value={this.state.mem_lname} onChange={this.handleFieldChange} placeholder="Last Name" required />
                    </div>
                     <div class="form-group">
                      <input type="text" class="form-control" name="ORCID_ID" value={this.state.ORCID_ID} onChange={this.handleFieldChange} placeholder="ORCID ID" required />
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" name="mem_dpt" value={this.state.mem_dpt} onChange={this.handleFieldChange} placeholder="Department" required />
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" name="mem_staff_email" value={this.state.mem_staff_email} onChange={this.handleFieldChange} placeholder="Strathmore Email" required />
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" name="mem_staff_id" value={this.state.mem_staff_id} onChange={this.handleFieldChange} placeholder="Staff ID" required />
                    </div>
                    <div class="model-footer text-center">
                      <button type="button" class="btn btn-primary btn-color-bluish" onClick={(event) => this.onFormSubmitEditProfile(event)}>Change</button>

                    </div>< br/>

                  </form>
                </div>
              </div>
            </div>
          </div>
          {/*Edit profile Modal*/}
          {/*Modals*/}

          {/* Sidebar */}
          <nav id="sidebar" class="bg-transparent text-dark">

            {/* Sidebar Header*/}
            <div class="sidebar-header bg-transparent">
              <a class="navbar-brand pl-3 txt-big text-dark bg-transparent" href="#">
                <img src="/storage/images/strath_logo_2.png" width="60" height="60" class="d-inline-block align-top mr-3" alt="" />
                      RIMS
              </a>
              
            </div>
            {/* Sidebar Header*/}

            {/* List */}
            <div class="pl-4 d-flex pt-4 bg-transparent">
              <h2 class="text-dark">Menu</h2>
            </div>
              
            <ul class="list-unstyled pl-5 bg-transparent">
              <li class="">
                  <Link to="/projects" class="text-decoration-none text-dark">
                    <img src="/storage/images/projects.png" width="12" height="12" class="d-inline-block align-top mr-2 mt-2" alt=""/>
                    Projects
                  </Link>
              </li>
              <li>
                  <Link to="" class="text-decoration-none text-dark">
                    <img src="/storage/images/publications.png" width="12" height="12" class="d-inline-block align-top mr-2 mt-2" alt=""/>
                    Publications
                  </Link>
              </li>
              <li>
                  <Link to="" class="text-decoration-none text-dark">
                    <img src="/storage/images/events.png" width="12" height="12" class="d-inline-block align-top mr-2 mt-2" alt=""/>
                    Events
                  </Link>
              </li>
              <li>
                  <Link to="" class="text-decoration-none text-dark">
                    <img src="/storage/images/trainings.png" width="12" height="12" class="d-inline-block align-top mr-2 mt-2" alt=""/>
                    Trainings
                  </Link>
              </li>
            </ul>

            <div class="pl-4 d-flex pt-4 bg-transparent">
              <h2 class="text-dark">Account</h2>
            </div>
            <ul class="list-unstyled pl-5 bg-transparent">
              <li>
                  <Link to="/profile" class="text-decoration-none text-dark">
                    <img src="/storage/images/user_profile.png" width="12" height="12" class="d-inline-block align-top mr-2 mt-2" alt=""/>
                    Profile
                  </Link>
              </li>
              <li>
                  <Link to="" class="text-decoration-none text-dark">
                    <img src="/storage/images/notifications.png" width="12" height="12" class="d-inline-block align-top mr-2 mt-2" alt=""/>
                    Notifications
                  </Link>
              </li>
              <li>
                  <Link to="" class="text-decoration-none text-dark">
                    <img src="/storage/images/settings.png" width="12" height="12" class="d-inline-block align-top mr-2 mt-2" alt=""/>
                    Settings
                  </Link>
              </li>
            </ul>
            {/* List */}

          </nav>
          {/* Sidebar */}

          {/* Line Separator */}
          <div id="line-separator" class="mr-4 line-sep">
          </div>
          {/* Line Separator */}

          {/* Content */}
          <div id="content" class="container-fluid">

            {/*Greetings section*/}
            <div class="section bg-transparent my-projects-row-div">
                <div class="row bg-transparent p-2 rounded-lg">
                  <div class="col-5 bg-transparent rounded-lg pt-1 pl-0 py-2 ">
                      <h2>Hi, {ReactSession.get("mem_fname")} {ReactSession.get("mem_lname")}</h2>
                  </div>
                  <div class="col-2 bg-transparent rounded-lg pt-3 d-flex justify-content-end">
                      <div class="switchToggle mr-n5">
                          <input type="checkbox" id="switch" />
                          <label for="switch">Toggle</label>
                      </div>
                  </div>
                  <div class="col-2 bg-transparent rounded-lg pt-3 d-flex justify-content-end">
                    <a class="bg-transparent text-danger text-decoration-none txt-logout margin-logout-txt " href="">
                      <img src="/storage/images/logout2.png" width="30" height="30" class="d-inline-block align-top mr-2" alt="Logout" />
                            Logout
                    </a>
                  </div>
                </div>  
            </div>
            {/*Greetings section*/}

            {/*My Profile section*/}
            <div class="section bg-transparent my-projects-row-div">
                <div class="row bg-transparent p-2 rounded-lg d-flex">

                  <div class="col-3 bg-transparent rounded-lg p-2 ">
                      <h2>My Profile</h2>
                  </div>
                  <div class="col-3 bg-transparent rounded-lg pt-2 ">
                      
                  </div>
                  <div class="col-3 bg-transparent rounded-lg pt-2 d-flex justify-content-end pr-5 ">
                      <img src="/storage/images/edit.png" width="30" height="30" class="d-inline-block align-top mr-3" alt="" onClick={(event) => this.onClickEditProfile(event)} />
                  </div>
                  
                </div>  
            </div>
            {/*My Profile section*/}

            {/* profile pic n name */}
            <div class="section bg-transparent">
              <div class="row bg-transparent p-2 rounded-lg">
                <div class="col-2 bg-transparent rounded-lg p-2 text-center pt-3 img-profile-div">
                  <img src="/storage/images/user_profile.png" width="130" height="130" class="d-inline-block align-top mr-3" alt="" />
                </div>
                <div class="col-3 bg-transparent rounded-lg pt-5 img-profile-div">
                    <span class="name-big-letters">
                      <img src="/storage/images/name.png" width="30" height="30" class="d-inline-block align-top mr-2 mt-1" alt="" />
                      {this.state.mem_fname} {this.state.mem_lname}
                    </span><br />
                    <span class="email-big-letters">
                      <img src="/storage/images/email.png" width="25" height="25" class="d-inline-block align-top ml-1 mr-2 mt-1" alt="" />
                      {this.state.mem_staff_email}
                    </span>
                </div>
                <div class="col-5 bg-transparent rounded-lg pt-2 img-profile-div">
                    
                </div>
              </div>
            </div>
            {/* profile pic n name */}

            <hr />

            {/*personal details*/}
            <div class="section">
              {/*staff no*/}
              <div class="row bg-transparent p-2 rounded-lg">
                <div class="col-2 bg-transparent rounded-lg p-2 text-center">
                  <span class="fields-smaller-letters">
                      <img src="/storage/images/staff_no.png" width="30" height="30" class="d-inline-block align-top mr-3 mt-0" alt="" />
                      Staff ID
                  </span><br />
                </div>
                <div class="col-8 bg-transparent rounded-lg pt-2">
                  <h4>{this.state.mem_staff_id}</h4>
                </div>
              </div>
              {/*staff no*/}

              <hr />

              {/*orcid id*/}
              <div class="row bg-transparent p-2 rounded-lg">
                <div class="col-2 bg-transparent rounded-lg p-2 pl-3 text-center">
                  <span class="fields-smaller-letters">
                      <img src="/storage/images/orcid_id.png" width="30" height="30" class="d-inline-block align-top mr-3 mt-0" alt="" />
                      ORCiD ID
                  </span><br />
                </div>
                <div class="col-8 bg-transparent rounded-lg pt-2">
                  <h4>{this.state.ORCID_ID}</h4>
                </div>
              </div>
              {/*orcid id*/}

              <hr />

              {/*department*/}
              <div class="row bg-transparent p-2 rounded-lg">
                <div class="col-2 bg-transparent rounded-lg p-2 pl-4 text-center">
                  <span class="fields-smaller-letters">
                      <img src="/storage/images/department.png" width="30" height="30" class="d-inline-block align-top mr-3 mt-0" alt="" />
                      Department
                  </span><br />
                </div>
                <div class="col-8 bg-transparent rounded-lg pt-2">
                  <h4>{this.state.mem_dpt}</h4>
                </div>
              </div>
              {/*department*/}

              <hr />
              
            </div>
            {/*personal details end*/}
          </div>
          {/* Content */}
      </div>
    );
  }
}

export default Profile;