import React from 'react';
import './style.scss'
import InputWrapper from '../input_wrapper/index.js';
import HeaderOptions from '../header_options/index.js';
import fetchApi from '../../util/fetchApi';
import getForeignName from '../../util/getForeignName';

const pluralize = require('pluralize')

const columns = ['id','name','game_id'];

// http://localhost:3000/api/v1/teams
export default class Teams extends React.Component {

  state = {
    updateData: {},
    rowIsEdited: false,
    editCounter: 0,
    currentAction: 'reading', // 'reading' 'updating' 'creating' 'deleting'
    actionActiveState: 'inactive', // 'cancel' 'confirm' 'inactive' 'fetching'
    createCounter: 1
  }

  constructor(props) {
    super(props)
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.detectEditCancel = this.detectEditCancel.bind(this);
    this.handleActionCancel = this.handleActionCancel.bind(this);
    this.detectEditConfirm = this.detectEditConfirm.bind(this);
    this.handleEditConfirm = this.handleEditConfirm.bind(this);
    this.detectCreate = this.detectCreate.bind(this);
    this.handleCreateConfirm = this.handleCreateConfirm.bind(this);
    this.detectCreateConfirm = this.detectCreateConfirm.bind(this);
  }

  handleDoubleClick () {
    this.setState({
      currentAction: 'updating'
    })
  }

  detectEditConfirm () {
    this.setState({
      actionActiveState: 'confirm',
    })
  }

  handleEditConfirm (value, isEdited) {

    console.log(isEdited)
    this.state.updateData[columns[this.state.editCounter]] = value;
    this.state.editCounter++;
  
    if (isEdited) {
      this.state.rowIsEdited = true;
    }
  
    if (Object.keys(this.state.updateData).length === columns.length) {
      if (this.state.rowIsEdited === true) {
        this.props.handleUpdate(this.state.updateData)
        this.state.rowIsEdited = false;
      }
      this.state.updateData = {};
      this.state.editCounter = 0;
    }
 
    this.setState({
      actionActiveState: 'inactive',
      currentAction:'reading'
    })
  }

  detectEditCancel () {
    this.setState({
      actionActiveState: 'cancel',
    })
  }

  handleActionCancel () {
    this.setState({
      actionActiveState: 'inactive',
      currentAction: 'reading',
    })
  }

  detectCreate() {
    this.setState({
      currentAction: 'creating',
    })
  }
  
  detectCreateConfirm () {
    this.setState({
      actionActiveState: 'confirm'
    })
  }

  handleCreateConfirm(value) {
    this.state.updateData[columns[this.state.createCounter]] = value;
    this.state.createCounter++;

    if (Object.keys(this.state.updateData).length === columns.length - 1) {
      
      this.props.handleCreate(this.state.updateData)
      this.state.updateData = {};
      this.state.createCounter = 1;
    }

    this.setState({
      actionActiveState: 'inactive',
      currentAction:'reading'
    })
  }

  renderTable() {
    if (this.props.data.length === 0) {
      return (
        <div>No Data to be displayed</div>
      )
    }
    return (
      <>
        <table>
          <thead>
            <tr>
              {columns.map((key) => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                this.state.currentAction === 'creating' ? (
                  <>
                    <td/>
                    {
                      columns.map ((key) => 
                        (key != 'id') ? (
                          <td>
                            <InputWrapper 
                              foreignData={key.includes('_id') ? 
                              {[`${pluralize(getForeignName(key))}`]:this.props.foreignData[pluralize(getForeignName(key))]} : null}
                              currentAction={this.state.currentAction}
                              actionActiveState={this.state.actionActiveState}
                              handleCreateConfirm={this.handleCreateConfirm}
                              handleActionCancel={this.handleActionCancel}
                            />
                          </td>
                        ) : (
                          null
                        ))} 
                  </>
                ) : (
                  <></>
                )
              }
          
            </tr>
            {
            this.props.data.map((row, index) =>
              <tr>{
                columns.map((key) =>
                  <td id={`${key}:${index}`}>
                    <InputWrapper
                      value={row[key]}
                      foreignData={key.includes('_id') ? 
                      {[`${pluralize(getForeignName(key))}`]:this.props.foreignData[pluralize(getForeignName(key))]} : null}
                      handleDoubleClick={this.handleDoubleClick}
                      handleActionCancel={this.handleActionCancel}
                      handleEditConfirm={this.handleEditConfirm}
                      currentAction={this.state.currentAction}
                      actionActiveState={this.state.actionActiveState}
                    />
                  </td>
                )}
                {
                this.state.currentAction === 'reading' ? (
                  <td className='delete-active' onClick={async () => {
                      this.setState ({
                        currentAction: 'deleting'
                      })
                      await this.props.handleDelete(row['id'])
                      this.setState ({
                        currentAction: 'reading'
                      })
                  }}>x</td>
                ) : (
                  <td className='delete-inactive'></td>
                )
              }</tr>   // delete coloumn 
            )}
          </tbody>
        </table>
      </>
    )
  }

  render() {
    return (
      <div className='teams'>
        <HeaderOptions
          detectEditCancel={this.detectEditCancel}
          detectEditConfirm={this.detectEditConfirm}
          detectCreate={this.detectCreate}
          currentAction={this.state.currentAction}
          detectCreateConfirm={this.detectCreateConfirm}
        />
        {this.renderTable()}
      </div>
    )
  }




}   