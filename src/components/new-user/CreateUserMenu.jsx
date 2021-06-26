import React, {useState, useEffect} from 'react';


export default function CreateUserMenu({enterName,socket}) {
    const [name, setName] = useState('')
    const [retry, setRetry] = useState(false)

    const handleChange = (e) => {
        setName(e.target.value)
    } 

    const handleSubmit = (e) => {
        e.preventDefault();
        enterName(name)
    }

    useEffect(() => {
        socket.on('retryName', () => {
            setRetry(true)
        })
    })

    return <form onSubmit={handleSubmit}>
        {retry === true ?
            <span className='retry'>Choose a different name</span> :
            ''
        }
        <div className='form-fields' >
            <label htmlFor="username">Username: </label>
            <input type="text" id='username' name="username" onChange={handleChange} />
            <input type="submit" value="Submit"/>
        </div>
        
    </form>
}