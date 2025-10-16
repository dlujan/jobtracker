import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faMinus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./Components.css";

class Dashboard extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div className="page-container-dash">
        <div className="header">
          <h1>Dashboard</h1>
          <h3>Your statistics</h3>
        </div>
        <div style={{ background: "#f7f7f7" }}>
          <div className="card-container">
            <div className="card">
              <div className="card-icon-income">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div className="card-content">
                <span>Income this week</span>
                <div>
                  <strong>${this.props.weeksIncome.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-icon-income">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div className="card-content">
                <span>Income this month</span>
                <div>
                  <strong>${this.props.monthsIncome.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-icon-income">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div className="card-content">
                <span>Income this year</span>
                <div>
                  <strong>${this.props.yearsIncome.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="card-container">
            <div className="card">
              <div className="card-icon-count">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="card-content">
                <span>Jobs this week</span>
                <div>
                  <strong>{this.props.weeksCount}</strong>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-icon-count">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="card-content">
                <span>Jobs this month</span>
                <div>
                  <strong>{this.props.monthsCount}</strong>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-icon-count">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="card-content">
                <span>Jobs this year</span>
                <div>
                  <strong>{this.props.yearsCount}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="card-container">
            <div className="card">
              <div className="card-icon-expenses">
                <FontAwesomeIcon icon={faMinus} />
              </div>
              <div className="card-content">
                <span>Expenses this week</span>
                <div>
                  <strong>${this.props.weeksExpenses.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-icon-expenses">
                <FontAwesomeIcon icon={faMinus} />
              </div>
              <div className="card-content">
                <span>Expenses this month</span>
                <div>
                  <strong>${this.props.monthsExpenses.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-icon-expenses">
                <FontAwesomeIcon icon={faMinus} />
              </div>
              <div className="card-content">
                <span>Expenses this year</span>
                <div>
                  <strong>${this.props.yearsExpenses.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
