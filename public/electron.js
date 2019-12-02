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
  
  // Load the jobs of current month by default
  ipcMain.on('app-load', (event, bang) => {
    jobsData.getJobs(currentMonth()); // getJobs populates filteredJobs array, only needs to happen on app load and during user filter
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
  })
  
  // IMPORTANT! App will NEVER return all the jobs, only the filtered jobs.
  ipcMain.on('filter-jobs', (event, filterSpecs) => {
    jobsData.getJobs(filterSpecs);
    mainWindow.send('list-jobs', jobsData.filteredJobs);
  })
  
  ipcMain.on('add-job', (event, job) => {
    jobsData.addJob(job);
    mainWindow.send('list-jobs', jobsData.filteredJobs);
  })
  
  ipcMain.on('edit-job', (event, editItems) => {
    jobsData.editJob(editItems);
    mainWindow.send('list-jobs', jobsData.filteredJobs);
  })
  
  ipcMain.on('delete-job', (event, id) => {
    let deletedJob = jobsData.queryJobByID(id); // find job that's being deleted
    jobsTrash.addJob(deletedJob); // put that job in tha TRASHHH
    jobsData.deleteJob(id);
  })

  ipcMain.on('recover-job', (event, id) => {
    let recoveredJob = jobsTrash.queryJobByID(id);
    jobsData.addJob(recoveredJob);
    jobsTrash.deleteJob(id);
  })

 ipcMain.on('destroy-job', (event, id) => {
   jobsTrash.deleteJob(id);
 })
