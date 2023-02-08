import React, { useEffect, useRef, useState } from 'react';
import logger from '../../util/logger';
import LetterR from './letter_r';
import LetterP from './letter_p';
import LetterA from './letter_a';
import { components } from 'react-select';


// import './style.scss'

function CheckBox(props) {

  const [checked, setChecked] = useState(props.defaultState);
  const [active, setActive] = useState(false)

  const {
    svgImage,
    displayEdit,
    setCurrentValue,
    defaultState,
    detectSort,
    colName,
    currentAction,
    activeSortCol,
    displayName
  } = props;

  useEffect(() => {
    //console.log(currentAction, active, colName)
    if (setCurrentValue) setCurrentValue(defaultState)

    if (currentAction === 'sorting') {
      if (activeSortCol === colName) setChecked(!checked)
    } else if (currentAction === 'reading' && active && activeSortCol != colName) {
      setChecked(0); 
      setActive(0);
    }
  
  }, [currentAction, activeSortCol])


  useEffect(() => {
    setChecked(defaultState)
  }, [defaultState])

  switch (svgImage) {
    case 'R':
      return (
        <span
          onDoubleClick={e => {setChecked(!checked); setCurrentValue(!checked)}}>
          <LetterR
            fill={checked ? 'black' : 'lightgrey'}
            letterFill={displayEdit ? '#f08080' : 'white'}
          />
        </span>
      )
    case 'P':
      return (
        <span
          onDoubleClick={e => {setChecked(!checked); setCurrentValue(!checked)}}>
          <LetterP
            fill={checked ? 'black' : 'lightgrey'}
            letterFill={displayEdit ? '#f08080' : 'white'}
          />
        </span>

      )
    case 'A':  
      return (
        <span
          onDoubleClick={e => {setChecked(!checked); setCurrentValue(!checked)}}>
          <LetterA
            fill={checked ? 'black' : 'lightgrey'}
            letterFill={displayEdit ? '#f08080' : 'white'}
          />
        </span>
      )  
    default:
      var rotated;
      if (checked) rotated = 'rotate(180)';
      return (
        <span
          onDoubleClick={e => { if (!active) {setActive(true); detectSort(colName, checked)}}}
          onClick={e => { if (active){ detectSort(colName, checked) }}}>
          {`${displayName} `}
          {
          !active ? '' : 
            <svg viewBox={'0 0 100 100'} height={'10'} width={'10'} transform={rotated}>
              <polygon points={'50 15, 100 100, 0 100'}/>
            </svg>
          }
        </span>
      )
  }
}

export default CheckBox