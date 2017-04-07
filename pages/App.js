import React from 'react'
import Store from 'store'
import View from './abstract/View'

class App extends View {

    constructor(props) {
        Store.set("username", "admin");
        Store.set("password", 1234);
        
        super(props);
    }

    render() {
        return <div>
            {this.props.children}
        </div>;
    }

}

export default App;
