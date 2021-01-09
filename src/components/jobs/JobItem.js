import React from 'react';
import ToolTip from 'react-portal-tooltip';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../Components.css';

class JobItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionActive: false,
            editBarActive: false,
            editJobInput: {
                customer: '',
                source: '',
                pay: '',
                description: ''
            }
        }
    }

    showTooltip = () => {
        this.setState({descriptionActive: true})
    }
    hideTooltip = () => {
        this.setState({descriptionActive: false}) // CLEAR INPUT ON EDIT WINDOW CLOSE
    }

    toggleEditBar = () => {
        this.setState({editBarActive: !this.state.editBarActive})
    }

    handleThisJobEdit = (id, event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(prevState => ({
            editJobInput: {
                ...prevState.editJobInput,
                [name]: value
              }
        }))
        this.props.handleJobEdit(id, event);
    }

    sendJobEdits = event => { // NEEDS AT LEAST ONE INPUT
        this.props.editJob(event);
        this.resetJobEdits();
        this.setState({
            editBarActive: false
          })
        event.preventDefault();
    }

    resetJobEdits = event => {
        this.setState({
            editJobInput: {
                customer: '',
                source: '',
                pay: '',
                description: ''
            }
        })
    }

    editBarStyle = () => {
        if (this.state.editBarActive === false) {
            return {
                display: 'none'
            }
        }
    }

    editButtonStyle = () => {
        if (this.state.editBarActive === true) {
            return {
                color: 'black'
              }
        }
      }

    render() {
        const {id, dateMonth, dateDay, dateYear, customer, source, pay, description} = this.props.job;
        const {handleJobEditDate, deleteJob} = this.props;
        return (
            <div className="job-item">
                <div>{dateMonth}/{dateDay}/{dateYear}</div> 
                <div>{customer}</div> 
                <div>{source}</div> 
                <div>${pay}</div>
                <div className="action-box">
                    <div ref={(element) => { this.element = element }} className="action-item" onMouseEnter={this.showTooltip} onMouseLeave={this.hideTooltip}>
                        <FontAwesomeIcon icon={faFileAlt}/>
                        <ToolTip 
                            active={this.state.descriptionActive} 
                            position="left" 
                            arrow="center" 
                            parent={this.element} 
                            tooltipTimeout={100}
                        >
                            <p>{description}</p>
                        </ToolTip>
                    </div>
                    <div className="action-item" onClick={this.toggleEditBar} style={this.editButtonStyle()}>
                        <FontAwesomeIcon icon={faEdit}/>
                    </div>
                    <div className="action-item" onClick={deleteJob.bind(this, id)}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </div>
                </div>
                {/* JobItem edit bar - toggles visible and hidden */}
                <form onSubmit={this.sendJobEdits}>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <DayPickerInput onDayChange={handleJobEditDate.bind(this, id)}/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <input name="customer" type="text" value={this.state.editJobInput.customer} onChange={this.handleThisJobEdit.bind(this, id)} placeholder="Edit Customer"/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <input name="source" type="text" value={this.state.editJobInput.source} onChange={this.handleThisJobEdit.bind(this, id)} placeholder="Edit Source"/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <input name="pay" type="number" min="0.00" max="10000.00" step="0.01" value={this.state.editJobInput.pay} onChange={this.handleThisJobEdit.bind(this, id)} placeholder="Edit Pay"/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <input name="description" type="text" value={this.state.editJobInput.description} onChange={this.handleThisJobEdit.bind(this, id)} placeholder="Edit Description"/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <button className="submit-btn" type="submit" value="Submit">Submit Changes</button>
                    </div>
                </form>
                
            </div>
        );
    }
    
}

JobItem.propTypes = {
    job: PropTypes.object.isRequired
}

export default JobItem;