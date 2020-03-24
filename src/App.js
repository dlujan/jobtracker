import React from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import MenuBar from './components/MenuBar';
import Dashboard from './components/Dashboard';
import JobLister from './components/JobLister';
import TrashJobLister from './components/TrashJobLister';
import './App.css';
const {ipcRenderer} = window.require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      trashJobs: [],
      listFilter: {
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        dateWeek: undefined,
        customer: undefined, // These have to be undefined for when they send to electron.js
        source: undefined, // in case not all are specified.
        pay: undefined
      },
      filterInput: {
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

  handleListFilter = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      listFilter: {
        ...prevState.listFilter,
        [name]: value
      },
      filterInput: {
        ...prevState.filterInput,
        [name]: value
      }
    }));
  }

  submitListFilter = event => {
    let allUndefined = true;

    for (var property in this.state.listFilter) {
      if (this.state.listFilter[property] !== undefined) {
        allUndefined = false;
        break;
      }
    }

    if (allUndefined === false) {
      ipcRenderer.send('filter-jobs', this.state.listFilter);
      this.resetListFilter();
      allUndefined = true;
    }
    event.preventDefault();
  }

  resetListFilter = () => {
    this.setState({
      listFilter: {
        dateDay: undefined,
        dateMonth: undefined,
        dateYear: undefined,
        dateWeek: undefined,
        customer: undefined,
        source: undefined,
        pay: undefined
      },
      filterInput: {
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

  addJob = event => {
    ipcRenderer.send('add-job', this.state.newJob);
    ipcRenderer.send('app-reload', 0); // reload so income stats get updated
    
    this.resetNewJobInput();
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

  deleteJob = (id, event) => {
    if (window.confirm("Are you sure you want to trash this job?")) {
      ipcRenderer.send('delete-job', id);
      ipcRenderer.send('app-reload', 0); // must update income stats
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

              filterInput={this.state.filterInput}
              handleListFilter={this.handleListFilter}
              submitListFilter={this.submitListFilter}
              resetListFilter={this.resetListFilter}
              
              jobs={this.state.jobs}
              handleJobEdit={this.handleJobEdit}
              handleJobEditDate={this.handleJobEditDate}
              editJob={this.editJob}
              deleteJob={this.deleteJob} 
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

