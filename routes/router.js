const express = require('express');
const Coin = require('../models/Coin.model');
const CoinRouter = express.Router({caseSensitive: true});


// INDEX PAGE - view list
CoinRouter.route('/').get(function (req, res) {
	Coin.find().sort({ name: -1, price: 1}).exec(function (err, coins){
		if(err){
			console.log(err);
		}
		else {
			res.render('./coins/index', {coins: coins, data: 'My data'});
		}
	});
});

// CREATE NEW ITEM TO DB - FORM view
CoinRouter.route('/create').get(function (req, res) {
	res.render('./coins/create');
});


// ADD ITEM TO DB - data comes
CoinRouter.route('/post').post(function (req, res) {
	const coin = new Coin(req.body);
	console.log('New data comes: ', req.body);
	coin.save()
		.then( (coin) => {
			console.log('RESULT: ', coin);
			res.redirect('/coins');
		})
		.catch(err => {
			res.status(400).send("Error: Can't save to database " + err.message);
		});
});

// EDIT ONE ITEM - WEB FORM
// CoinRouter.route('/edit/:id/open/:age').get(function (req, res) {
CoinRouter.route('/edit/:id').get(function (req, res) {
	const id = req.params.id;
	// const { id, age } = req.params;
	Coin.findById(id, function (err, coin){
		if (err) {
			console.log('no such id' + id);
			res.render('./coins/no_such_id', { id: id });
		} else {
			res.render('./coins/edit', { coin: coin });
		}
	});
});

// SAVE EDITed ITEM - data comes
CoinRouter.route('/update/:id').post(function (req, res, nex) {
	Coin.findById(req.params.id, function(err, coin) {
		if (!coin)
			console.log('no such id' + id);
			// return next(new Error('Could not load Document'));
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
