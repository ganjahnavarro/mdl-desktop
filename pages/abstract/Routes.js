import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../App'
import Dashboard from '../Dashboard'
import Login from '../Login'

import Units from '../Units'
import Brand from '../Brand'
import Agents from '../Agents'
import Customers from '../Customers'
import Categories from '../Categories'
import Suppliers from '../Suppliers'
import Stocks from '../Stocks'

import PurchaseOrders from '../PurchaseOrders'
import SalesOrders from '../SalesOrders'
import CounterReceipt from '../CounterReceipt'

import Transactions from '../reports/Transactions'
import StockMovement from '../reports/StockMovement'
import StockMonitoring from '../reports/StockMonitoring'
import PurchaseMonitoring from '../reports/PurchaseMonitoring'
import SalesMonitoring from '../reports/SalesMonitoring'

import Todo from '../Todo'

function requireAuth(nextState, replaceState) {
    /*
        if not logged on, call replaceState("/login");
    */
}

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Login}/>

        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/login" component={Login} />

        <Route path="/units" component={Units} onEnter={requireAuth}/>
        <Route path="/brands" component={Brand} onEnter={requireAuth}/>
        <Route path="/agents" component={Agents} onEnter={requireAuth}/>
        <Route path="/customers" component={Customers} onEnter={requireAuth}/>
        <Route path="/categories" component={Categories} onEnter={requireAuth}/>
        <Route path="/suppliers" component={Suppliers} onEnter={requireAuth}/>
        <Route path="/stocks" component={Stocks} onEnter={requireAuth}/>

        <Route path="/purchaseOrders" component={PurchaseOrders} onEnter={requireAuth}/>
        <Route path="/salesOrders" component={SalesOrders} onEnter={requireAuth}/>
        <Route path="/counterReceipts" component={CounterReceipt} onEnter={requireAuth}/>

        <Route path="/transactions" component={Transactions} onEnter={requireAuth}/>
        <Route path="/stockMovement" component={StockMovement} onEnter={requireAuth}/>
        <Route path="/stockMonitoring" component={StockMonitoring} onEnter={requireAuth}/>
        <Route path="/purchaseMonitoring" component={PurchaseMonitoring} onEnter={requireAuth}/>
        <Route path="/salesMonitoring" component={SalesMonitoring} onEnter={requireAuth}/>

        <Route path="/todo" component={Todo} onEnter={requireAuth}/>
    </Route>

)
