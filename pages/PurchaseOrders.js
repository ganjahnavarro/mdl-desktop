import _ from 'lodash'
import React from 'react';
import { Link } from 'react-router';

import Utils from '../core/utils'
import Provider from '../core/provider'
import Formatter from '../core/formatter'

import Input from '../components/input'
import Button from '../components/button'
import Dropdown from '../components/dropdown'
import Textarea from '../components/textarea'
import Datatable from '../components/datatable'


import TransactionView from './abstract/TransactionView'

class PurchaseOrders extends TransactionView {

    constructor(props) {
        super(props);
        this.endpoint = "purchaseOrder/";
    }

    getColumns() {
        const { transaction } = this.state;

        let columns = [{
                key: "stock",
                name: "Stock",
                editable: true,
                required: true,
                getOptions: super.getStocks.bind(this),
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
                getDefaultValue: (row) => row && row.stock ? 1 : null
            }, {
                key: "price",
                name: "Price",
                editable: true,
                required: true,
                type: "amount",
                getDefaultValue: (row) => row && row.stock ? row.stock.cost : null
            }
        ];

        if (transaction) {
            let createDiscountColumn = (key, name) => {
                return {
                    key,
                    name,
                    editable: true,
                    required: true,
                    type: "amount",
                    getDefaultValue: (row) => row && row.stock ? row.stock.cost : null
                };
            }

            if (transaction.discount1) {
                columns.push(createDiscountColumn("discount1", "D1"));
            }

            if (transaction.discount2) {
                columns.push(createDiscountColumn("discount2", "D2"));
            }

            if (transaction.discount3) {
                columns.push(createDiscountColumn("discount3", "D3"));
            }
        }

        columns.push({
            key: "amount",
            name: "Amount",
            type: "amount",
            formula: (item) => {
                if (item.price && item.quantity && !isNaN(item.price) && !isNaN(item.quantity)) {
                    const gross = parseFloat(item.price) * parseFloat(item.quantity);
                    let net = gross;

                    if (item.discount1 && !isNaN(item.discount1)) {
                        net = net - (net * (parseFloat(item.discount1) / 100));
                    }

                    if (item.discount2 && !isNaN(item.discount2)) {
                        net = net - (net * (parseFloat(item.discount2) / 100));
                    }

                    if (item.discount3 && !isNaN(item.discount3)) {
                        net = net - (net * (parseFloat(item.discount3) / 100));
                    }
                    return net;
                }
                return null;
            }
        });

        return columns;
    }

    componentDidMount() {
        super.componentDidMount();
        Provider.loadSuppliers((suppliers) => this.setState({suppliers}));
    }

    getRequestValue() {
        let transaction = this.state.transaction;
        transaction.items = this.transactionItemsTable.getRows().map((item) => {
            if (!transaction.discount1) {
                delete item.discount1;
            }

            if (!transaction.discount2) {
                delete item.discount2;
            }

            if (!transaction.discount3) {
                delete item.discount3;
            }
            return item;
        });

        return transaction;
		}

    onSupplierChange(supplier) {
		    let transaction = this.state.transaction || {};
		    transaction.supplier = {id: supplier.value};
		    this.setState({transaction});
		}

    onDiscountChange(event, field) {
        let nextState = this.state;
        _.set(nextState, event.target.name, event.target.value);

        nextState.items = nextState.items.filter((item) => {
              if (!Utils.isEmpty(item)) {
                  item[field] = event.target.value;
              }
              return item;
        });

        this.setState(nextState, () => this.updateTotalAmount(nextState.items));
    }

    renderTransaction() {
        let { transaction, suppliers, totalAmount, items, updateMode } = this.state;

        let supplier = transaction.supplier;
        let supplierId = supplier ? supplier.id : null;

        let supplierItems = [];
        if (suppliers) {
            supplierItems = suppliers.map((supplier) => {
                return {value: supplier.id, label: supplier.name};
            });
        }

        return <div className="ui form">
            <div className="fields">
                <Input ref={(input) => {this.firstInput = input}} autoFocus="true"
                    name="transaction.documentNo"
                    label="Document No." value={transaction.documentNo} disabled={!updateMode}
                    onChange={super.onChange.bind(this)} fieldClassName="eight" />

                <Input name="transaction.date" placeholder="MM/dd/yyyy"
                    label="Date" value={transaction.date} disabled={!updateMode}
                    onChange={super.onChange.bind(this)} fieldClassName="eight" />
            </div>

            <div className="fields">
                <Dropdown name="supplier" label="Supplier" value={supplierId} disabled={!updateMode}
                    options={supplierItems} onChange={(value) => this.onSupplierChange(value)}
                    fieldClassName="seven" />

                <Input name="transaction.discount1" maxLength={2}
                    label="Discount 1" value={transaction.discount1} disabled={!updateMode}
                    onChange={(event) => this.onDiscountChange(event, "discount1")} fieldClassName="three" />

                <Input name="transaction.discount2" maxLength={2}
                    label="Discount 2" value={transaction.discount2} disabled={!updateMode || !transaction.discount1}
                    onChange={(event) => this.onDiscountChange(event, "discount2")} fieldClassName="three" />

                <Input name="transaction.discount3" maxLength={2}
                    label="Discount 3" value={transaction.discount3} disabled={!updateMode || !transaction.discount2}
                    onChange={(event) => this.onDiscountChange(event, "discount3")} fieldClassName="three" />
            </div>

            <div className="fields">
                <Textarea ref={(input) => {this.lastInput = input}}
                    name="transaction.remarks" label="Remarks" value={transaction.remarks} disabled={!updateMode}
                    onChange={super.onChange.bind(this)} onKeyDown={this.checkTableTab.bind(this)}
                    fieldClassName="eight" />
                <Input name="totalAmount" label="Total Amount"
                    value={Formatter.formatAmount(totalAmount)} disabled={true}
                    fieldClassName="eight" />
            </div>
            <br/>

            <Datatable
                columns={this.getColumns()}
                rows={items} footers={this.state.footers}
                disabled={!updateMode} allowedDelete={true}
                ref={(table) => { this.transactionItemsTable = table; }}
                onRowsChange={(rows) => this.updateTotalAmount(rows)}
                firstInput={this.firstInput} lastInput={this.lastInput} />
        </div>;
    }

}

export default PurchaseOrders;
