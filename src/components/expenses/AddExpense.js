import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import PropTypes from 'prop-types';
import 'react-day-picker/lib/style.css';
import '../Components.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class AddExpense extends React.Component {

    render() {
        //const {addJob, resetNewJobInput, newJob, handleNewJob, handleNewJobDate} = this.props;
        return (
            <div className="add-job-container">
                <div className="add-job-cell" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f7f7f7'}}>
                    <FontAwesomeIcon icon={faPlus} style={{fontSize: '5rem'}}/>
                </div>
                <div className="add-job-cell add-job-form">
                    <h3>Add Expense</h3>
                    {/* <form onSubmit={addJob}>
                        <DayPickerInput onDayChange={handleNewJobDate} inputProps={{required: true}}/>
                        <input name="customer" type="text" value={newJob.customer} onChange={handleNewJob} placeholder="Customer Name" required/>
                        <input name="source" type="text" value={newJob.source} onChange={handleNewJob} placeholder="Job source" required/>
                        <input name="pay" type="number" min="0.00" max="10000.00" step="0.01" value={newJob.pay} onChange={handleNewJob} placeholder="Job Pay" required/>
                        <input name="description" type="text" value={newJob.description} onChange={handleNewJob} placeholder="Job Description"/>
                        <div>
                            <button className="submit-btn" type="submit" value="Submit">Submit</button>
                            <button onClick={resetNewJobInput}>Reset</button>
                        </div>   
                    </form> */}
                </div>
            </div>
        );
    }
    
}

AddExpense.propTypes = {
    newJob: PropTypes.object.isRequired
}

export default AddExpense;