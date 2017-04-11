import React from 'react'

class Input extends React.Component {

		focus() {
				this.refs.self.focus();
		}

		render() {
				let props = Object.assign({}, this.props);
				delete props.label;

		    return <div>
						<p>{this.props.label}</p>
						<input ref="self" {...props} />
				</div>
		}

}

export default Input;
