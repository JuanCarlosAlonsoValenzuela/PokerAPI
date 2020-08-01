const joi = require('@hapi/joi');

const schemaEntrada = joi.object({
    jugadas: joi.array().min(2).required(),
    bote: joi.number().min(0).required()
});

const schemaJugada = joi.object({
    jugador: joi.string().required(),
    apuesta: joi.number().min(0).required(),
    cartas: joi.array().min(5).max(5).required()
});

const regexValor = new RegExp("^[23456789JQKA]{1}$|^10$");
const regexPalo = new RegExp("^[CDHS]{1}$");

const schemaCarta = joi.object({
    valor: joi.string().pattern(regexValor).required(),
    palo: joi.string().pattern(regexPalo).required()
})

const convertirANumero = {
    "A": 14,
    "J": 11,
    "Q": 12,
    "K": 13
};

function comparatorCartas(a, b){
    numberA = Number(a.valor);
    if(isNaN(numberA)){
        numberA = convertirANumero[a.valor];     // Acceder mapa
    }
    numberB = Number(b.valor);
    if(isNaN(numberB)){
        numberB = convertirANumero[b.valor];     // Acceder mapa
    }

    a.valor = numberA;
    b.valor = numberB;

    if(numberA > numberB) {
        return 1;
    } else if(numberA < numberB) {
        return -1;
    } else {
        if(a.palo > b.palo){
            return 1;
        }else if(a.palo < b.palo){
            return -1;
        }else{
            throw { details:[ {message: "Partida amañada"} ]}
        }
    }
}

module.exports = {

    async validarEntrada(entrada){

        // Validamos la entrada (lista de jugadas y el bote)
        await schemaEntrada.validateAsync(entrada);

        let jugadas = entrada.jugadas;

        let todasLasCartas = [];

        for(let i=0; i<jugadas.length; i++){
            // Validamos cada una de las jugadas (jugador, apuesta y cartas)
            await schemaJugada.validateAsync(jugadas[i]);
            let cartas = jugadas[i].cartas;

            // Validamos cada una de las cartas de la jugada
            for(let j=0; j<cartas.length; j++){
                await schemaCarta.validateAsync(cartas[j]);
            }

            // Una vez sabemos que las cartas son las correctas, ordenar las cartas del jugador en orden ascendente (mantenerlo)
            cartas.sort(comparatorCartas);

            // Añadir a la lista acumuladora
            todasLasCartas = todasLasCartas.concat(cartas);
        }
        // Buscar repeticiones en la lista mergeada
        todasLasCartas.sort(comparatorCartas);
    }
}


