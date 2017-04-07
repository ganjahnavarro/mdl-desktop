import React from 'react'

class Input extends React.Component {

		focus() {
				this.refs.self.focus();
		}

		render() {
		    return <input ref="self" {...this.props} />
		}

}

export default Input;
