import React from 'react';
import keycode from 'keycode';
import { Link } from 'react-router';

import ReactDataGrid from 'react-data-grid';
import Update from 'react-addons-update';


const { Editors, Formatters } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

// options for IssueType dropdown editor
// these can either be an array of strings, or an object that matches the schema below.
let issueTypes = [];
// const issueTypes = [
//   { id: 'bug', value: 'bug', text: 'Bug', title: 'Bug' },
//   { id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement' },
//   { id: 'epic', value: 'epic', text: 'Epic', title: 'Epic' },
//   { id: 'story', value: 'story', text: 'Story', title: 'Story' }
// ];

for (var i = 0; i < 50000; i++) {
    issueTypes.push({id: i.toString(), value: i.toString(), text: "Issue " + i, title: "Issue " + i});
}

const IssueTypesEditor = <DropDownEditor options={issueTypes}/>;
const IssueTypesFormatter = <DropDownFormatter options={issueTypes} value="bug"/>;


import View from './abstract/View'

class Test extends View {

    constructor(props) {
        super(props);
        this.createRows();
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
              issueType: ['Issue 1', 'Issue 2', 'Issue 3', 'Issue 4'][Math.floor((Math.random() * 3) + 1)],
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
      // options for priorities autocomplete editor
      let priorities = [];
      for (let i = 1; i < 100; i++) {
          priorities.push({ id: i, title: "Good game " + i });
      }

      // const priorities = [{ id: 1, title: 'Critical' }, { id: 2, title: 'High' }, { id: 3, title: 'Medium' }, { id: 4, title: 'Low'} ];
      const PrioritiesEditor = <AutoCompleteEditor options={priorities} />;

      let columns = [
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

        return <div>
            <p>At purchase orders. <Link to="/">Go to home</Link></p>
            <hr />

            <ReactDataGrid
                enableCellSelect={true}
                columns={columns}
                rowGetter={(index) => this.getRow(index)}
                rowsCount={this.state.rows.length}
                minHeight={500}
                onGridRowsUpdated={(e) => this.handleGridRowsUpdate(e)} />
        </div>;
    }

}

export default Test;
