import React from 'react'
import Select from 'react-select';

class Dropdown extends React.Component {

		render() {
				/*
					https://github.com/JedWatson/react-select#further-options
				*/

        let props = Object.assign({}, this.props);
				props.clearable = false;
				props.matchPos = "start"
				props.inputProps = {type: "react-type"};
        delete props.label;

				let label = this.props.label;
				let asyncSelect = typeof this.props.loadOptions != "undefined";
				let selectComponent = asyncSelect ? <Select.Async {...props} /> : <Select {...props} />;

				return <div className="field">
            {label ? <label>{label}</label> : null}
						{selectComponent}
        </div>
		}

}

export default Dropdown;
