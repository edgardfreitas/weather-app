import axios from 'axios';

function citySearch() {
  axios.get("http://dataservice.accuweather.com/locations/v1/search")
  .then(response => console.log(response))
  .catch(error => console.log(error))
}

citySearch();