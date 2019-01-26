const express = require('express');
const Coin = require('../models/Coin.model');
const CoinRouter = express.Router({caseSensitive: true});


// INDEX PAGE - view list
CoinRouter.route('/').get(function (req, res) {
	Coin.find().sort({price: -1}).exec(function (err, coins){
		if(err){
			console.log(err);
		}
		else {
			res.render('./coins/index', {coins: coins});
		}
	});
});

// ADD ITEM TO DB - FORM view
CoinRouter.route('/create').get(function (req, res) {
	res.render('./coins/create');
});


// ADD ITEM TO DB - data comes
CoinRouter.route('/post').post(function (req, res) {
	const coin = new Coin(req.body);
	console.log('New data comes: ', req.body);
	coin.save()
		.then(coin => {
			res.redirect('/coins');
		})
		.catch(err => {
			res.status(400).send("Error: Can't save to database " + err.message);
		});
});

// EDIT ONE ITEM - WEB FORM
CoinRouter.route('/edit/:id').get(function (req, res) {
	const id = req.params.id;
	Coin.findById(id, function (err, coin){
		res.render('./coins/edit', {coin: coin});
	});
});

// EDIT ONE ITEM - data comes
CoinRouter.route('/update/:id').post(function (req, res) {
	Coin.findById(req.params.id, function(err, coin) {
		if (!coin)
			return next(new Error('Could not load Document'));
		else {
			// do your updates here
			coin.name = req.body.name;
			coin.price = req.body.price;

			coin.save().then(coin => {
				res.redirect('/coins');
			})
				.catch(err => {
					res.status(400).send("unable to update the database");
				});
		}
	});
});

// DELETE DATA
CoinRouter.route('/delete/:id').get(function (req, res) {
	Coin.findByIdAndRemove({_id: req.params.id},
		function(err, coin){
			if(err) res.json(err);
			else res.redirect('/coins');
		});
});
module.exports = CoinRouter;