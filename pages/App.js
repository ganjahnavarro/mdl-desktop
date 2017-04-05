import React from 'react'
import View from './abstract/View'

class App extends View {

    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            {this.props.children}
        </div>;
    }

}

export default App;
