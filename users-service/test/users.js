var expect = require("chai").expect;
var axios = require('axios');


describe("Users API", function () {

 

  // describe("Signup user", function () {
  //   var url = "http://localhost:3080/api/v1/users/signup";
  //   it("returns status 200", function () {
  //     axios.post(url, {
  //       "first_name": "slimane", 
  //       "last_name": "amiar",
  //       "email": "test@talik.io",
  //       "password":  "password",
  //       "passwordConfirm": "password"
  //     }, function (error, response, body) {
  //       expect(response.statusCode).to.equal(200);
  //     });
  //   });

  // });

  // describe("Login user", function () {
  //   var url = "http://localhost:3080/api/v1/users/login";
  //   it("returns status 200", async function () {
  //     const response = await axios.post(url, {
  //       "email": "test@talik.io",
  //       "password":  "password",
  //     }); 
  //     // console.log('body', response.data)  
  //     expect(response.status).to.equal(200);
  //     expect(response.data.token.length>0).to.equal(true);
      
  //   });

  // });




  describe("Get all users", async function () {

   


    var url = "http://localhost:3080/api/v1/users?limit=100&page=0";
    it("returns status 200", async function () {
      var urlLogin = "http://localhost:3080/api/v1/users/login";
      const responseLogin = await axios.post(urlLogin, {
        "email": "slimaneamiar@talik.io",
        "password":  "password",
      }); 
     

      const reqOptions = {
        method:'get',
        url:url,
        headers:{
           Authorization:'Bearer '+responseLogin.data.token
        }
      }
      const response = await axios(reqOptions); 

      expect(response.status).to.equal(200);
      expect(response.data.data.length>0).to.equal(true);

    });

     
  });




});
