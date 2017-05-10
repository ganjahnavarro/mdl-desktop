import React from 'react'
import { hashHistory } from 'react-router'
import View from './abstract/View'

import Fetch from '../core/fetch'
import Alert from '../core/alert'

import Input from '../components/input'
import Button from '../components/button'
import Header from '../components/header'

class Todo extends View {

		render() {
				return <div>
						<Header />
						<div className="screen-center">
								<div className="ui grey image">
										<img id="brand" src="resources/images/logo.png" className="image" />
										<p className="message">This page is under construction.</p>
								</div>
						</div>
				</div>;
		}
}

export default Todo;
