const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  //Add tests
  suite('GET requests to /api/stock-prices/', function() {

    test('Viewing one stock', function(done) {
      chai.request(server)
      .get("/api/stock-prices")
      .set("content-type", "application/json")
      .query({ stock: "MSFT" })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "MSFT");
        assert.exists(res.body.stockData.price, "MSFT has a price");
        done();
      });
    });

    test('Viewing one stock and liking it', function(done) {
      chai.request(server)
      .get("/api/stock-prices")
      .set("content-type", "application/json")
      .query({ stock: "GOOG", like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.equal(res.body.stockData.likes, 1);
        assert.exists(res.body.stockData.price, "GOOG has a price");
        done();
      });
    });

    test('Viewing the same stock and liking it again', function(done) {
      chai.request(server)
      .get("/api/stock-prices")
      .set("content-type", "application/json")
      .query({ stock: "GOOG", like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.equal(res.body.stockData.likes, 1);
        assert.exists(res.body.stockData.price, "GOOG has a price");
        done();
      });
    });

    test('Viewing two stocks', function(done) {
      chai.request(server)
      .get("/api/stock-prices")
      .set("content-type", "application/json")
      .query({ stock: ["GOOG", "NFLX"] })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "NFLX");
        assert.exists(res.body.stockData[0].price, "GOOG has a price");
        assert.exists(res.body.stockData[1].price, "NFLX has a price");
        done();
      });
    });

    test('Viewing two stocks and liking them', function(done) {
      chai.request(server)
      .get("/api/stock-prices")
      .set("content-type", "application/json")
      .query({ stock: ["GOOG", "NFLX"], like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "NFLX");
        assert.exists(res.body.stockData[0].price, "GOOG has a price");
        assert.exists(res.body.stockData[1].price, "NFLX has a price");
        assert.exists(res.body.stockData[0].rel_likes, "has rel_likes");
        assert.exists(res.body.stockData[1].rel_likes, "has rel_likes");
        done();
      });
    });

  });

});
