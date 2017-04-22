import React from 'react';
import { Link } from 'react-router';

import Provider from '../core/provider'
import Fetch from '../core/fetch'

import Input from '../components/input'
import Dropdown from '../components/dropdown'
import Datatable from '../components/datatable'

import View from './abstract/View'

class PurchaseOrders extends View {

    constructor(props) {
        super(props);
        this.state.pageOffset = 0;
        this.state.purchaseOrder = {};

        this.state.updateMode = "UPDATE";

        let getStocks = (input, callback) => {

            let parameters = {
                filter: input,
    						orderedBy: "name",
    						pageSize: 5
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

        this.state.columns = [{
                key: 'stock',
                name: 'Stock',
                editable: true,
                getOptions: getStocks,
            }, {
                key: 'stock.description',
                name: 'Description'
            }, {
                key: 'stock.unit.name',
                name: 'Unit'
            }, {
                key: 'quantity',
                name: 'Qty',
                editable: true
            }, {
                key: 'price',
                name: 'Price',
                editable: true
            } , {
                key: 'amount',
                name: 'Amount',
                formula: (item) => item.price * item.quantity
            }
        ];

        this.state.footers = [{
                value: "Sum",
                colSpan: 5
            }, {
                formula: (items) => items.reduce((accumulated, value) => accumulated + (value.price * value.quantity), 0)
            }
        ];
    }

    componentDidMount() {
        let parameters = {
            orderedBy: "documentNo",
            pageOffset: this.state.pageOffset
        };

        Fetch.get("purchaseOrder/view", parameters, (purchaseOrder) => {
            console.log("On load purchase order", purchaseOrder);
            this.setState({purchaseOrder});
        });

        Provider.loadSuppliers((suppliers) => this.setState({suppliers}));
    }

    onSupplierChange(supplier) {
		    let nextState = this.state.value || {};
		    nextState.supplier = {id: supplier.value};
		    this.setState(nextState);
		}

    render() {
        let { purchaseOrder } = this.state;
        let supplier = purchaseOrder.supplier;
        let supplierId = supplier ? supplier.id : null;

				let suppliers = [];
        if (this.state.suppliers) {
						suppliers = this.state.suppliers.map((supplier) => {
								return {value: supplier.id, label: supplier.name};
						});
        }

        return <div>
            <p>At purchase orders. <Link to="/">Go to home</Link></p>
            <hr />

            <Input name="documentNo" label="Document No." value={purchaseOrder.documentNo} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <Dropdown name="supplier" label="Supplier" value={supplierId} disabled={!this.state.updateMode}
                options={suppliers} onChange={this.onSupplierChange.bind(this)} />

            <Input name="remarks" label="Remarks" value={purchaseOrder.remarks} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <br/><br/>

            <Datatable
                columns={this.state.columns}
                rows={purchaseOrder.items}
                footers={this.state.footers}
                disabled={!this.state.updateMode} />

            <button>Save</button>
            <button>Cancel</button>
        </div>;
    }

}

export default PurchaseOrders;
