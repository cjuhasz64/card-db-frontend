import React, { useEffect, useState } from 'react';
import fetchApi from '../../util/fetchApi';
import Select from 'react-select';

function InputWrapper(props) {

  const [displayEdit, setDisplayEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value);
  const [defaultValue, setDefaultValue] = useState(props.value);
  const [isEdited, setIsEdited] = useState(false);
  const [foreignValue, setForeignValue] = useState('');

  const { 
    handleDoubleClick, 
    handleActionCancel, 
    handleEditConfirm, 
    currentAction, 
    actionActiveState, 
    handleCreateConfirm,
    foreignData
  } = props;

  function prepareDataSelect (data) {
    let output = [];
    data.forEach(element => {
      output.push({value:element['id'], label:element['name']})
    });
    return output
  }

  useEffect(() => {
    console.log(foreignData)
    switch (currentAction) {
      case 'updating':
        if (actionActiveState === 'cancel') {
          setDisplayEdit(false);
          setCurrentValue(defaultValue);
          handleActionCancel();
        } else if (actionActiveState === 'confirm') {
          setDisplayEdit(false);
          setCurrentValue(currentValue);
          setDefaultValue(currentValue);
          handleEditConfirm(currentValue, isEdited);
          setIsEdited(false);
        } else if (actionActiveState === 'inactive') {
          
        }
        break;
      case 'creating':
        if (actionActiveState === 'confirm') {
          if (!props.value) {
            handleCreateConfirm(currentValue);
          } 
        } else if (actionActiveState === 'cancel') {
          handleActionCancel();
        }
        break;
      case 'reading':  
        async function getForeignValue () {
          if (foreignData) { 
            var result = await fetchApi('get', `/v1/${Object.keys(foreignData)[0]}/${currentValue}`);
            setForeignValue(result);
          } 
        }
        if (!foreignValue) {
          getForeignValue();
        }
        break;
    }
  }, [currentAction, actionActiveState]);
  return (
    <>
      {  
      props.value ? (
        foreignData? (
          !displayEdit ? (
            <span
              onDoubleClick={() => {setDisplayEdit(true); handleDoubleClick()}}>
                { foreignValue['name'] }
            </span>
          ) : (
            <Select
              options={prepareDataSelect(foreignData[Object.keys(foreignData)[0]])} 
              onChange={e => {setIsEdited(true); setCurrentValue(e.value)}}
              value={prepareDataSelect(foreignData[Object.keys(foreignData)[0]]).filter( (option) => {
                return option.value === currentValue;
              })}
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
      ) : (
        foreignData ? (
          <Select
            options={prepareDataSelect(foreignData[Object.keys(foreignData)[0]])} 
            onChange={e => {setIsEdited(true); setCurrentValue(e.value)}}
          />
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