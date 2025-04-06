//APARTADO 4.3.1
$(document).ready(() => {
    const tbody = $('#leaderboard-body');
  
    $.ajax({
      type: 'GET',
      url: 'assets/data/countries.xml',
      dataType: 'xml',
      success: (xml) => {
        $(xml).find('country').each((index, element) => {
          const name = $(element).find('name').text();
          const region = $(element).find('region').text();
          const total = $(element).find('total').text();
          const time = $(element).find('time').text();
          const last = $(element).find('last').text();
          const trend = $(element).find('trend').text();
      
          const row = $(`
            <tr class="animated-row">
              <td>${name}</td>
              <td>${region}</td>
              <td>${total}</td>
              <td>${time}</td>
              <td>${last}</td>
              <td>${trend}</td>
            </tr>
          `);
      
          setTimeout(() => {
            $('#leaderboard-body').append(row);
          }, index * 100); 
        });
      },
      error: (xhr) => {
        console.error('Error loading XML data', xhr.status, xhr.statusText);
      }
      
    });
});  

$(document).ready(() => {
    const highlightColor = '#123D15';
  
    // Delegación: se aplica a todos los tr incluso si se insertan más tarde
    $('#leaderboard-body').on('mouseenter', 'tr', function () {
      $(this).css({
        'background-color': highlightColor,
        'transform': 'scale(1.02)',
        'transition': 'all 0.2s ease',
        'z-index': 1,
      });
    });
  
    $('#leaderboard-body').on('mouseleave', 'tr', function () {
      $(this).css({
        'background-color': '',
        'transform': 'scale(1)',
        'transition': 'transform 0.2s ease, background-color 0.2s ease',
        'z-index': '',
      });
    });
  });


  $(document).ready(() => {
    let selectedRow = null;
  
    $('#leaderboard-body').on('click', 'tr', function () {
      const row = $(this);
  
      if (selectedRow && row.is(selectedRow)) {
        // Si ya estaba seleccionada, desactivar centrado
        $('html, body').animate({ scrollTop: 0 }, 500);
        selectedRow.removeClass('focused-row');
        selectedRow = null;
      } else {
        // Desactivar la fila anterior
        if (selectedRow) {
          selectedRow.removeClass('focused-row');
        }
  
        // Activar la nueva fila
        selectedRow = row;
        row.addClass('focused-row');
  
        // Calcular posición y centrar
        const offset = row.offset().top - ($(window).height() / 2) + (row.height() / 2);
        $('html, body').animate({ scrollTop: offset }, 500);
      }
    });
  });
  




  