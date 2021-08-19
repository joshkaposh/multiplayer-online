import React from 'react';

function Stat({label,id}) {
    return (
        <li>
            <h5>{label}: <span id={id}></span></h5>
        </li>
    )
}

function SurvivalStats() {
    return (
        <div className='death-menu-survival-stats'>
            <h3>Time Survived: <span id="survival-stat-duration"></span></h3>
            <h3>Score: <span id="survival-stat-score"></span></h3>
        </div>
    )
}


function OreStats({ ores }) {
    return Object.keys(ores).map(key => {
       return <Stat label={key} id={`${key}-total-mined`} />
    })
}

export default function DeathMenu({ ores }) {
    return (
            <div id='death-menu' className='hide'>
                <ul className='death-menu-stats'>
                    
                    <Stat label='total mined' id='total-mined' />
                    <OreStats ores={ores} />
                    <SurvivalStats />
                </ul>
                <div className='death-menu-buttons'>
                    <button id='retry-game' className="death-btn">Retry</button>
                    <button id='exit-game' className="death-btn">Exit</button>
                </div>
            </div>
        
    )
}