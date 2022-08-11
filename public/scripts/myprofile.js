(()=>{
// myprofile modal message
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const messageMyProfile = urlParams.get('messageMyProfile');


if (messageMyProfile != null) {
  document.querySelector('.modal-myprofile').classList.remove('modal-myprofile-hidden');
  document.getElementById('messageProfile').innerHTML = messageMyProfile
}

const deleteProfile = urlParams.get('delete');

// myprofile delete
if (deleteProfile != null) {
  const conf = confirm("Are you sure you want to delete your account?");
  if (conf) {
    fetch("http://localhost:3000/myprofile/deleteConfirmed", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    })
    .then(window.location.replace("http://localhost:3000/login"))
    
  }
}


})();
