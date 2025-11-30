import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from "./js/render-functions.js";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("#search-form");

form.addEventListener("submit", event => {
  event.preventDefault();

  const query = event.target.elements['search-text'].value.trim();

  if ( query === "") {
    iziToast.warning({
      title: "Увага",
      message: "Введіть пошукове слово!",
      position: "topRight",
    });
    return;
  }

  clearGallery();
  showLoader();

  getImagesByQuery(query)
    .then(data => {
      hideLoader();

      const images = data.hits;

      if (images.length === 0) {
        iziToast.info({
          title: "Немає результатів",
          message: `Зображень за запитом "${query}" не знайдено.`,
          position: "topRight",
        });
        return;
      }

      createGallery(images);
    })
    .catch(() => {
      hideLoader();
      iziToast.error({
        title: "Помилка",
        message: "Сталася помилка при завантаженні даних.",
        position: "topRight",
      });
    });
});


