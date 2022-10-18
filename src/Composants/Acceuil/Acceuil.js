import React from "react";

function Acceuil (props) {

    return(

        <div>
            <p>{props.txt} - {props.eat}</p>
            <button onClick={()=>{props.commander(props.id)}}>Commander</button>
        </div>


    )
}

export default Acceuil;