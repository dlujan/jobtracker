import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faList, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './Components.css';

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dashboardSelected: true,
            joblisterSelected: false,
            trashSelected: false
        }
    }
    dashboardSelected = () => { // I know the following code is super wet but it works
        this.setState({
            dashboardSelected: true,
            joblisterSelected: false,
            trashSelected: false
        })
    }

    joblisterSelected = () => {
        this.setState({
            dashboardSelected: false,
            joblisterSelected: true,
            trashSelected: false
        })
    }

    trashSelected = () => {
        this.setState({
            dashboardSelected: false,
            joblisterSelected: false,
            trashSelected: true
        })
    }

    dashboardNavStyle = () => {
        if (this.state.dashboardSelected === true) {
            return {
                marginRight: '12px',
                color: '#3676ff'
            }
        } else {
            return {
                marginRight: '12px',
                color: 'rgba(255, 255, 255, 0.4)'
            }
        }
    }

    joblisterNavStyle = () => {
        if (this.state.joblisterSelected === true) {
            return {
                marginRight: '12px',
                color: '#3676ff'
            }
        } else {
            return {
                marginRight: '12px',
                color: 'rgba(255, 255, 255, 0.4)'
            }
        }
    }

    trashNavStyle = () => {
        if (this.state.trashSelected === true) {
            return {
                marginRight: '12px',
                color: '#3676ff'
            }
        } else {
            return {
                marginRight: '12px',
                color: 'rgba(255, 255, 255, 0.4)'
            }
        }
    }
    render() {
        return (
            <div className="menu-bar">
                <Link to="/" className="link-comp">
                    <div onClick={this.dashboardSelected}>
                        <FontAwesomeIcon icon={faChartLine} style={this.dashboardNavStyle()}/><span>Dashboard</span>
                    </div>
                </Link>
                <Link to="/joblister" className="link-comp">
                    <div onClick={this.joblisterSelected}>
                        <FontAwesomeIcon icon={faList} style={this.joblisterNavStyle()}/><span>Job Lister</span>
                    </div>
                </Link>
                <Link to="/trashjoblister" className="link-comp">
                    <div onClick={this.trashSelected}>
                        <FontAwesomeIcon icon={faTrashAlt} style={this.trashNavStyle()}/><span>Trash</span>
                    </div>
                </Link>
            </div>
        );
    }
}

export default MenuBar;