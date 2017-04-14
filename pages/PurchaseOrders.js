import React from 'react';
import { Link } from 'react-router';

import Provider from '../core/provider'
import Fetch from '../core/fetch'

import Datatable from '../components/datatable'

import View from './abstract/View'

class PurchaseOrders extends View {

    constructor(props) {
        super(props);

        this.state.columns = [
            {
                key: 'id',
                name: 'ID',
                editable: false
            }, {
                key: 'name',
                name: 'Name',
                editable: true
            }, {
                key: 'agent',
                name: 'Agent',
                editable: true,
                test: true
            }
        ];
    }

    componentDidMount() {
        let parameters = {
            orderedBy: "name",
            pageSize: 10
        };

        Fetch.get("customer/", parameters, (customers) => {
            this.setState({customers});
        });

        Provider.loadAgents((agents) => this.setState({agents}));
    }

    render() {
        return <div>
            <p>At purchase orders. <Link to="/">Go to home</Link></p>
            <hr />

            <Datatable
                columns={this.state.columns}
                rows={this.state.customers}
                disabled={false}
                testList={this.state.agents} />

            <button>Save</button>
            <button>Cancel</button>
        </div>;
    }

}

export default PurchaseOrders;
