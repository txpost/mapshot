#mapshot

A simple bot. mapshot uses Google Maps to get a random satellite image and posts it to Tumblr. 

To avoid places on the map where Google has no imagery, mapshot is slowly expanding to areas it can rely on:

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

Some of the results are already interesting and should continue to be as more areas are added.