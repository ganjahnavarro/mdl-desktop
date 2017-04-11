import React from 'react'
import View from './View'

import Fetch from '../../core/fetch'
import Button from '../../components/button'

class Detail extends View {

    constructor(props) {
        super(props);
        this.state = {value: this.props.value || {}};
    }

    componentWillReceiveProps(nextProps) {
				this.setState({value:  Object.assign({}, nextProps.value)});
		}

    onDelete() {
				console.log("on delete id: " + this.props.value.id);
				let self = this;
				Fetch.delete(this.endpoint, this.props.value.id, () => this.props.onFetch());
		}

		onSave() {
				console.log("Saving", "Update Mode:", this.state.updateMode);
				this.state.updateMode == "CREATE" ? this.onCreate() :  this.onUpdate();
		}

		onCreate() {
				console.log("creating..");

				Fetch.post(this.endpoint, this.getRequestValue(), () => {
						this.setState({updateMode : null});
						this.props.onFetch();
				});
		}

		onUpdate() {
        console.log("updating..");
				Fetch.patch(this.endpoint, this.getRequestValue(), () => {
						this.setState({updateMode : null});
						this.props.onFetch();
				});
		}

		onChange(event) {
		    let nextState = this.state.value || {};
		    nextState[event.target.name] = event.target.value;
		    this.setState(nextState);
		}

    onAdd() {
        this.setState({
            updateMode: "CREATE",
            value: {}
        }, function() {
            this.refs.initial.focus();
        });
    }

    onCancel() {
        this.setState({
            updateMode: null
        });
    }

    onEdit() {
        this.setState({
            updateMode: "EDIT",
        }, function() {
            this.refs.initial.focus();
        });
    }

    getActions() {
        let viewingActions = <div>
            <Button onClick={() => this.onAdd()}>Add</Button>
            <Button onClick={() => this.onEdit()}>Edit</Button>
            <Button onClick={() => this.onDelete()}>Delete</Button>
        </div>;

        let editingActions = <div>
            <Button onClick={() => this.onSave()}>Save</Button>
            <Button onClick={() => this.onCancel()}>Cancel</Button>
        </div>;

        return <div>
            <br/>
            {this.state.updateMode ? editingActions : viewingActions}
        </div>;
    }

    getRequestValue() {
        return this.state.value;
		}

}

export default Detail;
