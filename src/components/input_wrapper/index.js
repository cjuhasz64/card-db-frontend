import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import fetchApi from '../../util/fetchApi';
import Select from 'react-select';
import { json } from 'react-router-dom';

function InputWrapper(props) {

  const [displayEdit, setDisplayEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value);
  const [defaultValue, setDefaultValue] = useState(props.value);
  const [isEdited, setIsEdited] = useState(false);
  const [linkDataIsEdited, setLinkDataIsEdited] = useState(false);
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
    isMulti,
    isCreating,
    rowId,
    linkData,
    name,
    rowNo,
    detectCheckPrereq,
    activateInput,
    isDisabled
  } = props;

  function prepareDataView (data) {
    let output = [];
    data.forEach(element => {
      output.push(`${element['name']}`) 
    })
    return output;
  }
  function prepareDataSelect (data) {
    let output = [];
    data.forEach(element => {
      if (selectFilter) {
        Object.keys(element).forEach(key => {
          if (element[key] === selectFilter) {
            output.push({value:element['id'], label:`${element['name']}${(element['year'] ? element['year'] : '')}`}) 
          }
        })
    
      } else {
        output.push({value:element['id'], label:element['name']}) 
      }
      
    });
    return output
  }

  useEffect(() => {
    if (activateInput) {      
      activateInput.forEach(e => {
        if (e.split(',')[0] === rowNo.toString() && e.split(',')[1] === name) {
          if (e.split(',')[2] === 'disable') {
            console.log(e + "   DISABLE")
            // TODO::::   clear input value
            setSelectDisabled(true)
            setSelectFilter(e.split(',')[2])
          } else {
            setSelectDisabled(false)
            setSelectFilter(e.split(',')[2])

          }
        }  
      });
    }
    
    switch (currentAction) {
      case 'updating':
        if (actionActiveState === 'cancel') {
          setDisplayEdit(false);
          handleActionCancel();
        } else if (actionActiveState === 'confirm') {
          setDisplayEdit(false);
          if (currentValue === '') {
            handleActionCancel();
          } else {
            setDefaultValue(currentValue);
            if (isMulti) {
              handleEditConfirm(currentValue, isEdited, currentValue, linkDataIsEdited);
            } else {
              handleEditConfirm(currentValue, isEdited);
            }
            setIsEdited(false);
            setLinkDataIsEdited(false)
          }
        }
        break;
      case 'creating':

        if (!isDisabled) {
          setSelectDisabled(false)
        }

        if (actionActiveState === 'confirm') {
          if (isCreating) {
            if (isMulti) {
              handleCreateConfirm(name, currentValue, true, currentValue);
            } else {
              if (typeof currentValue === 'undefined') {
                handleCreateConfirm(name, currentValue, false);
              } else {
                handleCreateConfirm(name, currentValue, true);
              }
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
        }

        if (foreignData) {
          if (typeof foreignData[Object.keys(foreignData)[0]] != 'undefined') { 
            foreignData[Object.keys(foreignData)[0]].forEach( element => {
              if (element['id'] === currentValue) {
                if (!foreignValue && currentValue) { 
                  setForeignValue(element);
                }
              }
            })
          }
        }

        if (linkData) { 
          if (typeof linkData[Object.keys(linkData)[0]] != 'undefined') {
            var temp = [];
            linkData[Object.keys(linkData)[0]].forEach( linkElement => {
              if (linkElement['card_id'] === rowId) {
                foreignData[Object.keys(foreignData)[0]].forEach( foreignElement => {
                  if (foreignElement['id'] === linkElement['features_id']) {
                    temp.push(foreignElement)
                  }
                })
              }
            }) 
            setLinkDataList(temp)     
          }
        }

        break;
    }
  }, [currentAction, actionActiveState, linkData, foreignData, activateInput]);

  return (
    
    <>
      {  
      !isCreating ? (
        isMulti ? (
          displayEdit ? ( 
            props.value ? (
              // <span>{ foreignValue['name'] }</span>
              <Select
                options={prepareDataSelect(foreignData[Object.keys(foreignData)[0]])} 
                onChange={e => {setIsEdited(true); setCurrentValue(e); setLinkDataIsEdited(true)}}
                isMulti
                defaultValue={prepareDataSelect(foreignData[Object.keys(foreignData)[0]]).filter( (option) => {
                  return option.value === currentValue;
                })} 
             
              />
            ) : (
              <Select
                options={prepareDataSelect(foreignData[Object.keys(foreignData)[0]])} 
                onChange={e => {setIsEdited(true); setCurrentValue(e); setLinkDataIsEdited(true)}}
                defaultValue={prepareDataSelect(linkDataList).filter( (option) => {
                  return option.value;
                })} 
                isMulti
          
              />
            )
          ) : (
            props.value ? (
              <span
              onDoubleClick={() => {setDisplayEdit(true); handleDoubleClick()}}>
                { foreignValue['name'] }
              </span>
            ) : (
              <span
              onDoubleClick={() => {setDisplayEdit(true); handleDoubleClick()}}>
                { linkDataList ? prepareDataView(linkDataList) : "loading" }
              </span>
            )
          )
        ) : (
          foreignData? (
            !displayEdit ? (
              <span
                onDoubleClick={() => {setDisplayEdit(true); handleDoubleClick()}}>
                  { foreignValue['name'] }
              </span>
            ) : (
              <Select
                options={prepareDataSelect(foreignData[Object.keys(foreignData)[0]])} 
                onChange={e => {
                  setIsEdited(true); 
                  if (activateInput != null) {
                    detectCheckPrereq(name, e.value, rowNo, currentValue)
                  };
                  setCurrentValue(e.value)}}
                value={prepareDataSelect(foreignData[Object.keys(foreignData)[0]]).filter( (option) => {
                    return option.value === currentValue;
                  })} 
                isDisabled={selectDisabled}
              />
            )
          ) : (
            !displayEdit ? (
              <span
                onDoubleClick={() => {setDisplayEdit(true); handleDoubleClick()}}>
                  { currentValue }
              </span>
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => {setCurrentValue(e.target.value); setIsEdited(true)}}
                autoFocus
              />
            )
          )
        )
      ) : (
        foreignData ? (
          isMulti ? ( 
            <Select
              options={prepareDataSelect(foreignData[Object.keys(foreignData)[0]])} 
              onChange={e => {setIsEdited(true); setCurrentValue(e); setLinkDataIsEdited(true)}}
              isMulti
              isDisabled={selectDisabled}
            />
        
          ) : (
            <Select
              options={prepareDataSelect(foreignData[Object.keys(foreignData)[0]])} 
              onChange={e => {
                setIsEdited(true); 
                if (activateInput != null) {
                  detectCheckPrereq(name, e.value, rowNo, currentValue)
                };
                setCurrentValue(e.value)}}
              value={prepareDataSelect(foreignData[Object.keys(foreignData)[0]]).filter( (option) => {
                  return option.value === currentValue;
                })} 
              isDisabled={selectDisabled}
            />
          )
        ) : (
          <input
            type="text"
            onChange={(e) => {setCurrentValue(e.target.value); setIsEdited(true)}}
            autoFocus
          />
        )
      )}
    </>
  )
}

export default InputWrapper