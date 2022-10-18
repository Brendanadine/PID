import React from "react";
import {useState} from 'react';
import axios from 'axios';
import moment from 'moment';


function Commande ({choixPlat, modifierNum}) {

    const [confirmation, setConfirmation] = useState({});

    const [rempli, setRempli] = useState(false);
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

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setConfirmation(values => ({...values, [name]: value}))     //MAJ du tab avec les valeurs de l'ancien 
        
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setConfirmation(values => ({...values, "restaurant" : choixPlat[0].nomResto, "adresse" : choixPlat[0].adresseResto,
        "commune" : choixPlat[0].communeResto,
         "plat" : choixPlat[0].plat, "etatCommande" : 0, "dateCréation" : moment().format("X"), "livreur" : ""}))
        setRempli(!rempli);  //change l'état, le form est full, on passe à l'affichage suivant

    }  


    const postCommande = () => {
        axios.post("http://localhost:4000/api/commandes", {
            confirmation
        })
        alert("Commande enregistrée ! ")

    }
    const updateResto = (resto) => {
        
        const value = restaurants.data.filter(item=>{
            return(item.nomResto === resto)        
        })
        axios.post("http://localhost:4000/api/restaurants", {
            value
        })
        
    }

    
    

    if(rempli===false){
        return(

            <div className="container bg-warning">
                <button onClick={()=>modifierNum(0)}>Retour</button>
                <p>Votre commande : </p>
                <p>{choixPlat.map((item, index)=>{
                return(
                    <div key={index}>
                        <>Restaurant : {item.nomResto}</>
                    </div>    
                )
                })}</p>
                <p>{choixPlat.map((item, index)=>{
                return(
                    <div key={index}>
                        <>Votre plat : {item.plat}</>
                    </div>    
                
                )
                })}</p>

                <div>
                    <form className="mt-5" onSubmit={handleSubmit}>

                        <label htmlFor="nomClient">Votre nom : </label><br/>
                        <input onChange={handleChange} type="text" name="client" value={confirmation.client} id="nomClient" className="form-control" 
                         required="required"/><br/>

                        <label htmlFor="nbRepas">Nombre de repas : </label><br/>
                        <input onChange={handleChange} type="number" name="nbRepas" value={confirmation.nbRepas} id="NbRepas" className="form-control" 
                        placeholder="1" required="required" min="1" max="20" /><br/>

                        <label htmlFor="rue">Rue : </label><br/>
                        <input onChange={handleChange} type="text" name="rueClient" value={confirmation.rueClient} id="Rue" className="form-control" 
                        placeholder="Rue" required="required"/><br/>

                        <label htmlFor="numRue">Numéro de maison : </label><br/>
                        <input onChange={handleChange} type="number" name="numMaison" value={confirmation.numMaison} id="NumRue" className="form-control" 
                        placeholder="1"/><br/>

                        <label htmlFor="numBoite">Numéro de boite : </label><br/>
                        <input onChange={handleChange} type="number" name="numBte" value={confirmation.numBte} id="NumBoite" className="form-control" placeholder="Boîte"/><br/>

                        <label htmlFor="cp">Code Postal : </label><br/>
                        <input onChange={handleChange} type="number" name="cpClient" value={confirmation.cpClient} id="Cp" className="form-control" 
                        min="1000" max= "9999"placeholder="1000" required="required"/><br/>

                        <label htmlFor="commune">Commune : </label><br/>
                        <input onChange={handleChange} type="text" name="communeClient" value={confirmation.communeClient} id="Commune" className="form-control" 
                        placeholder="Bruxelles" required="required" pattern="[A-za-z]+"/><br/>
                        
                        <div className="text-center">
                            <input type="submit"className="btn bg-primary text-light mb-5"/>
                            
                        </div>
                    </form>
                </div>
            </div>


        )
    }else{
        return(
            <div>
                
                <p>Confirmation de votre commande</p>
                <div>
                    <table>
                        <tr>
                            <td>Restaurant : </td>
                            <td>{choixPlat[0].nomResto}</td>
                        </tr>
                        <tr>
                            <td>Votre plat : </td>
                            <td>{choixPlat[0].plat}</td>
                        </tr>
                        <tr>
                            <td>Votre nom : </td>
                            <td>{confirmation.client}</td>
                        </tr>
                        <tr>
                            <td>Nombre de repas : </td>
                            <td>{confirmation.nbRepas}</td>
                        </tr>
                        <tr>
                            <td>Votre adresse : </td>
                            <td>{confirmation.rueClient}</td>
                        </tr>
                        <tr>
                            <td>Votre numéro de maison : </td>
                            <td>{confirmation.numMaison}</td>
                        </tr>
                        <tr>
                            <td>Votre numéro de boîte :</td>
                            <td>{confirmation.numBte}</td>
                        </tr>
                        <tr>
                            <td>Votre Code Postal : </td>
                            <td>{confirmation.cpClient}</td>
                        </tr>
                        <tr>
                            <td>Votre commune : </td>
                            <td>{confirmation.communeClient}</td>
                        </tr>
                    </table>
                    
                </div>
                <button onClick={()=>{postCommande();updateResto(choixPlat[0].nomResto);modifierNum(0)}}>Confirmer la commande</button>
            </div>
        )
    }    
}


export default Commande;