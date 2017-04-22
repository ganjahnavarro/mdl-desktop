import React from 'react'

class Input extends React.Component {

		focus() {
				this.selectedInput.focus();
		}

		render() {
				let props = Object.assign({}, this.props);
				if (typeof props.defaultValue == "undefined") {
						props.value = props.value || "";
				}

				delete props.label;

		    return <div>
						<p>{this.props.label}</p>
						<input ref={(input) => {this.selectedInput = input}}
								{...props} />
				</div>
		}

}

export default Input;
