/* === GLOBAL VARIABLES === */

const searchBar = document.querySelector('input[name=\'search-bar\']');
const searchButton = document.querySelector('.search-icon');
let username = "";
const gallery = document.querySelector('.gallery');
const userInfo = document.querySelector('.user-info');
const instructions = document.querySelector('.instructions');
const errorBar = document.getElementById('error')
const overlay = document.createElement('div');
const overlayCard = document.createElement('div');
const endOfBody = document.querySelector('body script');
let overlayUserImg = document.createElement('img');
let overlayUserName = document.createElement('h3');
let overlayRepo = document.createElement('div');
let userPic = '';
let userName = '';


//Variables for ajax request
const url = 'https://api.github.com/users/';
let urlQuery = "";
let xhr = new XMLHttpRequest;

/* === Functions === */

//Remove gallery listItems

function removeLI(el){
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

// Close the overlayCard
overlay.onclick = (e) => {
  if (e.target.classList.contains('card') === true || e.target.parentNode.classList.contains('card') === true) {
    //Do nothing
  } else {
  overlay.style.display = 'none';
  }
  removeLI(cardRepo);
}

// UpdateOverlay
function updateOverlay(title, description, stats){
  overlayUserImg.setAttribute('src', userPic);
  overlayUserName.innerText = userName;
  overlayRepo.innerHTML += title + '<br>';
  overlayRepo.innerHTML += description;
  overlayRepo.innerHTML += stats;
}

//Function to get the user's repositories from Github and display them in .gallery
xhr.onreadystatechange = () => {
  //Check for the readyState 4
  if (xhr.readyState === 4 ) {
    //Parse the response
    let response = JSON.parse(xhr.responseText);
    //Variable to store the generated HTML
    let cardHTML = "";
    //Check for errors.
    if (xhr.status === 404) {
      // Add Page not found message
      errorBar.innerHTML = '<p>Oh no, it looks like that user was '+ xhr.statusText + '.  Try searching for a different user.</p>';
      error.style.display = 'block';
      removeLI(userInfo);
      removeLI(gallery);
    } else if (xhr.status === 500) {
      // Add server error message
      errorBar.innerHTML = '<p>Oh no, it looks like there was a problem with the server.  Try again later.';
      error.style.display = 'block';
      removeLI(userInfo);
      removeLI(gallery);
    } else if (xhr.status === 200 && response.length > 0) {
      //hide the error bar if not already hidden
      error.style.display = 'none';

      //get the owner's profile information
      userPic = response[0].owner.avatar_url;
      let userURL = response[0].owner.html_url;
      userName = response[0].owner.login;

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
        let = repoName = response[i].name;
        let = repoURL = response[i].svn_url;
        let = repoDesc = response[i].description;
        let = forkCount = response[i].forks_count;
        let = stargazerCount = response[i].stargazers_count;


        //Build the html
        cardHTML += `
        <li class="card">
          <h3>${repoName}</h3>
          <p class="desc">${repoDesc}</p>
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
    } else {
      // Add server error message
      errorBar.innerHTML = `Hmmm, it looks like there are no respositories for that user.  Try another user.`;
      error.style.display = 'block';
      removeLI(userInfo);
      removeLI(gallery);
    }

  }  //End of if conditional

}  //End of anonymous arrow function

//Add event listner to gallery items
gallery.addEventListener('click', (e) => {
  if (e.target.parentNode.classList.contains('stats') === true) {
    let selectedCard = e.target.parentNode.parentNode;
  } else {
    selectedCard = e.target.parentNode;
  }
  overlay.style.display = 'block';
  let cardTitle = selectedCard.getElementsByTagName('h3')[0].innerHTML;
  let cardDesc = selectedCard.querySelector('.desc').innerHTML;
  let cardStats = selectedCard.querySelector('.stats').innerHTML;
  updateOverlay(cardTitle, cardDesc, cardStats);
})


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

// Add the overlay

document.body.insertBefore(overlay, endOfBody);
overlay.className = 'overlay';
overlay.appendChild(overlayCard);
overlayCard.className = 'card';
overlayCard.appendChild(overlayUserImg);
overlayCard.appendChild(overlayUserName);
overlayCard.appendChild(overlayRepo);
