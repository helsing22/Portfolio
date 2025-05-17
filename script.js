document.addEventListener('DOMContentLoaded', function() {
  const tipoWebSelect = document.getElementById('tipoWeb');
  const imagenSelect = document.getElementById('imagen');
  const btnEnviar = document.getElementById('btnEnviar');
  const detallePedido = document.getElementById('detallePedido');
  const precioTotalElement = document.getElementById('precioTotal');
  const grupoUpdates = document.getElementById('grupo-updates');
  const precioUpdateInput = document.getElementById('precioUpdate');
  
  // Recogemos todos los checkboxes de opciones adicionales
  const opcionesExtras = document.querySelectorAll('input[name="extra"]');
  // Función para actualizar el resumen del pedido
  function actualizarResumen() {
    let detalle = '';
    let precioTotal = 0;
    // Tipo de web seleccionado
    let tipoWebIndex = tipoWebSelect.selectedIndex;
    let tipoWebTexto = tipoWebSelect.options[tipoWebIndex].text;
    if (tipoWebSelect.value === 'actualizacion') {
      grupoUpdates.style.display = 'block';
      let precioUpdate = parseInt(precioUpdateInput.value) || 0;
      precioTotal += precioUpdate;
      detalle += `<strong>Tipo de Web:</strong> Actualización de web existente (${precioUpdate} CUP)<br>`;
    } else {
      grupoUpdates.style.display = 'none';
      precioTotal += parseInt(tipoWebSelect.value);
      detalle += `<strong>Tipo de Web:</strong> ${tipoWebTexto}<br>`;
    }
    // Imágenes
    let imagen = imagenSelect.value;
    detalle += `<strong>Imágenes proporcionadas:</strong> ${imagen}<br>`;
    // Opciones adicionales seleccionadas
    if(opcionesExtras.length > 0){
      let extrasSeleccionados = [];
      opcionesExtras.forEach(function(opcion) {
        if (opcion.checked) {
          extrasSeleccionados.push(opcion.nextElementSibling.textContent);
          precioTotal += parseInt(opcion.value);
        }
      });
      if (extrasSeleccionados.length > 0) {
        detalle += `<strong>Opciones Adicionales:</strong> ${extrasSeleccionados.join(', ')}<br>`;
      }
    }
    // Actualización del resumen en el DOM
    detallePedido.innerHTML = detalle;
    precioTotalElement.innerHTML = `<strong>Precio Total:</strong> ${precioTotal} CUP`;
  }
  // Eventos para actualizar el resumen según las opciones
  tipoWebSelect.addEventListener('change', actualizarResumen);
  imagenSelect.addEventListener('change', actualizarResumen);
  precioUpdateInput.addEventListener('input', actualizarResumen);
  opcionesExtras.forEach(function(opcion) {
    opcion.addEventListener('change', actualizarResumen);
  });
  // Al hacer clic en el botón se genera el mensaje y se envía a WhatsApp
  btnEnviar.addEventListener('click', function() {
    let mensaje = `Hola, me gustaría solicitar la creación de mi página web.%0A`;
    let tipoWebIndex = tipoWebSelect.selectedIndex;
    let tipoWebTexto = tipoWebSelect.options[tipoWebIndex].text;
    if (tipoWebSelect.value === 'actualizacion') {
      let precioUpdate = precioUpdateInput.value ? parseInt(precioUpdateInput.value) : 0;
      mensaje += `Tipo de web: Actualización de web existente (${precioUpdate} CUP)%0A`;
    } else {
      mensaje += `Tipo de web: ${tipoWebTexto}%0A`;
    }
    let imagen = imagenSelect.value;
    mensaje += `Imágenes proporcionadas: ${imagen}%0A`;
    
    // Incluir las opciones adicionales en el mensaje
    let extrasSeleccionados = [];
    opcionesExtras.forEach(function(opcion) {
      if (opcion.checked) {
        extrasSeleccionados.push(opcion.nextElementSibling.textContent);
      }
    });
    if (extrasSeleccionados.length > 0) {
      mensaje += `Opciones Adicionales: ${extrasSeleccionados.join(', ')}%0A`;
    }
    // Calcular precio total
    let precioTotal = 0;
    if (tipoWebSelect.value === 'actualizacion') {
      precioTotal += precioUpdateInput.value ? parseInt(precioUpdateInput.value) : 0;
    } else {
      precioTotal += parseInt(tipoWebSelect.value);
    }
    opcionesExtras.forEach(function(opcion) {
      if (opcion.checked) {
        precioTotal += parseInt(opcion.value);
      }
    });
    mensaje += `Precio Total: ${precioTotal} CUP.%0A`;
    mensaje += `Muchas gracias.`;
    let enlaceWhatsApp = `https://wa.me/5355015233?text=${mensaje}`;
    window.open(enlaceWhatsApp, '_blank');
  });
  // Llamada inicial para mostrar el resumen con los valores por defecto
  actualizarResumen();
});