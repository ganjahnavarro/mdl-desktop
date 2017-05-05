import React from 'react';
import { Link } from 'react-router';

import Provider from '../core/provider'
import Formatter from '../core/formatter'
import Fetch from '../core/fetch'
import Alert from '../core/alert'

import Input from '../components/input'
import Button from '../components/button'
import Dropdown from '../components/dropdown'
import Datatable from '../components/datatable'

import View from './abstract/View'

class PurchaseOrders extends View {

    constructor(props) {
        super(props);
        this.endpoint = "purchaseOrder/";

        this.state.totalAmount = 0;
        this.state.pageOffset = 0;
        this.state.purchaseOrder = {};

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
                key: "stock",
                name: "Stock",
                editable: true,
                required: true,
                getOptions: getStocks,
            }, {
                key: "stock.description",
                name: "Description"
            }, {
                key: "stock.unit.name",
                name: "Unit"
            }, {
                key: "quantity",
                name: "Qty",
                editable: true,
                required: true,
                type: "number",
                getDefaultValue: 1
            }, {
                key: "price",
                name: "Price",
                editable: true,
                required: true,
                type: "amount",
                getDefaultValue: (stock) => stock.cost
            } , {
                key: "amount",
                name: "Amount",
                formula: (item) => {
                    if (item.price && item.quantity && !isNaN(item.price) && !isNaN(item.quantity)) {
                        return parseFloat(item.price) * parseFloat(item.quantity);
                    }
                    return null;
                }
            }
        ];
    }

    componentDidMount() {
        this.onFetch();
        Provider.loadSuppliers((suppliers) => this.setState({suppliers}));
    }

    onSupplierChange(supplier) {
		    let purchaseOrder = this.state.purchaseOrder || {};
		    purchaseOrder.supplier = {id: supplier.value};
		    this.setState({purchaseOrder});
		}

    onSave() {
        let invalidRowIndexes = this.purchaseOrderItemsTable.revalidateAndGetInvalidRowIndexes();

        if (invalidRowIndexes.length == 0) {
            this.state.updateMode == "CREATE" ? this.onCreate() :  this.onUpdate();
        } else {
            Alert.error("Please correct invalid items before saving");
        }
    }

    getRequestValue() {
        let purchaseOrder = this.state.purchaseOrder;
        purchaseOrder.items = this.purchaseOrderItemsTable.getRows();
        return purchaseOrder;
		}

		onCreate() {
				console.log("Creating..");
				Fetch.post(this.endpoint, this.getRequestValue(), () => {
						this.setState({updateMode : null});
            console.log("Create successful");
				});
		}

		onUpdate() {
        console.log("Updating..");
				Fetch.patch(this.endpoint, this.getRequestValue(), () => {
						this.setState({updateMode : null});
						console.log("Update successful");
				});
		}

    onCancel() {
        console.log("Cancelling..");
        this.setState({updateMode: null});
    }

    onAdd() {
        console.log("Adding..");
        let purchaseOrder = {
            items: []
        };

        this.setState({
            updateMode: "CREATE",
            purchaseOrder
        }, () => this.firstInput.focus());
    }

    onEdit() {
        console.log("Editing..");
        this.setState({updateMode: "UPDATE"});
    }

    onDelete() {
        console.log("Deleting..");
        Fetch.delete(this.endpoint, this.state.purchaseOrder.id, () => this.onFetch());
    }

    onFetch() {
        let parameters = {
            orderedBy: "documentNo",
            pageOffset: this.state.pageOffset
        };

        Fetch.get("purchaseOrder/view", parameters, (purchaseOrder) => {
            this.setState({purchaseOrder});
        });
    }

    checkTableTab(event) {
        if (event.keyCode == 9 && !event.shiftKey) {
            event.preventDefault();
            this.purchaseOrderItemsTable.selectFirstCell();
        }
    }

    updateTotalAmount(rows) {
        if (rows) {
            let totalAmount = rows.reduce((accumulated, value) => {
                let current = value.price && value.quantity ? value.price * value.quantity : 0;
                return accumulated + current;
            }, 0);

            this.setState({totalAmount});
        }
    }

    render() {
        let { purchaseOrder, suppliers, updateMode, totalAmount } = this.state;

        let supplier = purchaseOrder.supplier;
        let supplierId = supplier ? supplier.id : null;

				let supplierItems = [];
        if (suppliers) {
						supplierItems = suppliers.map((supplier) => {
								return {value: supplier.id, label: supplier.name};
						});
        }

        let actionButtons = null;

        if (updateMode) {
            actionButtons = <div>
                <Button onClick={() => this.onSave()}>Save</Button>
                <Button onClick={() => this.onCancel()}>Cancel</Button>
            </div>;
        } else {
            actionButtons = <div>
                <Button onClick={() => this.onAdd()}>Add</Button>
                <Button onClick={() => this.onEdit()}>Edit</Button>
                <Button onClick={() => this.onDelete()}>Delete</Button>
            </div>
        }

        return <div>
            <p>At purchase orders. <Link to="/">Go to home</Link></p>
            <hr />

            <Input ref={(input) => {this.firstInput = input}} autoFocus="true"
                name="purchaseOrder.documentNo"
                label="Document No." value={purchaseOrder.documentNo} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} />

            <Input name="purchaseOrder.date" placeholder="MM/dd/yyyy"
                label="Date" value={purchaseOrder.date} disabled={!this.state.updateMode}
    						onChange={super.onChange.bind(this)} />

            <Dropdown name="supplier" label="Supplier" value={supplierId} disabled={!this.state.updateMode}
                options={supplierItems} onChange={(value) => this.onSupplierChange(value)} />

            <Input ref={(input) => {this.lastInput = input}}
                name="purchaseOrder.remarks" label="Remarks" value={purchaseOrder.remarks} disabled={!this.state.updateMode}
								onChange={super.onChange.bind(this)} onKeyDown={this.checkTableTab.bind(this)} />

            <Input name="totalAmount" label="Total Amount" value={Formatter.formatAmount(totalAmount)} disabled={true} />

            <br/><br/>

            <Datatable
                columns={this.state.columns}
                rows={purchaseOrder.items} footers={this.state.footers}
                disabled={!this.state.updateMode} allowedDelete={true}
                ref={(table) => { this.purchaseOrderItemsTable = table; }}
                onRowsChange={(rows) => this.updateTotalAmount(rows)}
                firstInput={this.firstInput} lastInput={this.lastInput} />

              {actionButtons}
        </div>;
    }

}

export default PurchaseOrders;
