import React from 'react'
import Store from 'store'

import View from './abstract/View'

class App extends View {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="ui container app">
            {this.props.children}
        </div>;
    }

}

export default App;
