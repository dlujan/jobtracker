import React from 'react';
import ToolTip from 'react-portal-tooltip';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import '../Components.css';

class ExpenseItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionActive: false,
            editBarActive: false,
            editExpenseInput: {
                name: '',
                cost: '',
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

    handleThisExpenseEdit = (id, event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(prevState => ({
            editExpenseInput: {
                ...prevState.editExpenseInput,
                [name]: value
              }
        }))
        this.props.handleExpenseEdit(id, event);
    }

    sendExpenseEdits = event => { // NEEDS AT LEAST ONE INPUT
        this.props.editExpense(event);
        this.resetExpenseEdits();
        this.setState({
            editBarActive: false
          })
        event.preventDefault();
    }

    resetExpenseEdits = event => {
        this.setState({
            editExpenseInput: {
                name: '',
                cost: '',
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
        const {id, dateMonth, dateDay, dateYear, name, cost, description} = this.props.expense;
        const {handleExpenseEditDate, deleteExpense} = this.props;
        return (
            <div className="job-item">
                <div>{dateMonth}/{dateDay}/{dateYear}</div> 
                <div>{name}</div>
                <div>${cost}</div>
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
                    <div className="action-item" onClick={deleteExpense.bind(this, id)}>
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </div>
                </div>
                {/* ExpenseItem edit bar - toggles visible and hidden */}
                <form onSubmit={this.sendExpenseEdits}>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <DayPickerInput onDayChange={handleExpenseEditDate.bind(this, id)}/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <input name="name" type="text" value={this.state.editExpenseInput.name} onChange={this.handleThisExpenseEdit.bind(this, id)} placeholder="Edit Name"/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <input name="cost" type="number" min="0.00" max="10000.00" step="0.01" value={this.state.editExpenseInput.cost} onChange={this.handleThisExpenseEdit.bind(this, id)} placeholder="Edit Cost"/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <input name="description" type="text" value={this.state.editExpenseInput.description} onChange={this.handleThisExpenseEdit.bind(this, id)} placeholder="Edit Description"/>
                    </div>
                    <div className="edit-job-form" style={this.editBarStyle()}>
                        <button className="submit-btn" type="submit" value="Submit">Submit Changes</button>
                    </div>
                </form>
                
            </div>
        );
    }
    
}

ExpenseItem.propTypes = {
    expense: PropTypes.object.isRequired
}

export default ExpenseItem;
