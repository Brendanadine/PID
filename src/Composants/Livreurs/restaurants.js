import axios from "axios";
import React from 'react'
import '../Livreurs/restaurant.css';
import {useState} from 'react';
import moment from 'moment';

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
const restaurantsReducer = (state, action) => {

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


function Restaurants (livreur) {
    
    const [etat, setEtat] = useState(false);
    const [etat2, setEtat2] = useState(false);
    const [update, setUpdate] = useState(false);
    const [num, setNum] = useState();
    const [resto, setResto] = useState();
    const [timer, setTimer] = useState();
     
    const open = (id) => {
      let number = (window.prompt("Entrez le numero de la commande à livrer : "));
      if(number == id){
        setNum(id);
        setEtat2(!etat2);
      }
      else{
        alert("Numéro incorrect");
        setEtat(true);
      }
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

    const selectResto = (resto) => {
      setEtat(!etat);
      setResto(resto);
    }

    const comLivrée = (index) => {
      if(window.confirm("Commande livrée ?")){
      const com = commandes.data[index];
      com.confirmation.livréeHeure = moment().format('X');
      com.confirmation.livreur = livreur.livreur;
      axios.post("http://localhost:4000/api/comLivree", {
        com
      })
      setUpdate(!update);
      setEtat(false);
      setEtat2(false);
      setTimer(0);
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
    }, [update])

    if(etat===false){
      return(
        <div>
          <h3>Restaurants avec des plats à livrer : </h3>
          {restaurants.data.map((item, index)=>{
            if(item.nbComPrête > 0){
              return(
                <div>
                  <li key={index}>{item.nomResto} <button onClick={()=>{selectResto(item)}}>Selectionner</button></li>
                  <p>Nombre de commandes prêtes en attente : {item.nbComPrête}</p>
                </div>
                
              )
            }
          })}
        </div>
      )
    }
    else{
      if(etat2===false){
        return(

          <div>
            <button onClick={()=>{setEtat(!etat)}}>Back</button>
              <h3>{resto.nomResto } - Commandes à livrer : </h3>
              <h6>Adresse du restaurant : </h6>
              <p>{resto.adresseResto} à {resto.communeResto}</p>
                  {commandes.isError && <div>Une erreur est survenue.</div>}
                  {commandes.isLoading && <div>Chargement en cours...</div>}
                  {!(commandes.isLoading || commandes.isError) && (
                  <ul>
                      {commandes.data.map((item, index)=>{
                        if(item.confirmation.etatCommande === 1 && item.confirmation.restaurant === resto.nomResto){
                          return(
                            <div>
                                <li key={item.id}>Commande n° {item.id} -
                                Nombres de repas : {item.confirmation.nbRepas}&nbsp;  
                                <button onClick={()=>{open(item.id)}}>Livrer</button></li><br/>
                            </div>
                          )
                        }
                      })}
                  </ul>
                  )} 
          </div>
        )
      }else{
        return(
          <div>
            {commandes.data.map((item, index)=>{
              if(item.id === num){
                return(
                  <div>
                    <h4 key={item.id}>Commande n° {item.id}</h4>
                    <table>
                      <tr>
                          <td>A livrer : {item.confirmation.plat}  </td>
                          <td>&nbsp; x {item.confirmation.nbRepas}</td>
                      </tr>
                      <th>Données client :</th>
                      <tr>
                          <td>Client : </td>
                          <td>{item.confirmation.client}</td>
                      </tr>
                      <tr>
                          <td>Adresse : </td>
                          <td>{item.confirmation.rueClient} - {item.confirmation.numMaison} </td>
                      </tr>
                      <tr>
                          <td>Boite : </td>
                          <td>{item.confirmation.numBte}</td>
                      </tr>
                      <tr>
                          <td>Commune : </td>
                          <td>{item.confirmation.cpClient} {item.confirmation.communeClient}</td>
                      </tr>
                      <br />
                    </table>
                    <button onClick={()=>{comLivrée(index)}}>Commande livrée !</button>
                  </div>
                )
              }
            })}
            
        </div>
        )
        
      }
    }
}

export default Restaurants;