import React from 'react';
import './style.scss'
import InputWrapper from '../input_wrapper/index.js';
import HeaderOptions from '../header_options/index.js';
import CheckBox from '../checkbox';
import fetchApi from '../../util/fetchApi';
import getForeignName from '../../util/getForeignName';
import logger from '../../util/logger';
import { v4 } from 'uuid';

const pluralize = require('pluralize')

const columns = [
  'id',
  'code',
  'variety_id',
  'features_list',
  'grade',
  'numberedTo',
  'rookie',
  'patch',
  'autograph',
  'quantity',
];

const checklist = [
  'rookie',
  'patch',
  'autograph'
]

const displayedColumns = {
  'id':'x',
  'code':'Code',
  'game_id':'Game',
  'set_id': 'Set',
  'variety_id':'Variety',
  'team_id': 'Team',
  'features_list':'Feature',
  'grade':'Grade',
  'numberedTo':'Numbered',
  'rookie':'',
  'patch':'',
  'autograph':'',
  'quantity':'Quantity'
}

// ie. to access features_list col, game_id must be entered
const prereqEntries = {
  'default':['game_id'],
  'game_id':['team_id', 'set_id'],
  'team_id':['features_list'],
  'set_id':['variety_id']
}

// http://localhost:3000/api/v1/games
export default class Cards extends React.Component {

  state = {
    updateData:{},
    linkData:{},
    rowIsEdited: false,
    multiIsChanged: false,
    createIsValid: true,
    currentAction: 'reading', // 'reading' 'updating' 'creating' 'deleting'
    actionActiveState: 'inactive', // 'cancel' 'confirm' 'inactive' 'fetching' 'failure'
    activateInput: []
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
    this.detectCheckPrereq = this.detectCheckPrereq.bind(this);
  }

  // for key:value(array) array e.g. prereqEntries
  getKeyByValue(array, value) {
    var result = null;
    if (array) {
      Object.keys(array).forEach((key) => {
        array[key].forEach(element => {
          if (element === value) result = key
        });
      });
    }
    return result
  }

  findDataRow(id, data) {
    var result;
    if (data) {
      data.forEach(element =>{
        if (element['id'] === id) {
          result = element
        }
      })
    }
    return result
  }

  getAssociatedId (targetTable, currentRowData) {
    var currentCol, result, dataRow;
    if (currentRowData) {
      if (Object.keys(currentRowData).includes(targetTable)) {
        return currentRowData[targetTable]
      } else {
        for (let i = 0; i < Object.keys(currentRowData).length; i++) {
          currentCol = Object.keys(currentRowData)[i];
          if (currentCol.includes('_id')) {
            dataRow = this.findDataRow(currentRowData[currentCol], this.props.foreignData[getForeignName(currentCol)])
            result = this.getAssociatedId(targetTable, dataRow)
            if (result !== false) return result
          }

          if (currentCol.includes('_list')) {

            // in _list option, if there happens to be multiple entries linked (mulitple features on card)
            // the field will be null.

            // The soultion is to search the corresponding link table for the current id (card_id) and return the first
            // linked id found (feature) since all features on a card are grouped to the same team, this solution works. 

            if (currentRowData[currentCol] != null) {
              dataRow = this.findDataRow(currentRowData[currentCol], this.props.foreignData[getForeignName(currentCol)])
              result = this.getAssociatedId(targetTable, dataRow)
              if (result !== false) return result
            } else {
              var rowId = currentRowData['id'] // card id
              var linkedId; // will contain the first id linked with rowId
              if (this.props.foreignData[getForeignName(currentCol, true)] != undefined) {
                this.props.foreignData[getForeignName(currentCol, true)].forEach(row => {
                  if (row['card_id'] === rowId) {
                    if (!linkedId) linkedId = row[`${currentCol.split('_list')[0]}_id`] // features_list -> features_id
                  }
                });
                dataRow = this.findDataRow(linkedId, this.props.foreignData[getForeignName(currentCol)])
                result = this.getAssociatedId(targetTable, dataRow)
                if (result !== false) return result
              } 
            }
          }
        }
        return false;
      }
    }
  }

