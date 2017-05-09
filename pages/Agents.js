import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/input'
import Audit from '../components/Audit'
import Header from '../components/header'
import Textarea from '../components/textarea'


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

				return  <div>
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
										<Agent value={selectedItem} onFetch={this.onFetch}/>
								</div>
						</div>
		    </div>;
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
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={this.state.value.name} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Textarea name="address" label="Address" value={this.state.value.address} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Input name="contact" label="Contact" value={this.state.value.contact} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Input name="tin" label="TIN" value={this.state.value.tin} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
			 </div>
		}
}

export default Agents;
