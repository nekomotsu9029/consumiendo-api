const _accordion = document.querySelector(".accordion");
const _calculos = document.querySelector(".calculos");
const _obtenerCalculos = document.querySelector("#Obtener_Calculos_de_la_API");
const _obtenerDatos = document.querySelector("#Obtener_Datos_de_la_API");
const _alertas = document.querySelector("#alertas");
const _limpiar = document.querySelector("#Limpiar_Todo");
const urlApi = "https://www.datos.gov.co/resource/etr2-mkeu.json";
var vectorDeObjetosCargados;
var apiCargada = false;
var apiCalculos = false;
const cantidadDeArchivosAdividir = 10;
const valorMasRepetido = (vector) =>
  vector.reduce(
    (acum, el, i, vector) => {
      const count = vector.filter((e) => e == el).length;
      return count > acum[1] ? [el, count] : acum;
    },
    ["", 0]
  );

function agregarTarjeta(objeto, pos) {
  let i = 0;
  return (
    '<div class="card"> <div class="card-header" id="heading' +
    pos +
    '"> <h2 class="mb-0"> <button class="btn btn-link btn-block text-center text-info" type="button" data-toggle="collapse" data-target="#collapse' +
    pos +
    '" aria-expanded="true" aria-controls="collapse' +
    pos +
    '"> CODIGO PVD: ' +
    objeto[i] +
    ' </button> </h2> </div> <div id="collapse' +
    pos +
    '" class="collapse" aria-labelledby="heading' +
    pos +
    '" data-parent="#accordionExample"> <div class="card-body"> <ul class="list-style-none"> <li>CODIGO PVD: ' +
    objeto[i++] +
    "</li> <li>ID_BENEFICIARIO: " +
    objeto[i++] +
    "</li> <li>REGION: " +
    objeto[i++] +
    "</li> <li>DANE_DPTO: " +
    objeto[i++] +
    "</li> <li>DEPTO: " +
    objeto[i++] +
    "</li> <li>DANE_MUN: " +
    objeto[i++] +
    "</li> <li>MUNICIPIO: " +
    objeto[i++] +
    "</li> <li>TIPO_PVD: " +
    objeto[i++] +
    "</li> <li>PROVEEDOR_CONECTIVIDAD: " +
    objeto[i++] +
    "</li> <li>FECHA INSTALACION CONECTIVIDAD: " +
    objeto[i++] +
    "</li> <li>TIPO_BENEFICIARIO: " +
    objeto[i++] +
    "</li> <li>DIRECCION: " +
    objeto[i++] +
    "</li> <li>NOMBRE_PVD: </li> <li>NOMBRE DE CONTACTO 1 ENTE TERRITORIAL: " +
    objeto[i++] +
    "</li> <li>TELEFONO DE CONTACTO 1: " +
    objeto[i++] +
    "</li> <li>CORREO DE CONTACTO 1: " +
    objeto[i++] +
    "</li> <li>NOMBRE DE CONTACTO 2: " +
    objeto[i++] +
    "</li> <li>TELEFONO DE CONTACTO 2: " +
    objeto[i++] +
    "</li> <li>CORREO DE CONTACTO 2: " +
    objeto[i++] +
    "</li> <li>ESTADO: " +
    objeto[i++] +
    "</li> <li>ANCHO DE BANDA: " +
    objeto[i++] +
    "</li> <li>INAUGURADO: " +
    objeto[i++] +
    "</li> <li>FECHA INAUGURACION: " +
    objeto[i++] +
    "</li> <li>INAUGURADO POR: " +
    objeto[i++] +
    "</li> <li>LONGITUD: " +
    objeto[i++] +
    "</li> <li>LATITUD: " +
    objeto[i++] +
    "</li> <li>No DE CONTRATO OPERADOR: " +
    objeto[i++] +
    "</li> <li>ANIO DEL CONTRATO OPERADOR: " +
    objeto[i++] +
    "</li> <li>CONTRATO CONTRATISTA: " +
    objeto[i++] +
    "</li> <li>VIGENCIA DEL CONTRATO: " +
    objeto[i++] +
    "</li> <li>CONTRATO PROVEEDOR: " +
    objeto[i++] +
    "</li> <li>VIGENCIA CONTRATO PROVEEDOR: " +
    objeto[i++] +
    "</li> </ul> </div> </div> </div>"
  );
}

