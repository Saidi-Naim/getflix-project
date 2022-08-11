(()=>{
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const comment = urlParams.get('comment');
if (comment != null) {
  alert(comment);
}})();
