import React, { useEffect, useState } from 'react';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

function InputWrapper(props) {

  const [displayInput, setDisplayInput] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value);
  const [defaultValue, setDefaultValue] = useState(props.value);
  const [isEdited, setIsEdited] = useState(false);

  const { 
    handleDoubleClick, 
    handleActionCancel, 
    handleEditConfirm, 
    currentAction, 
    actionActiveState, 
    handleCreateConfirm
  } = props;

  useEffect(() => {
    // console.log(currentAction + "       "+ actionActiveState)
    if (currentAction === 'updating') {
      if (actionActiveState === 'cancel') {
        setDisplayInput(false);
        setCurrentValue(defaultValue);
        handleActionCancel();
      } else if (actionActiveState === 'confirm') {
        setDisplayInput(false);
        setCurrentValue(currentValue);
        setDefaultValue(currentValue);
        handleEditConfirm(currentValue, isEdited);
        setIsEdited(false);
      }
    } else if (currentAction === 'creating') {
      if (actionActiveState === 'confirm') {
        if (!props.value) {
          handleCreateConfirm(currentValue);
        } 
      } else if (actionActiveState === 'cancel') {
        handleActionCancel();
      }
    }
  }, [currentAction, actionActiveState]);
  return (
    <>
      {  
        !props.value ? (
          <input
              type="text"
              onChange={(e) => {setCurrentValue(e.target.value); setIsEdited(true)}}
              autoFocus
            />
        ) : (
          displayInput ? (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => {setCurrentValue(e.target.value); setIsEdited(true)}}
              autoFocus
            />
          ) : (
            <span
              onDoubleClick={() => {setDisplayInput(true); handleDoubleClick()}}
            >
              {props.value}
            </span>
          )
        ) 
      }
    </>
  )
}

export default InputWrapper