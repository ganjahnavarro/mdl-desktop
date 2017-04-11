import React from 'react'
import Input from './input'

class Audit extends React.Component {

		render() {
        let modifiedDate = new Date(this.props.value.modifiedDate);

        let auditComponent = <div>
            <br/>
            <p>Modified By {this.props.value.modifiedBy}</p>
    				<p>Modified Date {modifiedDate.toLocaleString()}</p>
				</div>;

		    return this.props.value.modifiedBy ? auditComponent : null;
		}

}

export default Audit;
