$(document).ready(() => {
  const highlightColor = '#123D15';

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

          row.on('animationend', () => {
            row.removeClass('animated-row');
          });
        });
      },
      error: (xhr) => {
        console.error('Error loading XML data', xhr.status, xhr.statusText);
      }
      
    });
});  




  
  




  