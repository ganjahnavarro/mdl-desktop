import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Provider from '../core/provider'

import Input from '../components/input'
import Audit from '../components/Audit'
import Header from '../components/header'
import Dropdown from '../components/dropdown'
import Textarea from '../components/textarea'


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
						<Header />
								<div className="ui grid">
								<div className="five wide column ui form">
										<Input label="Search" value={this.state.filter} name="filter"
													onChange={this.onFilter.bind(this)} placeholder="Type here to search" />

										<div className="ui divider"></div>
										<ul className="ui list">
												{items}
										</ul>
								</div>

								<div className="eleven wide column">
										<Customer value={selectedItem} onFetch={this.onFetch}/>
								</div>
						</div>
		    </div>;
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
				let { value, updateMode } = this.state;
				let agentId = value && value.agent ? value.agent.id : null;

				let agents = [];
        if (this.state.agents) {
						agents = this.state.agents.map((agent, index) => {
								return {value: agent.id, label: agent.name};
						});
        }

				return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={value.name} disabled={!updateMode}
										onChange={super.onChange.bind(this)} />

								<Dropdown name="agent" label="Agent" value={agentId} disabled={!updateMode}
										options={agents} onChange={this.onAgentChange.bind(this)} />

								<Textarea name="address" label="Office Address" value={value.address} disabled={!updateMode}
										onChange={super.onChange.bind(this)} rows={2} />

								<Textarea name="homeAddress" label="Home Address" value={value.homeAddress} disabled={!updateMode}
										onChange={super.onChange.bind(this)} rows={2} />

								<div className="fields">
										<Input name="contact" label="Contact" value={value.contact} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="six" />

										<Input name="fax" label="Fax" value={value.fax} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="six"  />

										<Input name="commission" label="Commission" value={value.commission} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="four" />
								</div>

								<div className="fields">
										<Input name="tin" label="TIN" value={value.tin} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="terms" label="Terms" value={value.terms} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>

								<div className="fields">
										<Input name="ownersName" label="Owner's Name" value={value.ownersName} disabled={!updateMode}
											onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="accountNumber" label="Account Number" value={value.accountNumber} disabled={!updateMode}
												onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
		    </div>
		}
}

export default Customers;
