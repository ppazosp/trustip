const data = {};
let  cardAnimated = false;

function updateIpTable(ips) {
    const tbody = document.querySelector('.ip-scroll table tbody');
    tbody.innerHTML = "";
    ips.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${entry.ip}</td>
        <td>${entry.nor}</td>
        <td>${entry.dlr}</td>
      `;
        tbody.appendChild(tr);
    });
}

function selectCountry(countryName) {
    const info = data.countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    if (info) {
        console.log("Selected Country:", info.name);

        const card = document.querySelector('.country-card');
        const countryInfo = document.querySelector('.country-info');
        const countryTitle = document.querySelector('.country-card h2');

        countryTitle.textContent = info.name;
        const countryImage = document.querySelector('.map-stats img');
        countryImage.src = info.image;
        countryImage.alt = info.name;
        document.querySelector('.map-stats .rank span').textContent = "Rank: ";
        document.querySelector('.map-stats .rank strong').textContent = info.ranking;
        document.querySelector('.map-stats p:nth-child(3)').textContent =
            "IPs reported last Month: " + info.ips_last_month;
        document.querySelector('.map-stats p:nth-child(4)').textContent =
            "IPs reported in total: " + info.ips_total;
        updateIpTable(info.ips);

        if (!cardAnimated) {
            card.classList.add('show');
            card.addEventListener('animationend', function handler() {
                countryInfo.classList.add('show');
                card.removeEventListener('animationend', handler);
                cardAnimated = true;
            });
        } else {
            countryInfo.classList.remove('show');
            void countryInfo.offsetWidth;
            countryInfo.classList.add('show');
        }

        goToCountry(info);
        document.querySelector('.search-form input[name="search"]').blur();

    } else {
        console.log("Country not found:", countryName);
    }
}

function populateCountryDatalist() {
    const datalist = document.getElementById("countries");
    datalist.innerHTML = "";
    data.countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country.name;
        datalist.appendChild(option);
    });
}

async function loadCountriesData() {
    try {
        const response = await fetch('assets/data/countries.json');
        data.countries = await response.json();
        populateCountryDatalist();
    } catch (error) {
        console.error("Error al cargar countries.json:", error);
    }
}

async function preload() {
    try {

        await loadCountriesData();

        return true;
    } catch (error) {
        console.log(error);
    }
}


preload()

const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchInput = document.querySelector('.search-form input[name="search"]');
    const query = searchInput.value.trim();
    if (query) {
        selectCountry(query);
    }
});

const searchInput = document.querySelector('.search-form input[name="search"]');
searchInput.addEventListener('change', function(event) {
    const query = event.target.value.trim();
    if (query) {
        selectCountry(query);
    }
});
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    const currentText = this.value.trim().toLowerCase();
    const datalist = document.getElementById("countries");
    let candidate = null;
    if (datalist) {
      for (let i = 0; i < datalist.options.length; i++) {
        const optionValue = datalist.options[i].value;
        if (optionValue.toLowerCase().startsWith(currentText)) {
          candidate = optionValue;
          break;
        }
      }
    }
    if (candidate) {
      this.value = candidate;
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    selectCountry(this.value.trim());
  }
});



