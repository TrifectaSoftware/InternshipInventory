import React from 'react';

var MajorsDropDown = React.createClass({
    getInitialState: function(){
        return ({hasError: false});
    },
    setError: function(status){
        this.setState({hasError: status});
    },
    render: function() {
        var majors = this.props.majors;
        var level = this.props.level;

        var output = null;

        if(majors != null) {
            if(level !== "grad"){
                output = (
                    <select id="undergrad" name="undergrad" className="form-control">
                        {Object.keys(majors).map(function(key) {
                            return <option key={key} value={key}>{majors[key]}</option>;
                            })}
                        </select>
                    );
                } else {
                    output = (
                        <select id="grad" name="grad" className="form-control">
                            {Object.keys(majors).map(function(key) {
                                return <option key={key} value={key}>{majors[key]}</option>;
                                })}
                            </select>
                        );
                    }
                } else {
                    output = (
                        <select id="def" name="def" className="form-control">
                            <option >Choose a level first</option>
                        </select>
                    );
                }
                return (<div className="form-group">
                <label htmlFor={level} className="col-lg-3 control-label">Major/Program</label>
                <div className="col-lg-8">
                    {output}
                </div>
            </div>);
        }
    });

    export default MajorsDropDown;
