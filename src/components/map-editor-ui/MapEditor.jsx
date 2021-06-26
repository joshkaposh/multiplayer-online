import React, {useState} from 'react';



function Button({ text,setSelection,id }) {
    const handleClick = (e) => {
        e.preventDefault();
        setSelection(e.target.value)
    }

    return <button id={id?id:null}  className='editor-button' onClick={handleClick} value={text} >{text}</button>
}

export default function MapEditor() {

    const [selection, setSelection] = useState('none')

    return (
        <>
        <div className='editor' >
            <div className='editor-selected'>
                <h4>Current Selection: <span id='editor-selected-value'>{selection}</span> </h4>
            </div>
            <div className="tools">
                <Button id={'undo'} text={'undo'} selection={selection} setSelection={setSelection}/>
                <Button id={'redo'} text={'redo'} selection={selection} setSelection={setSelection}/>
                <Button id={'clear'} text={'clear'} selection={selection} setSelection={setSelection} />
                {/* <Button id={'save'} text={'save'} selection={selection} setSelection={setSelection} /> */}
            </div>
            <div className='editor-buttons'>
                <Button text={'tree'} selection={selection} setSelection={setSelection} />
                <Button text={'castle'} selection={selection} setSelection={setSelection} />
            </div>


            
            </div>
            <div id='current-btn'>
                <div>
                    <h3>Btn: <span id="btnvalue"></span> </h3>
                    <h3>Elasped Time: <span id="timevalue"></span> </h3>
                    
                </div>
                
            </div>
            </>
    )
}