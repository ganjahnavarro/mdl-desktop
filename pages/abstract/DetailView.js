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
            previousValue: this.state.value,
            value: {}
        }, function() {
            this.initialInput.focus();
        });
    }

    onCancel() {
        this.setState({
            updateMode: null,
            value: this.state.previousValue
        });
    }

    onEdit() {
        this.setState({
            updateMode: "EDIT",
            previousValue: this.state.value
        }, function() {
            this.initialInput.focus();
        });
    }

    getActions() {
        let value = this.state.value;

        let viewingActions = <div>
            <Button className="ui green button" icon="add" onClick={() => this.onAdd()}>Add</Button>
            {value && value.id ? <Button className="ui blue button" icon="write" onClick={() => this.onEdit()}>Edit</Button> : null}
            {value && value.id ? <Button className="ui button" icon="trash" onClick={() => this.onDelete()}>Delete</Button> : null}
        </div>;

        let editingActions = <div>
            <Button className="ui green button" icon="save" onClick={() => this.onSave()}>Save</Button>
            <Button className="ui button" icon="ban" onClick={() => this.onCancel()}>Cancel</Button>
        </div>;

        return <div className="actions">
            {this.state.updateMode ? editingActions : viewingActions}
        </div>;
    }

    getRequestValue() {
        return this.state.value;
		}

}

export default Detail;
