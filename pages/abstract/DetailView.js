import React from 'react'
import View from './View'

class DetailView extends View {

    constructor(props) {
        super(props);
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
            updateMode: null,
            value: null
        });
    }

    onEdit() {
        this.setState({
            updateMode: "EDIT",
        }, function() {
            this.refs.initial.focus();
        });
    }

}

export default DetailView;
