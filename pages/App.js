import React from 'react'
import Store from 'store'

import View from './abstract/View'

class App extends View {

    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <div className="ui container">
                {this.props.children}
            </div>

            <div id="loadingPanel" className="ui dimmer">
					    	<div className="ui text loader">Loading</div>
					  </div>
        </div>;
    }

}

export default App;
