$(function () {
    // Create a 28x22 game board (legal playing surface is 26 x 20)
    // Globals
    const ROWS = 22; // 1-20 (+ north & south borders)   
    const COLS = 28; // A-Z (+ west and east borders
    const initPhases = ['IJN Placement',
        'USN Placement'];
    const phases = ['IJN Move',         //[0]
        'USN Move',                     //[1]
        'IJN Ready  ',                  //[2]
        'USN Ready',                    //[3]
        'USN Search',                   //[4]
        'IJN Search',                   //[5]
        'USN Air Plot',                 //[6]
        'IJN Air Plot',                 //[7]
        'Air Combat',                   //[8]
        'Surface Combat',               //[9]
        'Accounting'];                  //[10]


    // [x][0] = Location (CellId)
    // [x][1] = # of ships
    // [x][2] = Arrival turn
    // [x][3] = spotted (boolean)
    // [x][4] = selected (boolean)
    // [x][5] = moved (boolean)

    // IJN Task Forces (4 real 2 dummies)
    var ijnTaskForce = [['', 9, 1, false, false, false],
    ['', 4, 11, false, false, false],
    ['', 8, 24, false, false, false],
    ['', 5, 36, false, false, false],
    ['', 0, 1, false, false, false],
    ['', 0, 1, false, false, false]];

    // USN Task Forces (2 real 4 dummies)
    var usnTaskForce = [['', 8, 1, false, false, false],
    ['', 3, 1, false, false, false],
    ['', 0, 1, false, false, false],
    ['', 0, 1, false, false, false],
    ['', 0, 1, false, false, false],
    ['', 0, 1, false, false, false]];



    // === Ship Database ===
    //var select,                         //[0] - boolean for selected
    //    id,                             //[1] - ship ID
    //    name,                           //[2] - ship name
    //    nation,                         //[3] - ship nation
    //    prefix,                         //[4] - ship prefix
    //    className,                      //[5] - ship class
    //    hull_code,                      //[6] - ship hull code
    //    air_ops,                        //[7] - air ops type
    //    capacity,                       //[8] - air ops capacity
    //    scouts,                         //[9] - number of scouts
    //    fighters,                       //[10] - number of fighters
    //    dive_bombers,                   //[11] - number of dive bombers
    //    torpedo_bombers,                //[12] - number of torpedo bombers
    //    attack,                         //[13] - attack value
    //    gun_range,                      //[14] - gun range
    //    defense,                        //[15] - defense value
    //    anti_air,                       //[16] - anti-air value
    //    damage,                         //[17] - damage value
    //    max_speed,                      //[18] - max speed
    //    speed,                          //[19] - current speed
    //    task_force,                     //[20] - task force number
    //    wiki;                           //[21] - wiki link

    var shipData = [
        [false, 1, 'Enterprise', 'USA', 'USS', 'Yorktown', 'CV', 'Flight_Deck', 80, 5, 25, 25, 25, 2, 4, 2, 4, 0, 7, 0, 16, 'https://en.wikipedia.org/wiki/USS_Enterprise_(CV-6)'],
        [false, 2, 'Hornet', 'USA', 'USS', 'Yorktown', 'CV', 'Flight_Deck', 80, 5, 25, 25, 25, 2, 4, 2, 4, 0, 7, 0, 16, 'https://en.wikipedia.org/wiki/USS_Hornet_(CV-8)'],
        [false, 3, 'Yorktown', 'USA', 'USS', 'Yorktown', 'CV', 'Flight_Deck', 80, 5, 25, 25, 25, 2, 4, 2, 4, 0, 6, 0, 17, 'https://en.wikipedia.org/wiki/USS_Yorktown_(CV-5)'],
        [false, 4, 'Northampton', 'USA', 'USS', 'Northampton', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 8, 0, 16, 'https://en.wikipedia.org/wiki/USS_Northampton_(CA-26)'],
        [false, 5, 'Astoria', 'USA', 'USS', 'Astoria', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 8, 0, 17, 'https://en.wikipedia.org/wiki/USS_Astoria_(CA-34)'],
        [false, 6, 'Minneapolis', 'USA', 'USS', 'Astoria', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 8, 0, 16, 'https://en.wikipedia.org/wiki/USS_Minneapolis_(CA-36)'],
        [false, 7, 'New Orleans', 'USA', 'USS', 'Astoria', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 8, 0, 16, 'https://en.wikipedia.org/wiki/USS_New_Orleans_(CA-32)'],
        [false, 8, 'Vincennes', 'USA', 'USS', 'Astoria', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 8, 0, 16, 'https://en.wikipedia.org/wiki/USS_Vincennes_(CA-44)'],
        [false, 9, 'Pensacola', 'USA', 'USS', 'Pensacola', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 8, 0, 16, 'https://en.wikipedia.org/wiki/USS_Pensacola_(CA-24)'],
        [false, 10, 'Portland', 'USA', 'USS', 'Portland', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 8, 0, 17, 'https://en.wikipedia.org/wiki/USS_Portland_(CA-33)'],
        [false, 11, 'Atlanta', 'USA', 'USS', 'Atlanta', 'CL', 'None', 0, 0, 0, 0, 0, 4, 4, 3, 6, 0, 10, 0, 16, 'https://en.wikipedia.org/wiki/USS_Atlanta_(CL-51)'],
        [false, 12, 'Atago', 'Japan', 'IJN', 'Takao', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Atago'],
        [false, 13, 'Chokai', 'Japan', 'IJN', 'Takao', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Ch%C5%8Dkai'],
        [false, 14, 'Myoko', 'Japan', 'IJN', 'Myoko', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_cruiser_My%C5%8Dk%C5%8D'],
        [false, 15, 'Haguro', 'Japan', 'IJN', 'Myoko', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Haguro'],
        [false, 16, 'Chikuma', 'Japan', 'IJN', 'Tone', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Chikuma_(1938)'],
        [false, 17, 'Kumano', 'Japan', 'IJN', 'Mogami', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 22, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Kumano'],
        [false, 18, 'Mikuma', 'Japan', 'IJN', 'Mogami', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 22, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Mikuma'],
        [false, 19, 'Mogami', 'Japan', 'IJN', 'Mogami', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 22, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Mogami_(1934)'],
        [false, 20, 'Suzuya', 'Japan', 'IJN', 'Mogami', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 22, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Suzuya_(1934)'],
        [false, 21, 'Tone', 'Japan', 'IJN', 'Tone', 'CA', 'Catapult', 2, 2, 0, 0, 0, 6, 6, 4, 4, 0, 7, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Tone_(1937)'],
        [false, 22, 'Nagara', 'Japan', 'IJN', 'Nagara', 'CL', 'None', 0, 0, 0, 0, 0, 4, 4, 3, 4, 0, 10, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Nagara'],
        [false, 23, 'Sendai', 'Japan', 'IJN', 'Sendai', 'CL', 'None', 0, 0, 0, 0, 0, 4, 4, 3, 4, 0, 10, 0, 24, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Sendai'],
        [false, 24, 'Yura', 'Japan', 'IJN', 'Nagara', 'CL', 'None', 0, 0, 0, 0, 0, 4, 4, 3, 4, 0, 10, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_cruiser_Yura'],
        [false, 25, 'Yamato', 'Japan', 'IJN', 'Yamato', 'BB', 'Catapult', 2, 2, 0, 0, 0, 12, 10, 10, 10, 0, 5, 0, 24, 'https://en.wikipedia.org/wiki/Japanese_battleship_Yamato'],
        [false, 26, 'Nagato', 'Japan', 'IJN', 'Nagato', 'BB', 'Catapult', 2, 2, 0, 0, 0, 10, 8, 8, 8, 0, 5, 0, 24, 'https://en.wikipedia.org/wiki/Japanese_battleship_Nagato'],
        [false, 27, 'Mutsu', 'Japan', 'IJN', 'Nagato', 'BB', 'Catapult', 2, 2, 0, 0, 0, 10, 8, 8, 8, 0, 5, 0, 24, 'https://en.wikipedia.org/wiki/Japanese_battleship_Mutsu'],
        [false, 28, 'Haruna', 'Japan', 'IJN', 'Haruna', 'BC', 'Catapult', 2, 2, 0, 0, 0, 8, 8, 6, 6, 0, 6, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_battleship_Haruna'],
        [false, 29, 'Hiei', 'Japan', 'IJN', 'Kongo', 'BC', 'Catapult', 2, 2, 0, 0, 0, 8, 8, 6, 6, 0, 6, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_battleship_Hiei'],
        [false, 30, 'Kirishima', 'Japan', 'IJN', 'Kongo', 'BC', 'Catapult', 2, 2, 0, 0, 0, 8, 8, 6, 6, 0, 6, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_battleship_Kirishima'],
        [false, 31, 'Kongo', 'Japan', 'IJN', 'Kongo', 'BC', 'Catapult', 2, 2, 0, 0, 0, 8, 8, 6, 6, 0, 6, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_battleship_Kong%C5%8D'],
        [false, 32, 'Akagi', 'Japan', 'IJN', 'Akagi', 'CV', 'Flight_Deck', 66, 0, 21, 18, 27, 2, 4, 2, 4, 0, 6, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_aircraft_carrier_Akagi'],
        [false, 33, 'Kaga', 'Japan', 'IJN', 'Kaga', 'CV', 'Flight_Deck', 75, 0, 21, 27, 27, 2, 4, 2, 4, 0, 6, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_aircraft_carrier_Kaga'],
        [false, 34, 'Hiryu', 'Japan', 'IJN', 'Hiryu', 'CV', 'Flight_Deck', 64, 0, 22, 20, 22, 2, 4, 2, 4, 0, 6, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_aircraft_carrier_Hiry%C5%AB'],
        [false, 35, 'Soryu', 'Japan', 'IJN', 'Soryu', 'CV', 'Flight_Deck', 63, 0, 21, 21, 21, 2, 4, 2, 4, 0, 6, 0, 21, 'https://en.wikipedia.org/wiki/Japanese_aircraft_carrier_S%C5%8Dry%C5%AB'],
        [false, 36, 'Zuiho', 'Japan', 'IJN', 'Zuiho', 'CVL', 'Flight_Deck', 30, 0, 10, 10, 10, 1, 4, 1, 2, 0, 5, 0, 23, 'https://en.wikipedia.org/wiki/Japanese_aircraft_carrier_Zuih%C5%8D'],
        [false, 37, 'Hosho', 'Japan', 'IJN', 'Hosho', 'CVL', 'Flight_Deck', 15, 0, 5, 5, 5, 1, 4, 1, 2, 0, 5, 0, 24, 'https://en.wikipedia.org/wiki/Japanese_aircraft_carrier_H%C5%8Dsh%C5%8D']
    ];
    // === Game Board ===

    let gameBoard = $('<table></table>');

    var drawBoard = function () {
        for (let i = 0; i < ROWS; i++) {
            let row = $('<tr></tr>');
            for (let j = 0; j < COLS; j++) {

                // Create a cell with a unique ID
                // The ID is a combination of the column (1st) then row index
                // Example: cellId = A-1, B-2, C-3, etc.

                let char = String.fromCharCode(j + 64);
                let cellId = '';
                cellId = char + '-' + i;
                switch (j) {
                    case 0:
                    case COLS - 1:
                        if ((i == 0) || (i == ROWS - 1)) // Top and bottom row
                            cell = $('<td class="cell" id=' + cellId + '></td>');
                        else
                            cell = $('<td class="cell" id=' + cellId + '>' + i + '</td>');
                        break;
                    default:
                        if ((i == 0) || (i == ROWS - 1)) // Top and bottom row
                            cell = $('<td class="cell" id=' + cellId + '>' + char + '</td>');
                        else
                            cell = $('<td class="cell" id=' + cellId + '></td>');
                        break;
                }

                // Paint cells based on their position
                if ((i == 0) || (j == 0) || (i == ROWS - 1) || (j == COLS - 1)) {
                    cell.addClass('coordCell');
                }
                if ((j == 1) && (i != 0) && (i != ROWS - 1))
                    cell.addClass('ijnCell');
                if (j == (COLS - 2)) {
                    cell.addClass('usnCell');
                } else {
                    cell.addClass('seaCell');
                }

                if ((i == 13) && (j == 22))
                    cell.addClass('midway');

                // Append the cell to the row
                row.append(cell);
            }
            // Append the row to the game board
            gameBoard.append(row);
        }
    }    /// END drawBoard function

    var turn = 0;                           // turn counter
    var pc = 0;                             // phase counter
    var clickedId = '';                     // clicked cell ID
    var selectedId = '';                    // selected cell ID
    var winner = 'Nobody';                  // game winner flag
    var day = 3;                            // game day (start: June 3rd) 
    var selected = false;                   // selected item flag
    var allMoved = false;                   // all units moved flag

    var gridContents = Array.from({ length: COLS - 2 }, () => Array(ROWS - 2).fill(0));
    console.log(gridContents);

    drawBoard();
    $('#gameBoard').append(gameBoard);


    // function for CellId conversion to array indicies
    function colToX(cell) {
        return (cell.substring(0, 1).charCodeAt(0) - 65);
    }
    function rowToY(cell) {
        return +(cell.substring(2, 4)) - 1;
    }
    function xToCol(x) {
        return String.fromCharCode(x + 65);
    }

    // function for hiding TF markers
    function hideTFs(player) {
  
        for (x = 1; x <= 6; x++) {
            let cellId = player + x;
            $(cellId).toggle();
        }
    }
    // function for showing TF markers
    function showTFs(player) {
        for (x = 1; x <= 6; x++) {
            let cellId = player + x;
            $(cellId).toggle();
        }
    }

    // funciton for searching a generic 2d array
    function search2DArray(array, value) {
        let found = null;
        $.each(array, function (colIndex, col) {
            $.each(col, function (rowIndex, rowValue) {
                if (rowValue === value) {
                    found = { col: colIndex, row: rowIndex };
                    console.log("col/row = " + colIndex + ":" + rowIndex);
                    return false; // Break out of the inner loop
                }
            });
            if (found) return false; // Break out of the outer loop
        });
        return found;
    }


    // Anonymous function for clicking on the game board cells
    $('.cell').on('click', function () {

        clickedId = $(event.target).attr('id');

        // if clickedID returns a TF id, search for that id in the Grid and
        // change the return values into the proper cellId
        if (clickedId.charAt(2) == "N") {

            console.log("clickedId GBC = " + clickedId);
            var result = search2DArray(gridContents, clickedId);
            if (result) {
                console.log("Value found at col " + result.col + ", row " + result.row);
            } else {
                console.log("Value not found");
            }
            clickedId = String.fromCharCode(result.col + 65) + "-" + (result.row + 1).toString();
            console.log("clickedId after conversion: " + clickedId);
        }
    });

    // Anonymous function for clicking on the turn/phase button
    $('.button').on('click', function () {
        if (turn == 0) {                            // for the initial TF placement only
            $('#phase').text(initPhases[pc]);
            switch (pc) {
                case 0:
                    $('#button').css("background", "yellow");
                    $('#hints').text("Japanese Player: place your task forces in the ORANGE zone, click PHASE button when done");
                    placeTFs(ijnTaskForce, '.ijnCell');
                    pc++;
                    break;
                case 1:
                    hideTFs("#IJN-TF");
                    $('#button').css("background", "yellow");
                    $('#hints').text("US Player: place your task forces in the BLUE zone");
                    placeTFs(usnTaskForce, '.usnCell');
                    pc++;
                    break;
                case 2:
                    showTFs("#IJN-TF");
                    hideTFs("#USN-TF");
                    pc = 0;
                    turn = 1;
                    break;
            }

            $('#message').text("Turn/Phase: " + turn + "/" + (pc) + " - June " + day + " 05:00 hours");
        }
    });
        // Anonymous function for changing mouse pointer over turn button
        $('.button').hover(
            function () {
                $(this).css('cursor', 'pointer');
            },
            function () {
                $(this).css('cursor', 'default');
            }
        );

        // Functions for handling TF Placement
        // function for waiting for a click event
        function waitForClick(c) {
            return new Promise(resolve => {
                $(c).one('click', resolve);
            });
        }
        // function that waits for a click before continuing - TF Initial Placement
        // the FOR loop passes through each TF array, waiting for a click to place the TF

        async function placeTFs(tfArray, cellClass) {
            let peek = 0;
            for (let i = 0; i < tfArray.length; i++) {
                do {
                    await waitForClick(cellClass);
                    peek = gridContents[colToX(clickedId)][rowToY(clickedId)];
                }
                while (peek != '0')

                if (cellClass === '.ijnCell') {
                    imgName = "IJN-TF" + (i + 1);
                    imgClass = "IJN";
                    console.log("i = " + i);
                    console.log("imgName = " + imgName);
                    console.log("clickedId = " + clickedId);
                    ijnTaskForce[i][0] = clickedId;
                }
                else {
                    imgName = "USN-TF" + (i + 1);
                    imgClass = "USN";
                    console.log("i = " + i);
                    console.log("imgName = " + imgName);
                    console.log("clickedId = " + clickedId);
                    usnTaskForce[i][0] = clickedId;
                }

                gridContents[colToX(clickedId)][rowToY(clickedId)] = imgName;

                var img = $('<img>').attr('src', '../media/' + imgName + ".png").attr('alt', 'Image');
                img.attr('id', imgName);
                img.attr('class', imgClass);
                $('#' + clickedId).append(img);

                // this messed up the "hide" and "show" functions, have no idea why
                // maybe use "if cellClass == c" change display block/none??
                // $('img').css({
                //    'display': 'block',
                //    'margin-left': 'auto',
                //    'margin-right': 'auto'
                // });
            }
            $('#button').css("background", "lightgreen");
        };

        // function for moving a TF
        async function moveTFs(tfArray, cellClass, distance) {
            console.log("made it inside MoveTFs");
            let empty = true;
            await waitForClick(cellClass);
            if (!selected) {
                let cx = colToX(clickedId);
                let cy = rowToY(clickedId);
                let tf = gridContents[cx][cy];
                var tfIndex = tf.substring(6, 7) - 1;   //tfIndex = number of task force-1 (1-6)
                console.log('tfIndex = ' + tfIndex)

                let cellId = tfArray[tfIndex][0];
                let m = distance;
                $('#' + cellId).css('background-color', 'gold');
                console.log('cellId = ' + cellId);
                selected = true;

                //let x = colToX(cellId);
                //let y = rowToY(cellId) + 1;

                for (a = 0; a <= m; a++) {
                    for (b = 0; b <= m; b++) {
                        for (c = -1; c <= 1; c = c + 2) {
                            mx = cx + a * c;
                            my = cy + b * c;

                            if (mx < 1 || my < 0 || mx > COLS - 1 || my > ROWS - 2)
                                continue;

                            if (gridContents[mx][my] == 0) {
                                cellId = xToCol(mx) + '-' + my;
                                console.log("move cellId = " + cellId);
                                $('#' + cellId).css('background-color', 'greenyellow');
                            }
                        }
                    }
                } // end if-NOT-selected block

                if (selected) {
                    console.log("clickedId = " + clickedId);
                    await waitForClick(cellClass);
                    if (document.getElementById(clickedId).style.backgroundColor == greenYellow)
                        alert("We can move here");
                    else
                        alert("We cannot move here");
                }


                // wait for the second click, must be a highlighted cell (highlight empty cells ONLY unless rule below is used)
                // if second click is on original cell (0,0), then cancel the original selection
                // *** advanced rule *** see if the player would like to merge/mix the ships of another TF
                // If selected destination is a gray cell, warn player that they are "scuttling" the entire TF - propmt for yes/no
                // then move TF to second selected cell and set all appropriate booleans
                // check to see if all TFs have moved, if so, set allMoved = true
                // do
                // { }
                // while (allMoved === false);
            }
        }

        //====================== Main Game Loop ==========================================

        if ((turn >= 1) && (winner == 'Nobody')) {
            console.log("made it inside main game loop");
            var hourString = '';
            hour = turn + 4;
            var turnHour = hour % 24;
            if (turnHour < 10)
                hourString = "0" + turnHour + ":00 hours";
            else
                hourString = turnHour + ":00 hours";

            // NOTE: When clicking on a task force, the image id == TF Name == clickedId variable
            // Otherwise, on an open cell the cellId is passed to the clickedId variable

            $('#phase').text(phases[pc]);
            $('#message').text("Turn/Phase: " + turn + "/" + (pc + 1) + " - June " + day + " " + hourString);
            selected = false;
            console.log("pc = " + pc);
            switch (pc) {
                case 0:
                    allMoved = false;
                    $('#button').css("background", "yellow");
                    $('#hints').text("Japanese Player: Move your task forces, click on 'Phase' buton when done.");
                    moveTFs(ijnTaskForce, '.ijnCell', 3);
                    break;
                case 1:
                    allMoved = false;
                    $('#hints').text("US Player: Move your task forces");
                    if (turn == 1) move = 6;
                    else move = 2;
                    moveTFs(usnTaskForce, '.usnCell', move);
                    break;
                case 2:
                    $('#hints').text("Japanese Player: Ready Air Ops");
                    // cycle through each active CV / CVL
                    break;
                case 3:
                    $('#hints').text("US Player: Ready Air Ops");
                    // cycle through each active CV + Midway (if not reduced)
                    break;
                case 4:
                    $('#hints').text("US Player: Plot Searches");
                    // cycle through all available search planes and select destination cells
                    break;
                case 5:
                    $('#hints').text("Japanese Player: Plot Searches");
                    // cycle through all available search planes and select destination cells
                    break;
                case 6:
                    $('#hints').text("USN: Plot Air Strikes");
                    // check to see if any air strikes are ready to launch - cycle through
                    break;
                case 7:
                    $('#hints').text("IJN Plot Air Strikes");
                    // check to see if any air strikes are ready to launch - cycle through
                    break;
                case 8:
                    $('#hints').text("Resolve Air Strikes (USN->IJN)");
                    // determine results if an air strike sucessfully found an enemy target
                    break;
                case 9:
                    $('#hints').text("Resolve Surface Combat");
                    // determine results from surface combat + Midway Shore Bombardment
                    break;
                case 10:
                    $('#hints').text("Accounting Phase");
                    // Bring out your dead!! "Butchers Bill" - show end of turn action results
                    // If one side has no ships left, game over
                    // If IJN has captured Midway, game is over (Japanese victory, obviously)
                    // Calculate + display victory points
                    // If the turn limit has not been reached, keep playing
                    break;
            }
            if (pc < phases.length - 1)
                pc++;
            else {
                pc = 0;
                turn++;
                console.log("Turn: " + turn);
                console.log("Hour: " + turnHour);
                if (turn == 20)
                    day = 4;
                if (turn == 44)
                    day = 5;
                if (turn == 68)
                    day = 6;
            }
        }

        //=== End Main Game Loop ==================================================

    });