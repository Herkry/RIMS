import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ReactSession } from 'react-client-session';
import { Redirect } from 'react-router-dom';
import "./projects.css"

class Projects extends Component {
  constructor () {
    super();
    this.state = {
      // changed just to rerender jsx content to update ui
      reload: "",

      // projects and proposals- ongoing, completed
      ongoingProjects: [],
      completedProjects: [],
      ongoingProposals: [],
      completedProposals: [],
      ongoingGrantsCount: "",
      ongoingProposalsCount: "",

      // current collaborators being added when creating project (used also when editing project)
      current_collaborators: [],

      // Files- will deal with these later
      // file attributes
      // name as visible in UI
      // file_ui_name: "",
      // // actual file
      // file: null,

      // the following 3 aren't necessary (to be determined in backend)
      // actual file name
      // file_actual_name: "",
      // URL of file
      //file_url: "",
      // file type
      //file type="",

      // current_item_id (used when adding file for particular project/bid, editing project/bid or removing project/bid)
      current_item_id: "",

      // add project attributes (also used when editing project)
      proj_type:"donation",
      proj_funder:"",
      proj_description:"",
      project_start_date:"",
      project_end_date:"",
      proj_name:"",
      proj_funding_amt:"",
      proj_funding_currency:"KES",

      // add bid attributes (also used when editing bid)
      bid_name:"",
      bid_description:"",
      bid_submission_date:"",
      bid_funder:"",

      // current collaborator details- used when adding collaborator for particular project/proposal (also used when editing project/proposal)
      current_collaborator_collabo_type:"internal",
      current_collaborator_collabo_role:"team_member",
      current_collaborator_collabo_orcid_id:"",

      // collapsibles
      collapsibleOngoingProjects: "down-arrow",
      collapsibleCompletedProjects: "down-arrow",
      collapsibleOngoingProposals: "down-arrow",
      collapsibleCompletedProposals: "down-arrow"
      
    }
    // binding
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFieldProjTypeChange = this.handleFieldProjTypeChange.bind(this);
    this.handleFieldProjFundingCurrencyChange = this.handleFieldProjFundingCurrencyChange.bind(this);
    this.handleFieldCollaboTypeChange = this.handleFieldCollaboTypeChange.bind(this);
    this.handleFieldCollaboRoleChange = this.handleFieldCollaboRoleChange.bind(this);
    this.onClickCollapsibleOngoingProjects = this.onClickCollapsibleOngoingProjects.bind(this);
    this.onClickCollapsibleCompletedProjects = this.onClickCollapsibleCompletedProjects.bind(this);
    this.onClickCollapsibleOngoingProposals = this.onClickCollapsibleOngoingProposals.bind(this);
    this.onClickCollapsibleCompletedProposals = this.onClickCollapsibleCompletedProposals.bind(this);
    this.onClickEditProject = this.onClickEditProject.bind(this);
  }

  // collapsibles functions
  onClickCollapsibleOngoingProjects() {
      if(this.state.collapsibleOngoingProjects == "down-arrow"){
          this.setState( {collapsibleOngoingProjects: "collapse-two-arrows"} );
      }
      else{
          this.setState( {collapsibleOngoingProjects: "down-arrow"} );
      }
  }
  onClickCollapsibleCompletedProjects() {
      if(this.state.collapsibleCompletedProjects == "down-arrow"){
          this.setState( {collapsibleCompletedProjects: "collapse-two-arrows"} );
      }
      else{
          this.setState( {collapsibleCompletedProjects: "down-arrow"} );
      }
  }

  onClickCollapsibleOngoingProposals() {
      if(this.state.collapsibleOngoingProposals == "down-arrow"){
          this.setState( {collapsibleOngoingProposals: "collapse-two-arrows"} );
      }
      else{
          this.setState( {collapsibleOngoingProposals: "down-arrow"} );
      }
  }

 onClickCollapsibleCompletedProposals() {
    if(this.state.collapsibleCompletedProposals == "down-arrow"){
        this.setState( {collapsibleCompletedProposals: "collapse-two-arrows"} );
    }
    else{
        this.setState( {collapsibleCompletedProposals: "down-arrow"} );
    }
  }

  // Files- will deal with these later
  // onClickAddFile(event, proj_id){
  //   // test
  //   //console.log(proj_id);

  //   // set state for current project_id
  //   this.setState({ current_item_id: proj_id });
  //   // open modal for adding file
  //   $('#add-file-modal').modal("show");
  // }

  onClickBigAddBtn(event){
    $('#add-prs-modal').modal("show");
  }

  onClickAddCollaborator(event){
    event.preventDefault();

    const collaborator = {
      collabo_type: this.state.current_collaborator_collabo_type,    
      collabo_role: this.state.current_collaborator_collabo_role,
      collabo_orcid_id: this.state.current_collaborator_collabo_orcid_id  
    };

    // add collaborator to collaborators array in state, so in modal a new collaborator appears
    const tempCollaborators = this.state.current_collaborators;
    tempCollaborators.push(collaborator);
    this.setState({ current_collaborators: tempCollaborators })
  }

  // remove collaborator from current_collaborators array
  onClickRemoveCollaborator(event, collabo_orcid_id){
    // remove collaborator from collaborators array in state, so in modal the removed collaborator disappears
    let tempCollaborators = this.state.current_collaborators;
    tempCollaborators = tempCollaborators.filter(collaborator => collaborator.collabo_orcid_id != collabo_orcid_id);
    this.setState({ current_collaborators: tempCollaborators })

    // test
    console.log(this.state.current_collaborators);
  }

  // editing project
  onClickEditProject(event, proj_id) {
    // set state for current project_id- setting the state is not working so just use proj_id
    this.setState({ current_item_id: proj_id });
    // get project to be edited (single project)
    let ongoingProjects = this.state.ongoingProjects;
    let projects_to_be_edited = ongoingProjects.filter(project => project.proj_id == proj_id);
    
    projects_to_be_edited.map((project_to_be_edited) => {
        let project_to_be_edited_proj_collaborators = project_to_be_edited.proj_collaborators.filter(project_collaborator => project_collaborator.p_collabo_orcid_id != ReactSession.get("ORCID_ID"));
        project_to_be_edited.proj_collaborators = project_to_be_edited_proj_collaborators;

        // put collaborators to temp array which will be assigned to state.current_collaborators in its proper format
        let tempCurrentCollaborators = [];
        project_to_be_edited.proj_collaborators.map((proj_collaborator) => {
            let tempCollaborator = {
              "collabo_type": proj_collaborator.p_collabo_type,
              "collabo_role": proj_collaborator.p_collabo_role,
              "collabo_orcid_id": proj_collaborator.p_collabo_orcid_id
            }
            tempCurrentCollaborators.push(tempCollaborator);
        });        

        // set state with details of the project clicked based on its proj_id
        this.setState({
            proj_type:project_to_be_edited.proj_type,
            proj_funder:project_to_be_edited.proj_funder,
            proj_description:project_to_be_edited.proj_description,
            project_start_date:project_to_be_edited.project_start_date,
            project_end_date:project_to_be_edited.project_end_date,
            created_by:project_to_be_edited.created_by,
            proj_name:project_to_be_edited.proj_name,
            proj_funding_amt:project_to_be_edited.proj_funding_amt,
            proj_funding_currency:project_to_be_edited.proj_funding_currency,
            current_collaborators: tempCurrentCollaborators,

            // now set current_item_id
            current_item_id: project_to_be_edited.proj_id
        });            
    });
    
    // open modal for editing project
    $('#edit-project-modal').modal("show");

    // test
    console.log(this.state);   
  }

  onClickRemoveProject(event, proj_id){
    //make post request to delete project
    axios.post(`/api/researcher/project/${proj_id}/delete`)
      .then(response => {
        // reload page
        location.reload();
    });
  }

  onClickCompleteProject(event, proj_id){
    //make post request to delete project
    axios.post(`/api/researcher/project/${proj_id}/complete`)
      .then(response => {
        // reload page
        location.reload();
    });
  }

