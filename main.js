// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyD5WSbAG6Ln_kc6DPshCTWR9mTdKt_79IQ",
  authDomain: "live-chat-49a2b.firebaseapp.com",
  databaseURL: "https://live-chat-49a2b.firebaseio.com",
  projectId: "live-chat-49a2b",
  storageBucket: "live-chat-49a2b.appspot.com",
  messagingSenderId: "631457358116",
  appId: "1:631457358116:web:9a8e399035a8595c90d3b1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let signUpUser = document.querySelector('.newUser')
let signUpPass = document.querySelector('.newPass')
let button = document.querySelector('.login-btn')
let user = '';
let password = "";
setInterval(() => {
  document.querySelector(".message-body").style.height =
    window.innerHeight - 110 + "px";
}, 100);
var me = "";

function addUser() {
  firebase
    .database()
    .ref("users")
    .push({
      user: signUpUser.value,
      pass: signUpPass.value
    }).then(s => {
      if(signUpUser.value !=='' || signUpPass.value !==''){
      chat()
      }
    })
  return user = signUpUser.value, password = signUpPass.value
}

function chat() {
  signUpPass.value = ""
  signUpUser.value = ""
  document.querySelector('.login-btn'). style.display='none'

  console.log(user, password)
  document.querySelector('.msg-section').style.display= 'block'
  document
    .querySelector(".message-input")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        firebase
          .database()
          .ref("Beasty/Texts")
          .push({
            user: user,
            msg: document
              .querySelector(".message-input")
              .value.trim()
              .replace(/</g, "&lt;"),
          });
        document.querySelector(".message-input").value = "";
      }
    });
  var id = "";
  firebase
    .database()
    .ref("Beasty/Texts")
    .on("child_added", (s) => {
      document.querySelector(".loader").style.opacity = "0";
      if (s.val().user === user && password) {
        if (id !== user &&
          password)

          document.querySelector(".message-body").innerHTML +=
          '<div class="my-name">You</div><div class="message-holder"><div class="my-text" onclick="deleteMsg(\'' +
          s.key +
          "')\" id=" +
          s.key +
          " >" +
          s.val().msg +
          "</div></div>";
        else
          document.querySelector(".message-body").innerHTML +=
          '<div class="message-holder"><div class="my-text" onclick="deleteMsg(\'' +
          s.key +
          "')\" id=" +
          s.key +
          ">" +
          s.val().msg +
          "</div></div>";
      } else {
        if (id !== user && password)
          document.querySelector(".message-body").innerHTML +=
          '<div class="their-name">' +
          s.val().user +
          '</div><div class="message-holder"><div class="their-text" id=' +
          s.key +
          ">" +
          s.val().msg +
          "</div></div>";
        else
          document.querySelector(".message-body").innerHTML +=
          '<div class="message-holder"><div class="their-text" id=' +
          s.key +
          ">" +
          s.val().msg +
          "</div></div>";
      }
      document.querySelector(".message-body").scrollBy(0, 1000);
      id = s.val().user;
      firebase
        .database()
        .ref("Beasty/Texts/" + s.key)
        .on("child_changed", (a) => {
          document.querySelector("#" + s.key).innerHTML =
            "<i>Message Erased</i>";
        });
    })
  console.log(id)
}
function deleteMsg(key) {
  console.log(key);
  swal({
    title: "Are you sure?",
    text: "You cannot recover your text once deleted!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((e) => {
    console.log(e);
    if (e)
      firebase
      .database()
      .ref("Beasty/Texts/" + key)
      .set({ user: user, msg: "<i>Message Erased</i>" });
  });
}