
var EditInternshipInterface = React.createClass({
    getInitialState: function() {
        return {
            internData: null,
            departmentData: null,
            facultyData: null,
            stateData: null
        };
    },
    componentWillMount: function(){
        this.getInternData();
        this.getStates();
        this.getDepartmentData();
    },
    saveInternship: function(e){
        e.preventDefault();
        var form = e.target;

        this.refs.mainInterface.buildInternshipData(form);
    },
    getInternData: function(){
        // Grabs the internship data
        $.ajax({
            url: 'index.php?module=intern&action=editInternshipRest&internshipId='+internshipId,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                this.setState({internData: data});
            }.bind(this),
            error: function(xhr, status, err) {
                alert("Failed to load intern data.")
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getStates: function(){
        // Grabs the State data
        $.ajax({
            url: 'index.php?module=intern&action=stateRest',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                this.setState({stateData: data});
            }.bind(this),
            error: function(xhr, status, err) {
                alert("Failed to load state data.")
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    //getFacultyListForDept&department
    getFacultyData: function(deptNum){
        // Grabs the State data
        $.ajax({
            url: 'index.php?module=intern&action=getFacultyListForDept&department='+deptNum,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if(data != '')
                {
                  data.unshift({first_name: "None", last_name: "", id: "-1"});
                  this.setState({facultyData: data});
                } else {
                  this.setState({facultyData: null});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                alert("Failed to load faculty data.")
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getDepartmentData: function(){
        // Grabs the State data
        $.ajax({
            url: 'index.php?module=intern&action=facultyDeptRest',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                this.setState({departmentData: data});
            }.bind(this),
            error: function(xhr, status, err) {
                alert("Failed to load department data.")
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        if(this.state.internData != null){
            return <MainInterface internData      = {this.state.internData} 
                                  facultyData     = {this.state.facultyData}
                                  departmentData  = {this.state.departmentData}
                                  stateData       = {this.state.stateData}
                                  getFacultyData  = {this.getFacultyData} 
                                  saveInternship  = {this.saveInternship}
                                  ref             = "mainInterface"/>
        }else{
            return( <p className="text-muted" style={{position:"absolute", top:"50%", left:"50%"}}>
                        <i className="fa fa-spinner fa-2x fa-spin"></i> Loading Internship...
                    </p>
            );
        }
    }
});

var MainInterface = React.createClass({
    buildInternshipData: function(form) {
        var student = this.refs.student.grabStudentData();
        var status  = this.refs.status.grabStatusData(form);
        var faculty = this.refs.faculty.grabFacultyData();
        var term    = this.refs.term.grabCourseAndTerm();
        var type    = this.refs.type.grabTypeData(form);


        var internship = {student:  student,
                          status:   status,
                          faculty:  faculty,
                          term:     term,
                          type:     type};

                          console.log(internship);
        //Host Information
        //var status  = this.refs.student.grabStudentData();
    },
    render: function() {
        var internData     = this.props.internData;
        var stateData      = this.props.stateData;
        var facultyData    = this.props.facultyData;
        var departmentData = this.props.departmentData;

        return(
            <div>
              <h1>
                  <i className="fa fa-edit"></i> Edit Internship
              </h1>

              <form className="form-horizontal" onSubmit={this.props.saveInternship}>

                <div className="form-group">
                  <div className="col-lg-1 col-lg-offset-8">
                    <button type="submit" className="btn btn-primary" id="{SUBMIT_ID}" >Save</button>
                  </div>

                  <div className="col-lg-1">
                    <a href="{DELETE_URL}" className="btn btn-danger-hover" onclick="return confirm('Are you sure you want to delete this internship?');">Delete</a>                             
                  </div>

                  <div className="col-lg-1 col-lg-offset-1">
                    <button type="button" id="contract-button" className="btn btn-default pull-right generateContract"><i className="fa fa-file"></i> Generate Contract</button>
                  </div>
                </div>

               
                  <div className="row">
                    <div className="col-lg-6">
                      <StudentInformation intern  = {internData.intern}
                                          student = {internData.student}
                                          states  = {stateData}
                                          ref     = "student" />
                      <EmgContactList />
                    </div>

                    <div className="col-lg-6">
                      <InternStatus workflow  = {internData.wfState}
                                    intern    = {internData.intern}
                                    ref       = "status" />

                      <FacultyInterface facultyData    = {facultyData} 
                                        departmentData = {departmentData}
                                        deptNumber     = {internData.intern.department_id}
                                        getFacultyData = {this.props.getFacultyData}
                                        facultyID      = {internData.intern.faculty_id}
                                        ref            = "faculty" />

                      <CourseAndTerm intern   = {internData.intern}
                                     subjects = {internData.subjects}
                                     ref      = "term" />

                      <TypeInterface experience_type = {internData.experience_type}
                                     ref             = "type"/>
                    </div>
                  </div>
              
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <div className="col-lg-1 col-lg-offset-9">
                          <button className="btn btn-success" id="{SUBMIT_ID}">Add Host</button>
                        </div>
                        <div className="col-lg-1 pull-right">
                          <button type="submit" className="btn btn-primary" id="{SUBMIT_ID}">Save</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <HostInterface hostData = {internData.agency}
                                     intern   = {internData.intern}
                                     states   = {stateData} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <NoteBox />
                    </div>

                    <div className="col-lg-6">
                       <Contracts title="Extra Documents"/>
                    </div>
                  </div>

                  <ChangeLog />
              </form>
            </div>
        );
    }
});

var StudentInformation = React.createClass({
    grabStudentData: function() {

        var student = { fname:    this.refs.fname.value, 
                        lname:    this.refs.lname.value,
                        mname:    this.refs.mname.value,
                        email:    this.refs.email.value,
                        address:  this.refs.address.value,
                        city:     this.refs.city.value,
                        state:    this.refs.state.value,
                        zip:      this.refs.zip.value,
                        phone:    this.refs.phone.value,}

        return student;
    },
    render: function() {
        var intern = this.props.intern;
        var student = this.props.student;
        var stateData = '';

        if(this.props.states != null){
            stateData = this.props.states.map(function (state) {
                  return (
                          <StateDropDown  key={state.abbr}
                                          sAbbr={state.abbr}
                                          stateName={state.full_name}
                                          active={state.active}
                                          stuState={intern.student_state} />
                      );
              }.bind(this));
        }
        
        return (
            <fieldset>
              <legend>Student</legend>
                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">Banner Id</label>
                  <div id="bannerid" className="col-lg-6"><p className="form-control-static">{intern.banner}</p></div>
                </div>

                <div className="form-group required">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">First Name</label>
                  <div className="col-lg-6"><input type="text" className="form-control" ref="fname" defaultValue={intern.first_name} /></div>
                </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">Middle Name/Initial</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="mname" defaultValue={intern.middle_name} /></div>
              </div>

              <div className="form-group required">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_LAST_NAME_ID}">Last Name</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="lname" defaultValue={intern.last_name} /></div>
              </div>

              <div className="form-group required">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_EMAIL_ID}">ASU Email</label>
                <div className="col-lg-6">
                  <div className="input-group">
                    <input type="text" className="form-control" ref="email" defaultValue={intern.email} /><span className="input-group-addon">@appstate.edu</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="birthdate">Birth date</label>
                <div id="birthdate" className="col-lg-6"><p className="form-control-static">{intern.birth_date}</p></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_ADDRESS_ID}">Address</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="address" defaultValue={intern.student_address} /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_CITY_ID}">City</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="city" defaultValue={intern.student_city} /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_STATE_ID}">State</label>
                <div className="col-lg-6">
                  <select className="form-control" ref="state">{stateData}</select></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_ZIP_ID}">Zip Code</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="zip" defaultValue={intern.student_zip} /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_PHONE_ID}">Phone</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="phone" defaultValue={intern.phone} /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_GPA_ID}">GPA</label>
                <div className="col-lg-6"><p className="form-control-static">{intern.gpa}</p></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="campus">Campus</label>
                <div id="campus" className="col-lg-6"><p className="form-control-static">{intern.campus}</p></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="level">Level</label>
                <div id="level" className="col-lg-6"><p className="form-control-static">{intern.level}</p></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{UGRAD_MAJOR_ID}{GRAD_MAJOR_ID}">Major / Program</label>

                <div className="col-lg-8">
                  <div className="btn-group-vertical" data-toggle="buttons" role="group" aria-label="major selector">
    
                    {student.majors_repeat.map(function (major) {
                        return (
                                <MajorSelector  key={major.code}
                                                active={major.active}
                                                checked={major.checked}
                                                code={major.code}
                                                desc={major.desc} />
                            );
                    })}
             
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="gradDate">Graduation Date</label>
                <div id="gradDate" className="col-lg-6"><p className="form-control-static">{student.grad_date}</p></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="credit-hours">Credit Hours</label>
                <div id="credit-hours" className="col-lg-6"><p className="form-control-static">{student.enrolled_credit_hours}</p></div>
              </div>
            </fieldset>
        );
    }
});

var StateDropDown = React.createClass({
    render: function() {
        if (this.props.active == 1 && this.props.stuState == this.props.sAbbr){
          return <option value={this.props.sAbbr} selected>{this.props.stateName}</option>
        }else {
          return <option value={this.props.sAbbr}>{this.props.stateName}</option>
        }
    }
});

var MajorSelector = React.createClass({
    render: function() {
        var setActive = (this.props.active == 'active') ? true : false;

        var activeButton = classNames({
           'btn'         : true,
           'btn-default' : true,
           'active'      : setActive
        });

        if (this.props.checked == 'checked'){
            var majorSelect = <label className={activeButton}>
                                <input type="radio" name="major_code" autoComplete="off" value="{this.props.code}"  defaultChecked /> {this.props.desc}
                              </label>
        }else{
            var majorSelect = <label className={activeButton}>
                                <input type="radio" name="major_code" autoComplete="off" value="{this.props.code}" /> {this.props.desc}
                              </label>
        }
        return (   
            majorSelect
        );
    }
});


var EmgContactList = React.createClass({
    render: function() {
        return (   
            <fieldset>
                <legend>Emergency Contacts</legend>
                <div className="row">
                    <div className="col-md-12">
                        <EmergencyContactList />
                    </div>
                </div>
            </fieldset> 
        );
    }
});

var InternStatus = React.createClass({
    grabStatusData: function(form) {
        var status = { status:  form.elements.workflowOption.value, 
                        oied:    form.elements.oiedCert.checked}

        return status;
    },
    render: function() {
        var status = this.props.workflow.status;
        var workflowAction = this.props.workflow.workflowAction;
        var oiedAllow = this.props.workflow.allow;

/****************
   NOT DONE!!!  *
 ****************/

        return (   
            <fieldset>
              <legend>Status</legend>
              <p>
                Current Status: <strong>{status}</strong>
              </p>
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">Next Status</h4>
                </div>
                <div className="panel-body">

                    {Object.keys(workflowAction).map(function(key) {
                        if(key == "Intern\\WorkflowTransition\\LeaveTransition"){     
                          return(<div className="radio" key={key}>
                                    <label><input type="radio" name="workflowOption" value={key} defaultChecked/>{workflowAction[key]}</label>
                                 </div>)
                        } else {
                          return(<div className="radio" key={key}>
                                    <label><input type="radio" name="workflowOption" value={key} />{workflowAction[key]}</label>
                                 </div>)
                        }
                    })}
                    
                </div>
              </div>
              <div className="form-group">
                <div className="col-lg-10">
                  <div className="checkbox">
                    { oiedAllow ? <label><input type="checkbox" name="oiedCert" />Certified by Office of International Education and Development</label>
                                : <label><input type="checkbox" disabled />Certified by Office of International Education and Development</label>
                    }

                  </div>
                </div>
              </div>
            </fieldset>
        );
    }
});

var FacultyInterface = React.createClass({
    getInitialState: function(){
        return {showDetails: false, facultyID: null};
    },
  //Query for list of departments for first drop down
  //Query based on chosen department for second drop down
  //Use second dropdown information for details page.
    componentWillMount: function() {
        this.getFacultyData();
    },
    getFacultyData: function() {
        if (this.props.deptNumber !== '')
        {
          this.setState({facultyID: this.props.facultyID, showDetails: true}, this.props.getFacultyData(this.props.deptNumber));
        } else {
          this.setState({facultyID: null, showDetails: false});
        }
    },
    setFacultyID: function(num) {
        this.setState({facultyID: num, showDetails: true});
    },
    hideDetailInfo: function() {
        this.setState({facultyID: null,showDetails: false});
    },
    grabFacultyData: function() {
        var faculty = {faculty_id: this.state.facultyID};
        return faculty;
    },
    render: function() {

        if (this.props.departmentData == null){
            return (<div />)
        }
        var facultyDetail = null;
        var facultyData = this.props.facultyData;
        var facultyID   = (this.state.facultyID != null) ? this.state.facultyID :this.props.facultyID;
        var dept        = this.props.departmentData;
        var deptNum     = this.props.deptNumber;

        //FIX DEPT NAME
        if(facultyData != null){
            facultyDetail = facultyData.map(function (faculty) {
                if(facultyID == faculty.id)
                  return (<FacultyDetail key={faculty.id} 
                                         username   = {faculty.username} 
                                         phone      = {faculty.phone} 
                                         fax        = {faculty.fax} 
                                         address1   = {faculty.street_address1}
                                         address2   = {faculty.street_address2}
                                         city       = {faculty.city}
                                         state      = {faculty.state}
                                         zip        = {faculty.zip} 
                                         fname      = {faculty.first_name}
                                         lname      = {faculty.last_name}
                                         deptname   = {dept[deptNum].name}
                                         hideDetailInfo = {this.hideDetailInfo} />);
            }.bind(this));
        }     //this.props.facultyID == null
        return (
            <fieldset>
              <legend>Faculty Advisor</legend>
              {(this.state.showDetails) ? facultyDetail 
                                        : <FacultyDropDown facultyData    = {facultyData} 
                                                           departmentData = {this.props.departmentData}
                                                           getFacultyData = {this.props.getFacultyData}
                                                           deptNumber     = {this.props.deptNumber}
                                                           setFacultyID   = {this.setFacultyID} />}
            </fieldset>
        );
    }

});

var FacultyDropDown = React.createClass({
    handleDeptDrop: function(e) {
        var deptNum = e.target.value;

        this.props.getFacultyData(deptNum);
    },
    handleFaculty: function(e) {
        var faculty = e.target.value;
        this.props.setFacultyID(faculty);

    },
    render: function() {
        var departments = this.props.departmentData;
        var facultyData = this.props.facultyData;
        var deptNumber  = this.props.deptNumber;

        if (this.props.facultyData == null){
            var ddFaculty =   <select className='form-control' disabled>
                                <option>No Advisors Available</option>
                              </select>
        } else {
            var ddFaculty =   <select className='form-control' onChange={this.handleFaculty}>
                                {Object.keys(facultyData).map(function(key) {
                                    return <option key={key} value={facultyData[key].id}>{facultyData[key].first_name+" "+facultyData[key].last_name}</option>;
                                })}
                              </select>
        }
        return(
            <div id="faculty_selector">
              <div className="form-group required">
                <label className="col-lg-3 control-label" for="{DEPARTMENT_ID}">Department</label>
                <div className="col-lg-8">
                  <select className="form-control" defaultValue={deptNumber} onChange={this.handleDeptDrop}> 
                    {Object.keys(departments).map(function(key) {                 
                          return <option key={departments[key].id} value={departments[key].id}>{departments[key].name}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label" for="{FACULTY_ID}">Faculty Advisor / Instructor of Record</label>
                <div className="col-lg-8">
                    {ddFaculty}
                </div>
              </div>
            </div>
        );
    }
});

var FacultyDetail = React.createClass({
    handleClick: function() {
        this.props.hideDetailInfo();
    },
    render: function() {
        var name = this.props.fname + " " + this.props.lname + " - " + this.props.dept;


        // Format Faculty Email
        var emailInfo = "mailto:" + this.props.username + "@appstate.edu";
        var email = <a href={emailInfo}> {this.props.username + "@appstate.edu"} </a>
        
        // Format Faculty Phone
        var phone = '';
        if(this.props.phone !== ''){
            var phoneInfo = "tel:+1" + this.props.phone;
            phone = <a href={phoneInfo}> {this.props.phone} </a>;
        } else {
            phone = <small className="text-muted">Has not been set</small>;
        }

        // Format Faculty Fax
        var fax = '';
        if(this.props.fax !== ''){
            var faxInfo = "fax:+1" + this.props.fax;
            fax = <a href={faxInfo}> {this.props.fax} </a>;
        } else {
            fax = <small className="text-muted">Has not been set</small>;
        }

        // Format Faculty Address
        var address = '';
        if(this.props.address1 !== '' && this.props.address1 !== null){
            address += this.props.address1;

            if (this.props.address2 !== '') {
                address += "<br />" + this.props.address2;
            }
        } else {
            address = <small className="text-muted">Address has not been set</small>;
        }
        if(this.props.city !== '' && this.props.city !== null && this.props.state !== '' && this.props.state !== null){
            address += "<br />" + this.props.city + ", " + this.props.state;
        }
        if(this.props.zip !== '' && this.props.zip !== null) {
            address += " " + this.props.zip;
        }


        return (
            <div id="faculty_details">

                <div className="row">
                  <div id="faculty_change" className="col-lg-2">
                    <button type="button" id="faculty-change" className="btn btn-default btn-xs" onClick={this.handleClick}>
                      <i className="fa fa-chevron-left"></i> change
                    </button>
                  </div>
                  <div id="faculty_name" className="col-lg-10 lead">{name}</div>
                </div>

                <div className="row">
                  <div className="col-lg-5 col-lg-offset-2">

                    <div className="row">
                      <div className="col-lg-12">
                        <p>
                          <abbr title="Email address"><i className="fa fa-envelope"></i></abbr> &nbsp;
                          <span id="faculty_email"></span>{email}
                        </p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12">
                        <p>
                          <abbr title="Phone"><i className="fa fa-phone"></i></abbr> &nbsp;
                          <span id="faculty_phone"></span>{phone}
                        </p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12">
                        <p>
                          <abbr title="Fax"><i className="fa fa-print"></i></abbr> &nbsp;
                          <span id="faculty_fax"></span>{fax}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <abbr title="Address"><i className="fa fa-map-marker"></i></abbr> &nbsp;
                    <address id="faculty_address">{address}</address>
                  </div>
                </div>
              </div>
        );
    }
});

var CourseAndTerm = React.createClass({
    grabCourseAndTerm: function(form) {
        var courseTerm = {termStart:    this.refs.startDate.value,
                          termEnd:      this.refs.endDate.value,
                          courseSubj:   this.refs.courseSubj.value,
                          courseNum:    this.refs.courseNum.value,
                          section:      this.refs.courseSect.value,
                          creditHours:  this.refs.courseCH.value,
                          title:        this.refs.courseTitle.value};
        return courseTerm;
    },
    render: function() {
        var intern = this.props.intern;
        var subjects = this.props.subjects;
        return(
          <div>
          <fieldset>
              <legend>Term & Course Information</legend>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="campus">Term</label>
                <div id="campus" className="col-lg-6"><p className="form-control-static">{intern.term}</p></div>
              </div>


              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{START_DATE_ID}">Term Start Date</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="startDate" defaultValue="START_DATE" /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{END_DATE_ID}">Term End Date</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="endDate" defaultValue="END_DATE" /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" htmlFor="{STUDENT_STATE_ID}">Course Subject</label>
                <div className="col-lg-6">
                  <select className="form-control" ref="courseSubj">
                  {Object.keys(subjects).map(function (key) {
                      if ((intern.course_subj === key) || (intern.course_subj === null && key == -1)){
                        return <option key={key} value={key} selected>{subjects[key]}</option>
                      }else {
                        return <option key={key} value={key} >{subjects[key]}</option>
                      }
                    }.bind(this))
                  }
                  </select>
                </div>
              </div>


              <div className="form-group">
                <label className="col-lg-3 control-label" for="{COURSE_NO_ID}">Course Number</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="courseNum" defaultValue={intern.course_no} /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">Section</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="courseSect" defaultValue={intern.course_sect} /></div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" for="{CREDITS_ID}">Credit Hours</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="courseCH" defaultValue={intern.credits} />
                   <span className="help-block"><small className="text-muted">Decimal values will be rounded.</small></span>
                </div>
              </div>

              <div className="form-group">
                <label className="col-lg-3 control-label" for="{CREDITS_ID}">Title</label>
                <div className="col-lg-6"><input type="text" className="form-control" ref="courseTitle" defaultValue={intern.course_title} />
                   <span className="help-block"><small className="text-muted">(Limit 28 characters; Banner)</small></span>
                </div>
              </div>
              </fieldset>
          </div>
        );
    }
});


var TypeInterface = React.createClass({
    grabTypeData: function(form) {
        var type = { type:  form.elements.typeOption.value}

        return type;
    },
    render: function() {
        var expType = this.props.experience_type;
        return(
          <div>
            <fieldset>
              <legend>Type</legend>
              <div className="form-group">
                <div className="col-lg-5 col-lg-offset-3">
                  {Object.keys(expType).map(function(key) {
                        if(key === "internship"){            
                          return(<div className="radio" key={key}>
                                    <label><input type="radio" name="typeOption" value={key} defaultChecked/>{expType[key]}</label>
                                 </div>)
                        } else {
                          return(<div className="radio" key={key}>
                                    <label><input type="radio" name="typeOption" value={key}/>{expType[key]}</label>
                                 </div>)
                        }
                    })}
                </div>
                <div className="col-lg-4">
                  <a id="internship-type-help-button" className="pull-right"><i className="fa fa-question-circle"></i> Type Definitions</a>
                </div>
              </div>
            </fieldset>
          </div>
        );
    }
});


var NoteBox = React.createClass({
    grabNoteData: function() {

    },
    render: function() {
        return(
          <div>
          <div className="form-group">
            <label for="{NOTES_ID}">Add a note</label> NOTES
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary pull-right" id="{SUBMIT_ID}">SUBMIT_VALUE</button>
          </div>
          </div>
        );
    }
});

var ChangeLog = React.createClass({
    render: function() {
        return(
          <div className="row">
            <div className="col-lg-8">
              <div className="form-group">CHANGE_LOG</div>
            </div>
          </div>
        );
    }
});








// <--------------------------------------------Host Information Section---------------------------------------------->

var HostInterface = React.createClass({
    buildHostData: function() {

    },
    render: function() {
        var hostData = this.props.hostData;
        var intern = this.props.intern;
        return(
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Host Information: {hostData.name}</h3>
            </div>
            <div className="panel-body">
                <div className="row">
                  <div className="col-lg-6">
                    <Location intern = {intern}/>
                    <Compensation hostData = {hostData}
                                  intern   = {intern} />
                    <Contracts title = "Contracts"/>
                  </div>
                  <div className="col-lg-6">
                    <HostDetails hostData = {hostData}
                                 states   = {this.props.states} />
                    <SupervisorInfo hostData = {hostData} />
                  </div>
                </div>
            </div>
          </div>
        );
    }
});

var Location = React.createClass({
    grabLocationData: function() {

    },
    render: function() {
        var intern = this.props.intern;
        return(
          <div>
            <fieldset>
                <legend>Location</legend>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="campus">Location</label>
                  <div id="campus" className="col-lg-6"><p className="form-control-static">{intern.international}</p></div>
                </div>

                <div className="checkbox">
                  <label><input type="checkbox" value="" />Host's information is same as Internship's</label>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">Address</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={intern.loc_address} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">City</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={intern.loc_city} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="campus">State</label>
                  <div id="campus" className="col-lg-6"><p className="form-control-static">STATE</p></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">Zip</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={intern.loc_zip} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">Location Start Date on Site</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue="LOC_START_DATE" /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">Location End Date on Site</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue="LOC_END_DATE" /></div>
                </div>
            </fieldset>
          </div>
        );
    }
});



var Compensation = React.createClass({
    grabCompensationData: function() {

    },
    render: function() {
        var hostData = this.props.hostData;
        var intern = this.props.intern;
        var allow = intern.stipend;
        var rButtons;

        if(intern.paid == 0){ 
          rButtons = <div className="radio">
                     <label className="radio-inline"><input type="radio" name="compOption" value="unpaid" defaultChecked/>Unpaid</label>
                     <label className="radio-inline"><input type="radio" name="compOption" value="paid" />Paid</label>
                     </div>
        } else {
          rButtons = <div className="radio">
                     <label className="radio-inline"><input type="radio" name="compOption" value="unpaid" />Unpaid</label>
                     <label className="radio-inline"><input type="radio" name="compOption" value="paid" defaultChecked />Paid</label>
                     </div>
        }

        return(
          <div>
            <fieldset>
                <legend>Compensation</legend>
                <div className="form-group">
                  <div className="col-lg-6 col-lg-offset-3">

                    {rButtons}

                    <div className="checkbox">
                      { allow ? <label><input type="checkbox" value="" />Stipend</label>
                              : <label><input type="checkbox" value="" disabled />Stipend</label>
                      }
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">Pay rate</label>
                  <div className="col-lg-3"><input type="text" className="form-control" defaultValue={intern.pay_rate} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" for="{COURSE_SECT_ID}">Average Hours per Week</label>
                  <div className="col-lg-3"><input type="text" className="form-control" defaultValue={intern.avg_hours_week} /></div>
                </div>

            </fieldset>
          </div>
        );
    }
});

var Contracts = React.createClass({
    grabContractData: function() {

    },
    render: function() {
        return(
          <div>
            <fieldset>
                <legend>{this.props.title}</legend>
                <div className="row">
                  <div className="col-lg-9">
                    <ul className="list-group">
                      <li className="list-group-item"><i className="fa fa-file"></i> DOWNLOAD &nbsp;DELETE</li>
                    </ul>
                  </div>
                  <div className="col-lg-2">UPLOAD_DOC</div>
                </div>
            </fieldset>
          </div>
        );
    }
});

var HostDetails = React.createClass({
    grabHostData: function() {

    },
    render: function() {
        var hostData = this.props.hostData;
        var stateData = '';

        if(this.props.states != null){
            stateData = this.props.states.map(function (state) {
                  return (
                          <StateDropDown  key={state.abbr}
                                          sAbbr={state.abbr}
                                          stateName={state.full_name}
                                          active={hostData.state} />
                      );
              }.bind(this));
        }
        return(
          <div>
            <fieldset>
                <legend>Host Details</legend>
                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_ADDRESS_ID}">Host Name</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.name} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_ADDRESS_ID}">Phone</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.phone} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_ADDRESS_ID}">Address</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.address} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_CITY_ID}">City</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.city} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_STATE_ID}">State</label>
                  <div className="col-lg-6">
                    <select className="form-control" onChange={this.handleDrop}>{stateData}</select></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_ZIP_ID}">Zip Code</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.zip} /></div>
                </div>
            </fieldset>
          </div>
        );
    }
});

var SupervisorInfo = React.createClass({
    grabSupervisorData: function() {

    },
    render: function() {
        var hostData = this.props.hostData;
        return(
          <div>
            <fieldset>
                <legend>Supervisor Information</legend>
                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">First Name</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_first_name} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">Last Name</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_last_name} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">Title</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_title} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">Email</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_email} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_MIDDLE_NAME_ID}">Fax</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_fax} /></div>
                </div>

                <div className="checkbox">
                  <label><input type="checkbox" value="" />Supervisor's information is same as Host's</label>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_ADDRESS_ID}">Phone</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_phone} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_ADDRESS_ID}">Address</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_address} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_CITY_ID}">City</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_city} /></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_STATE_ID}">State</label>
                  <div className="col-lg-6">
                    <select className="form-control" onChange={this.handleDrop}></select></div>
                </div>

                <div className="form-group">
                  <label className="col-lg-3 control-label" htmlFor="{STUDENT_ZIP_ID}">Zip Code</label>
                  <div className="col-lg-6"><input type="text" className="form-control" defaultValue={hostData.supervisor_zip} /></div>
                </div>
            </fieldset>
          </div>
        );
    }
});

ReactDOM.render(
    <EditInternshipInterface />, 
    document.getElementById('editInternshipInterface')
);