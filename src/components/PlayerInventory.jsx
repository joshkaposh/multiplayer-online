import React,{useState} from 'react';

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
        <li className={`sell-list-item sell-list-item-${type} sell-list-item-img-bg`}>
            <div className='sell-list-item-info'>
                <span className={type + '-value'}></span>
                <span className={type + '-count'}></span>
            </div>
            <button id={`${type}-sell-all`} className='sell-btn sell-all-btn' value={type} >Sell All</button>
            <button id={`${type}-sell`} className='sell-btn' value={type} >Sell</button>

      </li>)
}

function SellSection({ ores }) {
  
  return (
    <div className='sell-section'>
     
      <h3 className='sell-header'>Ores</h3>
      <ul className='sell-list'>
         {
          Object.keys(ores).map(ore => {
            return <SellItem key={ore} type={ore} />
          })
        }
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
          return <UpgradeItem key={upgrade.id} id={upgrade.id} name={capitalizeFirstLetter(upgrade.name)} desc={upgrade.desc} />
      })}
      </ul>
    </div>
  )
}

function BuySections({ sections, active }) {
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
      {sections.map((section, i) => {
      if (section.title === view) {
        return <BuySection key={i} title={section.title} upgrades={section.upgrades} active={true}  />
    }
    return <BuySection key={i} title={section.title} upgrades={section.upgrades} />
  })}
    </div>
    
  ) 
}

export default function Inventory({ores}) {

  const healHP = { id:'heal', name: 'food', desc: 'heals player' };
  const increaseHP = {id:'health', name: 'tougher skin', desc: 'increases max hp' };

  const test1 = {id: 'test1', name: 'test1', desc: 'test1desc' };
  const test2 = {id: 'test2', name: 'test2', desc: 'test2desc' };


  const health = { title: 'health', upgrades: [healHP, increaseHP] }
  const tools = {title: 'tools',upgrades: [test1, test2]}
  
  const sections = [health,tools]
  
    return (
      <div className="inventory-closed" id="inventory">
               <button id='inventory-exit'>X</button>

        {/* <InventoryNav /> */}
        <div className='inventory-sections'>
          <BuySections sections={sections} active={health} />
          <SellSection ores={ores}  />
        </div>
      </div>
    )
}