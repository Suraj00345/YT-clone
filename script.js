const videoCardContainer = document.querySelector(".video-container");
const BASE_URL = "https://www.googleapis.com/youtube/v3";
let api_key = "AIzaSyC-o1G1xoIdWvDZPvb97W1JruQ3fojN55g";

// another api key = AIzaSyAZdnIKGBcCPitlE2NMYX1fqURJ5wFOgEQ

let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

fetch(
  video_http +
    new URLSearchParams({
      key: api_key,
      part: "snippet",
      chart: "mostPopular",
      maxResults: 50,
      regionCode: "IN",
    })
)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    data.items.forEach((item) => {
      getChannelIcon(item);
    });
  })
  .catch((err) => console.log(err));

//  channel icon

const getChannelIcon = (video_data) => {
  fetch(
    channel_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video_data.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video_data.channelThumbnail =
        data.items[0].snippet.thumbnails.default.url;
      // console.log(video_data);
      makeVideoCard(video_data);
    });
};

const makeVideoCard = (data) => {
  // console.log(data);
  videoCardContainer.innerHTML += `
     <div class="video" onclick="location.href = 'videoPage.html?id=${data.id}'">
        <img
          src="${data.snippet.thumbnails.high.url}"
          class="thumbnail"
          alt="images"
        />
        <div class="content">
          <img
            src="${data.channelThumbnail}"
            class="chennel-icon"
            alt="chennel-img"
          />
          <div class="info">
            <h4 class="title">
             ${data.snippet.title}
            </h4>
            <p class="chennel-Name">${data.snippet.channelTitle}</p>
          </div>
        </div>
      </div> 
    `;
};

//loader

function loader() {
  const loader = document.querySelector(".loader");
  document.appendChild.loader;
}

// search bar

let searchInput = document.querySelector(".search-bar");
let searchBtn = document.querySelector(".Search-btn");
let searchLink = "https://www.youtube.com/results?search_query=";

searchBtn.addEventListener("click", () => {
  loader();

  // setTimeout(() => {
  //   if (searchInput.value.length) {
  //     location.href = searchLink + searchInput.value;
  //   }
  // }, "2000");

  const search_url = `https://www.googleapis.com/youtube/v3/search?key=${api_key}
  &part=snippet&q=${searchInput.value}&type=channel,video,playlist&maxResults=20`;
  fetch(search_url)
    .then((res) => res.json())
    .then((search_values) => {
      console.log(search_values);
      for (const i in search_values.items) {
        makeSearchAlive(search_values.items[i]);
      }
    });
});

async function makeSearchAlive(videos) {
  let my_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videos.id.videoId}&key=${api_key}`;
  let response = await fetch(my_url);
  let data = await response.json();

  // for (const i in data.items) {
  //     makeSearchAlive(data.items[i]);
  // }
  for (let i = 0; i < data.items.length; i++) {
    getChannelIcon(data.items[i]);
  }
}

const buttons = document.querySelectorAll(".tag");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log(button.innerHTML);
    location.href = searchLink + button.innerHTML;
  });
});
