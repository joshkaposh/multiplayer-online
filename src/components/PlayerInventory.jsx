import React,{useState,useEffect} from 'react';

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)


function UpgradeItem({id,name,desc}) {
  return (
    <li className='buy-list-item'>
      <div className='buy-list-item-info'>
        <h5><span id={`buy-list-item-${id.toLowerCase()}-cost`}></span></h5>
        <h4>{name}</h4>
        <p>{desc}</p>
      </div>
      <button id={'buy-'+id.toLowerCase()} className={'buy-btn buy-' + name.toLowerCase()} value={name}>Buy</button>
    </li>
  )
}

function SellItem({ type }) {
    return (
        <li className={`sell-list-item sell-list-item-${type}`}>
            <div className='sell-list-item-info'>
                <span className={type + '-value'}></span>
                <span className={type + '-count'}></span>
            </div>
            <button id={`${type}-sell-all`} className='sell-btn sell-all-btn' value={type} >Sell All</button>
            <button id={`${type}-sell`} className='sell-btn' value={type} >Sell</button>

      </li>)
}

function InventoryNav() {
  return (
    <div className='inventory-nav'>
      <ul className='inventory-nav-list'>
        <button className="inventory-nav-item">Heals</button>
        <button className="inventory-nav-item"></button>
        <button className="inventory-nav-item"></button>
      </ul>
    </div>
  )
}

function SellSection() {
  return (
    <div className='sell-section'>
                <h3 className='sell-header'>Ores</h3>
                <ul className='sell-list'>
                    <SellItem type={'copper'} />
                    <SellItem type={'iron'} />
                    {/* <Ore type={'gold'} /> */}
                </ul>
            </div>
  )
}

function BuySection({ title, upgrades, active }) {
  return (
    <div className={`buy-section ${active ? 'buy-list-active':'buy-list-inactive'}`}>
      <h3 className='buy-section-title'>Buy {capitalizeFirstLetter(title)}</h3>
      
      <ul className='buy-list'>
        {upgrades.map(upgrade => {
          return <UpgradeItem id={upgrade.id} name={capitalizeFirstLetter(upgrade.name)} desc={upgrade.desc} />
      })}
      </ul>
    </div>
  )
}

function BuySections({ sections,active }) {
  const [view, setView] = useState(active.title);
  const handleNavClick =  (e) => {
    e.preventDefault();
    setView(e.target.value)
  }
  return (
    <div className='buy-sections'>
      <nav className='buy-nav'>
        <ul className='buy-nav-list'>
          <li className="buy-nav-item"><button value='health' onClick={handleNavClick}>health</button></li>
          <li className="buy-nav-item"><button  value='tools' onClick={handleNavClick}>tools</button></li>
        </ul>
      </nav>
      {sections.map(section => {
      if (section.title === view) {
        return <BuySection title={section.title} upgrades={section.upgrades} active={true}  />
    }
    return <BuySection title={section.title} upgrades={section.upgrades} />
  })}
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

  const healHP = { id:'heal', name: 'food', desc: 'heals player' };
  const increaseHP = {id:'health', name: 'tougher skin', desc: 'increases max hp' };

  const test1 = {id: 'test1', name: 'faster drill', desc: 'increases mining speed' };
  const test2 = {id: 'test2', name: 'test2', desc: 'test2desc' };


  const health = { title: 'health', upgrades: [healHP, increaseHP] }
  const tools = {title: 'tools',upgrades: [test1, test2]}
  
  const sections = new Array(health,tools)
  
    return (
      <div className="inventory-closed" id="inventory">
               <button id='inventory-exit'>X</button>

        {/* <InventoryNav /> */}
        <div className='inventory-sections'>
          <BuySections sections={sections} active={health} />
          <SellSection />
        </div>
      </div>
    )
}