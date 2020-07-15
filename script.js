
// Set variables to be used later
const baseURL = "https://api.covid19api.com/";
let url;
let selectedCountry;
let slug;
let jsonData = [];
let dataDate = [];
let dataConfirmed = [];
let dataDeaths = [];
let dataRecovered = [];
let beginDate;
let endDate;
let initialLoad = true;

// Identify elements that will be updated 
const countries = document.getElementById('countries');
const submit = document.getElementById('submit');
const dataHeader = document.getElementById('selectedCountryHeader');

// Get list of countries for user
 async function fetchCountries() {
    let url = baseURL + 'countries';

    let result = await fetch(url);
    let json = await result.json();
    console.log(json);
    addCountries(json);
}

//Set an initial graph with data from the US
if (initialLoad) {
    dataHeader.innerText = 'United States of America';
    fetchStats('united-states');
    initialLoad = false;
}

// Invoke function to grab list of countries
fetchCountries();

// // Add list of countries to the dropdown on page
function addCountries(json) {  
    
    for(con of json) {
        let option = document.createElement('option');

        option.innerText = con.Country;
        option.value = con.Slug;

        // jsonData.push(con);
    
        countries.appendChild(option);
    }
}

// Lock in user's selection and call the function to fetch the data specific to selection
submit.addEventListener('click', () => {
    selectedCountry = countries.value;
    dataHeader.innerText = selectedCountry;
    fetchStats(selectedCountry);
})

// Fetch stats from a specific country
function fetchStats(country) {
    url = baseURL + 'total/country/' + country;

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            displayStats(json);
        })
}

function displayStats(json){
    // Resets data points before each fetch
    dataDate = [];
    dataConfirmed = [];
    dataDeaths = [];
    dataRecovered = [];

    for (item in json) {
        dataDate.push(json[item].Date);
        dataConfirmed.push(json[item].Confirmed);
        dataDeaths.push(json[item].Deaths);
        dataRecovered.push(json[item].Recovered);
    }
    
    // Build chart w/ data in Chart.js
    var ctx = document.getElementById('lineChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        // The data for our dataset
        data: {
            labels: dataDate,
            datasets: [{ 
                label: 'Total Deaths',
                borderColor: 'rgb(243, 119, 72)',
                backgroundColor: 'rgb(243, 119, 72)',
                fill: false,
                pointRadius: 2,
                data: dataDeaths
            },
            {
                label: 'Total Confirmed Cases',
                borderColor: 'rgb(132, 188, 218)',
                backgroundColor: 'rgb(132, 188, 218)',
                fill: false,
                pointRadius: 2,
                data: dataConfirmed
            },
            {
                label: 'Total Recovered',
                borderColor: 'rgb(236, 195, 11)',
                backgroundColor: 'rgb(236, 195, 11)',
                fill: false,
                pointRadius: 2,
                data: dataRecovered
            },]
        },
        // Configuration options go here
        options: {}
    });
}