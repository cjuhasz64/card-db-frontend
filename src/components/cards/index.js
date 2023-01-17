import React from 'react';
import './style.scss'
import InputWrapper from '../input_wrapper/index.js';
import HeaderOptions from '../header_options/index.js';
import fetchApi from '../../util/fetchApi';
import getForeignName from '../../util/getForeignName';
import { v4 } from 'uuid';



const pluralize = require('pluralize')

const columns = {
  'id':'x',
  'code':'Code',
  'variety_id':'Variety',
  'features_list':'Feature',
  'grade':'Grade',
  'numberedTo':'Numbered',
  'rookie':'R',
  'patch':'P',
  'autograph':'A',
  'quantity':'Quantity'
  
};

// http://localhost:3000/api/v1/games
export default class Cards extends React.Component {

  state = {
    updateData:{},
    linkData:{},
    rowIsEdited: false,
    multiIsChanged: false,
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


  handleEditConfirm (value, isEdited, linkData, linkDataIsEdited) {

    if (isEdited) {
      this.state.rowIsEdited = true;
      console.log("llllllllllllllllllllllllllllllllllllllllllllll")
    }
    
    if (linkDataIsEdited) {
      this.state.multiIsChanged = true;
      console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
    }
    
    if (linkData) {
      console.log("dwdw   " + JSON.stringify(linkData))
      // if (linkData.length > 1 && linkData.length < 20) fixed issue of UUID being passed in
      if (linkData.length > 1 && linkData.length < 20) {
        this.state.updateData[Object.keys(columns)[this.state.editCounter]] = null;
        this.state.linkData[getForeignName(Object.keys(columns)[this.state.editCounter])] = linkData
      } else {
        this.state.updateData[Object.keys(columns)[this.state.editCounter]] = value[0]['value'];
      }
    } else {
      console.log(Object.keys(columns)[this.state.editCounter])
      this.state.updateData[Object.keys(columns)[this.state.editCounter]] = value;
    }
    this.state.editCounter++;

    
      
    if (Object.keys(this.state.updateData).length === Object.keys(columns).length) {
      if (this.state.rowIsEdited === true) {
        if (this.state.multiIsChanged) {
          if (Object.keys(this.state.linkData).length > 0) {
            this.props.handleUpdate(this.state.updateData, true, this.state.linkData, 'card')
          } else {
            this.props.handleUpdate(this.state.updateData, true)
          }
          this.state.multiIsChanged = false;
        } else {
          this.props.handleUpdate(this.state.updateData)
        } 
        this.state.rowIsEdited = false;
      }
      
      this.state.updateData = {};
      this.state.editCounter = 0;
      this.state.linkData = {};
  
    }
    console.log(this.state.editCounter)
 
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

  async handleCreateConfirm(value, createIsValid, linkData) {
    if (linkData) {
      if (linkData.length > 1) {
        this.state.updateData[Object.keys(columns)[this.state.createCounter]] = null;
        this.state.linkData[getForeignName(Object.keys(columns)[this.state.createCounter])] = linkData
      } else {
        this.state.updateData[Object.keys(columns)[this.state.createCounter]] = value[0]['value'];
      }
    } else {
      this.state.updateData[Object.keys(columns)[this.state.createCounter]] = value;
    }

    this.state.createCounter++;
    if (!createIsValid) {
      this.state.createIsValid = false;
    } 

    if (Object.keys(this.state.updateData).length === Object.keys(columns).length - 1) {
      if (this.state.createIsValid) { 
        if (Object.keys(this.state.linkData) < 1) {
          await this.props.handleCreate(this.state.updateData) 
        } else {
          const id = v4();
          this.state.updateData['id'] = id;
          await this.props.handleCreate(this.state.updateData)
          this.props.handleCreateLink(this.state.linkData, id, 'card')
        }
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
                              foreignData={key.includes('_id') || key.includes('_list')? 
                              {[`${pluralize(getForeignName(key))}`]:this.props.foreignData[pluralize(getForeignName(key))]} : null}
                              currentAction={this.state.currentAction}
                              actionActiveState={this.state.actionActiveState}
                              handleCreateConfirm={this.handleCreateConfirm}
                              handleActionCancel={this.handleActionCancel}
                              isMulti={key.includes('_list')}
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
                      // console.log(key)
                        (key != 'id') ? (
                          <td>
                            <InputWrapper 
                              foreignData={key.includes('_id') || key.includes('_list')? 
                              {[`${pluralize(getForeignName(key))}`]:this.props.foreignData[pluralize(getForeignName(key))]} : null}
                              currentAction={this.state.currentAction}
                              actionActiveState={this.state.actionActiveState}
                              handleCreateConfirm={this.handleCreateConfirm}
                              handleActionCancel={this.handleActionCancel}
                              isMulti={key.includes('_list')}
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
            {
            this.props.data.map((row, index) =>
              <tr>{
                Object.keys(columns).map((key) =>
                  <td id={`${key}:${index}`}>
                    <InputWrapper 
                      value={row[key]}
                      foreignData={key.includes('_id') || key.includes('_list') ? 
                      {[`${getForeignName(key)}`]:this.props.foreignData[getForeignName(key)]} : null}
                      linkData={key.includes('_list') ? {[`${getForeignName(key, true)}`]:this.props.foreignData[getForeignName(key, true)]} : null}
                      handleDoubleClick={this.handleDoubleClick}
                      handleActionCancel={this.handleActionCancel}
                      handleEditConfirm={this.handleEditConfirm}
                      currentAction={this.state.currentAction}
                      actionActiveState={this.state.actionActiveState}
                      isMulti={key.includes('_list')}
                      isReading={true}
                      rowId={row['id']}
                    />
                  </td> 
                )}
                {
                this.state.currentAction === 'reading' ? (
                  <td className='delete-active' onClick={async () => {
                      this.setState ({
                        currentAction: 'deleting'
                      })
                      await this.props.handleDelete(row)
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
      <div className='cards'>
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