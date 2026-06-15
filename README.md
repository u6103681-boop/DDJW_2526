**Introducció**

Aquest projecte consisteix en un joc de Memory, on el jugador comença a un menú des del qual pot començar una partida, ja sigui en el mode 1 (una partida normal del Memory), o al mode 2 (una partida on la dificultat incrementa a cada nivell), podent personalitzar les opcions de la partida per a cada mode.

**Descripció del disseny del joc**

El joc se separa en dos modes de joc, el mode 1 (la partida normal) i el mode 2 (la versió amb nivells), i cada mode té el seu sistema de puntuació propi:

**Mode 1** - La puntuació màxima que es pot obtenir és la suma de: nombre de cartes úniques  50 + mida de grup  50. Aquesta puntuació, però, baixa en 25 unitats amb cada errada.

**Mode 1** - La puntuació màxima que es pot obtenir prové de la dificultat amb la qual s'ha decidit iniciar la partida, on en la dificultat baixa proporciona 300 punts inicials, però, només se'n descompten 10, en canvi, a                la dificultat normal (la predeterminada), es comença amb una puntuació de 200 punts i se'n resten 25 per cada errada, i, finalment, trobem la dificultat alta, on comences amb 100 punts i cada                                 errada resta 50, fent així molt difícil arribar al final del joc, havent de tenir un factor de sort i estratègia molt alt. 

**Descripció de les parts més rellevants de la implementació**

El joc comença amb el menú principal, on trobem el títol del joc i, sota seu, en forma de columna, trobem primerament el rànquing, on, segons es van completant partides, es mostren les 5 millors puntuacions aconseguides, tot seguit, trobem el botó de jugar, que cridarà a una alerta on el jugador podrà seleccionar si iniciar una partida en el mode 1 o en el mode 2, seguit, trobem les opcions, on es poden triar tant el nombre de cartes úniques com la mida del grup (duos, trios, quartets) per les partides del mode 1 (aquests canvis no afecten el mode 2), i, a més, també podem seleccionar la dificultat pel mode 2 (no afecta el mode 1), addicionalment, trobem un botó per tornar les opcions als seus valors predeterminats.

A continuació, trobem un botó de partides guardades, que en fer-lo servir mostrarà una alerta amb les partides que hàgim decidit guardar mentre jugàvem (només hi ha 5 slots per guardar), amb la informació sobre el seu mode i la puntuació que tenim en aquest. Finalment, trobem el botó de sortir, que l'única funcionalitat que té és treure un missatge per consola indicant que no es pot sortir.

**Conclusions i problemes trobats**

En conclusió, trobem un joc de Memory amb propostes interessants, però que no deixa de ser un memory sense cap mena d'alteració o d'addició estranya.

Per acabar, els principals problemes que he trobat han sigut a l'hora de treballar amb la memòria local pels guardats i per transferir les dates d'una escena a una altra, com per exemple les opcions, però amb paciència i tutorials de YouTube ho he pogut acabar implementant tot sense cap problema visible en les proves que he realitzat, acabant el procés traslladant el treball que havia fet al Visual Studio directament al GitHub i treballant el que em restava en aquest (per això els commits són amb els comentaris generats per la pàgina i no menciones res sobre les issues, donat que no he fet servir git Bash en gran part del projecte).
