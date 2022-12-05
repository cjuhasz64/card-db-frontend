import React, { useState } from 'react';

// Create an ElementMaker component
function HeaderOptions(props) {

  const { detectEditCancel, detectEditConfirm, currentAction, detectCreate, detectCreateConfirm } = props;
  console.log(currentAction)

  return (
    <div className='header-options'>
      {
        (currentAction === 'updating') ? (
          <div className='options-edit'>
            <button onClick={() => { detectEditConfirm() }}>✔️</button>
            <button onClick={() => { detectEditCancel() }}>❌</button>
          </div>
        ) : (
          <div className='options-edit'></div>
        )
      }

      {
        (currentAction === 'reading') ? (
        <div className='select-create'>
        <button onClick={() => { detectCreate() }}>CREATE</button>
        </div>
        ) : (
          <div className='select-create'></div>
        )
      }

    {
        (currentAction === 'creating') ? (
        <div className='options-create'>
          <button onClick={() => { detectCreateConfirm() }}>✔️</button>
          <button onClick={() => { detectEditCancel() }}>❌</button>
          <button onClick={() => {  }}>+</button>   
        </div>
        ) : (
          <div className='options-create'></div>
        )
      }
    </div>
  )
}

export default HeaderOptions