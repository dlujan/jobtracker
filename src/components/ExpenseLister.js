import React from 'react';
import ExpenseItem from './expenses/ExpenseItem';
import AddExpense from './expenses/AddExpense';
import ExpenseFilter from './expenses/ExpenseFilter';
import './Components.css';

class ExpenseLister extends React.Component {
    componentDidUpdate(prevProps) {
        // Scroll to bottom of page on new job creation
        if (this.props.expenses.length !== prevProps.expenses.length) {
            const bottom = document.getElementById('bottom');
            bottom.scrollIntoView({behavior: 'smooth'});
        }
      }

    render() {
        return (
            <div className="page-container">
                <div className="header">
                    <h1>Expenses</h1>
                    <h3>Keep track of your expenses</h3>
                </div>
                <div className="add-filter-container">
                    <AddExpense 
                        newExpense={this.props.newExpense}  
                        handleNewExpense={this.props.handleNewExpense} 
                        handleNewExpenseDate={this.props.handleNewExpenseDate}
                        addExpense={this.props.addExpense}
                        resetNewExpenseInput={this.props.resetNewExpenseInput}
                        scrollToBottom={this.scrollToBottom}
                    />
                    <ExpenseFilter 
                        expenses={this.props.expenses}
                        expenseFilterInput={this.props.expenseFilterInput}
                        handleExpenseListFilter={this.props.handleExpenseListFilter}
                        submitExpenseListFilter={this.props.submitExpenseListFilter}
                        resetExpenseListFilter={this.props.resetExpenseListFilter}
                    />
                </div>
                
                <div className="label-bar expenses">
                    <div>Date</div>
                    <div>Name</div>
                    <div>Cost</div>
                    <div>Actions</div>
                </div>
                {this.props.expenses.map(expense => {
                return <ExpenseItem key={expense.id} expense={expense}
                            handleExpenseEdit={this.props.handleExpenseEdit}
                            handleExpenseEditDate={this.props.handleExpenseEditDate}
                            editExpense={this.props.editExpense}
                            deleteExpense={this.props.deleteExpense}
                        />
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

export default ExpenseLister;