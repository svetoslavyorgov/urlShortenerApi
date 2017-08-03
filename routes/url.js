var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var url = db.collection('url');
var visited = db.collection('visited');
var multer = require('multer')
var async = require('async');
var crypto = require("crypto");
var ObjectId = require('mongojs').ObjectID;

function genUniqueUrl() {
    var urlShorter = crypto.randomBytes(3).toString('hex');
    var res = url.findOne({"urlShorter": urlShorter}, function (err, result) {
        return result;
    });
    if (res) {
        genUniqueUrl();
    }
    else {
        return urlShorter;
    }
}

router.route('/').post(function (req, res) {
    var urlShorter = genUniqueUrl();
    var urlCollection = {
        url: req.body.url,
        urlShorter: urlShorter,
        createdDate: new Date()
    };
    url.save(urlCollection, function (err, result) {
        if (err) return res.send({"status": 101, "message": err});

        if (result) {
            res.send({status: 200, message: 'short url created'});
        }
    });


});

router.route('/addVisit').post(function (req, res) {
    url.findOne({"urlShorter": req.body.shortUrl}, function (err, result) {
        if (err) return res.send({"status": 101, "message": err});

        if (!result) {
            res.send({status: 404, message: 'not fund'});
        }
        else {
            var visitedCollection = {
                urlShorter: result.urlShorter,
                visitedDate: new Date()
            }
            var url = result.url;
            visited.save(visitedCollection, function (err) {
                if (err) return res.send({"status": 101, "message": err});

                res.send({status: 200, message: 'short url created', url: url});

            })
        }
    });
});

router.route('/urls').get(function (req, res) {
    db.collection('url').aggregate([
        { $lookup:
            {
                from: 'visited',
                localField: 'urlShorter',
                foreignField: 'urlShorter',
                as: 'visitedDetails'
            }
        }
    ], function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});
module.exports = router;