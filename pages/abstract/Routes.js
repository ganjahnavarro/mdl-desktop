import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../App'
import Home from '../Home'
import Agents from '../Agents'

function requireAuth(nextState, replaceState) {
    /*
        if not logged on, call replaceState("/login");
    */
}

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/agents" component={Agents} onEnter={requireAuth}/>
    </Route>
)
