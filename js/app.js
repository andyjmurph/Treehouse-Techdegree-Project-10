//Global Variables

const searchBar = document.querySelector('input[name=\'search-bar\']');
const searchButton = document.querySelector('.search-icon');
let username = "";
const gallery = document.querySelector('.gallery');
const userInfo = document.querySelector('.user-info');
const instructions = document.querySelector('.instructions');

//Variables for ajax request
const url = 'https://api.github.com/users/';
let urlQuery = "";
let xhr = new XMLHttpRequest;

//Functions

//Function to get the user's repositories from Github and display them in .gallery
xhr.onreadystatechange = () => {
  //Check for the readyState 4
  if (xhr.readyState ===4) {
    //Parse the response
    let response = JSON.parse(xhr.responseText);
    //Variable to store the generated HTML
    let cardHTML = "";
    //log the response
    console.log(response);

    //get the owner's profile information
    let userPic = response[0].owner.avatar_url;
    let userURL = response[0].owner.html_url;
    let userName = response[0].owner.login;

    let profileInfo = `
      <div class="user">
        <img src="${userPic}" alt="Avatar for ${userName}">
        <div class="user-info">
          <h3>${userName}</h3>
          <p>Awesome.  You found ${userName}!  Check out what they've been working on.</p>
          <a href="${userURL}" target="blank">View profile</a>
        </div>
      </div>
    `;

    //Add the user profile info to the .profile-info section
    userInfo.innerHTML = profileInfo;

    for (var i = 0; i < response.length; i++) {
      let repoName = response[i].name;
      let repoURL = response[i].svn_url;
      let repoDesc = response[i].description;
      let forkCount = response[i].forks_count;
      let stargazerCount = response[i].stargazers_count;


      //Build the html
      cardHTML += `
      <li class="card">
        <h3>${repoName}</h3>
        <a href="${repoURL}" target="_"><p class="desc">${repoDesc}</p></a>
        <div class="stats">
          <p>${forkCount} Forks</p>
          <p>${stargazerCount} Stargazers</p>
          <i class="fa fa-github" aria-hidden="true"></i>
        </div>
      </li>
      `;
    }  //End of for loop

    // Add the cardHTML to the gallery
    gallery.innerHTML = cardHTML;
    //hide the instruction text
    instructions.style.display = 'none';

  }  //End of if conditional

}  //End of anonymous arrow function

//Store the value typed in searchBar as the searchValue when clicking the searchButton

searchButton.addEventListener('click', () => {
  //store the value of SearchBar in searchValue
  username = searchBar.value;
  //add the username to the url
  urlQuery = `${username}/repos`;
  //reset searchBar value to balnk.
  searchBar.value = "";
  searchBar.focus();
  //Open the xhr request
  xhr.open('GET', url + urlQuery);
  //send the xhr request
  xhr.send();
  //reset the query string to blank
  urlQuery = "";
})
