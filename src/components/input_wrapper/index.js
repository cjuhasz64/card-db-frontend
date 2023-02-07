import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import fetchApi from '../../util/fetchApi';
import Select from 'react-select';
import { json } from 'react-router-dom';
import logger from '../../util/logger';
import CheckBox from '../checkbox';
import './style.scss'

function InputWrapper(props) {

  const [displayEdit, setDisplayEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value);
  const [defaultValue, setDefaultValue] = useState(props.value);
  const [isEdited, setIsEdited] = useState(false);
  const [foreignValue, setForeignValue] = useState('');
  const [linkDataList, setLinkDataList] = useState(null);
  const [selectDisabled, setSelectDisabled] = useState(true)
  const [selectFilter, setSelectFilter] = useState(null)

  const {
    handleDoubleClick,
    handleActionCancel,
    handleEditConfirm,
    currentAction,
    actionActiveState,
    handleCreateConfirm,
    foreignData,
    dropDownData,
    isCreating,
    rowId,
    linkData,
    name,
    rowNo,
    detectCheckPrereq,
    activateInput,
    isDisabled,
    defaultFilter,
    inputType
  } = props;

  function exists(arr, target) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['value'] === target) return true
    }
    return false
  }

  function prepareDataView(data) {
    let output = [];
    for (let i = 0; i < data.length; i++) output.push(`${data[i]['name']}`)
    return output.join('/')
  }

  function prepareForeignDataSelect(data) {
    let output = [];
    data.forEach(element => {
      if (selectFilter) {
        Object.keys(element).forEach(key => {
          if (element[key] === selectFilter) {
            output.push({ value: element['id'], label: `${element['name']} ${(element['year'] ? element['year'] : '')}` })
          }
        })

      } else {
        output.push({ value: element['id'], label: `${element['name']} ${(element['year'] ? element['year'] : '')}` })
      }

    });
    return output
  }

  function prepareEnumDataSelect(data) {
    let output = [];
    Object.keys(data).forEach( element => {
      output.push({value:element, label:element})
    })
    return output
  }

  useEffect(() => {
    //if (defaultFilter) setSelectFilter(defaultFilter)
    //console.log(defaultFilter)
    // setCurrentValue(value)
    // setDefaultValue(value)
  }, []);

  useEffect(() => {
    if (activateInput && activateInput.length > 0) {
      activateInput.forEach(e => {
        if (e.split(',')[0] === rowNo.toString() && e.split(',')[1] === name) {
          if (e.split(',')[2] === 'disable') {
            //logger('d', e)
            setCurrentValue('x');
            setSelectDisabled(true)
            setSelectFilter(e.split(',')[2])
          } else {
            //logger('d', e)
            setCurrentValue('x');

            if (e.split(',')[2] != selectFilter) {
              setSelectFilter(e.split(',')[2])
            }

            setSelectDisabled(false)
            setDisplayEdit(true)
          }
        }
      });
    }
  }, [activateInput]);

  useEffect(() => {

    if (defaultFilter) setSelectFilter(defaultFilter) // would prefer this in the first useEffect

    switch (currentAction) {
      case 'updating':
        if (actionActiveState === 'confirm') {
          // setDefaultValue(currentValue);
          if (inputType === 'multi') {
            handleEditConfirm(name, currentValue, isEdited, currentValue);
          } else {
            handleEditConfirm(name, currentValue, isEdited);
          }

        } else if (actionActiveState === 'cancel') {
          // cancel update
          handleActionCancel();
        }

        if (actionActiveState === 'confirm' || actionActiveState === 'cancel') {
          setIsEdited(false);
          setDisplayEdit(false);
        }
        break;

      case 'creating':
        if (!isDisabled) {
          setSelectDisabled(false)
        }

        if (actionActiveState === 'confirm' && isCreating) {
          if (inputType === 'multi') {
            handleCreateConfirm(name, currentValue, true, currentValue);
          } else {
            if (typeof currentValue === 'undefined') {
              handleCreateConfirm(name, currentValue, false);
            } else {
              handleCreateConfirm(name, currentValue, true);
            }
          }
        } else if (actionActiveState === 'cancel') {
          handleActionCancel();
        }
        break;
      case 'reading':
        if (actionActiveState === 'inactive') {
          setDisplayEdit(false);
          setCurrentValue(defaultValue);

          // POSSIBLE SOURCE OF BUG
          setSelectDisabled(false)
        }
        break;
      case 'deleting':
        //nothing rn
        break;
    }
  }, [currentAction, actionActiveState]);

  useEffect(() => {

    if (foreignData) {
      if (typeof foreignData[Object.keys(foreignData)[0]] != 'undefined') {
        foreignData[Object.keys(foreignData)[0]].forEach(element => {
          if (element['id'] === props.value) {
            if (!foreignValue && props.value) {
              setForeignValue(element);
            }
          }
        })
      }
    }

    if (linkData) {
      if (typeof linkData[Object.keys(linkData)[0]] != 'undefined') {
        var temp = [];
        linkData[Object.keys(linkData)[0]].forEach(linkElement => {
          if (linkElement['card_id'] === rowId) {
            foreignData[Object.keys(foreignData)[0]].forEach(foreignElement => {
              if (foreignElement['id'] === linkElement['features_id']) {
                temp.push(foreignElement)
              }
            })
          }
        })
        setLinkDataList(temp)
      }
    }

  }, [linkData, foreignData])

  if (isCreating) {

    switch (inputType) {
      case 'multi':
        // creating/mulit
        return (
          <Select
            options={prepareForeignDataSelect(foreignData[Object.keys(foreignData)[0]])}
            onChange={e => { setIsEdited(true); setCurrentValue(e) }}
            isMulti
            value={
              prepareForeignDataSelect(foreignData[Object.keys(foreignData)[0]]).filter(option => {
                if (Array.isArray(currentValue)) { if (exists(currentValue, option.value)) return option.value }
                else if (!Array.isArray(currentValue) && currentValue) return option.value === currentValue
              })}
            isDisabled={selectDisabled}
          />
        )
      case 'checklist':
        switch (name) {
          case 'rookie':
            return (
              <>
                <span
                  onDoubleClick={() => {setIsEdited(true); setDisplayEdit(true)}}
                >
                  <CheckBox
                    svgImage={'R'}
                    defaultState={0}
                    setCurrentValue={setCurrentValue}
                    displayEdit={displayEdit}
                  />
                </span>
              </>
            )
          case 'patch':
            return (
              <>
                <span
                  onDoubleClick={() => {setIsEdited(true); setDisplayEdit(true)}}
                >
                  <CheckBox
                    svgImage={'P'}
                    defaultState={0}
                    setCurrentValue={setCurrentValue}
                    displayEdit={displayEdit}
                  />
                </span>
              </> 
            )
          case 'autograph':
            return (
              <>
                <span
                  onDoubleClick={() => {setIsEdited(true); setDisplayEdit(true)}}
                >
                  <CheckBox
                    svgImage={'A'}
                    defaultState={0}
                    setCurrentValue={setCurrentValue}
                    displayEdit={displayEdit}
                  />
                </span>
              </>
            )
      }
      case 'number': 
        return (
          <input
            type="number"
            value={currentValue}
            onChange={(e) => { setCurrentValue(e.target.value); setIsEdited(true) }}
            autoFocus
          />
        )
      default:
        if (foreignData) {
          return (
            // creating/foreignValue
            <Select
              options={prepareForeignDataSelect(foreignData[Object.keys(foreignData)[0]])}
              onChange={e => {
                setIsEdited(true);
                if (activateInput != null) {
                  detectCheckPrereq(name, e.value, rowNo, currentValue, false)
                };
                setCurrentValue(e.value)
              }}
              value={prepareForeignDataSelect(foreignData[Object.keys(foreignData)[0]]).filter((option) => {
                return option.value === currentValue;
              })}
              isDisabled={selectDisabled}
            />
          )
        } else {
        if (dropDownData) {
            return (
              <Select
                options={prepareEnumDataSelect(dropDownData)}
                onChange={e => {
                  setIsEdited(true);
                  setCurrentValue(e.value)
                }}
                value={prepareEnumDataSelect(dropDownData).filter((option) => {
                  return option.value === currentValue
                })}
              />
            )
          } else {
          // creating/standard
            return (
              <input
                type="text"
                onChange={(e) => { setCurrentValue(e.target.value); setIsEdited(true) }}
                autoFocus
              />
            )
          }
        }
    }
  } else {
    switch (inputType) {
      case 'multi':
        if (displayEdit) {
          // edit/multi
          return (
            <Select
              options={prepareForeignDataSelect(foreignData[Object.keys(foreignData)[0]])}
              onChange={e => { setIsEdited(true); setCurrentValue(e) }}
              isMulti
              value={
                prepareForeignDataSelect(currentValue ? foreignData[Object.keys(foreignData)[0]] : linkDataList).filter(option => {
                  if (Array.isArray(currentValue)) { if (exists(currentValue, option.value)) return option.value }
                  else if (!Array.isArray(currentValue) && currentValue) return option.value === currentValue
                  else if (!currentValue) return option.value;
                })}
              isDisabled={selectDisabled}
            />
          )
        } else {
          if (props.value) {
            // read/multi/singleValue
            return (
              <span
                onDoubleClick={() => { setDisplayEdit(true); handleDoubleClick() }}>
                {foreignValue['name']}
              </span>
            )
          } else {
            // read/multi/mulipleValues
            return (
              <span
                onDoubleClick={() => { setDisplayEdit(true); handleDoubleClick() }}>
                {linkDataList ? prepareDataView(linkDataList) : "loading"}
              </span>
            )
          }
        }
      case 'checklist':
        switch (name) {
          case 'rookie':
            return (
              <>
                <span
                  onDoubleClick={() => {setIsEdited(true); handleDoubleClick(); setDisplayEdit(true)}}
                >
                  <CheckBox
                    svgImage={'R'}
                    defaultState={currentValue}
                    setCurrentValue={setCurrentValue}
                    displayEdit={displayEdit}
                  />
                </span>
              </>
            )
          case 'patch':
            return (
              <>
                <span
                  onDoubleClick={() => {setIsEdited(true); handleDoubleClick(); setDisplayEdit(true)}}
                >
                  <CheckBox
                    svgImage={'P'}
                    defaultState={currentValue}
                    setCurrentValue={setCurrentValue}
                    displayEdit={displayEdit}
                  />
                </span>
              </>
            )
          case 'autograph':
            return (
              <>
                <span
                  onDoubleClick={() => {setIsEdited(true); handleDoubleClick(); setDisplayEdit(true)}}
                >
                  <CheckBox
                    svgImage={'A'}
                    defaultState={currentValue}
                    setCurrentValue={setCurrentValue}
                    displayEdit={displayEdit}
                  />
                </span>
              </>
            )
      }

      case 'number': 
      if (displayEdit) { 
        return (
          <>
            <input
              type="number"
              value={currentValue}
              onChange={(e) => { setCurrentValue(e.target.value); setIsEdited(true) }}
              autoFocus
            />
            <span>{`   ${(currentValue - defaultValue) > 0 ? '+' : ''}${(currentValue - defaultValue)}`}</span>
          </>
        )

      } else {
        return (
        
          <span
            onDoubleClick={() => { setDisplayEdit(true); handleDoubleClick() }}>
            {currentValue}
          </span>
      
        )
      }
      default:
        if (foreignData) {
          if (displayEdit) {
            // edit/standard-foreign/edit
            return (
              <Select
                options={prepareForeignDataSelect(foreignData[Object.keys(foreignData)[0]])}
                onChange={e => {
                  setIsEdited(true);
                  if (activateInput != null) {
                    detectCheckPrereq(name, e.value, rowNo, currentValue, false)
                  };
                  setCurrentValue(e.value)
                }}
                value={prepareForeignDataSelect(foreignData[Object.keys(foreignData)[0]]).filter((option) => {
                  if (currentValue) return option.value === currentValue
                  else return option.value === props.value; // needed for distant foreign values
                })}
                isDisabled={selectDisabled}
              />
            )
          } else {
            // read/standard-foreign/read
            return (
              <span
                onDoubleClick={() => { setDisplayEdit(true); handleDoubleClick() }}>
                {`${foreignValue['name']} ${foreignValue['year'] ? foreignValue['year'] : ''}`}
              </span>
            )
          }
        } else {
          if (dropDownData) {
            if (displayEdit) {
              return (
                <Select
                  //value={console.log(dropDownData['PSA10'])}
                  options={prepareEnumDataSelect(dropDownData)}
                  onChange={e => {
                    setIsEdited(true);
                    setCurrentValue(e.value)
                  }}
                  value={prepareEnumDataSelect(dropDownData).filter((option) => {
                    return option.value === currentValue
                  })}
                />
              )
            } else {
              return (
                <span
                  onDoubleClick={() => { setDisplayEdit(true); handleDoubleClick() }}>
                  {currentValue}
                </span>
              )
            }
          } else {
            if (displayEdit) {
              return (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => { setCurrentValue(e.target.value); setIsEdited(true) }}
                  autoFocus
                />
              )
            } else {
              return (
                <span
                  onDoubleClick={() => { setDisplayEdit(true); handleDoubleClick() }}>
                  {currentValue}
                </span>
              )
            }
          }
        }
    }
  }
}

export default InputWrapper