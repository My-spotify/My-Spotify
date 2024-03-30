
async function getsongs(folder) {


    let a = await fetch(`songs/${folder}`)


    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response;
    songs = []
    let as = div.getElementsByTagName("a")
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)

        }
    }


    // songlist  ul started

    let songlistul = document.querySelector(".songlist ul")
    let count = 0;
    songs.forEach(song => {
        song = urltosongname(song)
        // console.log(song);
        



        // just adding to dict 
        let songname = song.replaceAll(" ", "")

        song_url_dict[songname] = songs[count]

        songlistul.insertAdjacentHTML('beforeend', ` <li>
    <div class="songimg flex"><img class="invert" src="assets/music.png" alt="">
        <div class="t"> ${song} <p>artist names</p>
        </div>
    </div>


    <img class="invert playimg" src="assets/songplay.png" alt="songplay">
</li>  `)
        count++;


    });





    // ! adding eventlistener to all song





    let lis = document.querySelectorAll(".songlist ul li")

    lis.forEach(li => {

        let sname = li.querySelector(".t").innerHTML.split('<p>')[0]

        let songname = sname.replaceAll(" ", "")
        li.addEventListener('click', () => {
            document.querySelector(".songinfo").innerHTML = sname;

            playsong(song_url_dict[songname]);
        })
    }
    )




    


    return songs;

}




// main
let currentsong = new Audio();

let song_url_dict = {};



function playsong(url, pause = false) {

    currentsong.src = url
    if (!pause) {
        currentsong.play();
        play.src = "assets/pause.png"
    }





}







function urltosongname(song) {

    let songl41 = song.split("songs/")
    
    song = songl41[1]
    
    song = song.replaceAll("%20", " ")
    let songl = song.split("Full Video")
    song = songl[0]
    let songl2 = song.split("Video")
    song = songl2[0]
    let songl3 = song.split("Lyrical")
    song = songl3[0]
    let songl4 = song.split("/")
    song = songl4[1]
    song = song.replaceAll(".mp3", " ")
    return song;

}



// display albums
// func needed


async function displayalbum(){


    let a = await fetch(`songs/`)


    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response;
    
    let alla=div.getElementsByTagName('a')

    let array=Array.from(alla)
    for (let index = 0; index < array.length; index++) {

        const a = array[index];
        
        if (a.href.includes("/songs") && !a.href.includes(".htaccess")) {
            
            let folder=a.href.split('/')[4];
            
            
            // getting meta data of the folder
            
            let b = await fetch(`songs/${folder}/info.json`)
            let response2 = await b.json();
            
            document.querySelector(".cardcontainer").insertAdjacentHTML('beforeend', `


            <div class="card" data-folder="${folder}">

            <img src="songs/${folder}/cover.png" alt="${folder}">
            <button class="playbtn flex align-centre justify-centre"> <img src="assets/play.png"
                    alt="play_button"> </button>
            <h1>${response2.title}</h1>
            <p>${response2.description}</p>

            </div>
            
            
            
            `)






            
        }


    }
    // handling cards
    document.querySelectorAll(".card").forEach(e => (
        e.addEventListener('click', async () => {

            let songlistul = document.querySelector(".songlist ul")
            songlistul.innerHTML = "";
            let folder_name = e.dataset.folder
            songs = await getsongs(folder_name)

        })


    )
    )

    


}
displayalbum()



















