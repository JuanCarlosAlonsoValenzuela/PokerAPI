
const { Router } = require('express');
const router = Router();

const helpers  = require('./helpers');

router.post('/hands', async (req, res) =>{

    let input = req.body;

    try {
        // Comprobamos que la entrada es correcta
        // Y convertimos la entrada a números
        await helpers.validarEntrada(input);

    }catch(err){
        // Añadir status
        res.json(err.details[0].message);
    }

    let puntuaciones = [];
    const jugadas = input.jugadas;
    const nJugadas = jugadas.length;
    // Recorremos todas las jugadas
    for(let i = 0; i < nJugadas; i++){
        let cartas = jugadas[i].cartas;
        let cartaMasAltaColor = cartas[4].valor;
        let cartaMasAlta = cartas[4].valor;


        // Recorremos todas las cartas de una jugada
        // Inicializamos las comprobaciones
        let escaleraColor = true;
        let secondChanceColor = false;          // Para escalera de color

        let escalera = true;
        let secondChance = false;               // Para escalera
        let color = true;

        // Poker, trios y parejas
        let contador = 1;
        let poker = [false, 0];
        let trio = [false, 0];
        let parejas = [0, 0];
        
        
        if(cartas[0].valor==2 && cartaMasAlta==14){
            secondChance = true;
            if(cartas[0].palo == cartas[4].palo){
                secondChanceColor = true;
            }
            
        }


        for(let j = 0; j < 5; j++){
            carta = cartas[j];

            // Escalera de color
            if(j!=0 && escaleraColor){
                if(carta.palo != (cartas[j-1].palo)){
                    escaleraColor = false;
                }
                if(!(carta.valor == (cartas[j-1].valor +1))){
                    if(secondChanceColor){
                        secondChanceColor = false;
                        cartaMasAltaColor = cartas[j-1].valor;
                    } else {
                        escaleraColor = false;
                    }
                }
            }

            // Poker, full, trio, pareja y doble pareja (tener en cuenta que están ordenadas)
            if(j!=0 && carta.valor == cartas[j-1].valor){
                contador = contador + 1;
            }else{
                contador = 1;
            }

            if(contador == 2){
                parejas[0] = parejas[0] + 1;
                parejas[1] = carta.valor;
            }
            if(contador == 3){
                parejas[0] = parejas[0] - 1;
                trio[0] = true;
                trio[1] = carta.valor;
            }
            if(contador == 4){
                poker[0] = true;
                poker[1] = carta.valor;
            }

            

            // Color (todas las cartas son del mismo palo) (no hace falta iterar)
            if(j!=0 && color){
                if(carta.palo != cartas[j-1].palo){
                    color = false;
                }
            }

            // Escalera (Cinco cartas consecutivas, da igual el color)
            if(j!=0 && escalera){
                if(!(carta.valor == (cartas[j-1].valor+1))){
                    if(secondChance){
                        secondChance = false;
                        cartaMasAlta = cartas[j-1].valor;
                    }else{
                        escalera = false;
                    }
                }
            }
            

        }

        // Puntuación de la jugada
        let resultado = {puntuacion: 0, valorMasAlto: 0};

        if(escaleraColor){                  // Escalera de color
            resultado = {puntuacion: 9, valorMasAlto: cartaMasAltaColor};
        }else if(poker[0]){                 // Poker
            resultado = {puntuacion: 8, valorMasAlto: poker[1]};
        }else if(trio[0] && parejas[0]!=0){     // Full
            resultado = {puntuacion: 7, valorMasAlto: trio[1]};
        }else if(color){                    // Color
            resultado = {puntuacion: 6, valorMasAlto: cartas[4].valor};
        }else if(escalera){                 // Escalera
            resultado = {puntuacion: 5, valorMasAlto: cartaMasAlta};
        }else if(trio[0]){                  // Trio
            resultado = {puntuacion: 4, valorMasAlto: trio[1]};
        }else if(parejas[0] == 2){          // Doble pareja
            resultado = {puntuacion: 3, valorMasAlto: parejas[1]};
        }else if(parejas[0]==1){            // Pareja
            resultado = {puntuacion: 2, valorMasAlto: parejas[1]};
        }else{                              // Carta más alta
            resultado = {puntuacion: 1, valorMasAlto: cartas[4].valor};
        }

        puntuaciones.push(resultado);
    }

    // res.send(puntuaciones);
    res.send(puntuaciones);

})

module.exports = router;