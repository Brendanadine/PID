import './App.css';
import Menu from './Menu.js'
import {useState} from 'react';
import Commande from './Composants/Commande/Commande.js'
import Acceuil from './Composants/Acceuil/Acceuil.js'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Employe from './Composants/Employé/employe';
import Livreur from './Composants/Livreurs/livreur';
import axios from 'axios';
import React from 'react';
import Gestionnaire from './Composants/Gestionnaire/gestionnaire';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


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
const App = (props) => {

    const [num, setNum] = useState(0);    //une "page" = un numéro
    const [choixPlat, setChoixPlat] = useState([]);  //tab utilisé pour une commande de 1 plat

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
  
    const commander = (idCommande) => {
      setNum(1);
        
      const choix = restaurants.data.filter(item =>{    //méthode pour afficher la commande choisie
      return item.id === idCommande
        })
      setChoixPlat(choix);
    }
      
    const modifierPage = (a) => {
        setNum(a)
    }

  switch(num){
    case 0 : return(    //afficher page d'acceuil
      <div>
        <Menu modifierNum={modifierPage}/>
        {restaurants.isError && <div>Une erreur est survenue.</div>}
        {restaurants.isLoading && <div>Chargement en cours...</div>}
        {!(restaurants.isLoading || restaurants.isError) && (
          <ul>
            {restaurants.data.map((item, index)=>{
              return(
                <Acceuil txt={item.nomResto} eat={item.plat} key={index} id={item.id} commander={commander}/>
              )
            })}
          </ul>
        )}  
        <div id='divcarte'>
          <MapContainer center={[50.8366, 4.3707]} zoom={13}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {restaurants.data.map((item)=>(
              <Marker position={[item.lat, item.long]} title={item.nomResto} key={item.id}>
              <Popup>{item.nomResto} <br/>{item.plat} <br/>
              <button onClick={()=>commander(item.id)}>Commander</button>
              </Popup>
            </Marker>
            ))}
            
          </MapContainer>
        </div>
      </div>
    );

    case 1 : return(    //page de commande
      <div>
        <Menu modifierNum={modifierPage}/>
        <Commande choixPlat={choixPlat} modifierNum={modifierPage}/> 
      </div>
    );

    case 2 : return(
      <div>
        <Menu modifierNum={modifierPage}/>
        <Gestionnaire/>      
      </div>
    );
    case 3 : return(
      <div>
        <Menu modifierNum={modifierPage}/>
        <Employe/>
        
      </div>
    );
    case 4 : return(
      <div>
        <Menu modifierNum={modifierPage}/>
        <Livreur/>
      </div>
    );
    default : return(<>Problème</>)
  }
  
}


export default App;
