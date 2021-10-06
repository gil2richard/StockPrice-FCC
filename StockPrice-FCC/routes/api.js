const {saveStock, getStock} = require('../controllers/stock-functions.js');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req,res){

      let { stock,like } = req.query;
      like = (like === 'true');

      if(Array.isArray(stock)){
        
        let stockData = [];
        const { symbol, latestPrice } = await getStock(stock[0]);
        const { symbol: symbol2, latestPrice: latestPrice2 } = await getStock(stock[1]);
        const stockOne = await saveStock(stock[0], like, req.ip);
        const stockTwo = await saveStock(stock[1], like, req.ip);
        
        
        if(!symbol){
          stockData.push({
            rel_likes: stockOne.likes.length - stockTwo.likes.length
          });
        }
        else{
          stockData.push({
            stock: symbol,
            price: latestPrice,
            rel_likes: stockOne.likes.length - stockTwo.likes.length
          });
        }

        if(!symbol2){
          stockData.push({
            rel_likes: stockTwo.likes.length - stockOne.likes.length
          });
        }
        else{
          stockData.push({
            stock: symbol2,
            price: latestPrice,
            rel_likes: stockTwo.likes.length - stockOne.likes.length
          });
        }

        res.json({stockData});
        return;
      }

      const { symbol, latestPrice } = await getStock(stock);

      if (!symbol){
        res.json({ 
          stockData: { likes: like ? 1 : 0 }
        });
        return;
      }

      const oneStock = await saveStock(symbol, like, req.ip);
      res.json({
        stockData: {
          stock: symbol,
          price: latestPrice,
          likes: oneStock.likes.length
        }
      });
    });
};