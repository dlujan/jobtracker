import React from 'react';
import './Components.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class ListFilter extends React.Component {
    jobsPayTotal = () => {
        let total = 0.00;
        this.props.jobs.forEach(job => {
          total = total + parseFloat(job.pay);
        })
        return total.toFixed(2);
    }
    render() {
        const {submitListFilter, resetListFilter, filterInput, handleListFilter} = this.props;
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
                    <h3>Filter Jobs</h3>
                    <form onSubmit={submitListFilter}>
                        <input name="dateDay" type="text" value={filterInput.dateDay} onChange={handleListFilter} disabled={(filterInput.dateWeek === "")? "" : "disabled"} placeholder="Day"/>
                        <input name="dateMonth" type="text" value={filterInput.dateMonth} onChange={handleListFilter} disabled={(filterInput.dateWeek === "")? "" : "disabled"} placeholder="Month"/>
                        <input name="dateYear" type="text" value={filterInput.dateYear} onChange={handleListFilter} placeholder="Year"/>
                        <select id="week" name="dateWeek" value={filterInput.dateWeek} onChange={handleListFilter}>
                            <option value="">--Select week--</option>
                            {weeks.map(value => {return <option value={value}>{value}</option>})}
                        </select>
                        <input name="customer" type="text" value={filterInput.customer} onChange={handleListFilter} placeholder="Customer"/>
                        <input name="source" type="text" value={filterInput.source} onChange={handleListFilter} placeholder="Source"/>
                        <div>
                            <button className="submit-btn" type="submit" value="Submit">Submit</button>
                            <button onClick={resetListFilter}>Reset</button>
                            <span>Filtered total: ${this.jobsPayTotal()}</span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    
}

export default ListFilter;