let gram = document.getElementById("gram")
let renewgram = document.getElementById("renewgram")
let kwg = document.getElementById("kwg")
let green = document.getElementById("green")
let host = window.location.hostname
let got = false

chrome.runtime.sendMessage({
    message: "send_stats",
    url:host
});

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse) {
        // console.log(request)
        if(!got){
            got = true
            gram.innerHTML = req["co2_grid_grams"]
            renewgram.innerHTML = req["co2_renewable_grams"]
            kwg.innerHTML = req["energy_kwg"]
            green.innerHTML = ''
            if(req["category"]=="green"){
                green.style.backgroundColor = 'green'
            }
            else if(req["category"]=="semi-green"){
                green.style.backgroundColor = 'yellow'
            }
            else if(req["category"]=="non-green"){
                green.style.backgroundColor = 'red'
            }
            else{
                green.style.backgroundColor = 'black'
            }
        }
});