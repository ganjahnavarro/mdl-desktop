import React from 'react'
import View from './View'

import Fetch from '../../core/fetch'
import Provider from '../../core/provider'
import Alert from '../../core/alert'

import Button from '../../components/button'
import Header from '../../components/header'

class TransactionView extends View {

    constructor(props) {
        super(props);
        this.state.totalAmount = 0;
        this.state.pageOffset = 0;
        this.state.transaction = null;
    }

    componentDidMount() {
        this.onFetch();
    }

    onSave() {
        let invalidRowIndexes = this.transactionItemsTable.revalidateAndGetInvalidRowIndexes();

        if (invalidRowIndexes.length == 0) {
            this.state.updateMode == "CREATE" ? this.onCreate() :  this.onUpdate();
        } else {
            Alert.error("Please correct invalid items before saving");
        }
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
        this.setState({
            transaction: this.state.previousTransaction,
            updateMode: null
        });
    }

    onAdd() {
        console.log("Adding..");
        let transaction = {};
        let items = [{}];

        this.setState({
            totalAmount: 0,
            updateMode: "CREATE",
            transaction,
            items
        }, () => this.firstInput.focus());
    }

    onEdit() {
        console.log("Editing..");

        let { transaction, items } = this.state;
        this.updateTotalAmount(items);

        this.setState({
            updateMode: "UPDATE",
            transaction
        }, () => this.firstInput.focus());
    }

    onDelete() {
        console.log("Deleting..");
        Fetch.delete(this.endpoint, this.state.transaction.id, () => this.onFetch());
    }

    onFetch(direction = "next") {
        let parameters = {};
        if (this.state.transaction) {
            parameters.documentNo = this.state.transaction.documentNo;
        }

        Fetch.get(this.endpoint + direction, parameters, (transaction) => {
            let items = null;
            if (transaction) {
                items = transaction.items;
                items.push({});
            }

            this.setState({
                items,
                transaction,
                previousTransaction: transaction
            });

            this.updateTotalAmount(items);
        });
    }

    checkTableTab(event) {
        if (event.keyCode == 9 && !event.shiftKey) {
            event.preventDefault();
            this.transactionItemsTable.selectFirstCell();
        }
    }

    updateTotalAmount(rows) {
        let totalAmount = 0;
        if (rows) {
            totalAmount = rows.reduce((accumulated, value) => {
                const gross = value.price && value.quantity ? parseFloat(value.price) * parseFloat(value.quantity) : 0;
                let net = gross;

                if (value.discount1 && !isNaN(value.discount1)) {
                    net = net - (net * (parseFloat(value.discount1) / 100));
                }

                if (value.discount2 && !isNaN(value.discount2)) {
                    net = net - (net * (parseFloat(value.discount2) / 100));
                }

                if (value.discount3 && !isNaN(value.discount3)) {
                    net = net - (net * (parseFloat(value.discount3) / 100));
                }
                return accumulated + net;
            }, 0);
        }
        this.setState({totalAmount});
    }

    onPrevious() {
        this.onFetch("previous");
    }

    onNext() {
        this.onFetch("next");
    }

    renderPlaceholder() {
        return <p>No result</p>;
    }

    getStocks(input, callback) {
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
    }

    getActions() {
        let { transaction, updateMode } = this.state;
        let actionButtons = null;

        if (updateMode) {
            actionButtons = <div>
                <Button className="ui green button" icon="save" onClick={() => this.onSave()}>Save</Button>
                <Button className="ui button" icon="ban" onClick={() => this.onCancel()}>Cancel</Button>
            </div>;
        } else {
            actionButtons = <div>
                {transaction ? <Button className="ui button basic teal" icon="angle left" onClick={() => this.onPrevious()}>Previous</Button> : null}
                {transaction ? <Button className="ui button basic teal" icon="angle right" onClick={() => this.onNext()}>Next</Button> : null}

                <Button className="ui green button" icon="add" onClick={() => this.onAdd()}>Add</Button>
                {transaction ? <Button className="ui blue button" icon="write" onClick={() => this.onEdit()}>Edit</Button> : null}
                {transaction ? <Button className="ui button" icon="trash" onClick={() => this.onDelete()}>Delete</Button> : null}
            </div>
        }
        return <div className="actions">{actionButtons}</div>;
    }

    render() {
        let { transaction, updateMode } = this.state;

        return <div>
						<Header />
            {this.state.transaction ? this.renderTransaction() : this.renderPlaceholder()}
            {this.getActions()}
        </div>;
    }

}

export default TransactionView;