  onClickEditProposal(event, bid_id){
     // set state for current item_id- setting the state is not working so just use bid_id  
    this.setState({ current_item_id: bid_id });
    // get proposal to be edited (single proposal)
    let tempOngoingProposals = [];
    this.state.ongoingProposals.map((ongoingProposal) => {
      tempOngoingProposals.push(ongoingProposal);
    });

    let proposals_to_be_edited = tempOngoingProposals.filter(proposal => proposal.bid_id == bid_id);
    proposals_to_be_edited.map((proposal_to_be_edited) => {
        let proposal_to_be_edited_bid_collaborators = proposal_to_be_edited.bid_collaborators.filter(bid_collaborator => bid_collaborator.bid_collabo_orcid_id != ReactSession.get("ORCID_ID"));
        proposal_to_be_edited.bid_collaborators = proposal_to_be_edited_bid_collaborators;

        // put collaborators to temp array which will be assigned to state.current_collaborators in its proper format
        let tempCurrentCollaborators = [];
        proposal_to_be_edited.bid_collaborators.map((bid_collaborator) => {
            let tempCollaborator = {
              "collabo_type": bid_collaborator.bid_collabo_type,
              "collabo_role": bid_collaborator.bid_collabo_role,
              "collabo_orcid_id": bid_collaborator.bid_collabo_orcid_id
            }
            tempCurrentCollaborators.push(tempCollaborator);
        });        

        // set state with details of the proposal clicked based on its bid_id
        this.setState({
            bid_name:proposal_to_be_edited.bid_name,
            bid_description:proposal_to_be_edited.bid_description,
            bid_submission_date:proposal_to_be_edited.bid_submission_date,
            bid_funder:proposal_to_be_edited.bid_funder,
            current_collaborators: tempCurrentCollaborators,

            // now set current_item_id
            current_item_id: proposal_to_be_edited.bid_id
        });           
    });

    // open modal for editing project
    $('#edit-proposal-modal').modal("show");

  }

  onClickCompleteProposal(event, bid_id){
    // set current_item_id for use in onFormSubmitCompleteProposal
    this.setState({
      current_item_id: bid_id
    });

    // open modal for adding additional details before completing proposal and creating new project(grant)
    $('#complete-proposal-modal').modal("show");
  }

  onClickRejectProposal(event, bid_id){
    //make post request to reject project
    axios.post(`/api/researcher/proposal/${bid_id}/rejected`)
      .then(response => {
        // reload page
        location.reload();
    });
  }

  onClickRemoveProposal(event, bid_id){
    //make post request to delete project
    axios.post(`/api/researcher/proposal/${bid_id}/delete`)
      .then(response => {
        // reload page
        location.reload();
    });
  }

  // Files- will deal with these later
  // not sure what I intended to do here 
  //   //creating object
  //   project_incident = {
  //     p_inc_id: proj_incident_p_inc_id
  //   };

  //   // make request to delete file from db
  //   axios.post(`/api/researcher/project/file/remove`, project_incident)
  //     .then(response => {
  //       console.log(response);
  //   });

  //   // no state variable affected, just to rerender without deleted file  
  //   this.setState({ reload: ""});
  // }

  handleFieldChange(event){

    this.setState({
        [event.target.name]: event.target.value
    });

    // Files- will deal with these later
    // if it is file input we're dealing with(add file modal)
    // if(event.target.name == "file"){
    //   console.log(" event.target.name is file");
    //   let files = event.target.files || event.dataTransfer.files;  
    //   if (!files.length)
    //        return;
    //   this.createImage(files[0]);
    // }

    // Plus features- will deal with these later
    // make funding inputs inactive if project type selected is unfunded
    // if([event.target.name] == "proj_type" && event.target.value == "unfunded"){
    //   document.getElementById("proj_type").disabled = true;
    //   document.getElementById("proj_funding_amt").disabled = true;
    //   document.getElementById("proj_funding_amt_currency").disabled = true;
    // }
    // else{
    //     document.getElementById("proj_type").disabled = false;
    //     document.getElementById("proj_funding_amt").disabled = false;
    //     document.getElementById("proj_funding_amt_currency").disabled = false;
    // }
  }

  handleFieldProjTypeChange(event){
    this.setState({
        proj_type: event.target.value
    });
  }

  handleFieldProjFundingCurrencyChange(event){
    this.setState({
        proj_funding_currency: event.target.value
    });
  }

  handleFieldCollaboTypeChange(event){
    this.setState({
        current_collaborator_collabo_type: event.target.value
    });
  }

  handleFieldCollaboRoleChange(event){
    this.setState({
        current_collaborator_collabo_role: event.target.value
    });
  }

  // Files- will deal with these later
  // creating file
  // createImage(file) {
  //   let reader = new FileReader();
  //   reader.onload = (e) => {
  //     this.setState({
  //       file: e.target.result
  //     })
  //   };
  //   reader.readAsDataURL(file);
  // }

  // onFormSubmitAddFile(event){
  //   event.preventDefault();

  //   // not sure what this means  /, but has to do with routing
  //   const { history } = this.props;  

  //   //create object to hold the file's data (I use formdata object in this one)
  //   const form_data = new FormData();
  //   form_data.append("p_inc_file_ui_name", this.state.file_ui_name);
  //   form_data.append("file", this.state.file);
  //   form_data.append("proj_id", this.state.current_item_id);

  //   //(alternative- using json object)
  //   // const file = {
  //   //   p_inc_file_ui_name: this.state.file_ui_name,
  //   //   file: this.state.file, 
  //   //   // the following 3 aren't necessary (to be determined in backend)   
  //   //   // p_inc_file_actual_name: "",    
  //   //   // p_inc_file_url: "",
  //   //   // p_inc_type: "file",
  //   //   proj_id: this.state.current_item_id    
   
  //   // };

  //   // remove id of the project from dtate as we're done using it.
  //   this.setState({ current_item_id: "" });

  //   // test
  //   console.log(this.state.file);

  //   //make post request to store file contebts
  //   axios.post(`/api/researcher/project/file/add`, form_data)
  //     .then(response => {
  //       console.log(response);
  //   });

  //   //reload page to show updated files now with AWS bucket urls
  //   //window.location.reload();

  //   // --archived-- all below code not necessary any more
  //   // // add file created to state files
  //   // const ongoingProjects = this.state.ongoingProjects;
  //   // // get specific project and add new file to it
  //   // const projectToAddNewFile = ongoingProjects.filter(project => project.proj_id == file.proj_id);
  //   // projectToAddNewFile.map((singleProject) => {
  //   //     singleProject.proj_incidents.push(file);
  //   // });

  //   // console.log(projectToAddNewFile);

  //   // // remove specific project from array
  //   // ongoingProjects = ongoingProjects.filter(project => project.proj_id != file.proj_id);
  //   // // add it again but now with the new file added
  //   // ongoingProjects.push(projectToAddNewFile);
  //   // // set state with the ongoing projects containing the updated project whicj now has a new file
  //   // this.setState({
  //   //   ongoingProjects: ongoingProjects
  //   // });

  //   // console.log(this.state.ongoingProjects);

  //   // close modal
  //   //$('#add-file-modal').modal('hide');

  // }

  onFormSubmitAddProject(event){
    event.preventDefault();
    // test
    console.log(this.state);

    // not sure what this means , but has to do with routing
    const { history } = this.props;

    // create object to hold the project's data

    const project = {
      proj_type:this.state.proj_type,
      proj_funder:this.state.proj_funder,
      proj_description: this.state.proj_description,
      project_start_date: this.state.project_start_date,
      project_end_date:this.state.project_end_date,
      proj_name: this.state.proj_name,
      proj_funding_amt:this.state.proj_funding_amt,
      proj_funding_currency:this.state.proj_funding_currency,
      proj_collaborators: this.state.current_collaborators,

      // extras
      mem_id: ReactSession.get("mem_id"),
      ORCID_ID: ReactSession.get("ORCID_ID")
   
    };

    // clear current_collaborators array as we're done using it.
    this.setState({ current_collaborators: [] });

    //make post request to add project
    axios.post(`/api/researcher/project`, project)
      .then(response => {
        // reload page
        location.reload();
    });
  }

