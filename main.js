// Options
const CLIENT_ID = '1067847636924-r1fj5pii4bm8b9lp0rrjl8f7fm9urmqv.apps.googleusercontent.com';
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('login-page-button');
const signoutButton = document.getElementById('logout-page-button');
const loginStatus = document.getElementById('status-greeting');
const playlistSetup = document.getElementById('playlist-setup');
const statusSetup = document.getElementById('status-setup');



// Load auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Init API client library and set up sign in listeners
function initClient() {
    gapi.client
        .init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        })
        .then(() => {
            // Listen for sign in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // Handle initial sign in state
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
            playlistSetup.onclick = getPlaylist;
        });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        loginStatus.style.display = "block";
        displayStatus();

    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        loginStatus.style.display = "none";
        playlistSetup.style.display = "none"
        statusSetup.style.display = "none"



    }
}

// Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}


function displayStatus() {

    //Fetches your name
    gapi.client.youtube.channels.list({
        "part": "snippet,contentDetails,statistics",
        "mine": true
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            // console.log("Response", response);
            // console.log(response.result.items[0].snippet.title);

            loginStatus.innerHTML = "Hi " + response.result.items[0].snippet.title + "!";

            playlistSetup.style.display = "block"
            statusSetup.style.display = "block"


        },
            function (err) { console.error("Execute error", err); });


}

function getPlaylist() {

    let arr = [];
    let playlistExist = 0;

    let playlistID = "";


    //Returns list of Playlists of users 
    return gapi.client.youtube.playlists.list({
        "part": "snippet,contentDetails",
        "maxResults": 25,
        "mine": true
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            // console.log("Response", response);
            response.result.items.forEach(element => arr.push(element));
            // console.log(arr);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].snippet.title == "YouTube Pal") {
                    playlistExist = 1;
                    playlistID = arr[i].id;
                    console.log(playlistID);
                }
            }
            if (playlistExist != 1) {
                addPlaylist();
                console.log("Adding")
            }
            else {
                console.log("It already exists");
                returnPlaylist();
                playlistSetup.style.display = "none";
                statusSetup.innerHTML = "You already have the YouTube Pals Playlist, let's find you a video to watch!"

            }

        },
            function (err) { console.error("Execute error", err); });
    //List of Playlists returned 




    // Checks if Playlist already exists 

    function addPlaylist() {



        // Inserts Play list 
        gapi.client.youtube.playlists.insert({
            "part": "snippet,status",
            "resource": {
                "snippet": {
                    "title": "YouTube Pal",
                    "description": "This playlist will help with the YouTube Pal app",
                    "tags": [
                        "sample playlist",
                        "API call"
                    ],
                    "defaultLanguage": "en"
                },
                "status": {
                    "privacyStatus": "private"
                }
            }
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
                function (err) { console.error("Execute error", err); });

    }

    // Check done of whether playlist ecists or not 

    // Returns playlist data
    function returnPlaylist() {
        gapi.client.youtube.playlistItems.list({
            "part": "snippet,contentDetails",
            "maxResults": 50,
            "playlistId": playlistID
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
                function (err) { console.error("Execute error", err); });
    }
    // Playlist data returned 

}

