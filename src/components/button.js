
import React, { useState, setSt } from 'react'
import '../css/App.css';




const Button = props => {

    const [text, setText] = useState("test");

    const clicked = () =>{
        if(props.message){
            setText(props.message);
        }
    }

    return (
        <button className="button" onClick={clicked}>
            {text}
        </button>
    );
}

export default Button;