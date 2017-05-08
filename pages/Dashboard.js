import React from 'react'
import View from './abstract/View'
import { Link } from 'react-router'

import Header from '../components/header'

class Dashboard extends View {

		renderItem(link, label) {
				return <Link key={label} to={link} className="card">
						<p>{label}</p>
				</Link>
		}

		render() {
				let files = [
						{link: "/units", label: "Units"},
						{link: "/categories", label: "Categories"},
						{link: "/stocks", label: "Stocks"},
						{link: "/agents", label: "Agents"},
						{link: "/suppliers", label: "Suppliers"},
						{link: "/customers", label: "Customers"}
				];

				let transactions = [
						{link: "/purchaseOrders", label: "Purchase Orders"},
						{link: "/salesOrders", label: "Sales Orders"}
				];

				let filesComponents = files.map((item) => this.renderItem(item.link, item.label));
				let transactionsComponents = transactions.map((item) => this.renderItem(item.link, item.label));

		    return <div>
						<Header />
						<div className="dashboard">
								<div className="group">
										<div className="ui medium header blue">Files</div>
										<div className="ui four cards">
												{filesComponents}
										</div>
								</div>

								<div className="group">
										<div className="ui medium header blue">Transactions</div>
										<div className="ui four cards">
												{transactionsComponents}
										</div>
								</div>
						</div>
		    </div>;
		}
}

export default Dashboard;
