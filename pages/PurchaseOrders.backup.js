import React from 'react';
import { Link } from 'react-router';

import ReactDataGrid from 'react-data-grid';
import Update from 'react-addons-update';


const { Editors, Formatters } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

// options for priorities autocomplete editor
const priorities = [{ id: "Critical", title: 'Critical' }, { id: "High", title: 'High' }, { id: "Medium", title: 'Medium' }, { id: "Low", title: 'Low'} ];
const PrioritiesEditor = <AutoCompleteEditor options={priorities} />;

// options for IssueType dropdown editor
// these can either be an array of strings, or an object that matches the schema below.
const issueTypes = [
  { id: 'bug', value: 'bug', text: 'Bug', title: 'Bug' },
  { id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement' },
  { id: 'epic', value: 'epic', text: 'Epic', title: 'Epic' },
  { id: 'story', value: 'story', text: 'Story', title: 'Story' }
];
const IssueTypesEditor = <DropDownEditor options={issueTypes}/>;
const IssueTypesFormatter = <DropDownFormatter options={issueTypes} value="bug"/>;


import View from './abstract/View'

class PurchaseOrders extends View {

    constructor(props) {
        super(props);

        this.createRows();
        this.state.columns = [
            {
                key: 'id',
                name: 'ID',
                width: 80
            },
            {
                key: 'task',
                name: 'Title',
                editable: true
            },
            {
                key: 'priority',
                name: 'Priority',
                editor: PrioritiesEditor
            },
            {
                key: 'issueType',
                name: 'Issue Type',
                editor: IssueTypesEditor,
                formatter: IssueTypesFormatter
            }
        ];
    }

    getRandomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
    }

    createRows() {
      let rows = [];
      for (let i = 1; i < 20; i++) {
          rows.push({
              id: i,
              task: 'Task ' + i,
              priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
              issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
          });
      }
        this.state.rows = rows;
    }

    getRow(index) {
        return this.state.rows[index];
    }

    handleGridRowsUpdate({ fromRow, toRow, updated }) {
        console.log("handleGridRowsUpdate", fromRow, toRow, updated);

        let rows = this.state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = Update(rowToUpdate, {$merge: updated});
            rows[i] = updatedRow;
        }
        this.setState({rows});
    }

    render() {
        return <div>
            <p>At purchase orders. <Link to="/">Go to home</Link></p>
            <hr />

            <ReactDataGrid
                enableCellSelect={true}
                columns={this._columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                minHeight={500}
                onGridRowsUpdated={this.handleGridRowsUpdated} />
        </div>;
    }

}

export default PurchaseOrders;
