/*
 * 设置session方法
 * */
var mongoose = require('mongoose'),
    db = require('../db');
var sessionSchema = new mongoose.Schema({
    sid: String,
    session: mongoose.Schema.Types.Mixed
}),
    SessionModel = db.model('Session', sessionSchema);
var MongooseSession = function () {
    this.__proto__ = (require('express-session').Store).prototype;
    this.mongoose = mongoose;
    this.get = function(sid, callback) {
        var self = this;
        SessionModel.findOne({ sid: sid })
            .exec(function(err, results) {
                console.log(results);
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    if (results) {
                        callback(null, results.session);
                    } else {
                        callback(null);
                    }
                }
            });
    };
    this.set = function(sid, session, callback) {
        var self = this;
        SessionModel.update(
            { sid: sid },
            { sid: sid, session: session },
            { upsert: true },
            function(err) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
    };
    this.destroy = function(sid, callback) {
        var self = this;
        SessionModel.remove({ sid: sid })
            .exec(function(err, results) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
    };
    this.length = function(callback) {
        var self = this;
        SessionModel.find()
            .exec(function(err, results) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null, results.length);
                }
            });
    };
    this.clear = function(callback) {
        var self = this;
        SessionModel.remove()
            .exec(function(err, results) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
    };
};

module.exports = function() {
    return new MongooseSession();
};