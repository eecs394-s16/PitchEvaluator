var FirebaseTokenGenerator = require("firebase-token-generator");
var Firebase = require('firebase')
// var tokenGenerator = new FirebaseTokenGenerator("<04P1zi2B30RzUrIqZTOMbnj65N9753LgBtsI12yk>");
// var token = tokenGenerator.createToken({ uid: "test", name: "Testy"});
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6InRlc3QiLCJuYW1lIjoiVGVzdHkifSwiaWF0IjoxNDY0MTA1ODI5fQ.gZt_WGVxDjlTpMNg_TyiAvbgxUrsoSwIo1vEFBmou8c ";
// console.log(token);
var ref = new Firebase("https://pitchevaluator.firebaseio.com/");
ref.authWithCustomToken(token, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
    process.exit();
  } else {
    console.log("Login Succeeded!", authData);
    process.exit();
  }
});
