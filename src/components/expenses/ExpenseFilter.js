import React from 'react';
import '../Components.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class ExpenseFilter extends React.Component {
    expensesTotal = () => {
        let total = 0.00;
        this.props.expenses.forEach(expense => {
          total = total + parseFloat(expense.cost);
        })
        return total.toFixed(2);
    }
    render() {
        const {submitExpenseListFilter, resetExpenseListFilter, expenseFilterInput, handleExpenseListFilter} = this.props;
        let weeks = [];
        for (let i = 1; i <= 53; i++) {
            weeks.push(i.toString());
        }
        return (
            <div className="list-filter-container">
                <div className="list-filter-cell" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f7f7f7'}}>
                    <FontAwesomeIcon icon={faSearch} style={{fontSize: '5rem'}}/>
                </div>
                <div className="list-filter-cell list-filter-form">
                    <h3>Filter Expenses</h3>
                    <form onSubmit={submitExpenseListFilter}>
                        <input name="dateDay" type="text" value={expenseFilterInput.dateDay} onChange={handleExpenseListFilter} disabled={(expenseFilterInput.dateWeek === "")? "" : "disabled"} placeholder="Day"/>
                        <input name="dateMonth" type="text" value={expenseFilterInput.dateMonth} onChange={handleExpenseListFilter} disabled={(expenseFilterInput.dateWeek === "")? "" : "disabled"} placeholder="Month"/>
                        <input name="dateYear" type="text" value={expenseFilterInput.dateYear} onChange={handleExpenseListFilter} placeholder="Year"/>
                        <select id="week" name="dateWeek" value={expenseFilterInput.dateWeek} onChange={handleExpenseListFilter}>
                            <option value="">--Select week--</option>
                            {weeks.map(value => {return <option value={value}>{value}</option>})}
                        </select>
                        <input name="name" type="text" value={expenseFilterInput.name} onChange={handleExpenseListFilter} placeholder="Name"/>
                        <div>
                            <button className="submit-btn" type="submit" value="Submit">Submit</button>
                            <button onClick={resetExpenseListFilter}>Reset</button>
                            <span>Filtered total: ${this.expensesTotal()}</span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    
}

export default ExpenseFilter;
