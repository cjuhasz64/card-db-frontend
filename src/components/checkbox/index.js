import React, { useEffect, useRef, useState } from 'react';
import fetchApi from '../../util/fetchApi';
import Select from 'react-select';
import { json } from 'react-router-dom';
import logger from '../../util/logger';
import LetterR from './letter_r';
import LetterP from './letter_p';
import LetterA from './letter_a';
import userEvent from '@testing-library/user-event';

// import './style.scss'

function CheckBox(props) {

  const [checked, setChecked] = useState(props.defaultState);

  const {
    svgImage,
    displayEdit,
    setCurrentValue,
    defaultState
  } = props;

  useEffect(() => {
    setChecked(defaultState);
    setCurrentValue(defaultState)
  }, [])


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
  }
}

export default CheckBox