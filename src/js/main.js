document.addEventListener('DOMContentLoaded', () => {
  init();
});

const responseContainer = document.querySelector('.response .row__container');

const overlay = document.querySelector('.overlay');
const gitToken = 'aa3c782edd67469e3487c94562a7f5374b75816f';

function init() {
  addEvents();
}

function addEvents() {
  let submit = document.querySelector('input[type=submit]');
  let input = document.querySelector('input[type=text]');

  function showInfo() {
    let promise = new Promise(function(resolve, reject) {});

    promise
      .then(overlay.classList.add('show'))
      .then(removeInfo())
      .then(showUserInfo())
      .then(showRepoList())
      .then(overlay.classList.remove('show'));
  }

  input.addEventListener('keydown', (e)=> {
    if (e.keyCode == 13) {
      showInfo();
    }
  });

  submit.addEventListener('click', (e)=> {
    e.preventDefault();
    showInfo();
  })
}

function xhrInit(type) {
  let accessToken = `?access_token=${gitToken}`;

  let userName = document.querySelector('input[type=text]').value;
      userName = userName.replace(' ', '');

  let requestURL = 'https://api.github.com/users/';
      requestURL = requestURL + userName;
  if (type == 'repos') requestURL = requestURL + '/repos';

  let requestType = 'json';
  let requestMethod = 'GET';

  let xhr = new XMLHttpRequest();

  xhr.responseType = requestType;
  xhr.open(requestMethod , requestURL +  accessToken);
  xhr.send();

  return xhr;
}





function showUserInfo() {

  var request = xhrInit();

  request.onprogress = function() {
    document.querySelector('input[type=text]').setAttribute('class', '')
  }

  request.onload = function() {

    if (request.status >= 200 && request.status < 300) {

        let name = request.response['name'] ? request.response['name'] : request.response['login'];

        responseContainer.appendChild(generateIcon(request.response['avatar_url']));
        responseContainer.appendChild(generateUserInfo(name, request.response['html_url']));

      document.querySelector('input[type=text]').classList.add('success');


    } else {
      let msg = document.createElement('div');
      msg.classList.add('error','col_12');
      msg.innerText = 'User not found';

      responseContainer.appendChild(msg);

      document.querySelector('input[type=text]').classList.add('error');

      console.log('Some error with status ' + request.status + '. Message: "' + request.response.message + '"');
    }
  }
}


function generateIcon(icon) {
  var iconHtml = document.createElement('div');
  iconHtml.classList.add('user-icon', 'col_3', 'col-sm_2');

  var iconImg = document.createElement('img');
  iconImg.src = icon;

  iconHtml.appendChild(iconImg);

  return iconHtml;
}

function generateUserInfo(name, link) {
  var userInfoHtml = document.createElement('div');
  userInfoHtml.classList.add('user-information', 'col_9', 'col-sm_10');

  var userNameHtml = document.createElement('div');
  userNameHtml.classList.add('user-information__name');
  userNameHtml.innerText = name

  var userLinkHtml = document.createElement('div');
  userLinkHtml.classList.add('user-information__link');

  userInfoLinkToGit = document.createElement('a');
  userInfoLinkToGit.setAttribute('href', link);
  userInfoLinkToGit.setAttribute('target', '_blank');
  userInfoLinkToGit.innerHTML = '<i class="fas fa-external-link-alt"></i>';

  userLinkHtml.appendChild(userInfoLinkToGit);

  userInfoHtml.appendChild(userNameHtml);
  userInfoHtml.appendChild(userLinkHtml);

  return userInfoHtml;
}


function showRepoList() {

  var request = xhrInit('repos');

  request.onload = function() {

    if (request.status >= 200 && request.status < 300) {

      setTimeout(function () {
        if (generateLangFilter(request.response)) responseContainer.appendChild(generateLangFilter(request.response));
        responseContainer.appendChild(generateRepoList(request.response));

        let select = document.querySelector('select');

        select.addEventListener('change', () => {
          filterRepo();
        })
      }, 100)

    } else {
      console.log('Some error with status ' + request.status + '. Message: "' + request.response.message + '"');
    }
  }
}

