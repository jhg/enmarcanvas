/*
  enmarcar_imagen.js
  Copyright (c) 2011 Jesús Hernández Gormaz

  Permission is hereby granted, free of charge, to any
    person obtaining a copy of this software and associated
    documentation files (the "Software"), to deal in the
    Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the
    Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice
    shall be included in all copies or substantial portions of
    the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
    KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
    WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
    OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
    OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  LEAME (manual básico):
 *   Para utilizar este código en un documento HTML solo es necesario en el
 *    encabezado poner las etiquetas (modifique src por la ruta en su servidor):
 *   
 *    <script type="text/javascript" src="windowOnloadAdd.js"></script>
 *    <script type="text/javascript" src="enmarcar_imagen.js"></script>
 *   
 *   Y para crear imagenes con marcos solo tiene que usar (cambie las rutas
 *    por sus correspondientes):
 *   
 *    <script type="text/javascript">
 *      var foto_enmarcada = new cuadro ("imagen.jpg");
 *      foto_enmarcada.marco ("marco.jpg");
 *    </script>
 *   
 *   Opcionalmente, puede indicar un ancho para redimensionar la imagen
 *    (mantiene la relación de aspecto):
 *   
 *    <script type="text/javascript">
 *      var foto_enmarcada = new cuadro ("imagen.jpg", 200);
 *      foto_enmarcada.marco ("marco.jpg");
 *    </script>
 *   
 *   Y también el alto (no mantiene la relación de aspecto):
 *   
 *    <script type="text/javascript">
 *      var foto_enmarcada = new cuadro ("imagen.jpg", 200, 300);
 *      foto_enmarcada.marco ("marco.jpg");
 *    </script>
 *   
 *   Como un grosor para el marco:
 *   
 *    <script type="text/javascript">
 *      var foto_enmarcada = new cuadro ("imagen.jpg", 200, 300);
 *      foto_enmarcada.marco ("marco.jpg", 50);
 *    </script>
 *   
 *   Y usar varios marcos cada uno enmarcando a todos los anteriores:
 *   
 *    <script type="text/javascript">
 *      var foto_enmarcada = new cuadro ("imagen.jpg", 200, 300);
 *      foto_enmarcada.marco ("marco.jpg", 50);
 *      foto_enmarcada.marco ("marco_2.jpg", 70);
 *    </script>
 *   
 *   Siendo posible eliminar un marco gracias al indice:
 *   
 *    <script type="text/javascript">
 *      var foto_enmarcada = new cuadro ("imagen.jpg", 200, 300);
 *      var indice_marco = foto_enmarcada.marco ("marco.jpg", 50);
 *      foto_enmarcada.marco ("marco_2.jpg", 70);
 *      foto_enmarcada.quitar (indice_marco);
 *    </script>
 *   
 *   También dispone del metodo descargado que devuelve true si se descargaron
 *    todas las imagenes necesarias para mostrar el marco y el metodo enmarcar
 *    para actualizar la imagen con todos sus marcos el cual debe ser llamado
 *    solo habiendo comprobado antes que se han descargado todas las imagenes.
 */

/* Variable global para listar los objetos cuadros creados durante la carga
    de la pagina y que al haber descargado todas las iamgenes deben ser
    dibujados*/
var cuadros = new Array ();
/* Variable para indicar cuando la apgina esta cargada y se debe comprobar los
    cuadros que se crearon durante la carga*/
var fin_cuadros_durante_carga_pagina=false;
/* Recorre el array de cuadros creados durante la carga y comprueba si pueden
    ser dibujados*/
function cargar_cuadros ()
  {
    // Comprobamos si termino de cargar la pagina para comprobar los cuadros
    if (fin_cuadros_durante_carga_pagina == false)
      {
        return;
      }
    // Recorremos todos los cuadros creados durante la carga de la pagina
    var i;
    for (i = 0; i < cuadros.length; i++)
      {
        // Comprobamos si se ha descargado las iamgenes
        if (cuadros[i].descargado() == true)
          {
            // Dibujamos la imagen y los marcos
            cuadros[i].enmarcar ();
            // Quitamos este objeto del listado
            cuadros.splice(i,1);
            /* Ahora en el indice del objeto quitado podria haber otro, restamos
                en la variable usada para recorrer el indice para mantenernos
                en este*/
            i=i-1;
          }
      }
    // Comprobamos si no quedan más cuadros por dibujar
    if (cuadros.length == 0)
      {
        // Eliminamos el intervalo
        clearInterval (temporizador_cuadros);
      }
    return;
  }
/* Creamos el intervalo de repetición para la función que comprobara la carga de
    los cuadros*/
var temporizador_cuadros = setInterval ("cargar_cuadros ();", 1);
/* Añadimos, junto a las funciones ya asignadas, la que indicara que la pagina
    ya cargo*/
windowOnload.Add (function () {fin_cuadros_durante_carga_pagina=true;});

