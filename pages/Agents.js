import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'

import Fetch from '../core/fetch'
import Input from '../components/input'
import Button from '../components/button'


class Agents extends ListView {

		constructor(props) {
		    super(props);
		    this.state = {};
		}

		componentDidMount() {
				Fetch.get("agent/", (items) => {
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
						<Input value={this.state.filter} onChange={super.onChange.bind(this)} /> <br/>
						<hr />

						{items}
						<hr />

						<Details value={selectedItem}/>
						<hr />

						<p>Selected Index: {this.state.selectedIndex}</p>

						<Button onClick={() => super.firstItem()}>First</Button>
						<Button onClick={() => super.previousItem()}>Prev</Button>
						<Button onClick={() => super.nextItem()}>Next</Button>
						<Button onClick={() => super.lastItem()}>Last</Button>
		    </div>
		}
}

class Details extends View {

		constructor(props) {
		    super(props);
		    this.state = {};
		}

		render() {
				let value = this.props.value || {};

		    return <div>
						<p>Name</p>
						<Input value={value.name} onChange={super.onChange.bind(this)} /> <br/>

						<p>Address</p>
						<Input value={value.address} onChange={super.onChange.bind(this)} />

						<p>Contact</p>
						<Input value={value.contact} onChange={super.onChange.bind(this)} />

						<p>Tin</p>
						<Input value={value.tin} onChange={super.onChange.bind(this)} />

						<p>Modified By</p>
						<Input value={value.modifiedBy} onChange={super.onChange.bind(this)} />

						<p>Modified Date</p>
						<Input value={value.modifiedDate} onChange={super.onChange.bind(this)} />
		    </div>
		}
}

export default Agents;
