//api key
let API_key = "AIzaSyC-o1G1xoIdWvDZPvb97W1JruQ3fojN55g";

// function to get query parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
//format numbers
function formatNumber(num, precision = 2) {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;

    return formatted;
  }

  return num;
}

// function to get video info
const videoInfo = (data) => {
  // console.log(data);
  document.querySelector("#channel-info").innerHTML = `
  <h3>${data.items[0].snippet.title}</h3>
            <div class="channel">
              <img src=${
                data.items[0].snippet.thumbnails.default.url
              } alt="chennel Logo" />
              <p>${data.items[0].snippet.channelTitle}</p>
              <p>${formatNumber(data.items[0].statistics.viewCount)} views</p>
              <p>${formatNumber(data.items[0].statistics.likeCount)} likes</p>
              <div id="reactions">
            <button><i class="fa-solid fa-thumbs-up">Like</i></button>
            <button><i class="fa-solid fa-thumbs-down">Dislike</i></button>
            <button><i class="fa-solid fa-floppy-disk">save</i></button>
          </div>
            </div> 


  <h3> Description... </h3>

  
     <div class="description">
              <p>${data.items[0].snippet.description}</p>
            </div>
    `;
};

// addding video container
document.addEventListener("DOMContentLoaded", () => {
  const videoIds = getQueryParam("id");
  let video_http = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_key}`;
  fetch(video_http)
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(".video-container").innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoIds}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        height="500px"
        width="1000px"
      ></iframe>
      `;
      videoInfo(data);
    });

  //  fetching comments
  const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?`;
  async function fetchComment() {
    let response = await fetch(
      comment_url +
        new URLSearchParams({
          part: "snippet",
          videoId: videoIds,
          maxResults: 15,
          order: "time",
          key: API_key,
        })
    );
    let data = await response.json();
    console.log(data);
    for (let i = 0; i < data.items.length; i++) {
      const element = data.items[i];
      console.log(element);
      makeComments(element);
    }
  }
  fetchComment();

  const comment_container = document.getElementById("comments");
  function makeComments(comments) {
    let comment = document.createElement("div");
    comment.className = "comment";
    let comment_str = `
        <div class="user-logo">
            <img src="${
              comments.snippet.topLevelComment.snippet.authorProfileImageUrl
            }" alt="">
        </div>
        <div class="comment-ifno">
            <div class="top">
                <div class="username">${
                  comments.snippet.topLevelComment.snippet.authorDisplayName
                }</div>
                <div class="time">${makeDate(
                  comments.snippet.topLevelComment.snippet.updatedAt
                )}</div>
            </div>
            <div class="act-Comment">
                ${comments.snippet.topLevelComment.snippet.textDisplay}
            </div>
            <div class="like-dislike-reply">
                <div style=" padding-right: 5px; border-right: 1px solid #000000;" class="stat-items">
                    <div class="img">
                        <img src="Youtube/Button-Btn.png" alt="">
                    </div>
                    <i class="fa-solid fa-thumbs-up" class="like"></i>${formatNumber(
                      comments.snippet.topLevelComment.snippet.likeCount
                    )}</i>
                </div>

                <div style="margin-left: 10px;" class="stat-items">                        
                    <div class="img">
                            <img src="Youtube/Button-Btn-1.png" alt="">
                    </div>
                </div>
                <div>
                   <i class="fa-solid fa-reply"> reply</i>
                </div>
               
            </div>
            <div class="reply">
                <div class="show-more">
                    <div class="side-bar-menu-items-title">Show ${
                      comments.snippet.totalReplyCount
                    } More</div>
                    
                </div>
            </div>
        </div>`;
    comment.innerHTML = comment_str;
    comment_container.appendChild(comment);
  }
});
