// Chargement des données
var promises = []
function wait_for_data(promises) {
    get_data(promises)
    typeof window["data"] !== "undefined" ? mapMusee(window["data"]) : setTimeout(wait_for_data, 250);   
}

function get_data(promises) {
  const controller = new AbortController();
  try {
    if (promises == undefined) { var promises = [] }

    /*/////// CSV  //////*/
    promises.push(
      fetch('/ui/plug-in/integration/carte-instrument-musee/data/data-carte-collections_2023-07-20.csv.gz')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
          }
          return response.arrayBuffer(); // Utilisez arrayBuffer pour récupérer les données brutes
        })
        .then(arrayBuffer => {
          // Décompressez le contenu avec pako
          const inflatedData = pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' });

          // Parsez le contenu décompressé en CSV avec d3
          return d3.csvParse(inflatedData);
        })
    );

    /*/////// JSON  //////*/
    const jsonUrls = [
      '/ui/plug-in/integration/carte-instrument-musee/data/amerique.json.gz',
      '/ui/plug-in/integration/carte-instrument-musee/data/reste.json.gz',
      '/ui/plug-in/integration/carte-instrument-musee/data/config.json.gz',
    ];

    // Utilisez une boucle pour charger et décompresser les fichiers JSON
    for (const url of jsonUrls) {
      promises.push(
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.arrayBuffer(); // Utilisez arrayBuffer pour récupérer les données brutes
          })
          .then(arrayBuffer => {
            // Décompressez le contenu avec pako
            const inflatedData = pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' });

            // Parsez le contenu décompressé en tant qu'objet JSON
            return JSON.parse(inflatedData);
          })
      );
    }

    setTimeout(() => controller.abort(), 2000);
    Promise.all(promises, { signal: controller.signal })
      .then(data => {
        window["data"] = data;
      })
      .catch(error => {
        console.error('Erreur lors du chargement des fichiers gzip :', error);
      });
  } catch (err) {
    console.log(err);
  }
}

// Vérification que tous les modules sont chargés
function isLibrariesLoaded() {
  return typeof L !== 'undefined' 
      && typeof L.map === 'function'
      && typeof L.markerClusterGroup === 'function'
      && typeof pako !== 'undefined'
}
function onLibrariesLoaded(attempt_count) {
  if (isLibrariesLoaded()) {
    wait_for_data(promises)
  } else {
    // Rechargement de la page après 4 tentatives avec message d'erreur
    if (attempt_count >= 4) { 
      let message = document.createElement("p")
      message.setAttribute("class", "reload-error")
      message.textContent = "Nous rencontrons un problème, la page va être rechargée."
      document.getElementById("mapMuseeContainer").appendChild(message)
      setTimeout(function () {
        location.reload() 
      }, 1500); 
    }

    setTimeout(function () {
      console.log('Tentative de chargement de Leaflet...');
      onLibrariesLoaded(attempt_count + 1);
    }, 2000);
  }
} 

$(document).ready(function() {
  $(".loader").show()

  var attempt_count = 0
  onLibrariesLoaded(attempt_count);
})