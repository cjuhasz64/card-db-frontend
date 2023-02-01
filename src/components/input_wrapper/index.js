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
    isDisabled,
    defaultFilter,
    value
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
        output.push({value:element['id'], label:`${element['name']}${(element['year'] ? element['year'] : '')}`}) 
      }
      
    });
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
            setSelectDisabled(true)
            setSelectFilter(e.split(',')[2])
          } else {
            setSelectDisabled(false)
            setSelectFilter(e.split(',')[2])
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
          // confirm update
          if (currentValue === '') {
            // should make the row invalid to edit, could be handled in cards index.js
            //handleActionCancel();
          } else {
            setDefaultValue(currentValue);
            if (isMulti) {
              handleEditConfirm(name, currentValue, isEdited, currentValue); // attributes can be improved
            } else {
              handleEditConfirm(name, currentValue, isEdited);
            }
          }  
        } else if (actionActiveState === 'cancel') {
          // cancel update
          handleActionCancel();
        } 

        if (actionActiveState === 'confirm' || actionActiveState === 'cancel') {
          setIsEdited(false);
          setLinkDataIsEdited(false);
          setDisplayEdit(false);
        }
        break;

      case 'creating':

        if (!isDisabled) {
          setSelectDisabled(false)
        }

        if (actionActiveState === 'confirm' && isCreating) {
          if (isMulti) {
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
        foreignData[Object.keys(foreignData)[0]].forEach( element => {
          //console.log(currentValue)
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

  }, [linkData, foreignData])

  return (  
    <>
      {  
      !isCreating ? (
        isMulti ? (
          displayEdit ? ( 
            props.value ? (
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
                  {/* dwadwad */}
                  { foreignValue['name'] }
                  {/* { JSON.stringify(foreignData) } */}
                  {/* { JSON.stringify(foreignValue) } */}
                  {/* { JSON.stringify(props.value) } */}
                  {/* { currentValue } */}
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
                    if (currentValue) return option.value === currentValue
                    else return option.value === props.value; // needed for distant foreign values
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