export default class Ajax {

  constructor() {

    this.avatar = document.querySelector('.user-inforamtion__icon img');

    this.requestURL = 'https://api.github.com/users/';
    this.requestType = 'json';
    this.requestMethod = 'GET';
    this.gitToken = 'aa3c782edd67469e3487c94562a7f5374b75816f';

    this.init();
  }


  init() {
    this.addEvents();
  }

  xhrInit() {
    let request = new XMLHttpRequest();
    let userName = document.querySelector('form input[type=text]').value;

    request.open(this.requestMethod , this.requestURL + userName + '?access_token=' + this.gitToken);
    request.responseType = this.requestType;
    request.send();

    return request;
  }

  addEvents() {
    document.querySelector('form input[type=submit]').addEventListener('click', (e)=> {
      e.preventDefault();
      this.showUserInfo();
    })
  }

  removeUserInfo() {
    this.avatar.removeAttribute('src');
  }

  showUserInfo() {
    var request = this.xhrInit();

    request.onprogress = function() {
      document.querySelector('.overlay').classList.add('show');
      this.removeInfo();
    }


      request.onload = function() {
        document.querySelector('.overlay').classList.remove('show');
        if (request.status >= 200 && request.status < 300) {

          console.log(request.response['login']);



        console.log(this.userInfoAvatar);

        document.querySelector('.user-inforamtion__icon img').src = request.response['avatar_url'];

        // this.showUserInfo(response);    //todo show user info: userInfoAvatar; username, count of repo etc.
        // this.generateRepoList(gitInfo);        //todo show repo list
      }else{
          console.log(request.status)
          return
        };  //todo  schow here error message

    }




  }




   generateRepoList(jsonObj) {
    var heroes = jsonObj['members'];

    for(i = 0; i < heroes.length; i++) {
      var myArticle = document.createElement('article');
      var myH2 = document.createElement('h2');
      var myPara1 = document.createElement('p');
      var myPara2 = document.createElement('p');
      var myPara3 = document.createElement('p');
      var myList = document.createElement('ul');

      myH2.textContent = heroes[i].name;
      myPara1.textContent = 'Secret identity: ' + heroes[i].secretIdentity;
      myPara2.textContent = 'Age: ' + heroes[i].age;
      myPara3.textContent = 'Superpowers:';

      var superPowers = heroes[i].powers;
      for(j = 0; j < superPowers.length; j++) {
        var listItem = document.createElement('li');
        listItem.textContent = superPowers[j];
        myList.appendChild(listItem);
      }

      myArticle.appendChild(myH2);
      myArticle.appendChild(myPara1);
      myArticle.appendChild(myPara2);
      myArticle.appendChild(myPara3);
      myArticle.appendChild(myList);

      section.appendChild(myArticle);
    }
  }




}
