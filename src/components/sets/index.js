import React from 'react';
import './style.scss'
import InputWrapper from '../input_wrapper/index.js';
import HeaderOptions from '../header_options/index.js';
import fetchApi from '../../util/fetchApi';
import getForeignName from '../../util/getForeignName';

const pluralize = require('pluralize')

const columns = {
  'id':'x',
  'name':'Name',
  'game_id':'Game',
  'year':'Year'
};

// http://localhost:3000/api/v1/games
export default class Sets extends React.Component {

  state = {
    updateData: {},
    rowIsEdited: false,
    createIsValid: true,
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
    this.state.updateData[Object.keys(columns)[this.state.editCounter]] = value;
    this.state.editCounter++;
  
    if (isEdited) {
      this.state.rowIsEdited = true;
    }
  
    if (Object.keys(this.state.updateData).length === Object.keys(columns).length) {
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

  handleCreateConfirm(name, value, createIsValid) {
    this.state.updateData[Object.keys(columns)[this.state.createCounter]] = value;
    this.state.createCounter++;

    if (!createIsValid) {
      this.state.createIsValid = false;
    } 

    if (Object.keys(this.state.updateData).length === Object.keys(columns).length - 1) {
      
      if (this.state.createIsValid) {
        this.props.handleCreate(this.state.updateData)  
      }
      this.setState({
        updateData: {},
        createCounter: 1,
        createIsValid: true
      })
    }

    this.setState({
      actionActiveState: 'inactive',
      currentAction:'reading'
    })
  }

  renderTable() {
    if (this.props.data.length === 0) {
      return (
        this.state.currentAction === 'creating' ? ( 
          <table>
            <thead>
              <tr>
                {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
              {
                this.state.currentAction === 'creating' ? (
                  <>
                    <td/>
                    {
                      Object.keys(columns).map ((key) => 
                        (key != 'id') ? (
                          <td>
                            <InputWrapper 
                              foreignData={key.includes('_id') ? 
                              {[`${pluralize(getForeignName(key))}`]:this.props.foreignData[pluralize(getForeignName(key))]} : null}
                              currentAction={this.state.currentAction}
                              actionActiveState={this.state.actionActiveState}
                              handleCreateConfirm={this.handleCreateConfirm}
                              handleActionCancel={this.handleActionCancel}
                              isCreating={true}
                            />
                          </td>
                        ) : (
                          null
                        )
                      )
                    } 
                  </>
                ) : (
                  <></>
                )
              }
              </tr>
            </tbody>
          </table>
        ) : (
          <span>No data to be displayed</span>
        )
      ) 
    }
    return (
      <>
        <table>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                this.state.currentAction === 'creating' ? (
                  <>
                    <td/>
                    {
                      Object.keys(columns).map ((key) => 
                        (key != 'id') ? (
                          <td>
                            <InputWrapper 
                              foreignData={key.includes('_id') ? 
                              {[`${pluralize(getForeignName(key))}`]:this.props.foreignData[pluralize(getForeignName(key))]} : null}
                              currentAction={this.state.currentAction}
                              actionActiveState={this.state.actionActiveState}
                              handleCreateConfirm={this.handleCreateConfirm}
                              handleActionCancel={this.handleActionCancel}
                              isCreating={true}
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
                Object.keys(columns).map((key) =>
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
      <div className='sets'>
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