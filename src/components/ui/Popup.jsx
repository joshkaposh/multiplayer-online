import React, {useState, useEffect} from 'react';

function PopupMessage(props) {
    return (
        <div className='popup'>
            {props.children}
            
        </div>
    );
}

const useClick = () => {
    const [state, setState] = useState(false);

    const handleState = (e) => {
        e.preventDefault();
        setState(true);
        console.log(state);

    }

    return [state, handleState]

}

export default function DetectKeyDown(props) {

    const [retry, setRetry] = useClick();

    return (

        false ? props.children : 
            <PopupMessage>
                <div className="death-menu">
                    <div className='death-menu-header'>
                        <h2>You died!</h2>
                    </div>
                    <ul className='death-menu-nav'>
                        <h3 onClick={setRetry}>Play Again?</h3>
                        <h3>Stats</h3>
                        <h3>Exit</h3>
                    </ul>
                </div>
        </PopupMessage>
    )
}