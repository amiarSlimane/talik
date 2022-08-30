var expect = require("chai").expect;
var axios = require('axios');


describe("Comments API", function () {

  describe("Get all comments", function () {
    var url = "http://localhost:3080/api/v1/comments?limit=100&page=0";
    it("returns status 200", function () {
      axios.get(url, function (error, response, body) {

        expect(response.statusCode).to.equal(200);
      });
    });
    it("returns an array of comments", function () {
      axios.get(url, function (error, response, body) {
        const jsonBody = JSON.parse(body);
        expect(jsonBody.status).to.equal("success");
      });
    });
  });

  describe("Add one comment", function () {
    var url = "http://localhost:3080/api/v1/comments/1";
    it("returns status 200", function () {
      axios.post(url, {
        "content": "content 3"
      }, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

    it("returns the created comment", async function () {

      const response = await axios.post(url, {
        "content": "content 3"
      });
      
      const data = response.data.data;

      expect(data.post).to.equal("1");
      expect(data.content).to.equal("content 3");
      expect(data.active).to.equal(true);
      
    });

  });


});