function generateLangFilter(obj) {

  let languages = new Set();

  for (key in obj) {
    if  (obj[key]['language']) {
      languages.add(obj[key]['language'])
    }
  }

  if (languages.size <= 1) {
    return
  }


  let filterWrapper = document.createElement('div');
  filterWrapper.classList.add('filter', 'col_12');
  filterWrapper.innerText = 'Language filter:'

  let deleteFilterEl = document.createElement('span');
  deleteFilterEl.id = 'delFilter';
  deleteFilterEl.innerHTML = '<i class="fas fa-times"></i>unset filter';
  deleteFilterEl.addEventListener('click', function() {
    document.querySelector('select').value = 'all';
    filterRepo();
    this.style.display = 'none';
  })

  let filter = document.createElement('select');
  filter.setAttribute('name', 'languages');

  let filterfirstItem = document.createElement('option');
  filterfirstItem.setAttribute('value', 'all');
  filterfirstItem.innerText = 'All languages';

  filter.appendChild(filterfirstItem);

  for (let language of languages) {
    let filterItem = document.createElement('option');
    filterItem.setAttribute('value', language);
    filterItem.innerText = language;

    filter.appendChild(filterItem);
  }

  filterWrapper.appendChild(filter);
  filterWrapper.appendChild(deleteFilterEl);

  return filterWrapper;
}

function filterRepo() {
  let filterValue = document.querySelector('select').value;
  let deleteFilterEl = document.querySelector('#delFilter');

  let repos = document.querySelectorAll('.repo-list__item');

  if (filterValue == 'all') {
    for (let i = 0; i < repos.length; i++) {
      repos[i].style.display = "";
    }
    deleteFilterEl.style.display = 'none'
    return
  }

  let showedRepos = document.querySelectorAll('[data-lang="'+ filterValue +'"]');

  for (let i = 0; i < repos.length; i++) {
    repos[i].style.display = "none";
  }
  for (let i = 0; i < showedRepos.length; i++) {
    showedRepos[i].style['display']= ""
  }

  deleteFilterEl.style.display = 'inline'

}

function generateRepoList(obj) {

  var repoHtml = document.createElement('div');
  repoHtml.classList.add('repo-list', 'col_12');

  let showedProperty = new Map([
    ['Main language', 'language'],
    ['Create date', ''],
    ['Last update', '']
  ]);

  if (obj.length == 0) {
    repoHtml.classList.add('warning');
    repoHtml.innerText = "Repos not found";

    return repoHtml;
  }

  for(i = 0; i < obj.length; i++) {

    let repo = document.createElement('div');

    let createDate = new Date(obj[i].created_at);
    let updateDate = new Date(obj[i].updated_at);

    repo.classList.add('repo-list__item', 'col_12', 'col-sm_6');
    repo.dataset.lang = obj[i].language;

    repo.innerHTML = `<div class="repo-list__item-top">
                      <div class="repo-list__item-name">${obj[i].name}</div>
                      <a class="btn btn-grey" href="${obj[i].html_url}" target="_blank">show</a>
                    </div>`;



    showedProperty.forEach( (value, key) => {

      let propertyValue = obj[i][value] !== null ? obj[i][value] : 'unknow';
      if (key == 'Create date') propertyValue = createDate.toLocaleDateString();
      if (key == 'Last update') propertyValue = updateDate.toLocaleDateString();

      repo.innerHTML += `<div class="repo-list__item-bottom">
                        <div class="repo-list__item-name">${key}</div>
                        <div class="repo-list__item-value">${propertyValue}</div>
                       </div>`
    });

    repoHtml.appendChild(repo);
  }

  return repoHtml;
}


function removeInfo() {
  while(responseContainer.firstChild) {
    responseContainer.removeChild(responseContainer.firstChild)
  }
}