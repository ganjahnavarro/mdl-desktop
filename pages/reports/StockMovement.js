import React from 'react'
import { hashHistory } from 'react-router'

import View from '../abstract/View'

import Fetch from '../../core/fetch'
import Provider from '../../core/provider'
import Utils from '../../core/utils'

import Header from '../../components/header'
import Dropdown from '../../components/dropdown'
import Button from '../../components/button'
import Input from '../../components/input'

class StockMovement extends View {

		onStockChange(selected) {
				const stock = { id: selected.value };
				this.setState({ stock });
		}

		render() {
				const { startDate, endDate, stock } = this.state;
				let stockId = stock ? stock.id : null;

				const getStocks = (input, callback) => {
						let parameters = {
								filter: input,
								orderedBy: "name",
								pageSize: 10
						};

						Fetch.get("stock/", parameters, (items) => {
								Provider.filteredItems.stock = items;

								if (items) {
										let filteredStocks = items.map((item) => {
												return {value: item.id, label: item.name}
										});
										callback(null, { options: filteredStocks, cache: false });
								}
						});
				};

				return (<div>
						<Header />

						<div className="ui form report-panel">
								<h1 className="ui header">Stock Movement</h1>
								<br />

								<div className="fields">
										<Input name="startDate" placeholder="MM/dd/yyyy"
												label="Start Date" value={startDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />

										<Input name="endDate" placeholder="MM/dd/yyyy"
												label="End Date" value={endDate} onChange={super.onChange.bind(this)} fieldClassName="eight" />
								</div>

								<div className="fields">
                    <Dropdown name="stock" label="Stock" value={stockId}
												loadOptions={getStocks} onChange={(value) => this.onStockChange(value)}
                        fieldClassName="sixteen" />;
								</div>

								<br />
								<Button className="ui green button" icon="print">Print</Button>
						</div>
				</div>);
		}
}

export default StockMovement;
