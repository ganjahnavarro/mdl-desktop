import React from 'react'
import View from './abstract/View'
import { Link } from 'react-router'

class Home extends View {

		render() {
		    return <div>
						<p>At home</p>
						<p><Link to="/units"> -> units</Link></p>
						<p><Link to="/categories"> -> categories</Link></p>
						<p><Link to="/stocks"> -> stocks</Link></p>
            <p><Link to="/agents"> -> agents</Link></p>
						<p><Link to="/suppliers"> -> suppliers</Link></p>
						<p><Link to="/customers"> -> customers</Link></p>
						<br/>

						<p><Link to="/purchaseOrders"> -> purchase orders</Link></p>
		    </div>
		}
}

export default Home;
