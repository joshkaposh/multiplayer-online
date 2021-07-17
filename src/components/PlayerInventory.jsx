import React,{useState,useEffect} from 'react';

function Ore({ type }) {
    console.log(type);
    return (
        <li className='sell-list-item'>
            <div className='sell-list-item-info'>
                <span className={type + '-value'}></span>
                <span className={type + '-count'}></span>
            </div>
            
            <button className={type + '-sell sell-btn'} value={type} type='button' >Sell</button>
        </li>)
}

function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
    // If pressed key is our target key then set to true
    const  downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
    // Add event listeners
    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return keyPressed;
  }

export default function Inventory(props) {

    let [isHidden, setVisibility] = useState(false)

    // TODO: fix so player only sees menu when in shop


    return (
      <div className='player-inventory inventory-closed'>
            <div className='inventory-nav'>
                <button id='inventory-exit' onClick={(e) => {
                    // e.preventDefault();

                    document.getElementsByClassName('player-inventory')[0].setAttribute('data','inventory-closed')
                    setVisibility(true)
                }}>X</button>
                <ul className='inventory-nav-list'>
                    <button className="inventory-nav-item"></button>
                    <button className="inventory-nav-item"></button>
                    <button className="inventory-nav-item"></button>
                </ul>
            </div>
            <div className='sell-section'>

                <h3 className='sell-header'>Ores</h3>
                <ul className='sell-list'>
                    <Ore type={'copper'} />
                    <Ore type={'silver'} />
                    <Ore type={'gold'} />

                </ul>


            </div>
            <div className='buy-section'></div>
        </div>
    )
}