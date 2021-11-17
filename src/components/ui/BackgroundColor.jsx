import React, {useRef, useEffect} from 'react';

export default function BackgroundColor(props) {
    const bgColorRef = useRef();
    const bgButtonRef = useRef();
    useEffect(() => {
        if (props.bgColor === 'white') {
            bgColorRef.current.classList.remove('black');
            bgColorRef.current.classList.add('white');
        } else {
            bgColorRef.current.classList.remove('white');
            bgColorRef.current.classList.add('black');
        }
    },[props.bgColor])

    return (
        <div id='settings' className={`${props.bgColor}`} ref={bgColorRef}>
            <p>Background Theme: <button
                className={'bgColorSetter'}
                onClick={props.handleClick}
                ref={bgButtonRef}
            >
                {props.bgColor}
            </button></p>
            {props.children}
        </div>
    )
}