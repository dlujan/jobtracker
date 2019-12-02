import React from 'react';
import TrashJobItem from './TrashJobItem';
import './Components.css';

class TrashJobLister extends React.Component {

    render() {
        return (
            <div className="page-container">
                <div className="header">
                    <h1>Trash</h1>
                    <h3>Recover or permanently erase deleted jobs</h3>
                </div>
                
                <div className="label-bar">
                    <div>Date</div>
                    <div>Customer</div>
                    <div>Source</div>
                    <div>Pay</div>
                    <div>Actions</div>
                </div>
                {this.props.trashJobs.map(job => {
                return <TrashJobItem key={job.id} job={job}
                        recoverJob={this.props.recoverJob}
                        destroyJob={this.props.destroyJob}
                    />
                })}
            </div>
        );
    }
    
}

// JobLister.propTypes = {
//     job: PropTypes.object.isRequired,
//     editedJob: PropTypes.object.isRequired
// }

export default TrashJobLister;