async function main() {
    let songs = await getsongs('liked')



    play.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "assets/pause.png"
        }
        else {
            currentsong.pause()
            play.src = "assets/play.png"
        }

    })
    


    //! playing one song by default

    let a = 0;
    if (a == 0) {
        playsong(songs[0], pause = true)
        let song = songs[0]
        song = urltosongname(song)

        document.querySelector(".songinfo").innerHTML = song;



        currentsong.src = songs[0];
        ctime = convertSecondsToMinutesAndSeconds(currentsong.currentTime)
        document.querySelector(".songtime1").innerHTML = `dsfd`;
        currentsong.addEventListener('loadedmetadata', () => {
            // Update the UI elements with the duration once it's available
            duration = convertSecondsToMinutesAndSeconds(currentsong.duration);
            document.querySelector(".songtime2").innerHTML = `${duration}`;
        });

        a = 1
    }













   














    function convertSecondsToMinutesAndSeconds(seconds) {
        // Ensure the input is treated as a number and rounded down to the nearest whole number
        const totalSeconds = Math.floor(Number(seconds));
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Ensure currentTime is set to 0

    currentsong.addEventListener('timeupdate', () => {
        duration = convertSecondsToMinutesAndSeconds(currentsong.duration)
        ctime = convertSecondsToMinutesAndSeconds(currentsong.currentTime)
        document.querySelector(".songtime1").innerHTML = `${ctime}`;
        document.querySelector(".songtime2").innerHTML = `${duration}`;
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`
        document.querySelector(".filler").style.width = `${((currentsong.currentTime / currentsong.duration) * 100)}%`

    })
    // event for seek bar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        document.querySelector(".filler").style.width = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";


        currentsong.currentTime = currentsong.duration * ((e.offsetX / e.target.getBoundingClientRect().width))

    })



    // handling volume

    document.querySelector(".vol input").addEventListener("change", (e) => {
        currentsong.volume = e.target.value;

    })



    



}

main()



// ! main ended











// ! functions for html
let a = 0
function openleft() {
    if (a == 0) {
        document.querySelector(".left").style.left = "0%";
        document.querySelector(".crosstoclose").style.display = "flex";
        a = 1;
        document.querySelector(".spotify-playlist").addEventListener('click', () => {
            document.querySelector(".left").style.left = "-100%";
            document.querySelector(".crosstoclose").style.display = "none";

            a = 0;
        })
        document.querySelector(".crosstoclose").addEventListener('click', () => {
            document.querySelector(".left").style.left = "-100%";
            document.querySelector(".crosstoclose").style.display = "none";

            a = 0;
        })
    }

    else {
        document.querySelector(".left").style.left = "-100%";
        a = 0;
    }

}





//needed for next 
function getValueFromIndex(obj, index) {
    // Get keys of the object
    var keys = Object.keys(obj);

    // Check if index is valid
    if (index < 0 || index >= keys.length) {
        return undefined; // Index out of bounds
    }

    // Get the key at the specified index
    var key = keys[index];

    // Return the value associated with the key
    return obj[key];
}

function getObjectLength(obj) {
    let length = 0;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            length++;
        }
    }
    return length;
}
// play next song


function next() {
    console.log(currentsong.src);
    let song_num = 0;
    let song;
    let length = getObjectLength(song_url_dict)
    console.log(length);

    for (let i = 0; i < length; i++) {

        console.log(getValueFromIndex(song_url_dict, i));

        if (currentsong.src == getValueFromIndex(song_url_dict, i)) {
            break
        }
        song_num++;
    }
    if (song_num == length - 1) {

        playsong(getValueFromIndex(song_url_dict, 0))
        song = getValueFromIndex(song_url_dict, 0)

    }
    else {
        playsong(getValueFromIndex(song_url_dict, song_num + 1))
        song = getValueFromIndex(song_url_dict, song_num + 1)

    }

    song = urltosongname(song)

    document.querySelector(".songinfo").innerHTML = song;




}
function previous() {
    console.log(currentsong.src);
    let song_num = 0;
    let song;
    let length = getObjectLength(song_url_dict)
    console.log(length);

    for (let i = 0; i < length; i++) {

        console.log(getValueFromIndex(song_url_dict, i));

        if (currentsong.src == getValueFromIndex(song_url_dict, i)) {
            break
        }
        song_num++;
    }
    if (song_num == 0) {

        // playsong(getValueFromIndex(song_url_dict, length-1))
        // song = getValueFromIndex(song_url_dict,length-1)

    }
    else {
        playsong(getValueFromIndex(song_url_dict, song_num - 1))
        song = getValueFromIndex(song_url_dict, song_num - 1)

    }

    song = urltosongname(song)

    document.querySelector(".songinfo").innerHTML = song;




}
function sameprevious() {
    console.log(currentsong.src);
    let song_num = 0;
    let song;
    let length = getObjectLength(song_url_dict)
    console.log(length);

    for (let i = 0; i < length; i++) {

        console.log(getValueFromIndex(song_url_dict, i));

        if (currentsong.src == getValueFromIndex(song_url_dict, i)) {
            break
        }
        song_num++;
    }
    if (song_num == 0) {

        // playsong(getValueFromIndex(song_url_dict, length-1))
        // song = getValueFromIndex(song_url_dict,length-1)

    }
    else {
        playsong(getValueFromIndex(song_url_dict, song_num))
        song = getValueFromIndex(song_url_dict, song_num)

    }

    song = urltosongname(song)

    document.querySelector(".songinfo").innerHTML = song;




}


mutec=0;
function mute_unmute(){
    image=document.querySelector(".vol img")
    if(mutec==0){
        image.src="assets/mute.png"
        mutec=1;
        currentsong.volume = 0;

    }
    else{
        e=document.querySelector(".vol input")
        currentsong.volume = e.value;
        image.src="assets/volume.png"
        mutec=0;

    }

}






