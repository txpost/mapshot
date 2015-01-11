var async = require('async'),
    tumblr = require('tumblr.js');

// authenticate the Tumblr API
var tumb = tumblr.createClient({
	consumer_key: process.env.TUMB_CONSUMER_KEY,
	consumer_secret: process.env.TUMB_CONSUMER_SECRET,
	token: process.env.TUMB_ACCESS_TOKEN,
	token_secret: process.env.TUMB_ACCESS_TOKEN_SECRET
});

function getRandomNum (min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

getImage = function (cb) {
	var y,
		x,
		zoom,
		uri,
		area,
		botData = {};

	// get 0 or 1
	area = getRandomNum(0,2);

	if (area == 0) {
		// BC-AB
		y = getRandomNum(47, 59);
		x = getRandomNum(-124, -110);
	} else if (area == 1) {
		// trans-canada
		y = getRandomNum(41, 51);
		x = getRandomNum(-124, -70);
	};

	zoom = getRandomNum(12, 18);

	botData.uri = "https://maps.googleapis.com/maps/api/staticmap?center=" + y + "," + x + "&zoom=" + zoom + "&size=600x600&maptype=satellite&key=" + process.env.YT_API_KEY;
	botData.text = "lat " + y + ", long " + x + ", zoom " + zoom;

	cb(null, botData);
}

postImage = function (botData, cb) {
	console.log(botData);
	// post to Tumblr using the photo post type
    tumb.photo("mapshotbot", { caption: botData.text, source: botData.uri }, function (err, res) {
        if (err) {
            console.log("There was a problem posting to Tumblr, ABORT.", err);
        };
    });
}


// run each function in sequence
run = function () {
    async.waterfall([
        getImage,
        postImage
    ],
    function (err, botData) {
        if (err) {
            console.log("There was an error posting to Tumblr: ", err);
        } else {
            console.log("Post successful!");
            console.log("Tweet: ", botData.tweetBlock);
        }
    });
}


// run every hour: 60000 * 60 * 1
setInterval(function () {
    try {
        run();
    }
    catch (e) {
        console.log(e);
    }
}, 60000 * 60);