/*
  windowOnloadAdd.js
  Copyright (C) 2011 Jesús Hernández Gormaz

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

// Object of functions
var windowAddOnload = function ()
  {
    // Array of functions
    var func = new Array ();
    // Add new function
    this.Add = function (new_func)
      {
        // Check that new_func is a function type
        if (typeof new_func == 'function')
          {
            func[func.length] = new_func;
          }
      }
    // Run all functions
    this.rUn = function ()
      {
        var i;
        for (i = 0; i < func.length; i++) func[i] ();
      }
  }

// New object of functions run in load window
var windowOnload = new windowAddOnload ();

// Add the run method of object to window load event
if (typeof window.onload != 'function')
  {
    window.onload = windowOnload.rUn;
  }
else
  {
    var oldonload = window.onload;
    window.onload = function ()
      {
        if (oldonload)
          {
            oldonload ();
          }
        windowOnload.rUn ();
      }
  }

/*  This code is a modified version of the function written by Simon
 *   Willison (http://simonwillison.net/) and licensed under the MIT license
 *   With which to be reducing the level of recursion that task
 *   Using instead an object with an array that holds the functions
 *   And a loop through all the executive functions. It follows
 *   Using recursion to a lesser extent when necessary.
 *
 *  Este código es una versión modificada de la función escrita por Simon
 *   Willison (http://simonwillison.net/) y licenciada bajo la licencia del MIT
 *   con el cual ser reduce el nivel de recursividad de la mencionada función
 *   empleando en su lugar un objeto con una matriz que mantiene las funciones
 *   y un bucle que recorre todas las funciones ejecutandolas. Se sigue
 *   empleando la recursividad en menor medida cuando es necesario.
 */
