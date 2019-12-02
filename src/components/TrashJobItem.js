import React from 'react';
import ToolTip from 'react-portal-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faUndoAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import './Components.css';

class JobItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionActive: false
        }
    }

    showTooltip = () => {
        this.setState({descriptionActive: true})
    }
    hideTooltip = () => {
        this.setState({descriptionActive: false}) // CLEAR INPUT ON EDIT WINDOW CLOSE
    }


    render() {
        const {id, dateMonth, dateDay, dateYear, customer, source, pay, description} = this.props.job;
        const {recoverJob, destroyJob} = this.props;
        return (
            <div className="trash-job-item">
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
                    <div className="action-item" onClick={recoverJob.bind(this, id)}>
                        <FontAwesomeIcon icon={faUndoAlt}/>
                    </div>
                    <div className="action-item" onClick={destroyJob.bind(this, id)}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </div>
                </div>
            </div>
        );
    }
    
}

JobItem.propTypes = {
    job: PropTypes.object.isRequired
}

export default JobItem;