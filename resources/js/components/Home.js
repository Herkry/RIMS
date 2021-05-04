import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ReactSession } from 'react-client-session';
import { Redirect } from 'react-router-dom';
import "./home.css"

// create options of select usertype statement
const usertypes = [
  {
    label: "Super Admin",
    value: "super_admin",
  },
  {
    label: "Group Admin",
    value: "group_admin",
  },
  {
    label: "Researcher",
    value: "researcher",
  },
];

class Home extends Component {
  constructor () {
    super();
    this.state = {
      super_admin: "super_admin",    
      group_admin: "group_admin",    
      strath_email: "",    
      staff_no: "",    
      orcid_id: "",    
      pass: "",    
      f_name: "",    
      l_name: "",    
      department: "",    

      // later try and notify errors like in the pusher tutorial
      errors: []
    }

    // binding methods
    this.handleFieldChange = this.handleFieldChange.bind(this);
    //this.onFormSubmitRegister = this.onFormSubmitRegister.bind(this);
    //this.onFormSubmitLogin = this.onFormSubmitLogin.bind(this);

  }

  componentDidMount () {
    //store data in sessions
    ReactSession.set("no_one", "100");
    ReactSession.set("no_two", "200");
    ReactSession.set("no_three", "300");
  }

  handleFieldChange(event){
    this.setState({
          [event.target.name]: event.target.value
      })
  }

  onFormSubmitRegister(event){
    
    event.preventDefault();
    
    // test
    console.log("click3!!");

    // not sure what this means , but has to do with routing
    const { history } = this.props;

    const researcher = {
      user_type: this.state.user_type,    
      strath_email: this.state.strath_email,    
      staff_no: this.state.staff_no,    
      orcid_id: this.state.orcid_id,    
      pass: this.state.pass,    
      f_name: this.state.f_name,    
      l_name: this.state.l_name,    
      department: this.state.department 

    };

    // axios.get('/api/test/test')
    //   .then(response => {
    //     // test
    //     console.log(response);

    //     // check for errors/success message 
    //     // response.data.map(response_message => {
    //     //     if(response_message.error == "none"){
    //     //       // alert success message
    //     //       alert(response_message.message);
    //     //     }
    //     //     else{
    //     //        alert(response_message.error);
    //     //     }
    //     // })
    //   })
    //   .then(
    //     // redirect back to home page
    //     // history.push("/")
    //   );

    // axios.post(`/api/researcher/register`, researcher)
    //   .then(response => {
    //     console.log(response);
    // });

    
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
    //           ReactSession.set("staff_id", response_message.staff_id);
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

  render () {
    // Not sure whether the code below is necessary as I already set this in the root App component
    ReactSession.setStoreType("localStorage");

    return(
          <div>

            {/*Login Modal*/}
            <div class="modal fade" id="login-modal">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header text-center">
                    <h3>Login</h3>
                  </div>
                  <form onSubmit={(event) => onFormSubmitLogin(event)} method="post" enctype="multipart/form-data">
                    <div class="modal-body">
                      <div class="form-group">
                        <input class="form-control" type="text" name="staff_id"  placeholder="Staff ID" required /><br />
                      </div>
                      <div class="form-group">
                        <input class="form-control" type="password" name="pass"  placeholder="Password" required /><br />
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
                    <form onSubmit={(event) => this.onFormSubmitRegister(event)}>
                      
                      <div class="form-group">
                        <input type="text" class="form-control" name="strath_email" value={this.state.strath_email} onChange={this.handleFieldChange} placeholder="Strathmore email" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="staff_no" value={this.state.staff_no} onChange={this.handleFieldChange} placeholder="Staff No." required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="orcid_id" value={this.state.orcid_id} onChange={this.handleFieldChange} placeholder="ORCID ID" required />
                      </div>
                      <div class="form-group">
                        <input type="password" class="form-control" name="pass" value={this.state.pass} onChange={this.handleFieldChange} placeholder="Password" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="f_name" value={this.state.f_name} onChange={this.handleFieldChange} placeholder="First Name" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="l_name" value={this.state.l_name} onChange={this.handleFieldChange} placeholder="Last Name" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="department" value={this.state.department} onChange={this.handleFieldChange} placeholder="Department" required />
                      </div>
                      <div class="model-footer text-center">
                        <input type="submit" value="Register" class="btn btn-primary" />
                      </div>< br/>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          {/*navbar*/}
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
              <a class="navbar-brand" href="#">
                <img src="/storage/images/knife.png" width="30" height="30" class="d-inline-block align-top" alt="" />
                     <h4><b>RIMS</b></h4>
              </a>
          
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
          
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">

                  <li>
                    <Link to="/projects">Projects</Link>
                  </li>

                  <li class="nav-item active">
                    <a class="nav-link" href="/index">Home<span class="sr-only">(current)</span></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/about">About Us {ReactSession.get('no_one')}</a>
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
            {/* navbar */}
          </div>

    );
  }
}

export default Home;