  detectCheckPrereq (inputName, inputValue, rowNo, hadValue, notFirstChain) {
    // PROBLEM PASSING IN PARAMETER FROM INPUT_WRAPPER
    
    if (!notFirstChain) {
      this.setState({
        activateInput: []
      })
    }

    var output = [];
   
    Object.keys(prereqEntries).forEach((key) => {
      if (key === inputName) {
        prereqEntries[key].forEach(e => {
          output.push(`${rowNo},${e},${inputValue}`)
          if (hadValue) {
            this.detectCheckPrereq(e,'disable',rowNo,false,true)
          }
        });
      } 
    });

    output.forEach(element => {
      this.setState(prevState => ({
        activateInput: [...prevState.activateInput, element]
      })) 
    });
  }

  rowIsValid (rowData, targetState, exceptionCols) {
    //logger('d', JSON.stringify(rowData))
    // make sure:
    // - correct amount of entries
    // - corrent col titles
    // - compart with exceptionCols: e.g. features_list can be null, if it exists in exceptionCols, then its  valid

    var currentKeys = Object.keys(rowData);
    for (let i = 0; i < currentKeys.length; i++) {
      if (!targetState.includes(currentKeys[i])) return false;
      //if (rowData[currentKeys[i]] === null && !exceptionCols.includes(currentKeys[i])) return false;
      if (rowData[currentKeys[i]] === '' || rowData[currentKeys[i]] === -1) return false;
    }
    return true;
  }


  handleEditConfirm (colName, colValue, inputIsEdited, linkData) {
    if (columns.includes(colName)) {

      if (inputIsEdited) {
        this.state.rowIsEdited = true;
        if (linkData != null) this.state.multiIsChanged = true; 
      }

      if (linkData) {
        if (linkData.length > 1 && linkData.length < 20) {  
          this.state.updateData[colName] = null;
          this.state.linkData[getForeignName(colName)] = linkData
        } else if (linkData.length < 1) {
          this.state.updateData[colName] = -1;
        } else {
          this.state.updateData[colName] = colValue[0]['value'];
        }
      } else {
        this.state.updateData[colName] = colValue;
      }

      if (columns.length === Object.keys(this.state.updateData).length) {
        if (this.rowIsValid(this.state.updateData, columns, Object.keys(this.state.updateData).filter((key) => { return key.includes('_list') }))) {
          if (this.state.rowIsEdited) {
            logger('success', 'Card Edit')
            if (this.state.multiIsChanged) {
              if (Object.keys(this.state.linkData).length > 0) {
                this.props.handleUpdate(this.state.updateData, true, this.state.linkData, 'card')
              } else {
                this.props.handleUpdate(this.state.updateData, true)
              }
            } else {
              this.props.handleUpdate(this.state.updateData, false)
            }
          }
        } else {
          logger('error', `Card Edit \n${JSON.stringify(this.state.updateData)}`)
        }
        this.state.multiIsChanged = false;
        this.state.rowIsEdited = false;
        this.state.updateData = {};
        this.state.linkData = {};
      }
    }
    this.setState({
      actionActiveState: 'inactive',
      currentAction:'reading'
    })
  }

  // linkData defaults to [] if is _list. To be consistent with updateConfirm. 
  async handleCreateConfirm(colName, colValue, createIsValid, linkData = colName.includes('_list') ? [] : undefined) {
    if (columns.includes(colName))
    {
      if (!createIsValid) {
        this.state.createIsValid = false;
      } 
     
      if (linkData) {
        if (linkData.length > 1 && linkData.length < 20) {  
          this.state.updateData[colName] = null;
          this.state.linkData[getForeignName(colName)] = linkData
        } else if (linkData.length < 1) {
          this.state.updateData[colName] = -1;
        } else {
          this.state.updateData[colName] = colValue[0]['value'];
        }
      } else {
        this.state.updateData[colName] = colValue;
      }

      if (columns.length === Object.keys(this.state.updateData).length + 1) {
        if (this.rowIsValid(this.state.updateData, columns, Object.keys(this.state.updateData).filter(key => { return key.includes('_list') }))) {
          if (this.state.createIsValid) {
            logger('success', 'Card Created')
            if (Object.keys(this.state.linkData).length > 0) {
              const id = v4();
              this.state.updateData['id'] = id;
              await this.props.handleCreate(this.state.updateData)
              this.props.handleCreateLink(this.state.linkData, id, 'card')
            } else {
              await this.props.handleCreate(this.state.updateData) 
            }
          } 
        } else {
          logger('error', `Card Create \n${JSON.stringify(this.state.updateData)}`)
        }

        this.setState({
          updateData: {},
          createIsValid: true
        })
      } 
  
    }
    this.setState({
      actionActiveState: 'inactive',
      currentAction:'reading'
    }) 
  }


