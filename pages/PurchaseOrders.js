import React from 'react';
import { Link } from 'react-router';

import Provider from '../core/provider'
import Fetch from '../core/fetch'

import Datatable from '../components/datatable'

import View from './abstract/View'

class PurchaseOrders extends View {

    constructor(props) {
        super(props);

        let getOptions = function(input, callback) {
            setTimeout(function() {
                callback(null, {
                    options: [{
                        value: 110,
                        label: "Gan"
                    }, {
                        value: 220,
                        label: "Aubs"
                    }, {
                        value: 330,
                        label: "Dex"
                    }],

                    cache: false
                });
            }, 250);
        };

        this.state.columns = [{
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
                getOptions: getOptions
            }, {
                key: 'agent.description',
                name: 'Description'
            }, {
                key: 'agent.unit',
                name: 'Unit'
            }, {
                key: 'amount',
                name: 'Amount',
                editable: true
            }
        ];

        this.state.customers = [{
                id: 1,
                name: 'Ganjah',
                agent: {
                    id: 110,
                    name: 'Gan',
                    description: 'Ganj description',
                    unit: 'm'
                },
                amount: 100
            }, {
                id: 2,
                name: 'Aubrey',
                agent: {
                    id: 220,
                    name: 'Aubs',
                    description: 'Aubs description',
                    unit: 'km'
                },
                amount: 120
            }, {
                id: 3,
                name: 'Dexter',
                agent: {
                    id: 330,
                    name: 'Dex',
                    description: 'Xc description',
                    unit: 'cm'
                },
                amount: 100
            }
        ];
    }

    componentDidMount() {
        let parameters = {
            orderedBy: "name",
            pageSize: 10
        };

        // Fetch.get("customer/", parameters, (customers) => {
        //     this.setState({customers});
        // });
        //
        // Provider.loadAgents((agents) => this.setState({agents}));
    }

    render() {
        return <div>
            <p>At purchase orders. <Link to="/">Go to home</Link></p>
            <hr />

            <Datatable
                columns={this.state.columns}
                rows={this.state.customers}
                disabled={false} />

            <button>Save</button>
            <button>Cancel</button>
        </div>;
    }

}

export default PurchaseOrders;
