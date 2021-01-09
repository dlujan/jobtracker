import React from 'react';
import ExpenseItem from './expenses/ExpenseItem';
import AddExpense from './expenses/AddExpense';
import ExpenseFilter from './expenses/ExpenseFilter';
import './Components.css';

class ExpenseLister extends React.Component {
    componentDidUpdate(prevProps) {
        // Scroll to bottom of page on new job creation
        // if (this.props.jobs.length !== prevProps.jobs.length) {
        //     const bottom = document.getElementById('bottom');
        //     bottom.scrollIntoView({behavior: 'smooth'});
        // }
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
                        // newJob={this.props.newJob}  
                        // handleNewJob={this.props.handleNewJob} 
                        // handleNewJobDate={this.props.handleNewJobDate}
                        // addJob={this.props.addJob}
                        // resetNewJobInput={this.props.resetNewJobInput}
                        // scrollToBottom={this.scrollToBottom}
                    />
                    <ExpenseFilter 
                        // jobs={this.props.jobs}
                        // filterInput={this.props.filterInput}
                        // handleListFilter={this.props.handleListFilter}
                        // submitListFilter={this.props.submitListFilter}
                        // resetListFilter={this.props.resetListFilter}
                    />
                </div>
                
                <div className="label-bar expenses">
                    <div>Date</div>
                    <div>Name</div>
                    <div>Cost</div>
                    <div>Actions</div>
                </div>
                {/* {this.props.jobs.map(job => {
                return <ExpenseItem key={job.id} job={job}
                            handleJobEdit={this.props.handleJobEdit}
                            handleJobEditDate={this.props.handleJobEditDate}
                            editJob={this.props.editJob}
                            deleteJob={this.props.deleteJob}
                        />
                })} */}
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