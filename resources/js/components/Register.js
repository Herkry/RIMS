import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ReactSession } from 'react-client-session';
import { Redirect } from 'react-router-dom';
import "./register.css"

class Register extends Component {
  constructor () {
    super();
    this.state = {
      mem_fname:"",
      mem_lname:"",
      ORCID_ID:"",
      mem_dpt:"",
      mem_staff_email:"",
      mem_staff_id:"",
      mem_pass:""
    }

    // binding methods
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount () {
      
  }

  handleFieldChange(event){
    this.setState({
          [event.target.name]: event.target.value
      })
  }

  onFormSubmitRegisterResearcher(event){
    event.preventDefault();

    // make object to register researcher
    let researcher = {
      mem_fname: this.state.mem_fname,
      mem_lname: this.state.mem_lname,
      ORCID_ID: this.state.ORCID_ID,
      mem_dpt: this.state.mem_dpt,
      mem_staff_email: this.state.mem_staff_email,
      mem_staff_id: this.state.mem_staff_id,
      mem_pass: this.state.mem_pass
    };

    // create modal with loading spinner
    $('#spinner-reg-modal').modal("show").on("hide.bs.modal", function(){ return false });

    // make api call
    axios.post(`/api/researcher/register`, researcher).then(response => {
        // test
        console.log(response.data);

        // put important info in the sessions
        ReactSession.set("mem_id", response.data.mem_id);
        ReactSession.set("mem_staff_id", response.data.mem_staff_id);
        ReactSession.set("mem_fname", response.data.mem_fname);
        ReactSession.set("mem_lname", response.data.mem_lname);
        ReactSession.set("mem_type", response.data.mem_type);
        ReactSession.set("ORCID_ID", response.data.ORCID_ID);
        ReactSession.set("logged_in_status", "true");

    }).then(()=>{
        // hide modal
        $('#spinner-reg-modal').on("hide.bs.modal", function() { });
        $("#spinner-reg-modal").hide();
        $(".modal-backdrop").remove();

        // go to dashboard(projects page)
        window.location.href = "/projects";
    });
  }


  render () {
    // Not sure whether the code below is necessary as I already set this in the root App component
    ReactSession.setStoreType("localStorage");

    return(
         <div id="content" class="bg-colour">
            {/*navbar*/}
            {/*<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
              <a class="navbar-brand" href="#">
                  <div class="row">
                    <div class="col-6 d-flex justify-content-end pr-2">
                      <a href="https://strathmore.edu"><img src="/storage/images/strath_logo_2.png" width="55" height="50" class="d-inline-block align-top" alt="SU_Logo" /></a>
                    </div>
                    <div class="col-6 d-flex justify-content-start pl-1 pt-1">
                      <p>RIMS</p>
                    </div>
                  </div>
              </a>                
            </nav>*/}
            {/* navbar */}

            {/* Modal with loading spinner*/}
            <div class="modal fade bd-example-modal-sm" tabindex="-1" id="spinner-reg-modal" role="dialog" aria-labelledby="spinner-modal" aria-hidden="true">
              <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div class="modal-content pt-3 pb-3">
                  <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div class="text-center mt-2">
                    Loading...
                  </div>
                </div>
              </div>
            </div>
            {/* Modal with loading spinner*/}

            {/*Login section*/}
            <div class="section bg-transparent">
                <div class="row bg-transparent p-2 rounded-lg">

                  <div class="col-8 bg-transparent rounded-lg px-2 py-2 pt-3 ">
                      
                  </div>
                  <div class="col-4 bg-transparent rounded-lg p-3">
                    <div class="row">
                      <div class="col-6 d-flex justify-content-end pr-1">
                        <Link to="/" class="color-bluish"><img src="/storage/images/logout.png" width="30" height="30" class="d-inline-block align-top" alt="" /></Link>
                      </div>
                      <div class="col-6 d-flex justify-content-start pl-1 pt-1">
                        <Link to="/" class="color-bluish"><b>Login</b></Link>
                      </div>
                    </div>
                  </div>
                  
                </div>  
            </div>
            {/*Login section*/}

            {/*Big section*/}
            <div class="section bg-transparent h-100 mt-2">
                <div class="row bg-transparent p-2 rounded-lg flex-grow-1 overflow-auto h-100">
                  <div class="col-6 bg-transparent rounded-lg pt-3 px-2 py-2 d-flex justify-content-center align-items-center">
                      <figure class="figure">
                        <a class="" data-target="" data-toggle="modal" href="#">
                          <img src="/storage/images/strath_logo_2.png" width="240" height="240" class="d-inline-block align-top figure-img img-fluid rounded" alt=""/>
                        </a>
                        <figcaption class="figure-caption">
                          {/*<a class="" href="#"><h1>RIMS</h1></a>*/}
                        </figcaption>
                      </figure>
                  </div>
                  <div class="col-6 bg-transparent rounded-lg px-3 py-3 pt-4 justify-content-center align-items-center">
                      <div class="pl-3 color-bluish">
                        <b class="color-bluish">Create a new account</b>
                      </div>
                      <div class="card mt-2 color-light-bluish card-width">
                        <div class="card-body">
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
                            <input type="text" class="form-control" name="mem_staff_email" value={this.state.mem_staff_email} onChange={this.handleFieldChange} placeholder="Staff Email" required />
                          </div>
                          <div class="form-group">
                            <input type="text" class="form-control" name="mem_staff_id" value={this.state.mem_staff_id} onChange={this.handleFieldChange} placeholder="Staff ID" required />
                          </div>
                          <div class="form-group">
                            <input type="password" class="form-control" name="mem_pass" value={this.state.mem_pass} onChange={this.handleFieldChange} placeholder="Password" required />
                          </div>
                          <div class="form-group">
                            <button type="button" class="btn btn-primary btn-color-bluish" onClick={(event) => this.onFormSubmitRegisterResearcher(event)}>Continue</button>
                          </div>
                        </div>
                      </div>
                  </div>

                </div>  
            </div>
            {/*Big section*/}

         </div> 
    );
  }
}

export default Register;