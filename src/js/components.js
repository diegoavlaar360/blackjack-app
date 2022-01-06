import {_} from './libraries/underscore-min.js';

const miModulo = (() => {
    'use strict'

    let deck = [],
        tipos = ['C', 'D', 'H', 'S'],
        letras = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');
    
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        
        for(let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }

    const crearDeck = () => {
        deck = [];

        for(let i = 2; i <= 10; i++){
            for (let tipo of tipos){
                deck.push(i + tipo);
            }
        }

        for(let letra of letras){
            for(let tipo of tipos){
                deck.push(letra + tipo);
            }
        }

        return _.shuffle(deck);
    }

    const pedirCarta = () => {
        if(deck.length === 0){
            throw 'No hay cartas en el deck';
        }
        
        return deck.pop();
    }

    const acumularPuntos = (carta, turno) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno]; 

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.classList.add('carta');
        imgCarta.src = `./assets/img/cards/${carta}.png`;
                                                
        divCartasJugadores[turno].append(imgCarta);
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length-1);

        return (isNaN(valor)) ?
                (valor === 'A') ? 11 : 10
                : valor * 1;
    }

    const determinarGanador = () => {

        const [puntosminimos, puntosComputadora] = puntosJugadores;

        setTimeout(()=>{

            if(puntosComputadora === puntosminimos){
                alert('Nadie Gana :(');
            } else if(puntosminimos > 21){
                alert('La Computadora Gana');
            } else if(puntosComputadora > 21){
                alert('El Jugador Gana');
            } else{
                alert('La Computadora Gana');
            }

        },300)
    }

    const turnoComputadora = (puntosminimos) => {
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosComputadora < puntosminimos) && (puntosminimos <= 21));

        determinarGanador();
    }

    btnPedir.addEventListener('click', ()=>{ 
        const carta = pedirCarta();

        const puntosJugador = acumularPuntos(carta, 0);
        
        crearCarta(carta, 0);

        if(puntosJugador > 21){
            console.warn('Lo siente mucho, perdiste.');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }else if(puntosJugador === 21){
            console.warn('21, Genial!')
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click',()=>{
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click',()=>{    
         inicializarJuego();
    })

    return {nuevoJuego: inicializarJuego};

})();