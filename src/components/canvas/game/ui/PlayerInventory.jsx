import mystery_ore0 from '../../images/mystery-ore-0.png';
import mystery_ore1 from '../../images/mystery-ore-1.png';
import mystery_ore2 from '../../images/mystery-ore-2.png';

const images = {};

images.mystery_ore0 = new Image();
images.mystery_ore0.onerror = console.error;
images.mystery_ore0.src = mystery_ore0;

images.mystery_ore1 = new Image();
images.mystery_ore1.onerror = console.error;
images.mystery_ore1.src = mystery_ore1;

images.mystery_ore2 = new Image();
images.mystery_ore2.onerror = console.error;
images.mystery_ore2.src = mystery_ore2;

const Ore = ({ type, cost }) => {
    let imgType;

    if (type === 'gold' || type === 'iron' || type === 'copper') {
        imgType = 0;
    } else if (type === 'ruby') {
        imgType = 1
    } else {
        imgType = 2
    }

    return (
        <div  className={`ore-container-outter`}>
            <div className={`ore-container-inner`}>
                <div className={`mystery-ore mystery-ore-${imgType} ${type}-mystery-image`} ></div>
                <div id={type} className={`ore`} >
                    <div className='ore-inner-container'>
                        <div className='ore-header'>
                            <span>x<span id={`${type}-count`}></span> {type}</span>
                        </div>

                        <div className='ore-stats'>
                            <span className='ore-stat'>$<span>{cost}</span></span>
                            <button className='ore-sell sell-btn' type='button' id={`sell-${type}`}>sell</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
    )
}

function Ores({ ores }) {
    return (
        <ul className='ores'>
            {
                Object.keys(ores).map(ore => {
                    return <Ore type={ore} cost={ores[ore].cost} />
                })
            }
        </ul>
    )
}

const Skill = ({ stats }) => {

    const regex = /([_\W])+/g

    const name = stats.name.replace(regex,' ')


    return (
    
        <div className='skill'>
            <span>level: <span id={`${stats.name}-level`}></span></span>
            <span>cost: <span id={`upgrade-${stats.name}-cost`}></span></span>
            <span>current: <span id={`upgrade-${stats.name}-current`}></span></span>
            <button id={`upgrade-unlock-${stats.name}`} className={`upgrade upgrade-btn upgrade-${stats.name}`} >unlock {name}</button>
            <button id={`upgrade-level-${stats.name}`} className={`upgrade upgrade-btn upgrade-${stats.name}`} >upgrade {name}</button>
        </div>
    )

}

function Upgrades({ skills }) {
    return (
        <ul className='player-upgrades'>
                {
                skills.map((skill) => {
                        return <Skill key={skill.name} stats={skill} />
                    })
                }
            </ul>
    )
}

export default function PlayerSkills({ skills,ores }) {
    
    return (
            <div id='player-inventory' className='player-skills-container closed'>
                <div className='player-money'>
                    <h3>Money: <span id='currency' /></h3>
                </div>
                <div className='player-heal'>
                    <div className='player-heal-stats'>
                        <p>Heal</p>
                        <span>cost: <span id='heal-cost'></span></span>
                    </div>
                    <button id='heal'>heal</button>
                    </div>
                <div className='player-skills'>
                    <div className='player-ores'>
                        <h3>Ores</h3>
                        <Ores ores={ores} />
                    </div>
                    <div className='player-upgrades'>
                        <div>
                            <h3>Upgrades</h3>
                            <Upgrades skills={skills} />

                        </div>
                    </div>
                </div>
            </div>
    )
    
}