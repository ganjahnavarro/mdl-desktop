import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/input'
import Audit from '../components/Audit'


class Units extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "unit/";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

		    return <div>
						<p>At units. <Link to="/">Go to home</Link></p>
						<hr />

						<p>Search</p>
						<Input value={this.state.filter} onChange={this.onFilter.bind(this)} /> <br/>
						<hr />

						{items}
						<hr />

						<Unit value={selectedItem} onFetch={this.onFetch}/>
		    </div>
		}
}

class Unit extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "unit/";
    }

		render() {
				let value = this.state.value;

		    return <div>
						<Input ref="initial" autoFocus="true" label="Name"
								name="name" value={this.state.value.name} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

						<Input name="pluralName" label="Plural Name" value={this.state.value.pluralName} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <Audit value={value} />
						{super.getActions()}
		    </div>
		}
}

export default Units;
