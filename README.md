# Google Maps & Places Tutorial from Leigh Halliday

Este proyecto lo hice siguiendo el tutorial de Leigh Halliday que pueden encontrar [aquí](https://www.youtube.com/watch?v=WZcxJGmLbSo).

En chile no hay osos así es que aquí se marcan Pumas.

Para ejecutarlo necesitan generar una API KEY siguiendo este link: [https://developers.google.com/maps/documentation/javascript/get-api-key](https://developers.google.com/maps/documentation/javascript/get-api-key) y habilitar las siguientes APIs para su API KEY
* Maps JavaScript API
* Places API
* Geocoding API
* Geolocation API

Pueden inicializar el proyecto ejecutando el siguiente comando:
```
yarn start
```

Me ayudó a familiarizarme más con React, la consola de Google Cloud y sus Apis (Maps JavaScript API, Places API, Geocoding API, Geolocation API).

Hay cosas que se pueden mejorar como por ejemplo:

* Extraer los componentes Search y Locate desde App.js a su propio archivo.
* Actualmente solo guarda la info del ultimo marker seleccionado al hacerle click, estaría bueno que las guardara todas.
* Ver si es responsivo
* Ver si se puede ser mas eficiente con el uso de las APIs de google

Muchas gracias a Leigh.