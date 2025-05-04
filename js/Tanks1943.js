// Inserting the Images
// Process each box according to the contents by changing the innerHTML
function insertImage() {

    document.querySelectorAll('.box').forEach(image => {
                image.innerHTML = `${image.innerText} <img class='allimg' src="../media/${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
    })
}

//Color the background sides of the board (green=US, gray=German)
function coloring() {
    const grid = document.querySelectorAll('.box')

    grid.forEach(square => {

        getId = square.id
        row = (getId.substring(0, 1)).charCodeAt(0) - 64
        column = Number(getId.substring(1, 3))
        coord = (row * 100) + column

        // Set left half of board to US Color
        if (column <= 5) {
            square.style.backgroundColor = oliveDrab   // olivedrab #6B8E23 50% opacity
        
        }
        // Set right half of board to German Color
        if (column > 5) {
            square.style.backgroundColor = darkGray // darkgray #A9A9A9 50% opacity
        }
    })
}


// Function Definition Section

// Simulated combat - remove when the real thing works
function combatSim() {
    do {
        roll = dieRoll(2)
        if (roll == 1) {
            numShermans -= 1
            alert("US Player Loses a Sherman")
        }
        else {
            numPanzers -= 1
            alert("German Player Loses a Panzer")
        }

        if (numShermans == 0) {
            winner = 'German'
            alert("German Player Wins")
        }
        else if (numPanzers == 0) {
            winner = 'US'
            alert("US Player Wins")
        }
    }
    while (winner == 'Nobody');
}
// Get a random integer between min and max (inclusive)
function getRndInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Simulate a die roll of one 'sides' sided die
function dieRoll(sides)
{
    return getRndInteger(1, sides)
}
// ================== Main Game Loop Begins Here ======================= 

// Globals
var numShermans = 6
var numPanzers = 6
var numATs = 5
var num88s = 5
var maxShots_US = 6
var maxShots_German = 6
var specialShots_US = 5
var specialShots_German = 5
var maxMove_US = 3
var maxMove_German = 3
var moveRemaining = 0
var winner = 'Nobody'
var turn = 0
var pc = 0      // phase counter, index for phases[]
var row = 0
var column = 0
var coord = 0
var originalId = '' 

// color related constants
const gold = "rgb(255,215,0)"
const greenYellow = "rgb(173,255,47)"
const oliveDrab = 'rgb(107,142,35)'
const darkGray = 'rgb(169,169,169)'

// constants for arrays of phase names
// initPhases only used in the beginning (Turn = 0)
// phases used throught the normal game loop

const initPhases = ['US Relocation',    
    'German Relocation']
const phases = ['US Move',          //[0]
    'German Move',                  //[1]
    'US Resolve Fire',              //[2] - skip 1st turn
    'German Resolve Fire',          //[3] - skip 1st turn
    'Tank Combat',                  //[4] - skip 1st turn
    'Plot German Fire',             //[5]
    'Plot US Fire',                 //[6]
    'End Turn']                     //[7]

var skipPhase = false
var selected = false

// Booleans for Installations (true = active)
var US_HQ = true
var German_HQ = true
var US_Ammo = true
var German_Ammo = true
var US_Fuel = true
var German_Fuel = true

var listenerClicks = 0
insertImage()
coloring()

// set up the event listeners for the game board
document.querySelectorAll('.box').forEach(square =>
{
    square.addEventListener('click', function ()
    {
        getId = square.id
        row = (getId.substring(0, 1)).charCodeAt(0) - 64
        column = Number(getId.substring(1, 3))
        coord = (row * 100) + column

        // here we specify different actions depending on 1) current turn & phase
        // and 2) what object (if any) occupies the square

        contents = document.getElementById(getId).innerText

        // RELOCATON (0/1): Sherman is selected
        if ((turn == 0) && (pc == 1) && (contents == 'Sherman')) {
            if (!selected) {
                square.style.backgroundColor = gold
                for (let y = 0; y <= 9; y++) {
                    idTag = String.fromCharCode(65 + y) + '01'

                    if (document.getElementById(idTag).innerText == '') {
                        document.getElementById(idTag).style.backgroundColor = greenYellow
                    }
                }
                selected = true
                originalId = getId
            }
            else               
            {
                square.style.backgroundColor = oliveDrab
                for (let y = 0; y <= 9; y++) {
                    idTag = String.fromCharCode(65 + y) + '01'

                    if (document.getElementById(idTag).innerText == '') {
                        document.getElementById(idTag).style.backgroundColor = oliveDrab
                    }
                }
                selected = false
             }         
        }

        //RELOCATION(0/1): Move the Sherman to selected square, reset colors
        if ((turn == 0) && (pc == 1) && (contents == '') && (column == 1) && selected)
        {
            document.getElementById(getId).innerText = 'Sherman'
            document.getElementById(originalId).innerText = ''
            insertImage()
            square.style.backgroundColor = oliveDrab
            for (let y = 0; y <= 9; y++) {
                idTag = String.fromCharCode(65 + y) + '01'
                if (document.getElementById(idTag).innerText == '')
                    document.getElementById(idTag).style.backgroundColor = oliveDrab
            }
            selected = false
        }

        // RELOCATION (0/1) US HQ Selected
        // RELOCATION (0/1) US Ammo Selected
        // RELOCATION (0/1) US Fuel Selected
        // RELOCATION (0/1) US AT Selected

        // RELOCATION (0/2) Panzer IV Selected
        if ((turn == 0) && (pc == 2) && (contents == 'PanzerIV')) {
            if (!selected) {
                square.style.backgroundColor = gold
                for (let y = 0; y <= 9; y++) {
                    idTag = String.fromCharCode(65 + y) + '10'

                    if (document.getElementById(idTag).innerText == '') {
                        document.getElementById(idTag).style.backgroundColor = greenYellow
                    }
                }
                selected = true
                originalId = getId
            }
            else {
                square.style.backgroundColor = darkGray
                for (let y = 0; y <= 9; y++) {
                    idTag = String.fromCharCode(65 + y) + '10'

                    if (document.getElementById(idTag).innerText == '') {
                        document.getElementById(idTag).style.backgroundColor = darkGray
                    }
                }
                selected = false
            }
        }
      
        // RELOCATON (0/2): Move the PanzerIV to selected square, reset colors
        if ((turn == 0) && (pc == 2) && (contents == '') && (column == 10) && selected) {
            document.getElementById(getId).innerText = 'PanzerIV'
            document.getElementById(originalId).innerText = ''
            insertImage()
            square.style.backgroundColor = darkGray
            for (let y = 0; y <= 9; y++) {
                idTag = String.fromCharCode(65 + y) + '10'

                if (document.getElementById(idTag).innerText == '') {
                    document.getElementById(idTag).style.backgroundColor = darkGray
                }
            }
            selected = false
        }
    })
})

// Event listener for the button
document.querySelector('.button').addEventListener('click', function ()
{
    if (turn == 0) {
        document.getElementById("phase").innerText = initPhases[pc]
        document.getElementById("message").innerText = "Turn/Phase: " + turn + "/" + (pc + 1) 
        if (pc < initPhases.length)
            pc++
        else {
            pc = 0
            turn++
        }
    }
    // Main Game Loop - skip phases 2-6 1st turn ONLY

    if (turn == 1) {
        if ((pc < 2) || (pc > 4)) {
            document.getElementById("phase").innerText = phases[pc]
            document.getElementById("message").innerText = "Turn/Phase: " + turn + "/" + (pc + 1)
        }

        if (pc == 1)
            pc = 6
        if (pc < phases.length)
            pc++
        else {
            pc = 0
            turn++
        }
    }

    if (turn > 1) {
        document.getElementById("phase").innerText = phases[pc]
        document.getElementById("message").innerText = "Turn/Phase: " + turn + "/" + (pc + 1)
        if (pc < phases.length - 1)
            pc++
        else {
            pc = 0
            turn++
        }
    }
})