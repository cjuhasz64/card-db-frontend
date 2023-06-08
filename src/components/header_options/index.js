import React, { useEffect, useState } from 'react';
import CheckBox from '../checkbox';
import './style.scss';

// Create an ElementMaker component
function HeaderOptions(props) {

  const { 
    detectEditCancel, 
    detectEditConfirm, 
    currentAction, 
    detectCreate, 
    detectCreateConfirm,
    detectFilter
  } = props;
  
  useEffect(() => {
    console.log('dd')
  }, [])


  function searchbar () {
    return (
      <input
        onChange={e => {detectFilter('all', e.target.value)}}
      ></input>
    )
  }

  function drawControls() {
    switch (currentAction) {
      case 'updating':
        return (
          <div className='options-edit'>
            <button onClick={() => { detectEditConfirm() }}>✔️</button>
            <button onClick={() => { detectEditCancel() }}>❌</button>
          </div>
        )
      case 'reading':
        return (
          <div className='select-create'>
            <button onClick={() => { detectCreate() }}>CREATE</button>
          </div>
        )
      case 'creating':
        return ( 
          <div className='options-create'>
            <button onClick={() => { detectCreateConfirm() }}>✔️</button>
            <button onClick={() => { detectEditCancel() }}>❌</button>
            <button onClick={() => {  }}>+</button>   
          </div>
        )
      default:
    }
  }

  return (
      <div className='header-options'>
        <div>
          <label>Cards > 0</label>
          <input 
            type='checkbox'
            onChange={e => {detectFilter('quantity', e.target.checked ? '!0' : '')}}
          ></input>

        </div>
        { drawControls() }
        { searchbar() }
      </div>  
  )

  // return (
  //   <>
  //     <div className='header-options'>
  //       {
  //         (currentAction === 'updating') ? (
  //           <div className='options-edit'>
  //             <button onClick={() => { detectEditConfirm() }}>✔️</button>
  //             <button onClick={() => { detectEditCancel() }}>❌</button>
  //           </div>
  //         ) : (
  //           <div className='options-edit'></div>
  //         )
  //       }

  //       {
  //         (currentAction === 'reading') ? (
  //         <div className='select-create'>
  //         <button onClick={() => { detectCreate() }}>CREATE</button>
  //         </div>
  //         ) : (
  //           <div className='select-create'></div>
  //         )
  //       }

  //     {
  //         (currentAction === 'creating') ? (
  //         <div className='options-create'>
  //           <button onClick={() => { detectCreateConfirm() }}>✔️</button>
  //           <button onClick={() => { detectEditCancel() }}>❌</button>
  //           <button onClick={() => {  }}>+</button>   
  //         </div>
  //         ) : (
  //           <div className='options-create'></div>
  //         )
  //       }
  //       <div>
  //         <input></input>
  //       </div>
  //     </div>
    // </>
  // )
}

export default HeaderOptions