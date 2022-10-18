import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import moment from 'moment';

const commandesReducer = (state, action) => {

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

const Gestionnaire = () => {

    const [timer, setTimer] = useState(10);
    const [update, setUpdate] = useState(false);
    const [etat, setEtat] = useState(false);
    const [commandes, dispatchCommandes] = React.useReducer(commandesReducer, {
        data : [],                      
        isLoading : false,
        isError : false,
    })

    React.useEffect(()=>{
      setInterval(()=>{
        setTimer(timer => timer -1);
      }, 1000);
    },[])

    if(timer===0){
      setUpdate(!update);
      setTimer(10);
    }  

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
    

    const supprimerCommandes = () => {
      if(window.confirm("Ok")){
        axios.post("http://localhost:4000/api/suppCommandes")
      }
      setEtat(!etat);
      setUpdate(!update);
    }  

    const changeAnnuler = (index) => {
      if(window.confirm("Annuler cette commande ?")){
        const annulerCom = commandes.data[index];
        axios.post("http://localhost:4000/api/annulerCom", {
          annulerCom
        })
        setUpdate(!update);
      }
    }


    if(etat===false){
      return (

            <div>
              <p>Mise à jour dans {timer} secondes</p>
              <p><button onClick={()=>{setEtat(!etat)}}>Supprimer l'ensemble des commandes</button></p>
              
              <div>
                <h3>Commandes :</h3> 
                    {commandes.isError && <div>Une erreur est survenue.</div>}
                    {commandes.isLoading && <div>Chargement en cours...</div>}
                    {!(commandes.isLoading || commandes.isError) && (
                    <table>
                      <thead>
                        <th>Date et heure de commande</th>
                        <th>Adresse livraison</th>
                        <th>Nom restaurant</th>
                        <th>Nom livreur</th>
                        <th>Date et heure préparation</th>
                        <th>Date et heure d'enlèvement</th>
                        <th>Date et heure livraison</th>
                        <th>Etat commande</th>
                      </thead>
                      <tbody>
                        {commandes.data.map((item, index)=>{
                            return(
                              
                                <tr key={index}>
                                  <td>{(moment.unix(item.confirmation.dateCréation).format(" dddd, DD/MM/YYYY, HH:mm:ss"))}</td>
                                  <td>{item.confirmation.rueClient}{item.confirmation.numMaison}</td>
                                  <td>{item.confirmation.restaurant}</td>
                                  <td>{item.confirmation.livreur}</td>
                                  <td>{(moment.unix(item.confirmation.prêteHeure).format(" dddd, DD/MM/YYYY, HH:mm:ss"))}</td>
                                  <td></td>
                                  <td>{(moment.unix(item.confirmation.livréeHeure).format(" dddd, DD/MM/YYYY, HH:mm:ss"))}</td>
                                  <td>
                                  {item.confirmation.etatCommande === 0 && <>En préparation</>}
                                  {item.confirmation.etatCommande === 1 && <>Prête</>}
                                  {item.confirmation.etatCommande === 2 && <>Annulée</>}
                                  {item.confirmation.etatCommande === 3 && <>Livrée</>}
                                  {!(item.confirmation.etatCommande >= 2 ) && <button onClick={()=>{changeAnnuler(index)}}>Annuler</button>}
                                  </td>
                                </tr>
                            )
                        })}
                      </tbody>
                    </table>
                    )}
              </div>                    
            </div>
      )
    }
    else{
      return(
        <div>
          <p>Etes vous sur de vouloir supprimer l'ensemble des commandes ? </p>
          <button onClick={()=>{supprimerCommandes()}}>Supprimer</button>
        </div>
      )
    }   
}  



export default Gestionnaire;