'use strict';
const Stock = require('../models').Stock;
const fetch = require('node-fetch');

  async function createStock(stock,like,ip){

    const newStock = new Stock({
      symbol: stock,
      likes: like ? [ip] : []
    });
    const savedNewStock = await newStock.save();
    return savedNewStock;
  }

  async function findStock(stock){

    const foundStock = await Stock.findOne({symbol: stock});
    return foundStock;
  }

  async function saveStock(stock,like,ip){

    let savedStock = {};
    const foundStock = await findStock(stock);

    if(!foundStock){
      savedStock = await createStock(stock, like, ip);
      return savedStock;
    }
    else{
      if(like && foundStock.likes.indexOf(ip) === -1){
        foundStock.likes.push(ip);
      }
      savedStock = await foundStock.save();
      return savedStock;
    }
  }

  async function getStock(stock){

    const res = await fetch(
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
    );
    const {symbol, latestPrice} = await res.json();
    return {symbol, latestPrice};
  }

module.exports = {
  saveStock: saveStock,
  getStock: getStock,
};