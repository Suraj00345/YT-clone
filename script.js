const videoCardContainer = document.querySelector('.video-container');
const BASE_URL = "https://www.googleapis.com/youtube/v3";
let api_key = "AIzaSyC-o1G1xoIdWvDZPvb97W1JruQ3fojN55g";

let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

fetch(video_http + new URLSearchParams({
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
  fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video_data.snippet.channelId,
      })).then((res) => res.json())
     .then((data) => {
    // console.log(data);
    video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
    // console.log(video_data);
    makeVideoCard(video_data);
  });
};

const makeVideoCard = (data) => {
  videoCardContainer.innerHTML += `
     <div class="video" onclick="location.href = 'https://www.youtube.com/watch?v=${data.id}'">
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

// search bar

let searchInput = document.querySelector('.search-bar');
let searchBtn = document.querySelector('.Search-btn');
let searchLink = "https://www.youtube.com/results?search_query=";

searchBtn.addEventListener('click', (data) => {
    if(searchInput.value.length){
        location.href = searchLink + searchInput.value;
    }
});
