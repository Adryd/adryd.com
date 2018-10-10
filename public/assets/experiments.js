 const times = {
    minute: 1000 * 60,
    hour: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24,
    week: 1000 * 60 * 60 * 24 * 7,
    month: 1000 * 60 * 60 * 24 * 30,
    never: 9999999999999
}
const experiments = {
    socialIcons: {
        probabilities: [60, 20, 20],
        persists: 1,
        expiry: Date.now() + times.week,
        trigger: function(treatment) {
            if (typeof treatment !== Number) {
                treatment = parseInt(treatment)
            }
            let socialLinks = document.getElementById("links")
            if (socialLinks === null) {
                return;
            }
            switch (treatment) {
                case 0:
                    // do nothing
                    break;
                case 1:
                    for (link of links.getElementsByClassName("link_experimental")) {
                        link.classList.add("link_experimental_show")
                    }
                    break;
                case 2:
                    document.getElementById("link_plus").style = "display: inline;"
                    // show colapsed icons
                    break;
            }
        },
        showMore: function() {
            let links = document.getElementById("links")
            let plus = document.getElementById("link_plus")
            let open = 0
            for (cssClass of plus.classList) {
                if (cssClass === "link_plus_show") {
                    open = 1
                }
            }
            if (open == 1) {
                plus.classList.remove("link_plus_show")
                for (link of links.getElementsByClassName("link_experimental")) {
                    link.classList.remove("link_experimental_show")
                }
                
            } else {
                plus.classList.add("link_plus_show")
                for (link of links.getElementsByClassName("link_experimental")) {
                    link.classList.add("link_experimental_show")
                }
            }
            
        }
    },
    alternativeBlurb: {
        probabilities: [80, 15, 4, .75, .25],
        persists: 1,
        expiry: Date.now() + times.week,
        trigger: function (treatment) {
            if (typeof treatment !== Number) {
                treatment = parseInt(treatment)
            }
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                return;
            }
            switch (treatment) {
                case 0:
                    document.getElementById("blurb").innerText = "Software developer, graphic designer, musician and silly popsicle. "
                    break;
                case 1:
                    document.getElementById("blurb").innerText = "Software developer, music producer, graphic designer, and silly popsicle. "
                    break;
                case 2:
                    document.getElementById("blurb").innerText = "Full stack software developer, graphic designer, musician and silly popsicle. "
                    break;
                case 3:
                    document.getElementById("blurb").innerText = "A full stack software developer, musician and graphic designer who likes to make stuff"
                    break;
                case 4:
                    let link = document.createElement("a")
                    link.href = "https://sillyis.adryd.com/"
                    link.innerText = "Don't be silly!!1"

                    document.getElementById("blurb").appendChild(link)
                    break;
            }
        }
    }
}


// check if experiments object exists
if (!localStorage.experiments) {
    localStorage.experiments = JSON.stringify([])
}

let experimentsStore

// parse localstorage json
try {
    experimentsStore = JSON.parse(localStorage.experiments)
} catch (e) {
    experimentsStore = [] // if something goes wrong and the json malforms somehow, reset the variable so experiments can still be run
}

// choose treatment
for (experiment of Object.entries(experiments)) {
    let cancel = 0

    // check if experiment is already stored
    for (storedExperiment of experimentsStore) { 
        if (storedExperiment.name == experiment[0]) {
            cancel = 1
            break;
        }
    }

    if (cancel !== 1) { // don't overwrite existing experiments
        let point = Math.random() * 100
        let position = 0
        for (probabilityIndex in experiment[1].probabilities) {
            position += experiment[1].probabilities[probabilityIndex]
            if (point < position) {

                // probabilityIndex is the chosen treatment
                console.log(`triggering experiment "${experiment[0]}" with treatment "${probabilityIndex}"`)
                experiment[1].trigger(probabilityIndex) // actually trigger the experiment.
                store(experiment, probabilityIndex) // store chosen experiment. will be 
                break;
            }
        }
    }
}

// trigger experiments previously stored
for (storedExperimentIndex in experimentsStore) {
    storedExperiment = experimentsStore[storedExperimentIndex]
    if (storedExperiment.persist === 1 && storedExperiment.expiry > Date.now()) {
        if (experiments[storedExperiment.name]) {
            // trigger allowed experiments
            console.log(`triggering experiment "${storedExperiment.name}" with treatment "${storedExperiment.treatment}"`)
            experiments[storedExperiment.name].trigger(storedExperiment.treatment)
        }
    } else {
        // remove expired and non-persisting experiments
        experimentsStore.splice(storedExperimentIndex, 1)
    }
}

// update experiments storage
localStorage.experiments = JSON.stringify(experimentsStore)

function store(experiment, treatment) {
    experimentsStore.push({
        name: experiment[0],
        treatment: treatment,
        expiry: experiment[1].expiry,
        persist: experiment[1].persists
    })
}

window.experiments = experiments