import React from "react";
import JobItem from "./jobs/JobItem";
import AddJob from "./jobs/AddJob";
import JobFilter from "./jobs/JobFilter";
import "./Components.css";

class JobLister extends React.Component {
  render() {
    return (
      <div className="page-container">
        <div className="header">
          <h1>Job Lister</h1>
          <h3>Keep track of your jobs</h3>
        </div>
        <div className="add-filter-container">
          <AddJob
            newJob={this.props.newJob}
            handleNewJob={this.props.handleNewJob}
            handleNewJobDate={this.props.handleNewJobDate}
            addJob={this.props.addJob}
            resetNewJobInput={this.props.resetNewJobInput}
          />
          <JobFilter
            jobs={this.props.jobs}
            jobFilterInput={this.props.jobFilterInput}
            handleJobListFilter={this.props.handleJobListFilter}
            submitJobListFilter={this.props.submitJobListFilter}
            resetJobListFilter={this.props.resetJobListFilter}
          />
        </div>

        <div className="label-bar">
          <div>Date</div>
          <div>Customer</div>
          <div>Source</div>
          <div>Pay</div>
          <div>Actions</div>
        </div>
        {this.props.jobs.map((job) => {
          return (
            <JobItem
              key={job.id}
              job={job}
              handleJobEdit={this.props.handleJobEdit}
              handleJobEditDate={this.props.handleJobEditDate}
              editJob={this.props.editJob}
              deleteJob={this.props.deleteJob}
            />
          );
        })}
        <div id="bottom"></div>
      </div>
    );
  }
}

// JobLister.propTypes = {
//     job: PropTypes.object.isRequired,
//     editedJob: PropTypes.object.isRequired
// }

export default JobLister;
