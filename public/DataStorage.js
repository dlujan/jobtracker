const Store = require('electron-store');

class DataStorage extends Store {
    constructor(settings) {
        super(settings);

        this.jobs = this.get('jobs') || [];
        this.filteredJobs = [];
        this.expenses = this.get('expenses') || [];
        this.filteredExpenses = [];
    }

    saveJobs () {
        this.set('jobs', this.jobs);
        return this;
    }

    saveExpenses () {
        this.set('expenses', this.expenses);
        return this;
    }

    getJobs (filterSpecs) { // only accepts one object
        // this.filteredJobs = this.jobs.filter(job => {
        //     return Object.keys(filterSpecs).every(k => {
        //         return job[k] === filterSpecs[k];
        //     });
        // });
        // return this; // returns job objects

        this.filteredJobs = [];

        filterSpecs.forEach(spec => { // this method accepts an array of objects
            this.jobs.forEach(job => {
                if (Object.keys(spec).every(k => spec[k] === job[k])) {
                    this.filteredJobs.push(job);
                }
            });
        });
        return this;
    }

    getExpenses (filterSpecs) {
        this.filteredExpenses = [];

        filterSpecs.forEach(spec => { // this method accepts an array of objects
            this.expenses.forEach(expense => {
                if (Object.keys(spec).every(k => spec[k] === expense[k])) {
                    this.filteredExpenses.push(expense);
                }
            });
        });
        return this;
    }

    calculateIncome (timeRanges) {
        // param passed in will be ex. [{dateYear: 2019}] or [{dateMonth: 9}] or [{dateMonth: 9, dateYear: 2019}] OR [{dateMonth: 9, dateYear: 2019}, {etc.}, {etc.}]
        let total = 0.00;

        timeRanges.forEach(range => {
            this.jobs.forEach(job => {
                if (Object.keys(range).every(k => range[k] === job[k])) {
                    total = total + parseFloat(job.pay);
                }
            });
        });
        return total;
    }

    calculateExpenses (timeRanges) {
        // param passed in will be ex. [{dateYear: 2019}] or [{dateMonth: 9}] or [{dateMonth: 9, dateYear: 2019}] OR [{dateMonth: 9, dateYear: 2019}, {etc.}, {etc.}]
        let total = 0.00;

        timeRanges.forEach(range => {
            this.expenses.forEach(expense => {
                if (Object.keys(range).every(k => range[k] === expense[k])) {
                    total = total + parseFloat(expense.cost);
                }
            });
        });
        return total;
    }

    countJobs (timeRange) {
        let total = 0;

        timeRange.forEach(range => {
            this.jobs.forEach(job => {
                if (Object.keys(range).every(k => range[k] === job[k])) {
                    total = total + 1;
                }
            });
        });
        return total;
    }

    addJob (job) {
        this.jobs = [...this.jobs, job]; // adds new job to real jobs in storage
        this.filteredJobs = [...this.filteredJobs, job]; // adds new job to temporary filtered jobs being displayed
        return this.saveJobs();
    }

    addExpense (expense) {
        this.expenses = [...this.expenses, expense]; // adds new expense to real expenses in storage
        this.filteredExpenses = [...this.filteredExpenses, expense]; // adds new expense to temporary filtered expenses being displayed
        return this.saveExpenses();
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

    editExpense (editItems) {
        this.expenses = this.expenses.map(expense => { // edits real expenses in storage
            return expense.id === editItems.id ? Object.assign({}, expense, editItems): expense;
        });
        this.filteredExpenses = this.filteredExpenses.map(expense => { // edits temporary filtered expenses being displayed
            return expense.id === editItems.id ? Object.assign({}, expense, editItems): expense;
        });
        return this.saveExpenses();
    }

    deleteJob (id) {
        this.jobs = this.jobs.filter(job => job.id !== id); // deletes job from real jobs storage
        this.filteredJobs = this.filteredJobs.filter(job => job.id !== id); // deletes job from temporary filtered jobs being displayed
        return this.saveJobs();
    }

    deleteExpense (id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id); // deletes expense from real expenses storage
        this.filteredExpenses = this.filteredExpenses.filter(expense => expense.id !== id); // deletes expense from temporary filtered expenses being displayed
        return this.saveExpenses();
    }

    queryJobByID (id) {
        return this.jobs.find(job => job.id === id);
    }

    queryExpenseByID (id) {
        return this.expenses.find(expense => expense.id === id);
    }
}

module.exports = DataStorage;