  handleDoubleClick () {
    this.setState({
      currentAction: 'updating'
    })
  }

  handleActionCancel () {
    this.setState({
      actionActiveState: 'inactive',
      currentAction: 'reading',
      activateInput: []
    })
  }
  
  detectEditConfirm () {
    logger('INFO', 'Card Edit Confirmed')
    this.setState({
      actionActiveState: 'confirm',
    })
  }

  detectEditCancel () {
    logger('INFO', 'Card Action Cancelled')
    this.setState({
      actionActiveState: 'cancel',
    })
  } 

  detectCreate() {
    this.setState({
      currentAction: 'creating',
    })
  }
  
  detectCreateConfirm () {
    logger('INFO', 'Card Create Confirmed')
    this.setState({
      actionActiveState: 'confirm'
    })
  }

  renderTable() {
    return (
      <>
        {/* <img src={letterR} alt="Kiwi standing on oval"></img>
        <img src={letterP} alt="Kiwi standing on oval"></img>
        <img src={letterA} alt="Kiwi standing on oval"></img> */}
        <table>
          <thead>
            <tr>
              {
                (this.props.data.length === 0 && this.state.currentAction != 'creating') ? 'NOTHING HERE PAL' :
                Object.keys(displayedColumns).map((key) => <th key={key}>{displayedColumns[key]}</th>)
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                this.state.currentAction === 'creating' ? (
                  <>
                    <td/>
                    { 
                    
                      Object.keys(displayedColumns).map ((key) => 
                        (key != 'id') ? (
                          <td>
                            <InputWrapper 
                              foreignData={key.includes('_id') || key.includes('_list')? 
                              {[`${pluralize(getForeignName(key))}`]:this.props.foreignData[pluralize(getForeignName(key))]} : null}
                              currentAction={this.state.currentAction}
                              actionActiveState={this.state.actionActiveState}
                              handleCreateConfirm={this.handleCreateConfirm}
                              handleActionCancel={this.handleActionCancel}
                              //isMulti={key.includes('_list')}
                              isCreating={true}
                              name={key}
                              rowNo={-1}
                              detectCheckPrereq={this.detectCheckPrereq}
                              activateInput={this.state.activateInput}
                              isDisabled={prereqEntries['default'].includes(key) ? false : true}
                              inputType={key.includes('_list') ? 'multi' : checklist.includes(key) ? 'checklist' : null}
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
                Object.keys(displayedColumns).map((key) =>
                  <td id={`${key}:${index}`}>
                    <InputWrapper 
                      name={key}
                      rowNo={index}
                      value={Object.keys(prereqEntries).includes(key) ? this.getAssociatedId(key, row) : row[key]}
                      foreignData={key.includes('_id') || key.includes('_list') ? 
                      {[`${getForeignName(key)}`]:this.props.foreignData[getForeignName(key)]} : null}
                      linkData={key.includes('_list') ? {[`${getForeignName(key, true)}`]:this.props.foreignData[getForeignName(key, true)]} : null}
                      handleDoubleClick={this.handleDoubleClick}
                      handleActionCancel={this.handleActionCancel}
                      handleEditConfirm={this.handleEditConfirm}
                      currentAction={this.state.currentAction}
                      actionActiveState={this.state.actionActiveState}
                      inputType={key.includes('_list') ? 'multi' : checklist.includes(key) ? 'checklist' : null}
                      rowId={row['id']}
                      detectCheckPrereq={this.detectCheckPrereq}
                      activateInput={this.state.activateInput}
                      defaultFilter={this.getAssociatedId(this.getKeyByValue(prereqEntries, key), row)}
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