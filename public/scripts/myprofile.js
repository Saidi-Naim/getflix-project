(()=>{
// myprofile modal message
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const messageMyProfile = urlParams.get('messageMyProfile');


if (messageMyProfile != null) {
  document.querySelector('.modal-myprofile').classList.remove('modal-myprofile-hidden');
  document.getElementById('messageProfile').innerHTML = messageMyProfile
}



})();
