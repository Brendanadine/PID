var express = require('express');
var router = express.Router();

let idResto = 0;
let idCommande = 1;
let idLivreur = 0;
let idEmployé = 0;

const restaurants =
[
  {id: idResto++,  nomResto: "Pizzeria Mirante", plat: "Pizza Margherita", 
  adresseResto: "Plattesteen - 13", communeResto: "1000 Bruxelles" , lat : "50.84667",
  long: "4.34875",
   "nbCom": 0, "nbComPrête" : 0},
  {id: idResto++, nomResto: "Le Gauguin", plat: "Boulettes liégoises", 
  adresseResto: "Chaussée de Boondael - 420", communeResto: "1050 Ixelles", lat : "50.81755",
  long: "4.3883",
   "nbCom": 0, "nbComPrête" : 0},
  {id: idResto++, nomResto: "Carpe Diem", plat: "Chicons jambon gratin", 
  adresseResto: "Avenue de Tervuren - 13", communeResto: "1040 Etterbeek", lat : "50.83887",
  long: "4.39865",
   "nbCom": 0, "nbComPrête" : 0},
  {id: idResto++, nomResto: "Café Novo", plat : "Boulettes sauce tomate frites", 
  adresseResto: "Rue de Bruxelles - 9", communeResto: "1000 Bruxelles", lat : "50.84399",
  long: "4.35234",
  "nbCom": 0, "nbComPrête" : 0}
]

const employés = [
  {id: idEmployé++, prenom : "Philippe", nom : "Etchebest"},
  {id: idEmployé++, prenom : "Gordon", nom : "Ramsay"},
  {id: idEmployé++, prenom : "Cyril", nom : "Lignac"},
  {id: idEmployé++, prenom : "Alfredo", nom : "Linguini"},
]

const livreurs = 
[
  {id: idLivreur++, prenom : "Elvis", nom : "Presley"},
  {id: idLivreur++, prenom : "Freddie", nom : "Mercury"},
  {id: idLivreur++, prenom : "John", nom : "Lennon"}
]

let commandes = [

];

router.get('/restaurants', function(req, res, next) {
  res.json(restaurants);
});

router.get('/livreurs', function(req, res, next) {
  res.json(livreurs);
});

router.get('/commandes', function(req, res, next) {

  commandes.sort((a,b)=>{
    return a.confirmation.dateCréation - b.confirmation.dateCréation;
  })
  res.json(commandes);
});

router.get('/employés', function(req, res, next) {
  res.json(employés);
});

router.post('/commandes', function(req, res){
  const newCommande = req.body;
  newCommande.id = idCommande++;
  commandes.push(newCommande);
  commandes.sort((a,b) => a.dateCréation - b.dateCréation)
  res.sendStatus(201);
});

router.post('/commandesOk', function(req,res){
  const commandeOk = req.body;

  const a = commandes.filter(item =>{
    return(commandeOk.comOk.id === item.id)
  })
  a[0].confirmation.etatCommande = 1;
  a[0].confirmation.prêteHeure = commandeOk.comOk.confirmation.prêteHeure;


  const b = restaurants.filter(item=>{
    return(commandeOk.comOk.confirmation.restaurant === item.nomResto)
  })
  b[0].nbComPrête ++;
})

router.post('/comLivree', function(req, res){
  const comLivree = req.body;
  const a = commandes.filter(item=>{
    return(comLivree.com.id === item.id)
  })
  a[0].confirmation.etatCommande = 3;
  a[0].confirmation.livréeHeure = comLivree.com.confirmation.livréeHeure;

  const b = restaurants.filter(item=>{
    return(comLivree.com.confirmation.restaurant === item.nomResto)
  })
  b[0].nbComPrête --;
  b[0].nbCom --;


  const c = livreurs.filter(item=>{
    return(item.id === comLivree.com.confirmation.livreur)
  })

  let prenom = c[0].prenom , nom = c[0].nom;
  let livreur = prenom+" "+nom;
  a[0].confirmation.livreur = livreur;

  console.log(commandes);
})



router.post('/restaurants', function(req, res){
  const commande = req.body;
  
  const a = restaurants.filter(item=>{
    return(commande.value[0].nomResto === item.nomResto)
  })
  a[0].nbCom ++;
  res.sendStatus(201);
});

router.post('/suppCommandes', function(){
  commandes = [];

  restaurants.map(item=>{
    return(item.nbCom = 0);
  })
  restaurants.map(item=>{
    return(item.nbComPrête = 0);
  })
})

router.post('/annulerCom', function(req,res){
  const annuler = req.body;
  console.log(restaurants);
  const a = commandes.filter(item=>{
    return(annuler.annulerCom.id === item.id)
  })
  a[0].confirmation.etatCommande = 2;

  const b = restaurants.filter(item=>{
    return(annuler.annulerCom.confirmation.restaurant === item.nomResto)
  })
  b[0].nbComPrête --;
  b[0].nbCom --;
  
  console.log(restaurants);
})


module.exports = router;


