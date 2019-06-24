import axios from 'axios';
import { mockEvents } from './mock-events';

async function getSuggestions(query) {
    if (window.location.href.startsWith('http://localhost')) {
      return [
        {
          city: 'Munich',
          country: 'de',
          localized_country_name: 'Germany',
          name_string: 'Munich, Germany',
          zip: 'meetup3',
          lat: 48.14,
          lon: 11.58
        },
        {
          city: 'Munich',
          country: 'us',
          localized_country_name: 'USA',
          state: 'ND',
          name_string: 'Munich, North Dakota, USA',
          zip: '58352',
          lat: 48.66,
          lon: -98.85
        }
      ];
    }

    const token = await getAccessToken();
    if (token) {
      const url = 'https://api.meetup.com/find/locations?&sign=true&photo-host=public&query='
        + query
        + '&access_token=' + token;
      const result = await axios.get(url);
      return result.data;
    }
    return [];
}

async function getEvents(lat, lon) {
    if (window.location.href.startsWith('http://localhost')) {
        return mockEvents.events;
    }

    if (!navigator.onLine) {
      const events = localStorage.getItem('lastEvents');
      return JSON.parse(events);
    }

    const token = await getAccessToken();
    if (token) {
        let url = 'https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public'
        + '&access_token=' + token;
        // lat, lon is optional, if we have lat and lon, then we can add them
        if (lat && lon) {
        url += '&lat=' + lat + '&lon=' + lon;
        }
        const result = await axios.get(url);
        const events = result.data.events;
        if (events.length) { // Check if the events exist
          localStorage.setItem('lastEvents', JSON.stringify(events));
        }

        return events;
    }
    return [];
}

async function getOrRenewAccessToken(type, key) {
    console.log(type, key, '!!getOrRenew');
    let url;
    if (type === 'get') {
      // Lambda endpoint to get token by code
      url = 'https://29v6oisnpd.execute-api.eu-central-1.amazonaws.com/dev/api/token/' + key;
    } else if (type === 'renew') {
      // Lambda endpoint to get token by refresh_token
      url = 'https://29v6oisnpd.execute-api.eu-central-1.amazonaws.com/dev/api/refresh_token/'
        + key;
    }
    console.log(url, '!!url')
    // Use axios to do GET request to the endpoint
    const tokenInfo = await axios.get(url);
    console.log(tokenInfo, '!!tokenInfo');
    // Save tokens to localStorage together with a timestamp
    localStorage.setItem('access_token', tokenInfo.data.access_token);
    localStorage.setItem('refresh_token', tokenInfo.data.refresh_token);
    localStorage.setItem('last_saved_time', Date.now());
    // Return the access_token
    return tokenInfo.data.access_token;
  }

async function getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    console.log(accessToken, '!!getAccesstoken')
    // If no access_token found
    if (!accessToken) {
      // We try to get the authorization code from the url
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');

      if (!code) {
        // If we don't find any code, we need to redirect user to get it
        window.location.href = 'https://secure.meetup.com/oauth2/authorize?client_id=f29ecfroc9i5bv87ohotsj9pvt&response_type=code&redirect_uri=https://mgiota.github.io/meetup/';
        return null;
      }
      console.log(code, '!!')
      return getOrRenewAccessToken('get', code);
    }

    const lastSavedTime = localStorage.getItem('last_saved_time');

    // Check if access_token is still valid
    // Date.now() returns timestamp in milliseconds, one hour = 3600000 milliseconds
    if (accessToken && (Date.now() - lastSavedTime < 3600000)) {
      // The token is valid, return the token and end the function
      return accessToken;
    }
    // If the access_token is expired, we try to renew it by using refresh_token
    const refreshToken = localStorage.getItem('refresh_token');
    return getOrRenewAccessToken('renew', refreshToken);
  }

export { getSuggestions, getEvents };
