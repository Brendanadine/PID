import axios from 'axios';
import React, {useState } from 'react';
import moment from 'moment';

function Employe ({confirmation}) {

    const [etat, setEtat] = useState(false);
    const [restoSelect, setRestoSelect] = useState([]);
    const [update, setUpdate] = useState(false);
    const [timer, setTimer] = useState(10);

    const changeEtat = (resto, plat) => {
        const select = [resto, plat]
        setRestoSelect(select);
        setEtat(!etat);
    }
    
    React.useEffect(()=>{
      setInterval(()=>{
        setTimer(timer => timer -1);
      }, 1000);
    },[])

    if(timer===0){
      setUpdate(!update);
      setTimer(10);
    } 
    

    const restaurantsReducer = (state, action) => {

        switch(action.type){
          case "FETCH_INIT" :  //chargement en cours
            return{
              ...state, 
              isLoading : true,
              isError : false
            }
          case "FETCH_SUCCESS" : //chargement réussi
            return{
              ...state, 
              isLoading : false,
              isError : false,
              data : action.payload,
            }
          case "FETCH_FAILURE" : //chargement en erreur
            return{
              ...state, 
              isLoading : false,
              isError : true,
            }
          default :
          throw new Error();
        }  
    }

    const commandesReducer = (state, action) => {

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

    const [commandes, dispatchCommandes] = React.useReducer(commandesReducer, {
        data : [],                      
        isLoading : false,
        isError : false,
      })
    React.useEffect(()=>{
        dispatchCommandes({type : "FETCH_INIT"})    
        axios.get('http://localhost:4000/api/commandes')
        .then((reponse) => {
          dispatchCommandes({
            type : "FETCH_SUCCESS", 
            payload : reponse.data, 
          });
        })
        .catch(()=>{
          dispatchCommandes({
            type : "FETCH_FAILURE"
          });
        })
    }, [update])

    const [restaurants, dispatchRestaurants] = React.useReducer(restaurantsReducer, {
    data : [],                      
    isLoading : false,
    isError : false,
    })
    React.useEffect(()=>{
    dispatchRestaurants({type : "FETCH_INIT"})    
    axios.get('http://localhost:4000/api/restaurants')
    .then((reponse) => {
        dispatchRestaurants({
        type : "FETCH_SUCCESS", 
        payload : reponse.data, 
        });
    })
    .catch(()=>{
        dispatchRestaurants({
        type : "FETCH_FAILURE"
        });
    })
    }, [])

    const commandePrete = (nb, id) => {

        if (window.confirm("Commande prête avec "+nb+" repas(s)? ")){
          const comOk=(commandes.data[id]);
          comOk.confirmation.prêteHeure = moment().format("X");
          
          axios.post("http://localhost:4000/api/commandesOk", {
            comOk
          })
          setTimer(0);
          setUpdate(!update);
          
        }   
    }
    


    if(etat===false){
        return(
        <div>
            
            {restaurants.isError && <div>Une erreur est survenue.</div>}
            {restaurants.isLoading && <div>Chargement en cours...</div>}
            {!(restaurants.isLoading || restaurants.isError) && (
            <ul>
            {restaurants.data.map((item, index)=>{
              return(
                  <div>
                        <li key={index}>{item.nomResto}</li>
                        <button onClick={()=>changeEtat(item.nomResto, item.plat)}>Se connecter</button>
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
                <div>
                    {commandes.isError && <div>Une erreur est survenue.</div>}
                    {commandes.isLoading && <div>Chargement en cours...</div>}
                    {!(commandes.isLoading || commandes.isError) && (
                    <div>
                        <p>Mise à jour dans {timer} secondes</p>
                        <h4>Restaurant : {restoSelect[0]}</h4>
                        <h4>Plat à préparer : {restoSelect[1]}</h4>
                        <ul>
                        {commandes.data.map((item, index)=>{
                        
                        if(item.confirmation.restaurant === restoSelect[0] && 
                          item.confirmation.etatCommande === 0){
                           return(
                            <div>
                                    <li key={item.id}>Commande n° {item.id}
                                        <p>Date et heure : 
                                        {(moment.unix(item.confirmation.dateCréation).format(" dddd, DD/MM/YYYY, HH:mm:ss"))} <br/>
                                        Nombre de repas : {item.confirmation.nbRepas}</p>
                                        <p>{item.confirmation.prête}</p>
                                        
                                        <button onClick={()=>{commandePrete(item.confirmation.nbRepas, index)}}>Commande prête</button>
                                        
                                    </li>   
                            </div>
                            
                            ) 
                        }
                        })}
                        </ul>
                    </div>
                    )} 
                </div>
        </div>
        )
    }
    
    

}


export default Employe;