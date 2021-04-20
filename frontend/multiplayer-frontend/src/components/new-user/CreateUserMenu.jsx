import React, {useState} from 'react';


export default function CreateUserMenu({username,enterName}) {
    const [name, setName] = useState('')

    const handleChange = (e) => {
        setName(e.target.value)
    } 

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name);
        enterName(name)
    }
    return <form onSubmit={handleSubmit}>
        <input type="text" name="username" onChange={handleChange}/>
        <input type="submit" value="Submit"/>
    </form>
}