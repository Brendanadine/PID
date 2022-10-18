import React from "react";

function Menu (props) {


    return(

        <div className="container bg-warning" >
            <div className= "navbar">
                <div className="navbar navbar-expand-lg">
                    <ul className="navbar-nav">
                        <li className="nav-item ">
                            <button onClick={()=>{props.modifierNum(0)}}>Acceuil</button>
                        </li>
                        <li className="nav-item ">
                            <button onClick={()=>{props.modifierNum(2)}}>Connexion Gestionnaire</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={()=>{props.modifierNum(3)}}>Connexion Employés</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={()=>{props.modifierNum(4)}}>Connexion Livreurs</button>
                        </li>
                     </ul>
                </div>
            </div>
            <div>
                <h3>Application For Food</h3>
            </div>
        </div>


    )
}

export default Menu;