function crearAlerta(title_alert, body_alert, type_alert) {
  _alertas.innerHTML +=
    '<div class="alert alert-' +
    type_alert +
    ' alert-dismissible fade show" role="alert"><strong>' +
    title_alert +
    "</strong> " +
    body_alert +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
}

function limpiarTodo() {
  apiCargada = false;
  apiCalculos = false;
  _obtenerCalculos.className += " text-secondary";
  _obtenerCalculos.className += " disabled";
  _limpiar.className += " text-secondary";
  _limpiar.className += " disabled";
  _accordion.innerHTML = "";
  _calculos.innerHTML = "";
  _alertas.innerHTML = "";
}

function crearUnVectorApartirDeUnVectorDeObjeto(vectorDeObjetos) {
  var vectorObjeto;
  var vectorResultadoTotal;
  var vectorCiudades;
  for (
    var i = 0;
    i < vectorDeObjetos.length / cantidadDeArchivosAdividir;
    i++
  ) {
    vectorObjeto = Object.values(vectorDeObjetos[i]);
    if (i == 0) {
      vectorResultadoTotal = new Array(
        vectorDeObjetos.length * vectorObjeto.length
      );
      vectorCiudades = new Array(vectorDeObjetos.length * vectorObjeto.length);
    }
    vectorCiudades.push(vectorObjeto[3]);
    for (var j = 0; j < vectorObjeto.length; j++) {
      vectorResultadoTotal.push(vectorObjeto[j]);
    }
  }
  return [vectorResultadoTotal, vectorCiudades];
}

function cargarDatos() {
  if (!apiCargada) {
    crearAlerta(
      "La aplicacion dice:",
      "Se estan cargando los datos, por favor espere :)",
      "danger"
    );

    _obtenerCalculos.classList.remove("text-secondary");
    _obtenerCalculos.classList.remove("disabled");
    _limpiar.classList.remove("text-secondary");
    _limpiar.classList.remove("disabled");

    fetch(urlApi)
      .then((resp) => resp.json())
      .then(function (data) {
        apiCargada = true;
        const misDatitos = data;

        _accordion.innerHTML +=
          '<h3 class="text-center mb-3" >Datos parciales de mi Api (Hacer Click para expandir y mostrar datos detallados de cada registro)</h3>';

        for (
          var i = 0;
          i < misDatitos.length / cantidadDeArchivosAdividir;
          i++
        ) {
          _accordion.innerHTML += agregarTarjeta(
            Object.values(misDatitos[i]),
            i
          );
        }

        vectorDeObjetosCargados = misDatitos;
      })
      .catch(function (error) {
        console.log(
          "Uy! hubo un error al cargar los datitos de la API :( el error es : " +
            error
        );
      });
  }
}

function calcularDatos() {
  if (apiCargada && !apiCalculos) {
    apiCalculos = true;
    crearAlerta(
      "La aplicacion dice:",
      "Se calcularon los datos con exito! :)",
      "success"
    );
    var resultadoVector = crearUnVectorApartirDeUnVectorDeObjeto(
      vectorDeObjetosCargados
    );
    var _valorMasRepetido = valorMasRepetido(resultadoVector[0]);
    var _cuidadMasRepetida = valorMasRepetido(resultadoVector[1]);
    _calculos.innerHTML +=
      '<div class="card p-4"><div class"card-title text-center"><h4>3 Calculos con la API</h4></div><ul><li>Hay un total de ' +
      (vectorDeObjetosCargados.length/cantidadDeArchivosAdividir) +
      " registros Usados para el calculo</li><li>El valor mas repetido es: " +
      _valorMasRepetido[0] +
      " Se repitio un total de: " +
      _valorMasRepetido[1] +
      " veces.</li><li>Ciudad mas beneficiada: " +
      _cuidadMasRepetida[0] +
      " Se repitio un total de: " +
      _cuidadMasRepetida[1] +
      " veces.</li></ul></div>";
  }
}

_obtenerDatos.addEventListener("click", cargarDatos);

_obtenerCalculos.addEventListener("click", calcularDatos);

_limpiar.addEventListener("click", limpiarTodo);