  onFormSubmitEditProject(event){
    // to be cont...
    event.preventDefault();

    // not sure what this means , but has to do with routing
    const { history } = this.props;

    // create object to hold the project's data

    const project = {
      proj_type:this.state.proj_type,
      proj_funder:this.state.proj_funder,
      proj_description: this.state.proj_description,
      project_start_date: this.state.project_start_date,
      project_end_date:this.state.project_end_date,
      proj_name: this.state.proj_name,
      proj_funding_amt:this.state.proj_funding_amt,
      proj_funding_currency:this.state.proj_funding_currency,
      proj_collaborators: this.state.current_collaborators,

      // extras
      mem_id: ReactSession.get("mem_id"),
      ORCID_ID: ReactSession.get("ORCID_ID")
   
    };
    console.log(project);

    // clear current_collaborators array as we're done using it.
    this.setState({ current_collaborators: [] });

    //make post request to edit project
    axios.post(`/api/researcher/project/${this.state.current_item_id}/edit`, project)
      .then(response => {
        // test
        console.log(response);

        // remove id of the project from state as we're done using it.
        this.setState({ current_item_id: "" });

        // reload page
        location.reload();
    });
  }

  onFormSubmitAddProposal(event){
    event.preventDefault();

    // not sure what this means , but has to do with routing
    const { history } = this.props;

    // create object to hold the proposal's data

    const proposal = {
      bid_name:this.state.bid_name,
      bid_description: this.state.bid_description,
      bid_submission_date: this.state.bid_submission_date,
      bid_funder:this.state.bid_funder,
      bid_collaborators: this.state.current_collaborators,

      // extras
      mem_id: ReactSession.get("mem_id"),
      ORCID_ID: ReactSession.get("ORCID_ID")
   
    };

    // test
    console.log(proposal);

    // clear current_collaborators array as we're done using it.
    this.setState({ current_collaborators: [] });

    //make post request to add proposal
    axios.post(`/api/researcher/proposal`, proposal)
      .then(response => {
        // reload page
        location.reload();
    });
  }

  onFormSubmitEditProposal(event){
    event.preventDefault();

    // not sure what this means , but has to do with routing
    const { history } = this.props;

    // create object to hold the project's data
    const proposal = {
      bid_name:this.state.bid_name,
      bid_description: this.state.bid_description,
      bid_submission_date: this.state.bid_submission_date,
      bid_funder:this.state.bid_funder,
      bid_collaborators: this.state.current_collaborators,

      // extras
      mem_id: ReactSession.get("mem_id"),
      ORCID_ID: ReactSession.get("ORCID_ID")
   
    };

    // clear current_collaborators array as we're done using it.
    this.setState({ current_collaborators: [] });

    //make post request to edit proposal
    axios.post(`/api/researcher/proposal/${this.state.current_item_id}/edit`, proposal)
      .then(response => {
        // test
        console.log(response);

        // remove id of the project from state as we're done using it.
        this.setState({ current_item_id: "" });

        // reload page
        location.reload();
    });
  }

  onFormSubmitCompleteProposal(event){
    event.preventDefault();

    let projectAdditionalInfo = {
      project_start_date: this.state.project_start_date,
      project_end_date: this.state.project_end_date,
      proj_funding_amt: this.state.proj_funding_amt,
      proj_funding_currency:this.state.proj_funding_currency 
    }

    //make post request to complete proposal and create new project(grant)
     axios.post(`/api/researcher/proposal/${this.state.current_item_id}/complete`, projectAdditionalInfo)
      .then(response => {
        // test
        console.log(response);

        // remove id of the proposal from state as we're done using it
        this.setState({ current_item_id: "" });

        // reload page
        location.reload();
    });
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

    // make request to get ongoing projects
    axios.get(`/api/${ReactSession.get("mem_id")}/projects/ongoing`).then(response => {
      // test

      this.setState({
        ongoingProjects: response.data,
      });

      // count number of ongoingGrants
      let tempProjects = this.state.ongoingProjects;
      let ongoingGrants = tempProjects.filter(project => project.proj_type == "grant");
      this.setState({ ongoingGrantsCount: ongoingGrants.length });

    });

    // make request to get completed projects
    axios.get(`/api/${ReactSession.get("mem_id")}/projects/completed`).then(response => {
      // test

      this.setState({
        completedProjects: response.data,
      });

    });

    // make request to get ongoing proposals
    axios.get(`/api/${ReactSession.get("mem_id")}/proposals/ongoing`).then(response => {
      // test

      this.setState({
        ongoingProposals: response.data,
      });

      // count number of ongoingProposals
      let ongoingProposals = this.state.ongoingProposals;
      this.setState({ ongoingProposalsCount: ongoingProposals.length });

      console.log(ongoingProposals);


    });

    // make request to get completed proposals
    axios.get(`/api/${ReactSession.get("mem_id")}/proposals/completed`).then(response => {
      // test

      this.setState({
        completedProposals: response.data
      });

      // count ongoing proposals
      // store in state
    });

    

  }

