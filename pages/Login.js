import React from 'react'
import { hashHistory } from 'react-router'
import View from './abstract/View'

import Fetch from '../core/fetch'
import Alert from '../core/alert'

import Input from '../components/input'
import Button from '../components/button'

class Login extends View {

		constructor(props) {
				super(props);
		}

		login() {
				let { userName, password } = this.state;
				let data = { userName, password };

				if (userName && password) {
						Fetch.post("/login", data, (success) => {
								if (success) {
										hashHistory.push("/home");
								} else {
										Alert.error("Invalid username and/or password.");
								}
						});
				} else {
						Alert.error("Username and password is required.");
				}
		}

		render() {
		    return <div>
						<p>At Login</p>

						<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Username"
								name="userName" value={this.state.userName}
								onChange={super.onChange.bind(this)} />

						<Input label="Password" name="password" value={this.state.password}
								onChange={super.onChange.bind(this)} />

						<Button onClick={() => this.login()}>Login</Button>
		    </div>
		}
}

export default Login;
