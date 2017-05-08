import React from 'react'
import { Link } from 'react-router'
import Select from 'react-select';

class Header extends React.Component {

		render() {
				return <div>
						<div className="ui secondary menu">
		            <Link to="/dashboard" className="active item">
		                Dashboard
		            </Link>

		            <div className="right menu">
		                <Link to="/" className="ui item">
		                    Logout
		                </Link>
		            </div>
						</div>

						<div className="ui divider"></div>
        </div>
		}

}

export default Header;
