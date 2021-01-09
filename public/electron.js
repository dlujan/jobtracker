const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');

const DataStorage = require('./DataStorage');
const { autoUpdater } = require("electron-updater")

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1150, height: 700, webPreferences: {nodeIntegration: true, webSecurity: false}});
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    // mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});

////// DATA STORAGE //////

  const jobsData = new DataStorage({
    name: 'Jobs Main'
  })

  const jobsTrash = new DataStorage({
    name: 'Jobs Trash'
  })

  const expensesData = new DataStorage({
    name: 'Expenses Main'
  })
  // No use for this for now
  // const expensesTrash = new DataStorage({
  //   name: 'Expenses Trash'
  // })
  
  function currentWeek () {
    // Includes this week's Monday through current day
    let arr = [];
    let date = new Date();
  
    for (let i = date.getDay(); i >= 0; i--) {
      let date = new Date();
      date.setDate(date.getDate()-(date.getDay()-i));
      arr.push({
        dateDay: String(date.getDate()),
        dateMonth: String(date.getMonth()+1),
        dateYear: String(date.getFullYear())
      })
    }
    return arr;
  }
  
  function currentMonth () { // these CANNOT return an array bc "getJobs" won't work
    let date = new Date();
    return {
      dateMonth: String(date.getMonth()+1),
      dateYear: String(date.getFullYear())
    }
  }
  
  function currentYear () {
    let date = new Date();
    return {
      dateYear: String(date.getFullYear())
    }
  }

  function getDateOfISOWeek(w, y) {
    let simple = new Date(y, 0, 1 + (w - 1) * 7);
    let dow = simple.getDay();
    let ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}
  
  // Load the jobs of current month by default and ALL expenses (for now)
  ipcMain.on('app-load', (event, bang) => {
    jobsData.getJobs([currentMonth()]); // getJobs populates filteredJobs array, only needs to happen on app load and during user filter
    let weeksIncome = jobsData.calculateIncome(currentWeek());
    let monthsIncome = jobsData.calculateIncome([currentMonth()]);
    let yearsIncome = jobsData.calculateIncome([currentYear()]);
    let weeksCount = jobsData.countJobs(currentWeek());
    let monthsCount = jobsData.countJobs([currentMonth()]);
    let yearsCount = jobsData.countJobs([currentYear()]);
    mainWindow.send('income-stats', weeksIncome, monthsIncome, yearsIncome);
    mainWindow.send('jobCount-stats', weeksCount, monthsCount, yearsCount);
    mainWindow.send('list-jobs', jobsData.filteredJobs);
    mainWindow.send('list-trash-jobs', jobsTrash.jobs);

    expensesData.getExpenses([currentYear()]); // getExpenses populates filteredExpenses array, only needs to happen on app load and during user filter
    let yearsExpenses = expensesData.calculateExpenses([currentYear()]);
    //mainWindow.send('expenses-stats', yearsExpenses);
    mainWindow.send('list-expenses', expensesData.filteredExpenses);
    console.log(yearsExpenses);
  })
  
  ipcMain.on('app-reload', (event, bang) => {
    let weeksIncome = jobsData.calculateIncome(currentWeek());
    let monthsIncome = jobsData.calculateIncome([currentMonth()]);
    let yearsIncome = jobsData.calculateIncome([currentYear()]);
    let weeksCount = jobsData.countJobs(currentWeek());
    let monthsCount = jobsData.countJobs([currentMonth()]);
    let yearsCount = jobsData.countJobs([currentYear()]);
    mainWindow.send('income-stats', weeksIncome, monthsIncome, yearsIncome);
    mainWindow.send('jobCount-stats', weeksCount, monthsCount, yearsCount);
    mainWindow.send('list-jobs', jobsData.filteredJobs);
    mainWindow.send('list-trash-jobs', jobsTrash.jobs);

    let yearsExpenses = expensesData.calculateExpenses([currentYear()]);
    //mainWindow.send('expenses-stats', yearsExpenses);
    mainWindow.send('list-expenses', expensesData.filteredExpenses);
    console.log(yearsExpenses);
  })
  
  // IMPORTANT! App will NEVER return all the jobs, only the filtered jobs.
  ipcMain.on('filter-jobs', (event, filterSpecs) => {
    if (filterSpecs.dateWeek) {
      if (filterSpecs.dateDay) { // in case Day or Month are specified...
        delete filterSpecs.dateDay;
      }
      if (filterSpecs.dateMonth) { // ...but their input should get blocked on the front end
        delete filterSpecs.dateMonth;
      }
      if (!filterSpecs.dateYear) {
        filterSpecs.dateYear = new Date().getFullYear().toString();
      }
      let daysInWeek = [];

      let dateVal = getDateOfISOWeek(filterSpecs.dateWeek, filterSpecs.dateYear);
      for (let i = dateVal.getDay(); i <= 7; i++) {
        daysInWeek.push({
          dateDay: `${String(dateVal.getDate())}`, 
          dateMonth: `${String(dateVal.getMonth()+1)}`, 
          dateYear: `${String(filterSpecs.dateYear)}`
        });
        dateVal.setDate(dateVal.getDate()+1);
      }

      jobsData.getJobs(daysInWeek);

    } else {
        jobsData.getJobs([filterSpecs]);
    }
    
    mainWindow.send('list-jobs', jobsData.filteredJobs);
  })

  ipcMain.on('filter-expenses', (event, filterSpecs) => {
    if (filterSpecs.dateWeek) {
      if (filterSpecs.dateDay) { // in case Day or Month are specified...
        delete filterSpecs.dateDay;
      }
      if (filterSpecs.dateMonth) { // ...but their input should get blocked on the front end
        delete filterSpecs.dateMonth;
      }
      if (!filterSpecs.dateYear) {
        filterSpecs.dateYear = new Date().getFullYear().toString();
      }
      let daysInWeek = [];

      let dateVal = getDateOfISOWeek(filterSpecs.dateWeek, filterSpecs.dateYear);
      for (let i = dateVal.getDay(); i <= 7; i++) {
        daysInWeek.push({
          dateDay: `${String(dateVal.getDate())}`, 
          dateMonth: `${String(dateVal.getMonth()+1)}`, 
          dateYear: `${String(filterSpecs.dateYear)}`
        });
        dateVal.setDate(dateVal.getDate()+1);
      }

      expensesData.getExpenses(daysInWeek);

    } else {
        expensesData.getExpenses([filterSpecs]);
    }
    
    mainWindow.send('list-expenses', expensesData.filteredExpenses);
  })
  
  ipcMain.on('add-job', (event, job) => {
    jobsData.addJob(job);
    mainWindow.send('list-jobs', jobsData.filteredJobs);
  })

  ipcMain.on('add-expense', (event, expense) => {
    expensesData.addExpense(expense);
    mainWindow.send('list-expenses', expensesData.filteredExpenses);
  })
  
  ipcMain.on('edit-job', (event, editItems) => {
    jobsData.editJob(editItems);
    mainWindow.send('list-jobs', jobsData.filteredJobs);
  })

  ipcMain.on('edit-expense', (event, editItems) => {
    expensesData.editExpense(editItems);
    mainWindow.send('list-expenses', expensesData.filteredExpenses);
  })
  
  ipcMain.on('delete-job', (event, id) => {
    let deletedJob = jobsData.queryJobByID(id); // find job that's being deleted
    jobsTrash.addJob(deletedJob); // put that job in tha TRASHHH
    jobsData.deleteJob(id);
  })

  ipcMain.on('delete-expense', (event, id) => {
    // No need to hang onto deleted expenses, for now at least
    //let deletedExpense = expensesData.queryExpenseByID(id);
    //expensesTrash.addExpense(deletedExpense);
    expensesData.deleteExpense(id); // delete expense from storage straight up
  })

  ipcMain.on('recover-job', (event, id) => {
    let recoveredJob = jobsTrash.queryJobByID(id);
    jobsData.addJob(recoveredJob);
    jobsTrash.deleteJob(id);
  })

  // Currently no use for this endpoint
  // ipcMain.on('recover-expense', (event, id) => {
  //   let recoveredExpense = expensesTrash.queryExpenseByID(id);
  //   expensesData.addExpense(recoveredExpense);
  //   expensesTrash.deleteExpense(id);
  // })

 ipcMain.on('destroy-job', (event, id) => {
   jobsTrash.deleteJob(id);
 })

// Currently no use for this endpoint
//  ipcMain.on('destroy-expense', (event, id) => {
//    expensesTrash.deleteExpense(id);
//  })
