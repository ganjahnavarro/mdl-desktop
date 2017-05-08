import React from 'react'
import ReactDOM from 'react-dom'

class Input extends React.Component {

		constructor(props) {
				super(props);
				this.value = this.props.value;
		}

		focus() {
				this.selectedInput.focus();
		}

		highlight() {
				if (this.selectedInput && this.value) {
						let element = this.selectedInput;
						element.setSelectionRange(0, this.value.toString().length);
				}
		}

		componentWillReceiveProps(nextProps) {
				this.value = nextProps.value;
		}

		render() {
				let label = this.props.label;
				let props = Object.assign({}, this.props);

				if (typeof props.defaultValue == "undefined") {
						props.value = props.value || "";
				}
				delete props.label;

		    return <div className="field">
						{label ? <label>{label}</label> : null}
						<input ref={(input) => {this.selectedInput = input}}
								{...props} />
				</div>
		}

}

export default Input;
