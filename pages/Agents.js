import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/input'
import Audit from '../components/Audit'


class Agents extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "agent/";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

		    return <div>
						<p>At agents. <Link to="/">Go to home</Link></p>
						<hr />

						<p>Search</p>
						<Input value={this.state.filter} onChange={this.onFilter.bind(this)} /> <br/>
						<hr />

						{items}
						<hr />

						<Agent value={selectedItem} onFetch={this.onFetch}/>
		    </div>
		}
}

class Agent extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "agent/";
    }

		render() {
				let value = this.state.value;

		    return <div>
						<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
								name="name" value={this.state.value.name} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Input name="address" label="Address" value={this.state.value.address} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Input name="contact" label="Contact" value={this.state.value.contact} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Input name="tin" label="TIN" value={this.state.value.tin} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <Audit value={value} />
						{super.getActions()}
		    </div>
		}
}

export default Agents;
