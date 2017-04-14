import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Input from '../components/input'
import Audit from '../components/Audit'


class Categories extends ListView {

		constructor(props) {
		    super(props);
        this.endpoint = "category/";
		}

		render() {
				let items = [];
				let selectedItem = this.state.selectedItem;

				if (this.state.items) {
						items = this.state.items.map(this.renderItem.bind(this));
				}

		    return <div>
						<p>At categories. <Link to="/">Go to home</Link></p>
						<hr />

						<p>Search</p>
						<Input value={this.state.filter} onChange={this.onFilter.bind(this)} /> <br/>
						<hr />

						{items}
						<hr />

						<Category value={selectedItem} onFetch={this.onFetch}/>
		    </div>
		}
}

class Category extends DetailView {

		constructor(props) {
		    super(props);
        this.endpoint = "category/";
    }

		render() {
		    return <div>
						<Input ref="initial" autoFocus="true" label="Name"
								name="name" value={this.state.value.name} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <Audit value={this.state.value} />
						{super.getActions()}
		    </div>
		}
}

export default Categories;
