
### Documentation du fichier `getData.js`

#### Description globale du fichier et son fonctionnement

Le fichier `getData.js` est principalement utilisé pour charger des données de manière asynchrone à partir d'une URL spécifiée. Il utilise des Promises et la fonction `fetch` pour réaliser cette tâche. Le fichier contient des fonctions pour attendre que les données soient chargées et pour les récupérer. Si les données ne sont pas encore disponibles, il réessaye après un délai spécifique.

L'upload de fichier gzip est possible à l'aide de la bibliothèque pako
https://github.com/nodeca/pako


#### Description des variables et fonctions à modifier

##### `urls` (array)

Cette constante contient un array des urls des données à utilisé au format gzip.

##### `isLibrariesLoaded()`

Modifier les conditions de retours en incluant les objets devant être présents pour l'éxécution du code.

#### Description des fonctions

##### `wait_for_data(promises)`

Cette fonction est utilisée pour attendre que les données soient chargées. Elle appelle la fonction `get_data` pour charger les données et vérifie si les données sont définies. Si les données ne sont pas encore disponibles, elle se rappelle après un délai de 250 millisecondes.

###### Paramètres

- `promises` (Array): Un tableau de promesses qui sont utilisées pour gérer les opérations asynchrones.

##### `get_data(promises)`

Cette fonction utilise la méthode `fetch` pour charger des données de manière asynchrone à partir d'une URL spécifiée. Elle utilise également un `AbortController` pour avoir la possibilité d'annuler la requête fetch si nécessaire.

###### Paramètres

- `promises` (Array): Un tableau de promesses qui sont utilisées pour gérer les opérations asynchrones.

##### `isLibrariesLoaded()`

Cette fonction vérifie l'existance des objets ou fonctions des bibliothèques utilisés et retourne false si une d'elle est manquante.

##### `onLibrariesLoaded(attempt_count)`

Cette fonction contrôle le nombre de tentative de connexion et le délai entre chacune d'elle.

###### Paramètres

- `attempt_count` (Int): Nombre de tentative exécutées.

