import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../App'
import Home from '../Home'
import Units from '../Units'
import Agents from '../Agents'
import Customers from '../Customers'
import Categories from '../Categories'
import Suppliers from '../Suppliers'
import Stocks from '../Stocks'

import PurchaseOrders from '../PurchaseOrders'

import Test from '../Test'

function requireAuth(nextState, replaceState) {
    /*
        if not logged on, call replaceState("/login");
    */
}

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/units" component={Units} onEnter={requireAuth}/>
        <Route path="/agents" component={Agents} onEnter={requireAuth}/>
        <Route path="/customers" component={Customers} onEnter={requireAuth}/>
        <Route path="/categories" component={Categories} onEnter={requireAuth}/>
        <Route path="/suppliers" component={Suppliers} onEnter={requireAuth}/>
        <Route path="/stocks" component={Stocks} onEnter={requireAuth}/>

        <Route path="/purchaseOrders" component={PurchaseOrders} onEnter={requireAuth}/>
        <Route path="/test" component={Test} />
    </Route>

)
