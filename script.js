var gallery = [];
var searchText = "";
var filterType = "all";

var galleryGrid = document.getElementById("galleryGrid");
var searchInput = document.getElementById("searchInput");
var fileInput = document.getElementById("fileInput");
var browseButton = document.getElementById("browseButton");
var dropZone = document.getElementById("dropZone");
var clearAllButton = document.getElementById("clearAllButton");
var lightbox = document.getElementById("lightbox");
var lightboxImage = document.getElementById("lightboxImage");
var closeLightboxButton = document.getElementById("closeLightbox");
var toastContainer = document.getElementById("toastContainer");

function init() {
  loadGallery();
  showGallery();
  browseButton.onclick = function () {
    fileInput.click();
  };
  fileInput.onchange = function () {
    uploadImages(this.files);
  };
  searchInput.oninput = function () {
    searchText = this.value.toLowerCase();
    showGallery();
  };
  document.querySelectorAll(".filter-button").forEach(function (btn) {
    btn.onclick = function () {
      filterType = btn.getAttribute("data-filter");
      showGallery();
    };
  });
  clearAllButton.onclick = deleteAll;
  closeLightboxButton.onclick = function () {
    lightbox.classList.remove("is-open");
  };
  dropZone.ondragover = function (e) {
    e.preventDefault();
    dropZone.classList.add("is-dragging");
  };
  dropZone.ondragleave = function () {
    dropZone.classList.remove("is-dragging");
  };
  dropZone.ondrop = function (e) {
    e.preventDefault();
    dropZone.classList.remove("is-dragging");
    uploadImages(e.dataTransfer.files);
  };
}

function uploadImages(files) {
  for (var i = 0; i < files.length; i++) {
    if (files[i].type.startsWith("image/")) {
      var file = files[i];
      var reader = new FileReader();
      reader.onload = function (e) {
        gallery.unshift({
          name: file.name,
          src: e.target.result,
          date: new Date(),
        });
        saveGallery();
        showGallery();
        showToast("Upload Successful");
      };
      reader.readAsDataURL(file);
    }
  }
}

function showGallery() {
  var list = gallery.slice();
  if (filterType === "latest")
    list.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  if (filterType === "oldest")
    list.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
  if (searchText)
    list = list.filter(function (img) {
      return img.name.toLowerCase().includes(searchText);
    });
  galleryGrid.innerHTML = "";
  list.forEach(function (img) {
    var card = document.createElement("div");
    card.className = "gallery-card";
    card.innerHTML =
      "<img class='gallery-card__image' src='" +
      img.src +
      "' alt='" +
      img.name +
      "' /><div class='gallery-card__content'><p class='gallery-card__name'>" +
      img.name +
      "</p><p class='gallery-card__meta'>" +
      new Date(img.date).toLocaleDateString() +
      "</p><button class='delete-button'>Delete</button></div>";
    card.querySelector("img").onclick = function () {
      lightboxImage.src = img.src;
      lightbox.classList.add("is-open");
    };
    card.querySelector("button").onclick = function () {
      deleteImage(img.name);
    };
    galleryGrid.appendChild(card);
  });
}

function deleteImage(name) {
  gallery = gallery.filter(function (img) {
    return img.name !== name;
  });
  saveGallery();
  showGallery();
  showToast("Image Deleted");
}

function deleteAll() {
  if (confirm("Delete all images?")) {
    gallery = [];
    saveGallery();
    showGallery();
    showToast("Gallery Cleared");
  }
}

function saveGallery() {
  localStorage.setItem("photoGalleryItems", JSON.stringify(gallery));
}
function loadGallery() {
  var data = localStorage.getItem("photoGalleryItems");
  if (data) {
    gallery = JSON.parse(data);
    gallery = gallery.map(function (img) {
      return { name: img.name, src: img.src, date: new Date(img.date) };
    });
  }
}
function showToast(message) {
  var t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;
  toastContainer.appendChild(t);
  setTimeout(function () {
    t.remove();
  }, 2200);
}

init();
