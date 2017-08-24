'use strict';
(function () {
    var spotifyID = window.trackID;
    var artwork = window.artworkTE;

    var CLIENT_ID = "42710d8b10584c3ca8b1df0cd5a14a63";
    var CLIENT_SECRET = "27623922ff6f4fc7be2bd6094e52c600";
    var CLIENT_TOKEN = window.btoa(CLIENT_ID + ":" + CLIENT_SECRET);

    var accessTokenCommand = `curl -sb 'POST' -H 'Authorization: Basic ${CLIENT_TOKEN}' -d grant_type=client_credentials https://accounts.spotify.com/api/token`;

    window.originThis.run(accessTokenCommand, (errA, outputA) => {
        var result = $.parseJSON(outputA);
        
        var requestCommand = `curl -s -H "Authorization: Bearer ${result.access_token}" "https://api.spotify.com/v1/tracks/${spotifyID}"`
        window.originThis.run(requestCommand, (errR, outputR) => {
            var json = $.parseJSON(outputR);
            
            var album = json.album;
            var images = album.images;
            var albumArtwork = images[0].url;
            artwork.css('background-image', 'url(' + albumArtwork + ')');
        });
    });
})();
