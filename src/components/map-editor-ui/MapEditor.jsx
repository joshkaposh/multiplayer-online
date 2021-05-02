import React, {useState} from 'react';



function Button({ text,setSelection }) {
    const handleClick = (e) => {
        e.preventDefault();
        setSelection(e.target.value)
    }

    return <button className='editor-button' onClick={handleClick} value={text} >{text}</button>
}

export default function MapEditor({selection,setSelection,canvasRef}) {

    return (
        <div className='editor'>
            <div className='editor-selected'>
                <h4>Current Selection: <span id='editor-selected-value'>{selection}</span> </h4>
            </div>
            <ul className='editor-buttons'>
                <Button text={'tree'} selection={selection} setSelection={setSelection} />
                <Button text={'castle'} selection={selection} setSelection={setSelection} />
            </ul>
        </div>
    )
}