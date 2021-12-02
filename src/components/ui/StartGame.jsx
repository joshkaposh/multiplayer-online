import React, {useState} from 'react';

export default function StartGame(props) {

    const [clicked, setClicked] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        setClicked(true)
    }

    console.log(clicked);


    return (
     
       
            <div className='start-game'>
            <button id='start' onClick={handleClick}>Play</button>
            {clicked && props.children}
            </div>
            
    
    )
}