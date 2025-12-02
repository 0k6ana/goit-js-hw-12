import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from "./js/render-functions.js";

const form = document.querySelector("#search-form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalPages = 0;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add("is-hidden");
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove("is-hidden");
}

function smoothScrollAfterRender() {
  const gallery = document.querySelector(".gallery");

  if (!gallery) return;

  const cardHeight = gallery.getBoundingClientRect().height / 15;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

async function onSearch(e) {
  e.preventDefault();

  query = e.currentTarget.elements["search-text"].value.trim();

  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (!data || !data.hits.length) {
      alert("Sorry, no images found. Please try another query.");
      return;
    }

    createGallery(data.hits);
    totalPages = Math.ceil(data.totalHits / 15);

    if (page < totalPages) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      alert("We're sorry, but you've reached the end of search results.");
    }

  } catch (error) {
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
      alert("We're sorry, but you've reached the end of search results.");
    }

  } catch (error) {
    console.error("Помилка при завантаженні:", error);
  } finally {
    hideLoader();
  }
}
