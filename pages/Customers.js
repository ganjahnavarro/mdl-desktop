import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Provider from '../core/provider'

import Input from '../components/input'
import Audit from '../components/Audit'
import Dropdown from '../components/dropdown'


class Customers extends ListView {

		constructor(props) {
		    super(props);
				this.endpoint = "customer/";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

		    return <div>
						<p>At customers. <Link to="/">Go to home</Link></p>
						<hr />

						<p>Search</p>
						<Input value={this.state.filter} onChange={this.onFilter.bind(this)} /> <br/>
						<hr />

						{items}
						<hr />

						<Customer value={selectedItem} onFetch={this.onFetch}/>
						<hr />
		    </div>
		}
}

class Customer extends DetailView {

		constructor(props) {
		    super(props);
				this.endpoint = "customer/";
    }

    componentDidMount() {
        Provider.loadAgents((agents) => this.setState({agents}));
    }

		onAgentChange(agent) {
		    let nextState = this.state.value || {};
		    nextState.agent = {id: agent.value};
		    this.setState(nextState);
		}

		render() {
				let value = this.state.value;
				let agentId = value && value.agent ? value.agent.id : null;

				let agents = [];
        if (this.state.agents) {
						agents = this.state.agents.map((agent, index) => {
								return {value: agent.id, label: agent.name};
						});
        }

		    return <div>
						<Input ref="initial" autofocus="true" label="Name"
								name="name" value={value.name} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Dropdown name="agent" label="Agent" value={agentId} disabled={!this.state.updateMode}
								options={agents} onChange={this.onAgentChange.bind(this)} />

						<Input name="address" label="Address" value={value.address} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Input name="contact" label="Contact" value={value.contact} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <Input name="fax" label="Fax" value={value.fax} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Input name="tin" label="TIN" value={value.tin} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <Input name="commission" label="Commission" value={value.commission} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Audit value={value} />
						{super.getActions()}
		    </div>
		}
}

export default Customers;
