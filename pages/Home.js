import React from 'react'
import View from './abstract/View'
import { Link } from 'react-router'

class Home extends View {

		constructor(props) {
		    super(props);
		    this.state = {};
		}

		componentDidMount() {

		}

		componentDidUpdate() {

		}

		render() {
		    return <div>
						<p>At home</p>
            <Link to="/agents">Go to agents</Link>
		    </div>
		}
}

export default Home;
