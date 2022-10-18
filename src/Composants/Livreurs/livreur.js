import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import Restaurants from './restaurants';

const livreursReducer = (state, action) => {

    switch(action.type){
      case "FETCH_INIT" :
        return{
          ...state, 
          isLoading : true,
          isError : false
        }
      case "FETCH_SUCCESS" :
        return{
          ...state, 
          isLoading : false,
          isError : false,
          data : action.payload,
        }
      case "FETCH_FAILURE" :
        return{
          ...state, 
          isLoading : false,
          isError : true,
        }
      default :
      throw new Error();
    }  
  }


function Livreur () {

    const [etat, setEtat] = useState(false);
    const [livreur, setLivreur] = useState();
  console.log(livreur);
    const connexion = (id) => {
        setEtat(!etat);
        setLivreur(id);
    }
    const [livreurs, dispatchLivreurs] = React.useReducer(livreursReducer, {
        data : [],                      
        isLoading : false,
        isError : false,
      })
    React.useEffect(()=>{
        dispatchLivreurs({type : "FETCH_INIT"})    
        axios.get('http://localhost:4000/api/livreurs')
        .then((reponse) => {
          dispatchLivreurs({
            type : "FETCH_SUCCESS", 
            payload : reponse.data, 
          });
        })
        .catch(()=>{
          dispatchLivreurs({
            type : "FETCH_FAILURE"
          });
        })
    }, [])

    if(etat===false){
        return(
            <div>
                {livreurs.isError && <div>Une erreur est survenue.</div>}
                {livreurs.isLoading && <div>Chargement en cours...</div>}
                {!(livreurs.isLoading || livreurs.isError) && (
                <ul>
                    {livreurs.data.map((item, index)=>{
                    return(
                        <div>
                            <li key={index}>{item.nom} {item.prenom}</li>
                            <button onClick={()=>{connexion(item.id)}}>Se connecter</button>
                        </div>
                    )
                    })}
                </ul>
                )} 
            </div>
        )
    }else{
        return(
            <div>
                <Restaurants livreur={livreur}/> 
            </div>
        )
        
    }    
}


export default Livreur;