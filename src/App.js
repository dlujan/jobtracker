import React from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import MenuBar from './components/MenuBar';
import Dashboard from './components/Dashboard';
import JobLister from './components/JobLister';
import ExpenseLister from './components/ExpenseLister';
import TrashJobLister from './components/TrashJobLister';
import './App.css';
const {ipcRenderer} = window.require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      expenses: [],
      trashJobs: [],
      jobListFilter: {
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        dateWeek: undefined,
        customer: undefined, // These have to be undefined for when they send to electron.js
        source: undefined, // in case not all are specified.
        pay: undefined
      },
      jobFilterInput: {
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        dateWeek: '',
        customer: '', // these can't be undefined bc it messes up controlled vs uncontrolled input
        source: '', // so I have to have both ^ :/
        pay: ''
      },
      newJob: {
        id: undefined,
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        customer: '',
        source: '',
        pay: undefined,
        description: ''
      },
      editJobCriteria: {
        id: undefined,
        dateDay: undefined, // These have to be undefined for when they send to electron.js
        dateMonth: undefined, // in case not all are specified.
        dateYear: undefined,
        customer: undefined,
        source: undefined,
        pay: undefined,
        description: undefined
      },
      expenseListFilter: {
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        dateWeek: undefined,
        name: undefined, // These have to be undefined for when they send to electron.js
        cost: undefined // in case not all are specified.
      },
      expenseFilterInput: {
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        dateWeek: '',
        name: '', // these can't be undefined bc it messes up controlled vs uncontrolled input
        cost: '' // so I have to have both ^ :/
      },
      newExpense: {
        id: undefined,
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        name: '',
        cost: '',
        description: ''
      },
      editExpenseCriteria: {
        id: undefined,
        dateDay: undefined, // These have to be undefined for when they send to electron.js
        dateMonth: undefined, // in case not all are specified.
        dateYear: undefined,
        name: undefined,
        cost: undefined,
        description: undefined,
      },
      weeksIncome: 0,
      monthsIncome: 0,
      yearsIncome: 0,
      weeksCount: 0,
      monthsCount: 0,
      yearsCount: 0
    }
  }
  
  componentDidMount () {
    ipcRenderer.send('app-load', 0);
    
    ipcRenderer.on('list-jobs', (event, jobs) => {
      this.setState({
        jobs: jobs
      })
    })

    ipcRenderer.on('list-expenses', (event, expenses) => {
      this.setState({
        expenses: expenses
      })
    })

    ipcRenderer.on('list-trash-jobs', (event, jobs) => {
      this.setState({
        trashJobs: jobs
      })
    })

    ipcRenderer.on('income-stats', (event, weeksIncome, monthsIncome, yearsIncome) => {
      this.setState({
        weeksIncome: weeksIncome,
        monthsIncome: monthsIncome,
        yearsIncome: yearsIncome
      })
    })

    ipcRenderer.on('jobCount-stats', (event, weeksCount, monthsCount, yearsCount) => {
      this.setState({
        weeksCount: weeksCount,
        monthsCount: monthsCount,
        yearsCount: yearsCount
      })
    })
  }

  handleJobListFilter = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      jobListFilter: {
        ...prevState.jobListFilter,
        [name]: value
      },
      jobFilterInput: {
        ...prevState.jobFilterInput,
        [name]: value
      }
    }));
  }

  handleExpenseListFilter = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      expenseListFilter: {
        ...prevState.expenseListFilter,
        [name]: value
      },
      expenseFilterInput: {
        ...prevState.expenseFilterInput,
        [name]: value
      }
    }));
  }

  submitJobListFilter = event => {
    let allUndefined = true;

    for (var property in this.state.jobListFilter) {
      if (this.state.jobListFilter[property] !== undefined) {
        allUndefined = false;
        break;
      }
    }

    if (allUndefined === false) {
      ipcRenderer.send('filter-jobs', this.state.jobListFilter);
      this.resetJobListFilter();
      allUndefined = true;
    }
    event.preventDefault();
  }

  submitExpenseListFilter = event => {
    let allUndefined = true;

    for (var property in this.state.expenseListFilter) {
      if (this.state.expenseListFilter[property] !== undefined) {
        allUndefined = false;
        break;
      }
    }

    if (allUndefined === false) {
      ipcRenderer.send('filter-expenses', this.state.expenseListFilter);
      this.resetExpenseListFilter();
      allUndefined = true;
    }
    event.preventDefault();
  }

  resetJobListFilter = () => {
    this.setState({
      jobListFilter: {
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        dateWeek: undefined,
        customer: undefined,
        source: undefined,
        pay: undefined
      },
      jobFilterInput: {
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        dateWeek: '',
        customer: '',
        source: '',
        pay: ''
      }
    });
  }

  resetExpenseListFilter = () => {
    this.setState({
      expenseListFilter: {
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        dateWeek: undefined,
        name: undefined,
        cost: undefined
      },
      expenseFilterInput: {
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        dateWeek: '',
        name: '',
        cost: '',
      }
    });
  }

  handleNewJob = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      newJob: {
        ...prevState.newJob,
        id: Date.now(),
        [name]: value
      }
    }));
  }

  handleNewExpense = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      newExpense: {
        ...prevState.newExpense,
        id: Date.now(),
        [name]: value
      }
    }));
  }

  handleNewJobDate = date => {
    if(date !== undefined) {
      let newDate = date.toLocaleDateString();
      let parsedDate = newDate.split('/');
      let month = parsedDate[0];
      let day = parsedDate[1];
      let year = parsedDate[2];
      this.setState({
        newJob: {
          dateDay: day,
          dateMonth: month,
          dateYear: year
        }
      });
    }
  }

  handleNewExpenseDate = date => {
    if(date !== undefined) {
      let newDate = date.toLocaleDateString();
      let parsedDate = newDate.split('/');
      let month = parsedDate[0];
      let day = parsedDate[1];
      let year = parsedDate[2];
      this.setState({
        newExpense: {
          dateDay: day,
          dateMonth: month,
          dateYear: year
        }
      });
    }
  }

  addJob = event => {
    ipcRenderer.send('add-job', this.state.newJob);
    ipcRenderer.send('app-reload', 0); // reload so income stats get updated
    
    this.resetNewJobInput();
    event.preventDefault();
  }

  addExpense = event => {
    ipcRenderer.send('add-expense', this.state.newExpense);
    ipcRenderer.send('app-reload', 0); // reload so income stats get updated
    
    this.resetNewExpenseInput();
    event.preventDefault();
  }

  resetNewJobInput = () => {
    this.setState({
      newJob: {
        id: undefined,
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        customer: '',
        source: '',
        pay: '',
        description: ''
      }
    });
  }

  resetNewExpenseInput = () => {
    this.setState({
      newExpense: {
        id: undefined,
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        name: '',
        cost: '',
        description: ''
      }
    });
  }

  handleJobEdit = (id, event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      editJobCriteria: {
        ...prevState.editJobCriteria,
        id: id,
        [name]: value
      }
    }));
  }

  handleExpenseEdit = (id, event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      editExpenseCriteria: {
        ...prevState.editExpenseCriteria,
        id: id,
        [name]: value
      }
    }));
  }

  handleJobEditDate = (id, date) => {
    if(date !== undefined) {
      let newDate = date.toLocaleDateString();
      let parsedDate = newDate.split('/');
      let month = parsedDate[0];
      let day = parsedDate[1];
      let year = parsedDate[2];
      this.setState({
        editJobCriteria: {
          id: id,
          dateDay: day,
          dateMonth: month,
          dateYear: year
        }
      });
    }
  }

  handleExpenseEditDate = (id, date) => {
    if(date !== undefined) {
      let newDate = date.toLocaleDateString();
      let parsedDate = newDate.split('/');
      let month = parsedDate[0];
      let day = parsedDate[1];
      let year = parsedDate[2];
      this.setState({
        editExpenseCriteria: {
          id: id,
          dateDay: day,
          dateMonth: month,
          dateYear: year
        }
      });
    }
  }

  editJob = event => {
    let allUndefined = true;

    for (var property in this.state.editJobCriteria) {
      if (this.state.editJobCriteria[property] !== undefined) {
        allUndefined = false;
        break;
      }
    }

    if (allUndefined === false) {
      // create popup to confirm edit!
      if (window.confirm("Are you sure you want to make these edits?")) {
        ipcRenderer.send('edit-job', this.state.editJobCriteria);
        this.resetEditJobParams();
        ipcRenderer.send('app-reload', 0);
        allUndefined = true;
      }
    }
    
    event.preventDefault();
  }

  editExpense = event => {
    let allUndefined = true;

    for (var property in this.state.editExpenseCriteria) {
      if (this.state.editExpenseCriteria[property] !== undefined) {
        allUndefined = false;
        break;
      }
    }

    if (allUndefined === false) {
      // create popup to confirm edit!
      if (window.confirm("Are you sure you want to make these edits?")) {
        ipcRenderer.send('edit-expense', this.state.editExpenseCriteria);
        this.resetEditExpenseParams();
        ipcRenderer.send('app-reload', 0);
        allUndefined = true;
      }
    }
    
    event.preventDefault();
  }

  resetEditJobParams = () => {
    this.setState({
      editJobCriteria: {
        id: undefined,
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        customer: undefined,
        source: undefined,
        pay: undefined,
        description: undefined
      }
    })
  }

  resetEditExpenseParams = () => {
    this.setState({
      editExpenseCriteria: {
        id: undefined,
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        name: undefined,
        cost: undefined,
        description: undefined
      }
    })
  }

  deleteJob = (id, event) => {
    if (window.confirm("Are you sure you want to trash this job?")) {
      ipcRenderer.send('delete-job', id);
      ipcRenderer.send('app-reload', 0); // must update income stats
    }
    event.preventDefault();
  }

  deleteExpense = (id, event) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      ipcRenderer.send('delete-expense', id);
      ipcRenderer.send('app-reload', 0); // must update expense stats
    }
    event.preventDefault();
  }

  recoverJob = (id, event) => {
    if (window.confirm("Are you sure you want to recover this job?")) {
      ipcRenderer.send('recover-job', id);
      ipcRenderer.send('app-reload', 0);
    }
    event.preventDefault();
  }

  destroyJob = (id, event) => {
    if (window.confirm("Are you sure you want to permanently delete this job?")) {
      ipcRenderer.send('destroy-job', id);
      ipcRenderer.send('app-reload', 0);
    }
    event.preventDefault();
  }

  jobsPayTotal = () => {
    let total = 0.00;
    this.state.jobs.forEach(job => {
      total = total + parseFloat(job.pay);
    })
    return total;
  }

  render() {
    return (
      <HashRouter>
        <div className="flex-container">
          <div className="menubar-container">
            <MenuBar/>
          </div>
          <div className="main-container">
          <Switch>
            <Route exact path="/" render={(props) => <Dashboard {...props}
              weeksIncome={this.state.weeksIncome}
              monthsIncome={this.state.monthsIncome}
              yearsIncome={this.state.yearsIncome}
              weeksCount={this.state.weeksCount}
              monthsCount={this.state.monthsCount}
              yearsCount={this.state.yearsCount}
            />} />
            <Route exact path="/joblister" render={(props) => <JobLister {...props}
              newJob={this.state.newJob}
              handleNewJob={this.handleNewJob}  
              handleNewJobDate={this.handleNewJobDate}
              addJob={this.addJob}
              resetNewJobInput={this.resetNewJobInput}

              jobFilterInput={this.state.jobFilterInput}
              handleJobListFilter={this.handleJobListFilter}
              submitJobListFilter={this.submitJobListFilter}
              resetJobListFilter={this.resetJobListFilter}
              
              jobs={this.state.jobs}
              handleJobEdit={this.handleJobEdit}
              handleJobEditDate={this.handleJobEditDate}
              editJob={this.editJob}
              deleteJob={this.deleteJob} 
             />} />
             <Route exact path="/expenselister" render={(props) => <ExpenseLister {...props}
              newExpense={this.state.newExpense}
              handleNewExpense={this.handleNewExpense}  
              handleNewExpenseDate={this.handleNewExpenseDate}
              addExpense={this.addExpense}
              resetNewExpenseInput={this.resetNewExpenseInput}

              expenseFilterInput={this.state.expenseFilterInput}
              handleExpenseListFilter={this.handleExpenseListFilter}
              submitExpenseListFilter={this.submitExpenseListFilter}
              resetExpenseListFilter={this.resetExpenseListFilter}
              
              expenses={this.state.expenses}
              handleExpenseEdit={this.handleExpenseEdit}
              handleExpenseEditDate={this.handleExpenseEditDate}
              editExpense={this.editExpense}
              deleteExpense={this.deleteExpense}
            />} />
             <Route exact path="/trashjoblister" render={(props) => <TrashJobLister {...props}
              trashJobs={this.state.trashJobs}
              recoverJob={this.recoverJob}
              destroyJob={this.destroyJob}
             />} />
          </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
