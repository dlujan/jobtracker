import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import PropTypes from 'prop-types';
import 'react-day-picker/lib/style.css';
import '../Components.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class AddExpense extends React.Component {

    render() {
        const {addExpense, resetNewExpenseInput, newExpense, handleNewExpense, handleNewExpenseDate} = this.props;
        return (
            <div className="add-job-container expense">
                <div className="add-job-cell" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f7f7f7'}}>
                    <FontAwesomeIcon icon={faPlus} style={{fontSize: '5rem'}}/>
                </div>
                <div className="add-job-cell add-job-form">
                    <h3>Add Expense</h3>
                    <form onSubmit={addExpense}>
                        <DayPickerInput onDayChange={handleNewExpenseDate} inputProps={{required: true}}/>
                        <input name="name" type="text" value={newExpense.name} onChange={handleNewExpense} placeholder="Expense Name" required/>
                        <input name="cost" type="number" min="0.00" max="10000.00" step="0.01" value={newExpense.cost} onChange={handleNewExpense} placeholder="Cost" required/>
                        <input name="description" type="text" value={newExpense.description} onChange={handleNewExpense} placeholder="Expense Description"/>
                        <div>
                            <button className="submit-btn" type="submit" value="Submit">Submit</button>
                            <button onClick={resetNewExpenseInput}>Reset</button>
                        </div>   
                    </form>
                </div>
            </div>
        );
    }
    
}

AddExpense.propTypes = {
    newExpense: PropTypes.object.isRequired
}

export default AddExpense;
