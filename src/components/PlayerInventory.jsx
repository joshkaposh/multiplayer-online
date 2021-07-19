import React,{useState,useEffect} from 'react';

function Ore({ type }) {
    return (
        <li className='sell-list-item'>
            <div className='sell-list-item-info'>
                <span className={type + '-value'}></span>
                <span className={type + '-count'}></span>
            </div>
            
            <button className={type + '-sell sell-btn'} value={type} type='button' >Sell</button>
        </li>)
}

function InventoryNav() {
  return (
    <div className='inventory-nav'>
      <ul className='inventory-nav-list'>
        <button className="inventory-nav-item"></button>
        <button className="inventory-nav-item"></button>
        <button className="inventory-nav-item"></button>
        <button id='inventory-exit'>X</button>
      </ul>
    </div>
  )
}

function SellSection() {
  return (
    <div className='sell-section'>
                <h3 className='sell-header'>Ores</h3>
                <ul className='sell-list'>
                    <Ore type={'copper'} />
                    {/* <Ore type={'silver'} />
                    <Ore type={'gold'} /> */}
                </ul>
            </div>
  )
}

function BuySection({header}) {
  return (
    <div className='buy-section'>
      <h3>Buy</h3>
    </div>
  )
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

    // let [isHidden, setVisibility] = useState(false)

    // TODO: fix so player only sees menu when in shop
    return (
      <div className="inventory-closed" id="inventory">
        <InventoryNav />
        <div className='inventory-sections'>
          <BuySection />
          <SellSection />
        </div>
      </div>
    )
}