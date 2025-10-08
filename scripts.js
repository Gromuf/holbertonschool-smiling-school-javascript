$(document).ready(function () {
  console.log("script loaded");

  const carousel = $("#quotes-carousel");

  if (carousel.length) {
    $.ajax({
      url: "https://smileschool-api.hbtn.info/quotes",
      method: "GET",
      success: function (quotes) {
        carousel.empty();

        quotes.forEach((quote, index) => {
          const activeClass = index === 0 ? "active" : "";
          const item = `
            <div class="carousel-item ${activeClass}">
              <div class="row mx-auto align-items-center">
                <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                  <img src="${quote.pic_url}" class="d-block align-self-center rounded-circle" alt="${quote.name}" />
                </div>
                <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                  <div class="quote-text">
                    <p class="text-white">« ${quote.text} »</p>
                    <h4 class="text-white font-weight-bold">${quote.name}</h4>
                    <span class="text-white">${quote.title}</span>
                  </div>
                </div>
              </div>
            </div>`;
          carousel.append(item);
        });
      },
      error: function () {
        carousel.html(
          '<p class="text-white text-center">Unable to load quotes. Please try again later.</p>'
        );
      },
    });
  }

  const loader = $("#popular-loader");
  const track = $("#popular-track");

  if (track.length) {
    loader.show();

    function createCard(video) {
      let stars = "";
      for (let i = 0; i < 5; i++) {
        stars += `<img src="images/star_${
          i < Math.floor(video.star) ? "on" : "off"
        }.png" width="15" alt="star"/>`;
      }
      return `
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 px-2">
          <div class="card h-100">
            <img src="${video.thumb_url}" class="card-img-top" alt="${video.title}" />
            <div class="card-img-overlay text-center">
              <img src="images/play.png" alt="Play" width="64" class="align-self-center play-overlay" />
            </div>
            <div class="card-body">
              <h5 class="card-title font-weight-bold">${video.title}</h5>
              <p class="card-text text-muted">${video["sub-title"]}</p>
              <div class="creator d-flex align-items-center">
                <img src="${video.author_pic_url}" alt="${video.author}" width="30" class="rounded-circle" />
                <h6 class="pl-3 m-0 main-color">${video.author}</h6>
              </div>
              <div class="info pt-3 d-flex justify-content-between">
                <div class="rating">${stars}</div>
                <span class="main-color">${video.duration}</span>
              </div>
            </div>
          </div>
        </div>`;
    }

    $.ajax({
      url: "https://smileschool-api.hbtn.info/popular-tutorials",
      method: "GET",
      success: function (data) {
        loader.hide();

        data.forEach((video) => track.append(createCard(video)));
        data.slice(0, 4).forEach((video) => track.append(createCard(video)));

        const cardWidth = track.find(".col-lg-3").outerWidth(true);
        let position = 0;
        const total = data.length;

        function move(direction = 1) {
          position = (position + direction + total) % total;
          track.css("transform", `translateX(-${position * cardWidth}px)`);
        }

        let autoSlide = setInterval(() => move(1), 4000);

        $("#slideNext").click(() => {
          clearInterval(autoSlide);
          move(1);
        });

        $("#slidePrev").click(() => {
          clearInterval(autoSlide);
          move(-1);
        });
      },
      error: function () {
        loader.hide();
        track.html(
          '<p class="text-center text-danger w-100">Failed to load tutorials</p>'
        );
      },
    });
  }
});