// Creamos el prototipo de objeto con el que enmarcar iamgenes
var cuadro = function (url_imagen, ancho_imagen, alto_imagen)
  {
    // Registramos el objeto en el array de objetos cuadro que seran comprobados
    //  cuando han cargado sus iamgenes para dibujarlos
    cuadros[cuadros.length]=this;
    // Guardamos el ancho y el alto en unas propiedades privadas
    var ancho=ancho_imagen;
    var alto=alto_imagen;
    // En una propiedad privada guardaremos el identificador del temporizador
    //  de carga
    var temporizador=0;
    // Creamos la propiedad privada del Id del canvas del cuadro y lo generamos
    var id=0;
    this.id = 'cuadro_' + parseInt (Math.random () * 100000000);
    // Creamos el array donde almacernar los marcos
    var marcos;
    marcos = new Array ();
    // Creamos un objeto imagen que sera una propiedad privada
    var imagen = new Image();
    // Escribimos en el HTML el canvas con el que trabajaremos
    document.write ('<canvas id="'
                    + this.id
                    + '"><img src="' + url_imagen + '"></canvas>');
    // El lienzo canvas comienza siendo de dimensiones 0 por 0
    document.getElementById(this.id).width = 0;
    document.getElementById(this.id).height = 0;
    // Obtenemos el contexto canvas
    var lienzo = document.getElementById(this.id).getContext('2d');
    // Comprobamos que existe el lienzo
    if (lienzo)
      {
        // Mostraremos un texto indicando que se esta cargando
        document.getElementById(this.id).width = 150;
        document.getElementById(this.id).height = 50;
        lienzo.fillStyle="rgb(0,0,0)";
        lienzo.font="bold 16px Arial";
        lienzo.fillText("Cargando cuadro...",0,45);
      }
    // Cargamos las imagenes
    imagen.src = url_imagen;
    /* Obtenemos un canvas donde recuperaremos los marcos y la iamgen ya
        dibujados*/
    var canvas_enmarcaciones = document.createElement('canvas');
    canvas_enmarcaciones.width = document.getElementById(this.id).width;
    canvas_enmarcaciones.height = document.getElementById(this.id).height;
    var canvas_enmarcaciones_lienzo = canvas_enmarcaciones.getContext('2d');
    // Metodo publico con el que añadir un marco y  devuelve un indice de marco
    this.marco = function (url_marco, grosor_marco)
      {
        // Añadimos un nuevo array para las propiedades del marco nuevo
        marcos[marcos.length] = new Array ();
        // Creamos la iamgen del marco
        marcos[marcos.length-1][0] = new Image ();
        // La descargamos
        marcos[marcos.length-1][0].src = url_marco;
        // Guardamos el grosor del marco
        marcos[marcos.length-1][1] = grosor_marco;
        return marcos.length-1;
      }
    // Metodo publico que elimina un marco por su indice
    this.quitar = function (indice_marco)
      {
        // Eliminamos el elemento del array que guarda las propiedades del marco
        marcos.splice (indice_marco, 1);
      }
    /* Metodo publico con el que comprobar si el cuadro a descargado
        las imagenes necesarias*/
    this.descargado = function ()
      {
        var i;
        // Comprobamos si se descargaron las imagenes
        if ( ! imagen.complete)
          {
            return false;
          }
        for (i = 0; i < marcos.length; i++)
          {
            if ( ! marcos[i][0].complete)
              {
                return false;
              }
            else
              {
                // Comprobamos si se indica un grosor de marco y si no lo asignamos
                if (marcos[i][1] == null) marcos[i][1] = marcos[i][0].height;
              }
          }
        return true;
      }
    // Metodo publico para dibujar los marcos
    this.enmarcar = function ()
      {
        // Comprobamos si no se pide redimensionar la imagen
        if (ancho == null) ancho = imagen.width;
        /* Si no se indica alto este sera proporcional al ancho manteniendo la
            relacion de aspecto*/
        if (alto == null) alto = (ancho / imagen.width) * imagen.height;
        /* Asignamos el lienzo canvas en funcion de las dimensiones de la
            imagen*/
        document.getElementById(this.id).width = ancho;
        document.getElementById(this.id).height = alto;
        // Obtenemos el contexto canvas
        var lienzo = document.getElementById(this.id).getContext('2d');
        // Comprobamos que existe el lienzo
        if (lienzo)
          {
            // Dibujamos la imagen centrada
            lienzo.drawImage (imagen, 0, 0, ancho, alto);
          }
        // Guardamos la imagen ya dibujada
        canvas_enmarcaciones.width = document.getElementById(this.id).width;
        canvas_enmarcaciones.height = document.getElementById(this.id).height;
        canvas_enmarcaciones_lienzo = canvas_enmarcaciones.getContext('2d');
        canvas_enmarcaciones_lienzo.drawImage (lienzo.canvas, 0, 0,
        lienzo.canvas.width, lienzo.canvas.height);
        // Recorremos el array de marcos para enmarcarlos todos
        var i;
        for (i = 0; i < marcos.length; i++)
          {
            // Incrementamos el lienzo canvas en funcion de las dimensiones del
            //  marco
            document.getElementById(this.id).width += (2 * marcos[i][1]);
            document.getElementById(this.id).height += (2 * marcos[i][1]);
            // Obtenemos el contexto canvas
            var lienzo = document.getElementById(this.id).getContext('2d');
            // Comprobamos que existe el lienzo
            if (lienzo)
              {
                // Creamos la imagen del marco copiandola reflejada horizontalmente
                var canvas_marco_completo = document.createElement('canvas');
                canvas_marco_completo.width = 2 * marcos[i][0].width;
                canvas_marco_completo.height = marcos[i][1];
                var marco_completo = canvas_marco_completo.getContext('2d');
                marco_completo.drawImage (marcos[i][0], 0, 0, marcos[i][0].width, marcos[i][1]);
                /* Reflejamos el canvas para dibujar la otra mitad del amrco
                    reflejada*/
                marco_completo.transform(-1, 0, 0, 1, marco_completo.canvas.width,     0);
                marco_completo.drawImage (marcos[i][0], 0, 0, marcos[i][0].width, marcos[i][1]);
                // Creamos el marco como un patron
                var patron_marco = lienzo.createPattern (marco_completo.canvas, 'repeat');
                lienzo.fillStyle = patron_marco;
                // Dibujamos el lado superior del marco
                lienzo.beginPath ();
                lienzo.moveTo (-1, 0);
                lienzo.lineTo (lienzo.canvas.width + 1, 0);
                lienzo.lineTo (lienzo.canvas.width - marcos[i][1] + 1, marcos[i][1]);
                lienzo.lineTo (marcos[i][1] - 1, marcos[i][1]);
                lienzo.fill ();
                // Precalculamos los radianes de rotación
                var radianes=0;
                this.radianes = Math.PI * 90 / 180;
                // Rotamos el lienzo 90º y lo trasladamos para que el margen superior
                //  de dibujo coincida con el margen derecho de visualización
                lienzo.rotate(this.radianes);
                lienzo.translate (0, -(lienzo.canvas.width) );
                // Regeneramos el patron para la nueva posición del lienzo
                patron_marco = lienzo.createPattern (marco_completo.canvas, 'repeat');
                lienzo.fillStyle = patron_marco;
                // Dibujamos el lado derecho
                lienzo.beginPath ();
                lienzo.moveTo (-1, 0);
                lienzo.lineTo (lienzo.canvas.height + 1, 0);
                lienzo.lineTo (lienzo.canvas.height - marcos[i][1] + 1, marcos[i][1]);
                lienzo.lineTo (marcos[i][1] - 1, marcos[i][1]);
                lienzo.fill ();
                // Repetimos la rotación y traslación
                lienzo.rotate(this.radianes);
                lienzo.translate (0, -(lienzo.canvas.height) );
                // Regeneramos el patron
                patron_marco = lienzo.createPattern (marco_completo.canvas, 'repeat');
                lienzo.fillStyle = patron_marco;
                // Dibujamos el lado inferior
                lienzo.beginPath ();
                lienzo.moveTo (-1, 0);
                lienzo.lineTo (lienzo.canvas.width + 1, 0);
                lienzo.lineTo (lienzo.canvas.width - marcos[i][1] + 1, marcos[i][1]);
                lienzo.lineTo (marcos[i][1] - 1, marcos[i][1]);
                lienzo.fill ();
                // Repetición de los pasos anteriores
                lienzo.rotate(this.radianes);
                patron_marco = lienzo.createPattern (marco_completo.canvas, 'repeat');
                lienzo.fillStyle = patron_marco;
                lienzo.translate (0, -(lienzo.canvas.width) );
                lienzo.beginPath ();
                lienzo.moveTo (-1, 0);
                lienzo.lineTo (lienzo.canvas.height + 1, 0);
                lienzo.lineTo (lienzo.canvas.height - marcos[i][1] + 1, marcos[i][1]);
                lienzo.lineTo (marcos[i][1] - 1, marcos[i][1]);
                lienzo.fill ();
                // Ultima rotación y traslación para dejar el lienzo de dibujo en su
                //  posición original coincidiendo con el de visualización
                lienzo.rotate(this.radianes);
                lienzo.translate (0, -(lienzo.canvas.height) );
                // Dibujamos la imagen centrada y los marcos anteriores
                lienzo.drawImage (canvas_enmarcaciones_lienzo.canvas,
                  (lienzo.canvas.width / 2)-(canvas_enmarcaciones_lienzo.canvas.width / 2),
                  (lienzo.canvas.height / 2)-(canvas_enmarcaciones_lienzo.canvas.height / 2),
                  canvas_enmarcaciones_lienzo.canvas.width,
                  canvas_enmarcaciones_lienzo.canvas.height);
                // Guardamos los marcos y la imagen ya dibujados
                canvas_enmarcaciones.width = document.getElementById(this.id).width;
                canvas_enmarcaciones.height = document.getElementById(this.id).height;
                canvas_enmarcaciones_lienzo = canvas_enmarcaciones.getContext('2d');
                canvas_enmarcaciones_lienzo.drawImage (lienzo.canvas, 0, 0,
                lienzo.canvas.width, lienzo.canvas.height);
              }
          }
      }
    return;
  }
