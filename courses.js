$(document).ready(function () {
  const API_URL = "https://smileschool-api.hbtn.info/courses";

  const $videosRow = $(".videos-row");
  const $videoCount = $(".video-count");
  const $search = $("#search-input");
  const $topicMenu = $("#topic-menu");
  const $sortMenu = $("#sort-menu");
  const $topicLabel = $("#topic-label");
  const $sortLabel = $("#sort-label");

  let currentTopic = "all";
  let currentSort = "most_popular";
  let currentQuery = "";

  function renderVideos(data) {
    $videosRow.empty();
    $videoCount.text(`${data.courses.length} videos`);

    data.courses.forEach((video) => {
      const stars = Array.from(
        { length: 5 },
        (_, i) =>
          `<img src="images/star_${
            i < video.star ? "on" : "off"
          }.png" width="15" alt="star" />`
      ).join("");

      const card = `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
          <div class="card">
            <img src="${video.thumb_url}" class="card-img-top" alt="${video.title}">
            <div class="card-img-overlay text-center">
              <img src="images/play.png" alt="Play" width="64" class="align-self-center play-overlay">
            </div>
            <div class="card-body">
              <h5 class="card-title font-weight-bold">${video.title}</h5>
              <p class="card-text text-muted">${video["sub-title"]}</p>
              <div class="creator d-flex align-items-center">
                <img src="${video.author_pic_url}" alt="${video.author}" width="30" class="rounded-circle">
                <h6 class="pl-3 m-0 main-color">${video.author}</h6>
              </div>
              <div class="info pt-3 d-flex justify-content-between">
                <div class="rating">${stars}</div>
                <span class="main-color">${video.duration}</span>
              </div>
            </div>
          </div>
        </div>`;
      $videosRow.append(card);
    });
  }

  function loadCourses() {
    $videosRow.html('<div class="loader"></div>');
    $.get(API_URL, { q: currentQuery, topic: currentTopic, sort: currentSort })
      .done(renderVideos)
      .fail(() => {
        $videosRow.html(
          '<p class="text-danger text-center w-100">Error loading videos 😢</p>'
        );
      });
  }

  $.get(API_URL, function (data) {
    $topicMenu.empty();
    data.topics.forEach((topic) => {
      const item = $(`<a class="dropdown-item" href="#">${topic}</a>`);
      item.click(() => {
        currentTopic = topic;
        $topicLabel.text(topic);
        loadCourses();
      });
      $topicMenu.append(item);
    });

    $sortMenu.empty();
    data.sorts.forEach((sort) => {
      const item = $(
        `<a class="dropdown-item" href="#">${sort.replace("_", " ")}</a>`
      );
      item.click(() => {
        currentSort = sort;
        $sortLabel.text(sort.replace("_", " "));
        loadCourses();
      });
      $sortMenu.append(item);
    });

    loadCourses();
  });

  $search.on("input", function () {
    currentQuery = $(this).val();
    loadCourses();
  });
});
