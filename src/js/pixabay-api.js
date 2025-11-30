import axios from 'axios';

const API_KEY = '53351901-67f2d48607dfb534abaa6754b';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };
   return axios.get(BASE_URL, { params })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

 