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

function newImage () {
	var y,
		x,
		zoom;

	y = getRandomNum(47, 59);
	x = getRandomNum(-124, -110);
	zoom = getRandomNum(12, 18);

	document.getElementById('mapshot').src = "https://maps.googleapis.com/maps/api/staticmap?center=" + y + "," + x + "&zoom=" + zoom + "&size=600x600&maptype=satellite";
	document.getElementById('lat').textContent = "lat: " + y;
	document.getElementById('long').textContent = "long: " + x;
	document.getElementById('zoom').textContent = "zoom: " + zoom;
}

// sorry, we have no imagery here: https://maps.googleapis.com/maps/api/staticmap?center=46,-140&zoom=12&size=600x600&maptype=satellite

// getMaxZoomAtLatLng(latlng:GLatLng, callback:Function, opt_targetZoom:number)

// google.maps.MaxZoomResult

getImage = function (cb) {
	var y,
		x,
		zoom,
		uri,
		botData = {};

	y = getRandomNum(47, 59); // top of BC to Seattle
	x = getRandomNum(-124, -110); // Victoria, BC to AB-SK border
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