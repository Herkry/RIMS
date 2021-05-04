import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
//import ReactSession from 'react-client-session';
import "./test.css"

//ReactSession.setStoreType("localStorage");

class Test extends Component {
  constructor () {
    super();
    this.state = {
      // later try and notify errors like in the pusher tutorial
      errors: ""
    }
  }

  componentDidMount () {

  }

  onFormSubmitLogin(event){
    // event.preventDefault();

    // axios.post('/api/user/login', user)
    //   .then(response => {
    //     // test
    //     console.log(response);

    //     //check for errors/success mesage and store session info
    //     response.data.map(response_message => (
    //         if(response_message.error == "none"){
    //           // alert success message
    //           alert(response_message.message);

    //           //store data in sessions
    //           ReactSession.s et("staff_id", response_message.staff_id);
    //           ReactSession.set("name", response_message.name);
    //           ReactSession.set("user_type", response_message.user_type);
    //         }
    //         else{
    //            alert(response_message.error);
    //         }
    //     ))

    //   })
    //   .then(
    //     //redirect back to home page
    //     history.push("/");
    //   );

  }

  onFormSubmitRegister(event){
    // event.preventDefault();

    // axios.post('/api/researcher/register', researcher)
    //   .then(response => {
    //     // test
    //     console.log(response);

    //     //check for errors/success message 
    //     response.data.map(response_message => (
    //         if(response_message.error == "none"){
    //           // alert success message
    //           alert(response_message.message);
    //         }
    //         else{
    //            alert(response_message.error);
    //         }
    //     ))
    //   })
    //   .then(
    //     //redirect back to home page
    //     history.push("/");
    //   );
  }

  render () {
    return(
          <div>
            {/*Login Modal*/}
            <div class="modal fade" id="login-modal">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header text-center">
                    <div class="text-center">
                      <h3>Login</h3>
                    </div>
                  </div>
                  <form onSubmit={(event) => this.onFormSubmitLogin(event)} method="post" enctype="multipart/form-data">
                    <div class="modal-body">
                      <div class="form-group">
                        <input class="form-control" type="text" name="staff_id" value="" placeholder="Staff ID" required /><br />
                      </div>
                      <div class="form-group">
                        <input class="form-control" type="password" name="pass" value="" placeholder="Password" required /><br />
                      </div>
                      <div class="form-group">
                        <label class="my-1 mr-2" for="inlineFormCustomSelectPref">User Type</label><br />
                        <select class="custom-select my-1 mr-sm-2" name="user_type" id="inlineFormCustomSelectPref">
                          <option selected>Choose...</option>
                          <option value="super_admin">Super Admin</option>
                          <option value="group_admin">Group Admin</option>
                          <option value="researcher">Researcher</option>
                        </select>
                      </div>
                    </div>
                    <div class="model-footer text-center">
                      <input type="submit" value="Login" class="btn btn-primary" />
                    </div><br />
                  </form>
                </div>
              </div>
            </div>

            {/*Register Modal*/}
            <div class="modal fade" id="register-modal" tabindex="-1" role="dialog" aria-labelledby="registerModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="registerModalLabel">Registration</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <form onSubmit={(event) => this.onFormSubmiRegister(event)}>
                      <div class="form-group">
                        <input type="text" class="form-control" name="strath_email" value="" placeholder="Strathmore Email" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="staff_no" value="" placeholder="Staff No." required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="orcid_id" value="" placeholder="ORCID ID" required />
                      </div>
                      <div class="form-group">
                        <input type="password" class="form-control" name="pass" value="" placeholder="Password" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="f_name" value="" placeholder="First Name" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="l_name" value="" placeholder="Last Name" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="department" value="" placeholder="Department" required />
                      </div>
                    </form>
                  </div>
                  <div class="model-footer text-center">
                    <input type="submit" value="Register" class="btn btn-primary" />
                  </div><br />
                </div>
              </div>
            </div>

          {/*navbar*/}
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
              <a class="navbar-brand" href="#">
                <img src="/storage/images/knife.png" width="30" height="30" class="d-inline-block align-top mr-3" alt="" />
                             RIMS
              </a>
          
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
          
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <a class="nav-link" href="/index">Home<span class="sr-only">(current)</span></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/forms">E-learning</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/about">About Us</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/admin/home">Module Admin</a>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Account</a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a class="dropdown-item" data-target="#register-modal" data-toggle="modal" href="#">Register</a>
                      <a class="dropdown-item" data-target="#login-modal" data-toggle="modal" href="#"href="/logout">Login</a>
                      <a class="dropdown-item" href="/logout">Logout</a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="/logout">My Dashboard</a>
                    </div>
                  </li>             
                </ul>

              </div>
            </nav>
          </div>
    );
  }
}

export default Test;