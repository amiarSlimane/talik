var expect = require("chai").expect;
var axios = require('axios');

var token;
var userId;

describe("Users API", function () {

  describe("Signup user", function () {
    var url = "http://localhost:3080/api/v1/users/signup";
    it("returns status 201", async function () {
      response = await axios.post(url, {
        "first_name": "slimane",
        "last_name": "amiar",
        "email": "test@talik.io",
        "password": "password",
        "passwordConfirm": "password"
      });

      expect(response.status).to.equal(201);
      
    });
  });

  describe("Login user", function () {
    var url = "http://localhost:3080/api/v1/users/login";
    it("returns status 200", async function () {
      const response = await axios.post(url, {
        "email": "test@talik.io",
        "password": "password",
      });

      expect(response.status).to.equal(200);
      expect(response.data.token.length > 0).to.equal(true);


    });

  });




  describe("User Admin api", async function () {

    before((done) => {
      var url = "http://localhost:3080/api/v1/users/login";
       
         axios.post(url, {
          "email": "slimaneamiar@talik.io",
          "password": "password",
        }).then((response)=>{
          token = response.data.token;
          done()
        });
     
    });

    describe("Get all users", async function () {
      var url = "http://localhost:3080/api/v1/users?limit=100&page=0";
      
    it("returns status 200", async function () {

        const reqOptions = {
          method: 'get',
          url: url,
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
        const response = await axios(reqOptions);

        expect(response.status).to.equal(200);
        expect(response.data.data.length > 0).to.equal(true);

      });

    });



    before((done) => {
      var url = "http://localhost:3080/api/v1/users/login";
       
         axios.post(url, {
          "email": "test@talik.io",
          "password": "password",
        }).then((response)=>{
          userId = response.data.data.user._id;
          done()
        });
     
    });


    describe("Get one user", async function () {
      it("returns status 200", async function () {
        var url = `http://localhost:3080/api/v1/users/${userId}`;

        const reqOptions = {
          method: 'get',
          url: url,
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
        const response = await axios(reqOptions);

        expect(response.status).to.equal(200);
        expect(response.data.data._id).to.equal(userId);

      });
    });




    describe("Delete one user", async function () {
      it("returns status 204", async function () {
        var url = `http://localhost:3080/api/v1/users/${userId}`;

        const reqOptions = {
          method: 'delete',
          url: url,
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
        const response = await axios(reqOptions);

        expect(response.status).to.equal(204);

      });
    });


  });


});





