const Store = require('electron-store');

class DataStorage extends Store {
    constructor(settings) {
        super(settings);

        this.jobs = this.get('jobs') || [];
        this.filteredJobs = [];
    }

    saveJobs () {
        this.set('jobs', this.jobs);
        return this;
    }

    getJobs (filterSpecs) {
        this.filteredJobs = this.jobs.filter(job => {
            return Object.keys(filterSpecs).every(k => {
                return job[k] === filterSpecs[k];
            });
        });
        return this; // returns job objects
    }

    calculateIncome (timeRanges) {
        // param passed in will be ex. [{dateYear: 2019}] or [{dateMonth: 9}] or [{dateMonth: 9, dateYear: 2019}] OR [{dateMonth: 9, dateYear: 2019}, {etc.}, {etc.}]
        let total = 0.00;

        timeRanges.forEach(range => { // loops through all objects passed as params
            this.jobs.forEach(job => { // loops through all jobs!
                Object.keys(range).every(k => {
                    if (job[k] === range[k]) {
                        total = total + parseFloat(job.pay);
                    }
                });
            });
        });
        return total;
    }

    countJobs (timeRange) {
        let total = 0;

        timeRange.forEach(range => {
            this.jobs.forEach(job => {
                Object.keys(range).every(k => {
                    if (job[k] === range[k]) {
                        total = total + 1;
                    }
                });
            });
        });
        return total;
    }

    addJob (job) {
        this.jobs = [...this.jobs, job]; // adds new job to real jobs in storage
        this.filteredJobs = [...this.filteredJobs, job]; // adds new job to temporary filtered jobs being displayed
        return this.saveJobs();
    }

    editJob (editItems) {
        this.jobs = this.jobs.map(job => { // edits real jobs in storage
            return job.id === editItems.id ? Object.assign({}, job, editItems): job;
        });
        this.filteredJobs = this.filteredJobs.map(job => { // edits temporary filtered jobs being displayed
            return job.id === editItems.id ? Object.assign({}, job, editItems): job;
        });
        return this.saveJobs();
    }

    deleteJob (id) {
        this.jobs = this.jobs.filter(job => job.id !== id); // deletes job from real jobs storage
        this.filteredJobs = this.filteredJobs.filter(job => job.id !== id); // deletes job from temporary filtered jobs being displayed
        return this.saveJobs();
    }

    queryJobByID (id) {
        return this.jobs.find(job => job.id === id);
    }

    recoverJob(job) {
        console.log(job);
        // add recovered job to the end of the job array?
    }
}

module.exports = DataStorage;