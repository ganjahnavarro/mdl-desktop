import React from 'react'
import Select from 'react-select';

class Dropdown extends React.Component {

		render() {
        let props = Object.assign({}, this.props);
        delete props.label;

        return <div>
            <p>{this.props.label}</p>
						<Select {...props} />
        </div>
		}

}

export default Dropdown;
