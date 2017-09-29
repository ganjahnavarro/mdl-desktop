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
								<Button>Print</Button>
						</div>
				</div>;
		}
}

export default Todo;
