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

class SalesOrders extends TransactionView {

    constructor(props) {
        super(props);
        this.endpoint = "salesOrder/";
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
                getDefaultValue: (row) => row && row.stock ? stock.cost : null
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
                    getDefaultValue: 5
                };
            }

            if (transaction.discount1) {
                columns.push(createDiscountColumn("discount1", "D1"));
            }

            if (transaction.discount2) {
                columns.push(createDiscountColumn("discount2", "D2"));
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
                    return net;
                }
                return null;
            }
        });

        return columns;
    }

    componentDidMount() {
        super.componentDidMount();
        Provider.loadCustomers((customers) => this.setState({customers}));
        Provider.loadAgents((agents) => this.setState({agents}));
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
            return item;
        });

        return transaction;
		}

    onCustomerChange(customer) {
        let { customers, transaction } = this.state;

        transaction = transaction || {};
		    transaction.customer = {id: customer.value};

        debugger;
        if (customers) {
            let customerObject = customers.find((customer) => customer.id == customer.value);
            if (customerObject && customerObject.agent && !transaction.agent) {
                transaction.agent = customerObject.agent;
            }
        }

		    this.setState({transaction});
		}

    onAgentChange(agent) {
		    let transaction = this.state.transaction || {};
		    transaction.agent = {id: agent.value};
		    this.setState({transaction});
		}

    onDiscountChange(event, field) {
        let nextState = this.state;
        _.set(nextState, event.target.name, event.target.value);

        nextState.transaction.items = nextState.transaction.items.filter((item) => {
              if (!Utils.isEmpty(item)) {
                  item[field] = event.target.value;
              }
              return item;
        });

        this.setState(nextState);
    }

    renderTransaction() {
        let { transaction, customers, agents, totalAmount, items, updateMode } = this.state;

        let customer = transaction.customer;
        let customerId = customer ? customer.id : null;

        let agent = transaction.agent;
        let agentId = agent ? agent.id : null;

        let customerItems = [];
        if (customers) {
            customerItems = customers.map((customer) => {
                return {value: customer.id, label: customer.name};
            });
        }

        let agentItems = [];
        if (agents) {
            agentItems = agents.map((agent) => {
                return {value: agent.id, label: agent.name};
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
                <Dropdown name="customer" label="Customer" value={customerId} disabled={!updateMode}
                    options={customerItems} onChange={(value) => this.onCustomerChange(value)}
                    fieldClassName="six" />

                <Dropdown name="agent" label="Agent" value={agentId} disabled={!updateMode}
                    options={agentItems} onChange={(value) => this.onAgentChange(value)}
                    fieldClassName="six" />

                <Input name="totalAmount" label="Total Amount"
                    value={Formatter.formatAmount(totalAmount)} disabled={true}
                    fieldClassName="four" />
            </div>

            <div className="fields">
                <Textarea ref={(input) => {this.lastInput = input}}
                    name="transaction.remarks" label="Remarks" value={transaction.remarks} disabled={!updateMode}
                    onChange={super.onChange.bind(this)} onKeyDown={this.checkTableTab.bind(this)}
                    fieldClassName="eight" />

                <Input name="transaction.discount1" maxLength={2}
                    label="Discount 1" value={transaction.discount1} disabled={!updateMode}
                    onChange={(event) => this.onDiscountChange(event, "discount1")} fieldClassName="four" />

                <Input name="transaction.discount2" maxLength={2}
                    label="Discount 2" value={transaction.discount2} disabled={!updateMode || !transaction.discount1}
                    onChange={(event) => this.onDiscountChange(event, "discount2")} fieldClassName="four" />
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

export default SalesOrders;
