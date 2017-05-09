import React from 'react'
import View from './abstract/View'
import { Link } from 'react-router'

import Header from '../components/header'

class Dashboard extends View {

		renderItem(item, index) {
				let colors = ["red", "orange", "yellow", "olive", "green", "teal",
						"blue", "violet", "purple", "pink"];

				return <div key={item.label} className={"ui card " + colors[index]}>
						<div className="image">
								<Link to={item.link}>
										<img src={"resources/images/" + item.icon + ".png"} />
								</Link>
						</div>

						<Link to={item.link} className="content">
								<span className="header">{item.label}</span>
						</Link>
				</div>
		}

		render() {
				let files = [
						{link: "/units", label: "Units", icon: "icon_units"},
						{link: "/categories", label: "Categories", icon: "icon_categories"},
						{link: "/stocks", label: "Stocks", icon: "icon_stocks"},
						{link: "/agents", label: "Agents", icon: "icon_agents"},
						{link: "/suppliers", label: "Suppliers", icon: "icon_suppliers"},
						{link: "/customers", label: "Customers", icon: "icon_customers"}
				];

				let transactions = [
						{link: "/purchaseOrders", label: "Purchase Orders", icon: "icon_purchase_orders"},
						{link: "/salesOrders", label: "Sales Orders", icon: "icon_sales_orders"}
				];

				let filesComponents = files.map((item, index) => this.renderItem(item, index));
				let transactionsComponents = transactions.map((item, index) => this.renderItem(item, index));

				return <div>
						<Header />
						<div className="dashboard">
								<div className="group">
										<div className="ui large label teal">Files</div> <br/>
										<div className="ui link six cards">
												{filesComponents}
										</div>
								</div>

								<div className="group">
										<div className="ui large label blue">Transactions</div>
										<div className="ui link four cards">
												{transactionsComponents}
										</div>
								</div>
						</div>
				</div>
		}
}

export default Dashboard;
