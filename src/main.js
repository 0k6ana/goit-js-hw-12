import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn
} from "./js/render-functions.js";

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector("#search-form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalPages = 0;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

function smoothScrollAfterRender() {
  const gallery = document.querySelector(".gallery .gallery-item");
  if (!gallery) return;

  const cardHeight = gallery.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

async function onSearch(e) {
  e.preventDefault();

  query = e.currentTarget.elements["search-text"].value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Увага',
      message: 'Введіть пошуковий запит!',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

   
    if (!data || !data.hits.length) {
      iziToast.error({
        title: 'Помилка',
        message: 'Нічого не знайдено. Спробуйте інший запит.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    totalPages = Math.ceil(data.totalHits / 15);

     if (page < totalPages) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'Інформація',
        message: "Ви досягли кінця результатів пошуку.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити зображення',
      position: 'topRight',
    });
    console.error("Помилка при завантаженні:", error);
  } finally {
    hideLoader();
  }
}
async function onLoadMore() {
  page += 1;
  showLoader();
  hideLoadMoreBtn(); 
  try {
    const data = await getImagesByQuery(query, page);

    if (data && data.hits.length) {
      createGallery(data.hits);
      smoothScrollAfterRender();
    }

    if (page < totalPages) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'Інформація',
        message: "Ви досягли кінця результатів пошуку.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити наступну сторінку',
      position: 'topRight',
    });
    console.error("Помилка при завантаженні:", error);
  } finally {
    hideLoader();
  }
}