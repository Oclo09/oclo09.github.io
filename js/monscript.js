if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker enregistré !', reg))
      .catch(err => console.error('Erreur d\'enregistrement', err));
  });
}

let vaisseaux = document.querySelector("#starship");
let monde = document.querySelector("#monde");
let asteroids = document.querySelector("#asteroids");

// Vérifie la collision entre deux balises HTML
function checkCollisions(box1, box2){			
	if((box2.offsetLeft >= box1.offsetLeft + box1.clientWidth)      // trop à droite
		|| (box2.offsetLeft + box2.clientWidth <= box1.offsetLeft) // trop à gauche
		|| (box2.offsetTop >= box1.offsetTop + box1.clientHeight) // trop en bas
		|| (box2.offsetTop + box2.clientHeight <= box1.offsetTop))  // trop en haut $
		{
			// Pas collision
			return false; 
		} else {
			// Collision
			return true; 
		}
}

async function obtenirRotationDepart() {
    // 2. Écouter le tout premier événement généré
    const recupererPremiereValeur = (event) => {
      // Les trois axes de rotation (en degrés)
      // Traiter la valeur de départ ici...
      positionDebase.alpha = event.alpha;
      positionDebase.beta = event.beta;
      positionDebase.gamma = event.gamma;

      // 3. Supprimer immédiatement l'écouteur pour ne pas suivre les mouvements futurs
      window.removeEventListener('deviceorientation', recupererPremiereValeur);
    };

    window.addEventListener('deviceorientation', recupererPremiereValeur);
}

let positionalphaActuelle = 0;
let positionbetaActuelle = 0;

// Correction syntaxe : Remplacement des assignations erronées (=) par de vrais écouteurs d'événements
window.addEventListener('deviceorientation', (event) => {
    positionalphaActuelle = event.alpha; // "event" en minuscules
});

window.addEventListener('deviceorientation', (event) => {
    positionbetaActuelle = event.beta; // "event" en minuscules
});

// Initialisation de l'objet pour éviter l'erreur "undefined" lors du calcul
let positionDebase = { alpha: 0, beta: 0, gamma: 0 };
obtenirRotationDepart(); // Appel de la fonction pour lancer l'écoute de départ

let vaisseau = document.getElementById("starship");

function bougerEnfoctionDeRotation()
{
    // Calcul des déplacements théoriques
    let deltaX = positionalphaActuelle - positionDebase.alpha;
    let deltaY = positionbetaActuelle - positionDebase.beta;

    // Récupération des positions numériques actuelles pour pouvoir additionner correctement les pixels
    let actuelLeft = parseFloat(vaisseau.style.left) || window.innerWidth / 2;
    let actuelTop = parseFloat(vaisseau.style.top) || window.innerHeight / 2;

    let futurLeft = actuelLeft + deltaX;
    let futurTop = actuelTop + deltaY;

    // --- COLLISIONS BORDS FENÊTRE ---
    // Limites horizontales (vaisseau de 54px)
    if (futurLeft < 0) {
        futurLeft = 0;
    } else if (futurLeft > window.innerWidth - 54) {
        futurLeft = window.innerWidth - 54;
    }

    // Limites verticales (vaisseau de 54px)
    if (futurTop < 0) {
        futurTop = 0;
    } else if (futurTop > window.innerHeight - 54) {
        futurTop = window.innerHeight - 54;
    }

    // Application des styles corrigés avec l'unité "px"
    vaisseau.style.left = futurLeft + "px";
    vaisseau.style.top = futurTop + "px";
}

setInterval(() => bougerEnfoctionDeRotation(), 50);

const jeu = setInterval(() => {
	const asteroidsClone = asteroids.cloneNode(true);

	asteroidsClone.classList.add("asteroid");

	monde.appendChild(asteroidsClone);

	let positionLeft = 90; 

	let randomPercent = Math.random() * 100; 

	asteroidsClone.style.top = `calc(${randomPercent}% - ${randomPercent / 100 * 54}px)`;

	const mouvement = setInterval(() => {
		if(checkCollisions(asteroidsClone, monde) == false) {
			
			clearInterval(mouvement);
			asteroidsClone.remove();
		} else {
		positionLeft -= 0.5;
        
		asteroidsClone.style.left = positionLeft + "%";
		}

		if (checkCollisions(vaisseaux, asteroidsClone) == true) {
			vaisseaux.style.backgroundImage = `url("../gif/explosion.gif")`;

			clearInterval(jeu)
			setTimeout(() => {
				location.reload();
			}, 1200)
		}
	}, 10);
}, 1000);