  render () {
    {/* variables to be used in render method */}
    const ongoingProjects = this.state.ongoingProjects;
    const completedProjects = this.state.completedProjects;
    const ongoingProposals = this.state.ongoingProposals;
    const completedProposals = this.state.completedProposals;

    const ongoingGrantsCount = this.state.ongoingGrantsCount;
    const ongoingProposalsCount = this.state.ongoingProposalsCount;

    // function to display collaborators in add project modal
    const collaboratorsDisplay = () => {
      
      if(this.state.current_collaborators.length == 0){
        return(
          <div class="pd-3">
            <p class="">No collaborators added yet</p>
          </div>
        );
      }
      else{
        let count = 1;
        return(
          <div>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col"><i class="fa fa-book" aria-hidden="true"></i></th>
                  <th scope="col">Type</th>
                  <th scope="col">Role</th>
                  <th scope="col">ORCID</th>
                  <th class="text-danger" scope="col">Remove</th>
                </tr>
              </thead>
              <tbody>
                {this.state.current_collaborators.map((collaborator) => (
                  <tr>
                    <th scope="row">{count == 1 ? count++ : count++}</th>
                    <td class="col-md-3">{collaborator.collabo_type}</td>
                    <td class="col-md-3">{collaborator.collabo_role}</td>
                    <td class="col-md-3">{collaborator.collabo_orcid_id}</td>
                    <td class="col-md-3"><button type="button" class="close" aria-label="Close" onClick={(event) => this.onClickRemoveCollaborator(event, collaborator.collabo_orcid_id)}><span aria-hidden="true">&times;</span></button></td>
                  </tr>
                  
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
    
    // Return
    return (
      /* whole thing- wrapper */
      <div class="wrapper bg-grey-white">
          {/*Modals*/}
          {/*Files- will deal with these later*/}
          {/*Add file Modal*/}
          <div class="modal fade" id="add-file-modal" tabindex="-1" role="dialog" aria-labelledby="addFileModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="addFileModalLabel">Upload File</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form onSubmit={(event) => this.onFormSubmitAddFile(event)} enctype="multipart/form-data">
                    
                    <div class="form-group">
                      <input type="text" class="form-control" name="file_ui_name" value={this.state.file_ui_name} onChange={this.handleFieldChange} placeholder="File Name" required />
                    </div>
                    <div class="form-group">
                      <input type="file" class="form-control" name="file" onChange={this.handleFieldChange} placeholder="Choose File" required />
                    </div>

                    <div class="model-footer text-center">
                      <input type="submit" value="Add" class="btn btn-primary" />
                    </div>< br/>

                  </form>
                </div>
              </div>
            </div>
          </div>
          {/*Add file Modal*/}

          {/*Add Project/Proposal Modal*/}
          <div class="modal fade" id="add-prs-modal" tabindex="-1" role="dialog" aria-labelledby="addPrsModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                {/* Tab headers*/}
                <div class="modal-header">
                    <nav>
                      <ul class="nav nav-pills mb-3" id="pills-tab-add-prs" role="tablist">
                          <li class="nav-item">
                            <a class="nav-link active" id="pills-add-project-tab" data-toggle="pill" href="#pills-add-project" role="tab" aria-controls="pills-add-project" aria-selected="true"><h3>Project</h3></a>
                          </li>
                          <li class="nav-item">
                            <a class="nav-link" id="pills-add-proposal-tab" data-toggle="pill" href="#pills-add-proposal" role="tab" aria-controls="pills-add-proposal" aria-selected="false"><h3>Proposal</h3></a>
                          </li>
                      </ul>
                    </nav>    
                </div>
                {/* Tab headers*/}
                {/* Tab switcher */}
                <div class="tab-content" id="pills-tabContent">
                  {/*Tab 1 - Add Project*/}
                  <div class="tab-pane fade show active" id="pills-add-project" role="tab-panel" aria-labelledby="pills-add-project-tab">
                      {/*Modal Content*/} 
                      <form> 
                        <div class="modal-body">
                            <div class="form-group">
                                <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Project Type</label><br />
                                <select value={this.state.proj_type} onChange={this.handleFieldProjTypeChange}>
                                    <option value="unfunded">Unfunded</option>
                                    <option value="donation">Donation</option>
                                    <option value="grant">Grant</option>
                                </select>
                            </div>
                            <div class="form-group">
                              <input type="text" class="form-control" name="proj_funder" value={this.state.proj_funder} onChange={this.handleFieldChange} placeholder="Funder" required />
                            </div>
                            <div class="form-group">
                              <input type="text-area" class="form-control" name="proj_description" value={this.state.proj_description} onChange={this.handleFieldChange} placeholder="Project Description" required />
                            </div>
                            <div class="form-group">
                              <label>Project Start Date</label>
                              <input type="date" class="form-control" name="project_start_date" value={this.state.project_start_date} onChange={this.handleFieldChange} placeholder="Start Date" required />
                            </div>
                            <div class="form-group">
                              <label>Project End Date</label>
                              <input type="date" class="form-control" name="project_end_date" value={this.state.project_end_date} onChange={this.handleFieldChange} placeholder="End Date" required />
                            </div>
                            <div class="form-group">
                              <input type="text" class="form-control" name="proj_name" value={this.state.proj_name} onChange={this.handleFieldChange} placeholder="Project Title" required />
                            </div>
                            <div class="form-row">
                              <div class="form-group col-md-8">
                                <input type="text" class="form-control" name="proj_funding_amt" value={this.state.proj_funding_amt} onChange={this.handleFieldChange} placeholder="Funding Amount" required />
                              </div> 
                              <div class="form-group col-md-4">
                                <select value={this.state.proj_funding_currency} onChange={this.handleFieldProjFundingCurrencyChange}>
                                    <option value="KES">KES</option>
                                    <option value="USD">USD</option>
                                    <option value="EURO">EURO</option>
                                </select>
                              </div>
                            </div> 
                            <h5>Collaborators</h5>
                            <div class="form row pl-2 mt-n4 pl-5">
                              <div class="">
                                <br/>
                                {collaboratorsDisplay()}
                              </div>
                            </div>
                            <p>Add Collaborator</p> 
                            <div class="form-row mt-n4">
                              <div class="form-group col-md-3">
                                <br />
                                <label for="">Type</label><br />
                                <select value={this.state.current_collaborator_collabo_type} onChange={this.handleFieldCollaboTypeChange}>
                                    <option value="internal">Internal</option>
                                    <option value="external">External</option>
                                </select>
                              </div>
                              <div class="form-group col-md-3 mr-2 ml-n4">
                                <br />
                                <label for="">Role</label><br />
                                <select value={this.state.current_collaborator_collabo_role} onChange={this.handleFieldCollaboRoleChange}>                             
                                    <option value="team_member">Team Member</option>
                                    <option value="team_lead">Team Lead</option>
                                </select>
                              </div>
                              <div class="form-group col-md-3">
                                <br />
                                <input class="form-control mt-4" type="text" name="current_collaborator_collabo_orcid_id"value={this.state.current_collaborator_collabo_orcid_id} onChange={this.handleFieldChange} placeholder="ORCID ID" />
                              </div>
                              <div class="form-group pt-4 ml-2 justify-content-between">
                                <button value="Add" class="btn btn-primary btn-color-bluish mt-4" onClick={(event) => this.onClickAddCollaborator(event)}>Add</button>
                              </div>
                            </div>
                        </div>
                        <div class="model-footer text-center">
                          <button type="button" class="btn btn-primary btn-color-bluish" onClick={(event) => this.onFormSubmitAddProject(event)}>Create Project</button>
                        </div>< br/>
                      </form>
                      {/*Modal Content*/}
                  </div>
                  {/*Tab 1 Add Project*/}

                  {/*Tab 2 - Add Proposal*/}
                  <div class="tab-pane fade show active" id="pills-add-proposal" role="tab-panel" aria-labelledby="pills-add-proposal-tab">
                      {/*Modal Content*/} 
                      <form> 
                        <div class="modal-body">
                            <div class="form-group">
                              <input type="text" class="form-control" name="bid_name" value={this.state.bid_name} onChange={this.handleFieldChange} placeholder="Proposal Title" required />
                            </div>
                            <div class="form-group">
                              <input type="text-area" class="form-control" name="bid_description" value={this.state.bid_description} onChange={this.handleFieldChange} placeholder="Description" required />
                            </div>
                            <div class="form-group">
                              <input type="text" class="form-control" name="bid_funder" value={this.state.bid_funder} onChange={this.handleFieldChange} placeholder="Funder" required />
                            </div>
                            <div class="form-group">
                              <label>Proposal Submission Date</label>
                              <input type="date" class="form-control" name="bid_submission_date" value={this.state.bid_submission_date} onChange={this.handleFieldChange} placeholder="Submission Date" required />
                            </div>                            
                            <h5>Collaborators</h5>
                            <div class="form row pl-2 mt-n4 pl-5">
                              <div class="">
                                <br/>
                                {collaboratorsDisplay()}
                              </div>
                            </div>
                            <p>Add Collaborator</p>   
                            <div class="form-row mt-n4">
                              <div class="form-group col-md-3">
                                <br />
                                <label for="">Type</label><br />
                                <select value={this.state.current_collaborator_collabo_type} onChange={this.handleFieldCollaboTypeChange}>
                                    <option value="internal">Internal</option>
                                    <option value="external">External</option>
                                </select>
                              </div>
                              <div class="form-group col-md-3 mr-2 ml-n4">
                                <br />
                                <label for="">Role</label><br />
                                <select value={this.state.current_collaborator_collabo_role} onChange={this.handleFieldCollaboRoleChange}>                             
                                    <option value="team_member">Team Member</option>
                                    <option value="team_lead">Team Lead</option>
                                </select>
                              </div>
                              <div class="form-group col-md-3">
                                <br />
                                <input class="form-control mt-4" type="text" name="current_collaborator_collabo_orcid_id"value={this.state.current_collaborator_collabo_orcid_id} onChange={this.handleFieldChange} placeholder="ORCID ID" />
                              </div>
                              <div class="form-group pt-4 ml-2 justify-content-between">
                                <button value="Add" class="btn btn-primary btn-color-bluish mt-4" onClick={(event) => this.onClickAddCollaborator(event)}>Add</button>
                              </div>
                            </div>
                        </div>
                        <div class="model-footer text-center">
                          <button type="button" class="btn btn-primary btn-color-bluish" onClick={(event) => this.onFormSubmitAddProposal(event)}>Create Proposal</button>
                        </div>< br/>
                      </form>
                      {/*Modal Content*/}
                  </div>
                  {/*Tab 2 Add Proposal*/}
                </div>
                {/*Tabs Switcher */}

              </div>
            </div>
          </div>
          {/*Add Project/Proposal Modal*/}

          {/*Edit Project Modal*/}
          <div class="modal fade" id="edit-project-modal" tabindex="-1" role="dialog" aria-labelledby="editProjectModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="editProjectModalLabel">Edit Project</h4> 
                </div>
                {/*Modal Content*/} 
                <form> 
                  <div class="modal-body">
                      <div class="form-group">
                          <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Project Type</label><br />
                          <select value={this.state.proj_type} onChange={this.handleFieldProjTypeChange}>
                              <option value="unfunded">Unfunded</option>
                              <option value="donation">Donation</option>
                              <option value="grant">Grant</option>
                          </select>
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="proj_funder" value={this.state.proj_funder} onChange={this.handleFieldChange} placeholder="Funder" required />
                      </div>
                      <div class="form-group">
                        <input type="text-area" class="form-control" name="proj_description" value={this.state.proj_description} onChange={this.handleFieldChange} placeholder="Project Description" required />
                      </div>
                      <div class="form-group">
                        <label>Project Start Date</label>
                        <input type="date" class="form-control" name="project_start_date" value={this.state.project_start_date} onChange={this.handleFieldChange} placeholder="Start Date" required />
                      </div>
                      <div class="form-group">
                        <label>Project End Date</label>
                        <input type="date" class="form-control" name="project_end_date" value={this.state.project_end_date} onChange={this.handleFieldChange} placeholder="End Date" required />
                      </div>
                      <div class="form-group">
                        <input type="text" class="form-control" name="proj_name" value={this.state.proj_name} onChange={this.handleFieldChange} placeholder="Project Name" required />
                      </div>
                      <div class="form-row">
                        <div class="form-group col-md-8">
                          <input type="text" class="form-control" name="proj_funding_amt" value={this.state.proj_funding_amt} onChange={this.handleFieldChange} placeholder="Funding Amount" required />
                        </div> 
                        <div class="form-group col-md-4">
                          <select value={this.state.proj_funding_currency} onChange={this.handleFieldProjFundingCurrencyChange}>
                              <option value="KES">KES</option>
                              <option value="USD">USD</option>
                              <option value="EURO">EURO</option>
                          </select>
                        </div>
                      </div>
                      <h5>Collaborators</h5> 
                      <div class="form row pl-2 mt-n4 pl-5">
                        <div>
                          <br/>
                          {collaboratorsDisplay()}
                        </div>
                      </div>   
                      <p>Add Collaborator</p> 
                      <div class="form-row mt-n4">
                        <div class="form-group col-md-3">
                          <br />
                          <label for="">Type</label><br />
                          <select value={this.state.current_collaborator_collabo_type} onChange={this.handleFieldCollaboTypeChange}>
                              <option value="internal">Internal</option>
                              <option value="external">External</option>
                          </select>
                        </div>
                        <div class="form-group col-md-3 mr-2 ml-n4">
                          <br />
                          <label for="">Role</label><br />
                          <select value={this.state.current_collaborator_collabo_role} onChange={this.handleFieldCollaboRoleChange}>                             
                              <option value="team_member">Team Member</option>
                              <option value="team_lead">Team Lead</option>
                          </select>
                        </div>
                        <div class="form-group col-md-3">
                          <br />
                          <input class="form-control mt-4" type="text" name="current_collaborator_collabo_orcid_id"value={this.state.current_collaborator_collabo_orcid_id} onChange={this.handleFieldChange} placeholder="ORCID ID" />
                        </div>
                        <div class="form-group pt-4 ml-2 justify-content-between">
                          <button value="Add" class="btn btn-primary btn-color-bluish mt-4" onClick={(event) => this.onClickAddCollaborator(event)}>Add</button>
                        </div>
                      </div>
                  </div>
                  <div class="model-footer text-center">
                    <button type="button" class="btn btn-primary btn-color-bluish" onClick={(event) => this.onFormSubmitEditProject(event)}>Update</button>
                  </div>< br/>
                </form>
                {/*Modal Content*/}
              </div>
            </div>
          </div>
          {/*Edit Project Modal*/}

          {/*Edit Proposal Modal*/}
          <div class="modal fade" id="edit-proposal-modal" tabindex="-1" role="dialog" aria-labelledby="editProposalModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="editProposalModalLabel">Edit Proposal</h5> 
                </div>
                {/*Modal Content*/} 
                <form> 
                  <div class="modal-body">
                    <div class="form-group">
                      <input type="text" class="form-control" name="bid_name" value={this.state.bid_name} onChange={this.handleFieldChange} placeholder="Proposal Title" required />
                    </div>
                    <div class="form-group">
                      <input type="text-area" class="form-control" name="bid_description" value={this.state.bid_description} onChange={this.handleFieldChange} placeholder="Description" required />
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" name="bid_funder" value={this.state.bid_funder} onChange={this.handleFieldChange} placeholder="Funder" required />
                    </div>
                    <div class="form-group">
                      <label>Proposal Submission Date</label>
                      <input type="date" class="form-control" name="bid_submission_date" value={this.state.bid_submission_date} onChange={this.handleFieldChange} placeholder="Submission Date" required />
                    </div>  
                    <h5>Collaborators</h5>                          
                    <div class="form row pl-2  mt-n4 pl-5">
                      <div>
                        <br/>
                        {collaboratorsDisplay()}
                      </div>
                    </div>
                    <p>Add Collaborator</p>   
                    <div class="form-row mt-n4">
                      <div class="form-group col-md-3">
                        <br />
                        <label for="">Type</label><br />
                        <select value={this.state.current_collaborator_collabo_type} onChange={this.handleFieldCollaboTypeChange}>
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                        </select>
                      </div>
                      <div class="form-group col-md-3 mr-2 ml-n4">
                        <br />
                        <label for="">Role</label><br />
                        <select value={this.state.current_collaborator_collabo_role} onChange={this.handleFieldCollaboRoleChange}>                             
                            <option value="team_member">Team Member</option>
                            <option value="team_lead">Team Lead</option>
                        </select>
                      </div>
                      <div class="form-group col-md-3">
                        <br />
                        <input class="form-control mt-4" type="text" name="current_collaborator_collabo_orcid_id"value={this.state.current_collaborator_collabo_orcid_id} onChange={this.handleFieldChange} placeholder="ORCID ID" />
                      </div>
                      <div class="form-group pt-4 ml-2 justify-content-between">
                        <button value="Add" class="btn btn-primary btn-color-bluish mt-4" onClick={(event) => this.onClickAddCollaborator(event)}>Add</button>
                      </div>
                    </div>                    
                  </div>
                  <div class="model-footer text-center">
                    <button type="button" class="btn btn-primary btn-color-bluish" onClick={(event) => this.onFormSubmitEditProposal(event)}>Update</button>
                  </div>< br/>
                </form>
                {/*Modal Content*/}
              </div>
            </div>
          </div>
          {/*Edit Proposal Modal*/}

          {/*Complete Proposal Modal*/}
          <div class="modal fade" id="complete-proposal-modal" tabindex="-1" role="dialog" aria-labelledby="editProposalModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="editProposalModalLabel">Complete Proposal</h4> 
                </div>
                {/*Modal Content*/} 
                <form> 
                  <div class="modal-body">
                    <div class="form-group">
                      <label>Project Start Date</label>
                      <input type="date" class="form-control" name="project_start_date" value={this.state.project_start_date} onChange={this.handleFieldChange} placeholder="" required />
                    </div>
                    <div class="form-group">
                      <label>Project End Date</label>
                      <input type="date" class="form-control" name="project_end_date" value={this.state.project_end_date} onChange={this.handleFieldChange} placeholder="" required />
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" name="proj_funding_amt" value={this.state.proj_funding_amt} onChange={this.handleFieldChange} placeholder="Funding Amount" required />
                    </div>
                    <div class="form-group">
                      <select value={this.state.proj_funding_currency} onChange={this.handleFieldProjFundingCurrencyChange}>
                        <option value="KES">KES</option>
                        <option value="USD">USD</option>
                        <option value="EURO">EURO</option>
                      </select>
                    </div>
                  </div>
                  <div class="model-footer text-center">
                    <button class="btn btn-primary btn-color-bluish" onClick={(event) => this.onFormSubmitCompleteProposal(event)}>Complete</button>
                  </div>< br/>
                </form>
                {/*Modal Content*/}
              </div>
            </div>
          </div>
          {/* Complete Proposal Modal */}

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

            {/*My projects section*/}
            <div class="section bg-transparent my-projects-row-div">
                <div class="row bg-transparent p-2 rounded-lg display-flex">

                  <div class="col-3 bg-transparent rounded-lg pl-0 ">
                      <h2>My Projects</h2>
                  </div>
                  
                </div>  
            </div>
            {/*My projects section*/}

            {/* Tabs Headers*/}
            <div class="section bg-transparent my-projects-row-div">
                <div class="row bg-transparent p-2 rounded-lg display-flex ">
                  <nav>
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item">
                          <a class="nav-link active" id="pills-ongoing-tab" data-toggle="pill" href="#pills-ongoing" role="tab" aria-controls="pills-ongoing" aria-selected="true"><h3>Ongoing</h3></a>
                        </li>
                        <li class="nav-item">
                          <a class="nav-link" id="pills-completed-tab" data-toggle="pill" href="#pills-completed" role="tab" aria-controls="pills-completed" aria-selected="false"><h3>Completed</h3></a>
                        </li>
                    </ul>
                  </nav>
                </div>
            </div>
            {/* Tabs Headers*/}

            {/*At a glance section*/}
            <div class="section bg-transparent my-projects-row-div">
                <div class="row bg-transparent p-2 rounded-lg display-flex">
                  <div class="col-3 bg-transparent rounded-lg pl-0 ">
                      <h2>At a glance</h2>
                  </div>
                </div>  
            </div>
            {/*At a glance section*/}
            
            {/* Row 2 */}
            <div class="section bg-transparent ml-2">
              <div class="row bg-transparent pt-2 pb-2 rounded-lg d-flex">

                <div class="col-3 bg-dark-red rounded-lg text-white large-add-button mr-1 pt-3">
                    <div class="row bg-transparent rounded-lg d-flex justify-content-center">
                      <div class="col-3 text-center bg-transparent pt-2 px-2 py-2 big-number">
                          {ongoingGrantsCount}
                      </div>
                      <div class="col-6 bg-transparent p-1 pt-4">
                          <h5><b>Grants</b></h5>
                          <h6 class="mt-n2">Currently running</h6>
                      </div>
                    </div>
                    <div class="row bg-transparent rounded-lg d-flex justify-content-center mt-n4">
                      <div class="col-3 text-center bg-transparent pt-2 px-2 py-2 big-number">
                          {ongoingProposalsCount}
                      </div>
                      <div class="col-6 bg-transparent p-1 pt-4">
                          <h5><b>Proposals</b></h5>
                          <h6 class="mt-n2">Currently running</h6>
                      </div>
                    </div>
                </div>

                <div class="col-3 bg-dark-pantone text-center rounded-lg large-add-button mr-1 pt-2">
                    <figure class="figure">
                      <a class="" data-target="" data-toggle="modal" href="#">
                        <img src="/storage/images/strath_logo.png" width="240" height="240" class="d-inline-block align-top figure-img img-fluid rounded" alt=""/>
                      </a>
                      <figcaption class="figure-caption">
                        {/*<a class="ml-3" href="#"><h1>RIMS</h1></a>*/}
                      </figcaption>
                    </figure>
                </div>

                <div class="col-3 bg-dark-blue text-center rounded-lg pt-5 large-add-button " onClick={(event) => this.onClickBigAddBtn(event)}>
                    <figure class="figure">
                        <a class="" data-target="" data-toggle="modal" href="#">
                          <img src="/storage/images/add.png" width="80" height="80" class="d-inline-block align-top figure-img img-fluid rounded" alt=""/>
                        </a>
                        <figcaption class="figure-caption">
                          <a class="text-white" href="#"><b>Add New</b></a>
                        </figcaption>
                    </figure>
                </div>
              </div>
            </div>
            {/*Row 2*/}

            {/* Tab switcher */}
            <div class="tab-content" id="pills-tabContent">
              {/*Tab 1 - Ongoing Stuff*/}
              <div class="tab-pane fade show active bg-transparent" id="pills-ongoing" role="tab-panel" aria-labelledby="pills-ongoing-tab">
                {/*Projects*/}
                <div class="section bg-transparent">

                  {/*Header part*/}
                  <div class="row bg-transparent rounded-lg display-flex other-div">

                    <div class="col-8 bg-transparent rounded-lg p-2 ">
                          <h3>Running Projects</h3>
                    </div>
                    <div class="col-1 bg-transparent rounded-lg text-right pt-2">
                      <a class='link-simple bg-transparent margin-collapsible_projects' onClick={this.onClickCollapsibleOngoingProjects} data-toggle="collapse" href="#collapseOngoingProjects" role="button" aria-expanded="false" aria-controls="collapseOngoingProjects" ><small><img src={`/storage/images/${this.state.collapsibleOngoingProjects}.png`} width="20" height="20" class="d-inline-block align-top mr-3" alt="" /></small></a>
                    </div>
                    <div class="col-3 bg-transparent rounded-lg p-2">

                    </div>
                    
                  </div>
                  {/*Header part*/}

                  {/*List row*/}
                  <div class="row bg-transparent rounded-lg display-flex text-white pl-2 collapse other-div" id="collapseOngoingProjects">

                    {/*List col*/}
                    <div class="col-9 bg-dark-blue rounded-lg p-2 mr-n5">
                      <div class="list-group">

                          {/* selecting projects dynamically*/}
                          <div class="accordion" id="accordionExample">
                            {ongoingProjects.map(project => (

                                <div class="card bg-transparent border-0">

                                  <div class="card-header bg-transparent border-0" id="header-card">
                                    <div class="d-flex w-100 justify-content-between">
                                      <h5 class="mt-2"><b>{project.proj_name}</b></h5>
                                      <img src="/storage/images/edit_svg.svg" width="20" height="20" class="d-inline-block align-top mr-3 filter-edit_svg" alt="" onClick={(event) => this.onClickEditProject(event, project.proj_id)}/>
                                    </div>
                                  </div>

                                  <div id={project.proj_name} class="collapse show mt-n3 " data-parent="#accordionExample">
                                    <div class="card-body">
                                      <p class="list-contents-small text-white">
                                        <b>Description: </b>{project.proj_description}<br/>
                                        <b>Funder: </b>{project.proj_funder}<br/>
                                        <b>Funding Amount: </b>{project.proj_funding_amt} {project.proj_funding_currency}<br/>
                                        <b>Duration: </b>{project.project_start_date} - {project.project_end_date}<br/>
                                        {/* Collaborators*/}
                                        {/*dynamically selected collaborators*/}
                                        <b>Collaborators: </b>{project.proj_collaborators.map(proj_collaborator => (
                                                                    <span>{proj_collaborator.mem_fname} {proj_collaborator.mem_lname}{proj_collaborator.p_collabo_role == "team_lead" ? "(Team lead)|" : "|"}</span>
                                                               ))}
                                        {/*dynamically selected collaborators*/}
                                        {/* Collaborators*/}
                                      </p>
                                      <p class="list-contents-smaller text-white"> 
                                        <b>Created by: </b>{project.created_by} | <b>Last Edited: </b>{project.updated_at}
                                      </p>
                                      <div id="icons-projects">
                                          <img src="/storage/images/complete_svg.svg" width="20" height="20" class="d-inline-block align-top mr-3 filter-edit_svg" alt="" onClick={(event) => this.onClickCompleteProject(event, project.proj_id)}/>
                                          <img src="/storage/images/delete_svg.svg" width="20" height="20" class="d-inline-block align-top mr-3 filter-edit_svg" alt="" onClick={(event) => this.onClickRemoveProject(event, project.proj_id)}/>
                                      </div>
                                    </div>

                                    {/* Files-  will deal with these later*/}
                                    {/*<div class="card-footer mt-n4 pt-1">*/}
                                      {/*<div class="d-flex w-100 justify-content-between">
                                        <h6 class="list-contents-small">Files</h6>
                                        <button class="btn btn-primary" id="btnfile" type="button" onClick={(event) => this.onClickAddFile(event, project.proj_id)}>Add</button><br />
                                      </div>*/}
                                      {/*<div class="mt-n2">*/}
                                        {/*Files- will deal with these later*/}
                                        {/*dynamically selected files*/}
                                        {/*<p class="list-contents-small">
                                          {project.proj_incidents.map(proj_incident => (
                                            <div>
                                              <a href={`${proj_incident.p_inc_file_url}`} class="list-contents-small">{proj_incident.p_inc_file_ui_name}</a>
                                              <button type="button" class="close" aria-label="Close" onClick={(event) => this.onClickRemoveFile(event, proj_incident.p_inc_id)}>
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>
                                          ))}
                                        </p>*/} 
                                        {/*dynamically selected files*/}
                                        {/*Files- will deal with these later*/}
                                      {/*</div>*/}  
                                    {/*</div>*/}
                                    {/* Files*/}
                                  </div>
                                  <hr class="m-2 bg-grey-white"/>
                                </div>
                            ))}
                          </div>
                          {/*selecting projects dynamically*/}

                      </div>
                    </div>
                    {/*List col*/}

                  </div>
                  {/*List row*/}

                </div>
                {/*Projects*/}

                {/*Proposals*/}
                <div class="section bg-transparent mt-3">

                  {/*Header part*/}
                  <div class="row bg-transparent rounded-lg display-flex other-div">

                    <div class="col-8 bg-transparent rounded-lg p-2 ">
                          <h3>Active Proposals</h3>
                    </div>
                    <div class="col-1 bg-transparent rounded-lg p-2 text-right pt-2 pr-n5">
                      <a class='bg-transparent text-right margin-collapsible_proposals' onClick={this.onClickCollapsibleOngoingProposals} data-toggle="collapse" href="#collapseOngoingProposals" role="button" aria-expanded="false" aria-controls="collapseExample" ><small><img src={`/storage/images/${this.state.collapsibleOngoingProposals}.png`} width="20" height="20" class="d-inline-block align-top mr-3" alt="" /></small></a>
                    </div>
                    <div class="col-3 bg-transparent rounded-lg p-2">

                    </div>                 

                  </div>
                  {/*Header part*/}

                  {/*List row*/}
                  <div class="row bg-transparent rounded-lg display-flex text-dark pl-2 collapse other-div" id="collapseOngoingProposals">

                    {/*List col*/}
                    <div class="col-9 bg-dark-pantone rounded-lg p-2">
                      <div class="list-group">                          

                          {/* selecting proposals dynamically*/}
                          <div class="accordion" id="accordionExample">
                            {ongoingProposals.map(proposal => (

                                <div class="card bg-transparent border-0">

                                  <div class="card-header bg-transparent border-0" id="header-card">
                                    <div class="d-flex w-100 justify-content-between">
                                      <h5 class="mt-2"><b>{proposal.bid_name}</b></h5>
                                      <img src="/storage/images/edit.png" width="20" height="20" class="d-inline-block align-top mr-3" alt="" onClick={(event) => this.onClickEditProposal(event, proposal.bid_id)}/>
                                    </div>
                                  </div>

                                  <div id={proposal.bid_name} class="collapse show mt-n3 " data-parent="#accordionExample">
                                    <div class="card-body">
                                      <p class="list-contents-small text-dark">
                                        <b>Description: </b>{proposal.bid_description}<br/>
                                        <b>Funder: </b>{proposal.bid_funder}<br/>
                                        <b>Submission Date: </b>{proposal.bid_submission_date}<br/>
                                        {/* Collaborators*/}
                                        {/*dynamically selected collaborators*/}
                                        <b>Collaborators: </b>{proposal.bid_collaborators.map(bid_collaborator => (
                                                                    <span>{bid_collaborator.mem_fname} {bid_collaborator.mem_lname}{bid_collaborator.bid_collabo_role == "team_lead" ? "(Team lead)|" : "|"}</span>
                                                               ))}
                                        {/*dynamically selected collaborators*/}
                                        {/* Collaborators*/}
                                      </p>
                                      <p class="list-contents-smaller text-dark"> 
                                        <b>Created by: </b>self | <b>Last Edited: </b>{proposal.updated_at}
                                      </p>
                                      <div id="icons-proposals">
                                          <img src="/storage/images/complete.png" width="20" height="20" class="d-inline-block align-top mr-3" alt="" onClick={(event) => this.onClickCompleteProposal(event, proposal.bid_id)}/>
                                          <img src="/storage/images/delete.png" width="20" height="20" class="d-inline-block align-top mr-3" alt="" onClick={(event) => this.onClickRemoveProposal(event, proposal.bid_id)}/>
                                          <img src="/storage/images/rejected.png" width="20" height="20" class="d-inline-block align-top mr-3" alt="" onClick={(event) => this.onClickRejectProposal(event, proposal.bid_id)}/>
                                      </div>
                                    </div>
                                
                                    {/* Files-  will deal with these later*/}
                                    {/*<div class="card-footer mt-n4 pt-1">*/}
                                      {/*<div class="d-flex w-100 justify-content-between">
                                        <h6 class="list-contents-small">Files</h6>
                                        <button class="btn btn-primary" id="btnfile" type="button" onClick={(event) => this.onClickAddFile(event, project.proj_id)}>Add</button><br />
                                      </div>*/}
                                      {/*<div class="mt-n2">*/}
                                        {/*Files- will deal with these later*/}
                                        {/*dynamically selected files*/}
                                        {/*<p class="list-contents-small">
                                          {project.proj_incidents.map(proj_incident => (
                                            <div>
                                              <a href={`${proj_incident.p_inc_file_url}`} class="list-contents-small">{proj_incident.p_inc_file_ui_name}</a>
                                              <button type="button" class="close" aria-label="Close" onClick={(event) => this.onClickRemoveFile(event, proj_incident.p_inc_id)}>
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>
                                          ))}
                                        </p>*/} 
                                        {/*dynamically selected files*/}
                                        {/*Files- will deal with these later*/}
                                      {/*</div>*/}  
                                    {/*</div>*/}
                                    {/* Files*/}
                                  </div>
                                <hr class="m-2"/>
                                </div>
                            ))}
                          </div>
                          {/*selecting proposals dynamically*/}

                      </div>
                    </div>
                    {/*List col*/}

                  </div>
                  {/*List row*/}
                  
                </div>
                {/*Proposals*/}
              </div>
              {/*Tab 1- Ongoing Stuff*/}

              {/*Tab 2- Completed Stuff*/}
              <div class="tab-pane fade" id="pills-completed" role="tab-panel" aria-labelledby="pills-completed-tab">
                {/*Projects*/}
                <div class="section bg-transparent ">

                  {/*Header part*/}
                  <div class="row bg-transparent rounded-lg display-flex other-div">

                    <div class="col-8 bg-transparent rounded-lg p-2 ">
                          <h3>Closed Projects</h3>
                    </div>
                    <div class="col-1 bg-transparent rounded-lg p-2 text-right pt-2 pr-n5">
                      <a class='text-right margin-collapsible_projects2' onClick={this.onClickCollapsibleCompletedProjects} data-toggle="collapse" href="#collapseCompletedProjects" role="button" aria-expanded="false" aria-controls="collapseExample" ><small><img src={`/storage/images/${this.state.collapsibleCompletedProjects}.png`} width="20" height="20" class="d-inline-block align-top mr-3" alt="" /></small></a>
                    </div>
                    <div class="col-3 bg-transparent rounded-lg p-2">

                    </div>
                    
                  </div>
                  {/*Header part*/}

                  {/*List row*/}
                  <div class="row bg-transparent rounded-lg display-flex text-white collapse other-div" id="collapseCompletedProjects">

                    {/*List col*/}
                    <div class="col-9 bg-dark-blue rounded-lg p-2">
                      <div class="list-group">

                          {/* selecting projects dynamically*/}
                          <div class="accordion" id="accordionExample">
                            {completedProjects.map(project => (

                                <div class="card bg-transparent border-0">

                                  <div class="card-header bg-transparent border-0" id="header-card">
                                    <div class="d-flex w-100 justify-content-between">
                                      <h5 class="mt-2"><b>{project.proj_name}</b></h5>
                                      <img src="/storage/images/edit_svg.svg" width="20" height="20" class="d-inline-block align-top mr-3 filter-edit_svg" alt="" onClick={()=>this.onClickEditProject(project.proj_id)}/>
                                    </div>
                                  </div>

                                  <div id={project.proj_name} class="collapse show mt-n3 " data-parent="#accordionExample">
                                    <div class="card-body">
                                      <p class="list-contents-small text-white">
                                        <b>Description: </b>{project.proj_description}<br/>
                                        <b>Funder: </b>{project.proj_funder}<br/>
                                        <b>Funding Amount: </b>{project.proj_funding_amt} {project.proj_funding_currency}<br/>
                                        <b>Duration: </b>{project.project_start_date} - {project.project_end_date}<br/>
                                        {/* Collaborators*/}
                                        {/*dynamically selected collaborators*/}
                                        <b>Collaborators: </b>{project.proj_collaborators.map(proj_collaborator => (
                                                                    <span>{proj_collaborator.mem_fname} {proj_collaborator.mem_lname}{proj_collaborator.p_collabo_role == "team_lead" ? "(Team lead)|" : "|"}</span>
                                                               ))}
                                        {/*dynamically selected collaborators*/}
                                        {/* Collaborators*/}
                                      </p>
                                      <p class="list-contents-smaller text-white"> 
                                        <b>Created by: </b>{project.created_by} | <b>Last Edited: </b>{project.updated_at}
                                      </p>
                                      <div id="icons-projects2">
                                          <img src="/storage/images/delete_svg.svg" width="20" height="20" class="d-inline-block align-top mr-3 filter-edit_svg" alt="" onClick={(event) => this.onClickRemoveProject(event, project.proj_id)}/>
                                      </div>
                                    </div>
                                    
                                    {/* Files-  will deal with these later*/}
                                    {/*<div class="card-footer mt-n4 pt-1">*/}
                                      {/*<div class="d-flex w-100 justify-content-between">
                                        <h6 class="list-contents-small">Files</h6>
                                        <button class="btn btn-primary" id="btnfile" type="button" onClick={(event) => this.onClickAddFile(event, project.proj_id)}>Add</button><br />
                                      </div>*/}
                                      {/*<div class="mt-n2">*/}
                                        {/*Files- will deal with these later*/}
                                        {/*dynamically selected files*/}
                                        {/*<p class="list-contents-small">
                                          {project.proj_incidents.map(proj_incident => (
                                            <div>
                                              <a href={`${proj_incident.p_inc_file_url}`} class="list-contents-small">{proj_incident.p_inc_file_ui_name}</a>
                                              <button type="button" class="close" aria-label="Close" onClick={(event) => this.onClickRemoveFile(event, proj_incident.p_inc_id)}>
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>
                                          ))}
                                        </p>*/} 
                                        {/*dynamically selected files*/}
                                        {/*Files- will deal with these later*/}
                                      {/*</div>*/}  
                                    {/*</div>*/}
                                    {/* Files*/}
                                  </div>
                                <hr class="m-2 bg-grey-white"/>
                                </div>
                            ))}
                          </div>
                          {/*selecting projects dynamically*/}

                      </div>
                    </div>
                    {/*List col*/}

                  </div>
                  {/*List row*/}
                  
                </div>
                {/*Projects*/}

                {/*Proposals*/}
                <div class="section bg-transparent">

                  {/*Header part*/}
                  <div class="row bg-transparent rounded-lg display-flex other-div">

                    <div class="col-8 bg-transparent rounded-lg p-2 ">
                          <h3>Inactive Proposals</h3>
                    </div>
                    <div class="col-1 bg-transparent rounded-lg p-2 text-right pt-2 pr-n5">
                      <a class='text-right margin-collapsible_proposals2' onClick={this.onClickCollapsibleCompletedProposals} data-toggle="collapse" href="#collapseCompletedProposals" role="button" aria-expanded="false" aria-controls="collapseExample"><small><img src={`/storage/images/${this.state.collapsibleCompletedProposals}.png`} width="20" height="20" class="d-inline-block align-top mr-3" alt="" /></small></a>
                    </div>
                    <div class="col-3 bg-transparent rounded-lg p-2">

                    </div>
                    
                  </div>
                  {/*Header part*/}

                  {/*List row*/}
                  <div class="row bg-transparent rounded-lg display-flex text-dark collapse other-div" id="collapseCompletedProposals">

                    {/*List col*/}
                    <div class="col-9 bg-dark-pantone rounded-lg p-2">
                      <div class="list-group">

                          {/* selecting proposals dynamically*/}
                          <div class="accordion" id="accordionExample">
                            {completedProposals.map(proposal => (

                                <div class="card bg-transparent border-0">

                                  <div class="card-header bg-transparent border-0" id="header-card">
                                    <div class="d-flex w-100 justify-content-between">
                                      <h5 class="mt-2"><b>{proposal.bid_name}</b></h5>
                                      <img src="/storage/images/edit.png" width="20" height="20" class="d-inline-block align-top mr-3" alt="" onClick={(event)=>this.onClickEditProposal(event, proposal.bid_id)}/>
                                    </div>
                                  </div>

                                  <div id={proposal.bid_name} class="collapse show mt-n3 " data-parent="#accordionExample">
                                    <div class="card-body">
                                      <p class="list-contents-small text-dark">
                                        <b>Description: </b>{proposal.bid_description}<br/>
                                        <b>Funder: </b>{proposal.bid_funder}<br/>
                                        <b>Submission Date: </b>{proposal.bid_submission_date}<br/>
                                        {/* Collaborators*/}
                                        {/*dynamically selected collaborators*/}
                                        <b>Collaborators: </b>{proposal.bid_collaborators.map(bid_collaborator => (
                                                                    <span>{bid_collaborator.mem_fname} {bid_collaborator.mem_lname}{bid_collaborator.bid_collabo_role == "team_lead" ? "(Team lead)|" : "|"}</span>
                                                               ))}
                                        {/*dynamically selected collaborators*/}
                                        {/* Collaborators*/}
                                      </p>
                                      <p class="list-contents-smaller text-dark"> 
                                        <b>Created by: </b>self | <b>Last Edited: </b>{proposal.updated_at}
                                      </p>
                                      <div id="icons-proposals">
                                          <img src="/storage/images/delete.png" width="20" height="20" class="d-inline-block align-top mr-3" alt="" onClick={(event) => this.onClickRemoveProposal(event, proposal.bid_id)}/>
                                      </div>                              
                                    </div>            

                                    {/* Files-  will deal with these later*/}
                                    {/*<div class="card-footer mt-n4 pt-1">*/}
                                      {/*<div class="d-flex w-100 justify-content-between">
                                        <h6 class="list-contents-small">Files</h6>
                                        <button class="btn btn-primary" id="btnfile" type="button" onClick={(event) => this.onClickAddFile(event, project.proj_id)}>Add</button><br />
                                      </div>*/}
                                      {/*<div class="mt-n2">*/}
                                        {/*Files- will deal with these later*/}
                                        {/*dynamically selected files*/}
                                        {/*<p class="list-contents-small">
                                          {project.proj_incidents.map(proj_incident => (
                                            <div>
                                              <a href={`${proj_incident.p_inc_file_url}`} class="list-contents-small">{proj_incident.p_inc_file_ui_name}</a>
                                              <button type="button" class="close" aria-label="Close" onClick={(event) => this.onClickRemoveFile(event, proj_incident.p_inc_id)}>
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>
                                          ))}
                                        </p>*/} 
                                        {/*dynamically selected files*/}
                                        {/*Files- will deal with these later*/}
                                      {/*</div>*/}  
                                    {/*</div>*/}
                                    {/* Files*/}
                                  </div>
                                <hr class="m-2"/>  
                                </div>
                            ))}
                          </div>
                          {/*selecting proposals dynamically*/}

                      </div>
                    </div>
                    {/*List col*/}

                  </div>
                  {/*List row*/}
                  
                </div>
                {/*Proposals*/}
              </div>
              {/*Tab 2- Completed Stuff*/}
            </div>
            {/*Tab switcher*/}  

          </div>
          {/* Content */}

      </div>
      /* whole thing- wrapper */
    );
  }
}

export default Projects;