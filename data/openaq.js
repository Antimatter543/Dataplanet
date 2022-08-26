// file that interacts with the openaq api

class OpenAQ {
    // country URL for OpenAQ API
    countryURL = "https://api.openaq.org/v2/countries?limit=200&page=1&offset=0&sort=asc&order_by=country";

    getCountries() {
        // make api get request
        fetch(this.countryURL).then(res => {
            // catch any errors
            if (!res.ok)
                throw new Error(`${res.status} | Request Failed...`);
            return res.json();
        }).then(data => {
            // handle air data here
            console.log(data);
        }).catch(error => console.error(error));
    }

    getLatest() {

    }  
}

const API = new OpenAQ();
API.getCountries();