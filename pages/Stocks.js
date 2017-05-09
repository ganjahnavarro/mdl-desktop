import React from 'react'
import { Link } from 'react-router'

import View from './abstract/View'
import ListView from './abstract/ListView'
import DetailView from './abstract/DetailView'

import Provider from '../core/provider'

import Input from '../components/input'
import Audit from '../components/Audit'
import Header from '../components/header'
import Textarea from '../components/textarea'
import Dropdown from '../components/dropdown'


class Stocks extends ListView {

		constructor(props) {
		    super(props);
				this.endpoint = "stock/";
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
										<Stock value={selectedItem} onFetch={this.onFetch}/>
								</div>
						</div>
				</div>;
		}
}

class Stock extends DetailView {

		constructor(props) {
		    super(props);
				this.endpoint = "stock/";
    }

    componentDidMount() {
        Provider.loadCategories((categories) => this.setState({categories}));
				Provider.loadUnits((units) => this.setState({units}));
    }

		onUnitChange(unit) {
		    let nextState = this.state.value || {};
		    nextState.unit = {id: unit.value};
		    this.setState(nextState);
		}

		onCategoryChange(category) {
		    let nextState = this.state.value || {};
		    nextState.category = {id: category.value};
		    this.setState(nextState);
		}

		render() {
				let value = this.state.value;
        let unitId = value && value.unit ? value.unit.id : null;
				let categoryId = value && value.category ? value.category.id : null;

				let units = [];
				if (this.state.units) {
						units = this.state.units.map((unit, index) => {
								return {value: unit.id, label: unit.name};
						});
        }

				let categories = [];
				if (this.state.categories) {
						categories = this.state.categories.map((category, index) => {
								return {value: category.id, label: category.name};
						});
        }

				return <div>
						<div className="ui form">
								<Input ref={(input) => {this.initialInput = input}} autoFocus="true" label="Name"
										name="name" value={value.name} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<Textarea name="description" label="Description" value={value.description} disabled={!this.state.updateMode}
										onChange={super.onChange.bind(this)} />

								<div className="fields">
										<Input name="cost" label="Cost" value={value.cost} disabled={!this.state.updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="six" />

										<Input name="price" label="Price" value={value.price} disabled={!this.state.updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="six" />

										<Input name="onHand" label="Quantity on Hand" value={value.onHand} disabled={!this.state.updateMode}
												onChange={super.onChange.bind(this)}
												fieldClassName="four" />
								</div>

								<div className="fields">
										<Dropdown name="category" label="Category" value={categoryId} disabled={!this.state.updateMode}
												options={categories} onChange={this.onCategoryChange.bind(this)}
												fieldClassName="thirteen" />

										<Dropdown name="unit" label="Unit" value={unitId} disabled={!this.state.updateMode}
												options={units} onChange={this.onUnitChange.bind(this)}
												fieldClassName="three" />
								</div>
						</div>

						<div>
								<Audit value={value} />
								{super.getActions()}
						</div>
		    </div>
		}
}

export default Stocks;
