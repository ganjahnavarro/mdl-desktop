import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/detailView'

import Fetch from '../core/fetch'
import Input from '../components/input'
import Button from '../components/button'


class Agents extends ListView {

		constructor(props) {
		    super(props);
				this.onFetch = this.onFetch.bind(this);
		}

		componentDidMount() {
				this.onFetch(null);
		}

		onDelete() {
				console.log(this.state);

				let items = this.state.items.filter((item) => this.state.selectedItem.id != item.id);
				this.setState({items});
				if (items) super.onItemClick(0);
		}

		onFilter(event) {
				super.onChange(event);
				this.onFetch({filter: event.target.value});
		}

		onFetch(extraParameters) {
				let defaultParameters = {
						orderedBy: "name",
						pageSize: 5,
						pageOffset: 0
				};

				let parameters = Object.assign({}, defaultParameters, extraParameters);

				Fetch.get("agent/", parameters, (items) => {
						this.setState({items});
						if (items) super.onItemClick(0);
				});
		}

		renderItem(item, index) {
				return <p key={index} onClick={super.onItemClick.bind(this, index)}>
						{item.name}
				</p>;
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
						<hr />

						<p>Selected Index: {this.state.selectedIndex}</p>

						<Button onClick={() => super.firstItem()}>First</Button>
						<Button onClick={() => super.previousItem()}>Prev</Button>
						<Button onClick={() => super.nextItem()}>Next</Button>
						<Button onClick={() => super.lastItem()}>Last</Button>
		    </div>
		}
}

class Agent extends DetailView {

		constructor(props) {
		    super(props);
		}

		onDelete() {
				console.log("on delete id: " + this.props.value.id);
				let self = this;
				Fetch.delete("agent/", this.props.value.id, () => this.props.onFetch());
		}

		onSave() {
				console.log("Saving", "Update Mode:", this.state.updateMode);
				this.state.updateMode == "CREATE" ? this.onCreate() :  this.onUpdate();
		}

		onCreate() {
				console.log("creating..");
				Fetch.post("agent/", this.state.value, () => {
						this.setState({updateMode : null});
						this.props.onFetch();
				});

		}

		onUpdate() {
				console.log("updating..");
		}

		onChange(event) {
		    let value = this.state.value || {};
		    value[event.target.name] = event.target.value;
		    this.setState(value);
		}

		render() {
				let value = this.state.value || this.props.value || {};

				// <p>Modified By</p>
				// <Input value={value.modifiedBy} disabled={!this.state.updateMode}
				// 		onChange={super.onChange.bind(this)} />
				//
				// <p>Modified Date</p>
				// <Input value={value.modifiedDate} disabled={!this.state.updateMode}
				// 		onChange={super.onChange.bind(this)} />

				let viewingActions = <div>
						<Button onClick={() => super.onAdd()}>Add</Button>
						<Button onClick={() => super.onEdit()}>Edit</Button>
						<Button onClick={() => this.onDelete()}>Delete</Button>
				</div>;

				let editingActions = <div>
						<Button onClick={() => this.onSave()}>Save</Button>
						<Button onClick={() => super.onCancel()}>Cancel</Button>
				</div>;

		    return <div>
						<p>Name</p>
						<Input ref="initial" autofocus="true"
								name="name" value={value.name} disabled={!this.state.updateMode}
								onChange={this.onChange.bind(this)} /> <br/>

						<p>Address</p>
						<Input name="address" value={value.address} disabled={!this.state.updateMode}
								onChange={this.onChange.bind(this)} />

						<p>Contact</p>
						<Input name="contact" value={value.contact} disabled={!this.state.updateMode}
								onChange={this.onChange.bind(this)} />

						<p>Tin</p>
						<Input name="tin" value={value.tin} disabled={!this.state.updateMode}
								onChange={this.onChange.bind(this)} />

						<br/><br/>
						{this.state.updateMode ? editingActions : viewingActions}
		    </div>
		}
}

export default Agents;
