$(function () {
    // Globals
    // Create a 28x22 game board (legal playing surface is 26 x 20)
    const ROWS = 22; // 1-20 (+ north & south borders)   
    const COLS = 28; // A-Z (+ west and east borders
    const maxTurns = 100;
    const phases = [
        'Phase: IJN Placement',                //[0]
        'Phase: USN Placement',                //[1]
        'Phase: IJN Move',                     //[2]
        'Phase: USN Move',                     //[3]
        'Phase: IJN Ready  ',                  //[4]
        'Phase: USN Ready',                    //[5]
        'Phase: USN Search',                   //[6]
        'Phase: IJN Search',                   //[7]
        'Phase: USN Air Plot',                 //[8]
        'Phase: IJN Air Plot',                 //[9]
        'Phase: Air Combat',                   //[10]
        'Phase: Surface Combat',               //[11]
        'Phase: Accounting'];                  //[12]


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
    // === Drawing the Game Board ===

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

    var turn = 1;                           // turn counter
    var pc = 0;                             // phase counter
    var clickedId = '';                     // clicked cell ID
    var selectedId = '';                    // selected cell ID
    var winner = 'Nobody';                  // game winner flag
    var day = 3;                            // game day (start: June 3rd) 
    var selected = false;                   // selected item flag
    var allMoved = false;                   // all units moved flag
    var origColor = '';

    var gridContents = Array.from({ length: COLS - 2 }, () => Array(ROWS - 2).fill(0));
    console.log(gridContents);

    drawBoard();
    $('#gameBoard').append(gameBoard);

    // each time the button is clicked, advance to the next phase
    // Main game loop?

    $("#button").click(function () {
        switch (pc) {
            case 0:         //IJN Initial Placement
                $('#button').css("background", "yellow");
                $('#button').text(phases[pc]);
                $('#hints').text("Japanese Player: place your task forces in the ORANGE zone, click PHASE button when done");
                placeTFs(ijnTaskForce, '.ijnCell');
                $('#button').css("background", "lightgreen");
                pc++;
                break;
            case 1:         // USN Initial Placement
                hideTFs("#IJN-TF");
                $('#button').css("background", "yellow");
                $('#button').text(phases[pc]);
                $('#hints').text("US Player: place your task forces in the BLUE zone");
                placeTFs(usnTaskForce, '.usnCell');
                $('#button').css("background", "lightgreen");
                pc++;
                break;
            case 2:         // IJN Movement
                hideTFs("#USN-TF");
                showTFs("#IJN-TF");
                allMoved = false;
                $('#button').css("background", "yellow");
                $('#button').text(phases[pc]);
                $('#hints').text("Japanese Player: Move your task forces, click on 'Phase' buton when done.");
                moveTFs(ijnTaskForce, '.cell', 2);
                pc++;
                break;
            case 3:         // USN Movement
                hideTFs("#IJN-TF");
                showTFs("#USN-TF");
                allMoved = false;
                $('#button').css("background", "yellow");
                $('#button').text(phases[pc]);
                $('#hints').text("US Player: Move your task forces, click on 'Phase' buton when done.");
                if (turn == 1) move = 6;
                else move = 2;
                moveTFs(usnTaskForce, '.cell', move);
                pc++;
                break;
            case 4:         // IJN Ready Air Ops
                $('#hints').text("Japanese Player: Ready Air Ops");
                // cycle through each active CV / CVL
                break;
            case 5:         // USN Ready Air Ops
                $('#hints').text("US Player: Ready Air Ops");
                // cycle through each active CV + Midway (if not reduced)
                pc++;
                break;
            case 6:
                $('#hints').text("US Player: Plot Searches");
                // cycle through all available search planes and select destination cells
                pc++;
                break;
            case 7:
                $('#hints').text("Japanese Player: Plot Searches");
                // cycle through all available search planes and select destination cells
                pc++;
                break;
            case 8:
                $('#hints').text("USN: Plot Air Strikes");
                // check to see if any air strikes are ready to launch - cycle through
                pc++;
                break;
            case 9:
                $('#hints').text("IJN Plot Air Strikes");
                // check to see if any air strikes are ready to launch - cycle through
                pc++;
                break;
            case 10:
                $('#hints').text("Resolve Air Strikes (USN->IJN)");
                // determine results if an air strike sucessfully found an enemy target
                pc++;
                break;
            case 11:
                $('#hints').text("Resolve Surface Combat");
                // determine results from surface combat + Midway Shore Bombardment
                pc++;
                break;
            case 12:
                $('#hints').text("Accounting Phase");
                // Bring out your dead!! "Butchers Bill" - show end of turn action results
                // If one side has no ships left, game over
                // If IJN has captured Midway, game is over (Japanese victory, obviously)
                // Calculate + display victory points
                // If the turn limit has not been reached, keep playing
                pc = 2;             // reset to 2 to skip p[hases 0,1 (placement)
                turn++;
                break;
        }
    });

   
    // functions for CellId conversion to array indicies
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

    // function for searching a generic 2d array
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
            clickedId = String.fromCharCode(result.col + 65) + "-" + (result.row + 1).toString();
            console.log("clickedId after conversion: " + clickedId);
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

    // Functiton to wait for a mouse click
    function waitForClick(c) {
        return new Promise(resolve => {
            $(c).one('click', resolve);
        });
    }

    // Function for Task Force Initial Placement
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

        }
        $('#button').css("background", "lightgreen");
    };

    // function for moving a TF
    async function moveTFs(tfArray, cellClass, distance) {
        while (!allMoved) {
            await waitForClick(cellClass);
            if (!selected) {
                let cx = colToX(clickedId);
                let cy = rowToY(clickedId)
                let tf = gridContents[cx][cy];
                var tfIndex = tf.substring(6, 7) - 1;   //tfIndex = number of task force-1 (1-6)         
                let cellId = tfArray[tfIndex][0];
                let m = distance;
                if (cx == 0)
                    origColor = 'coral';
                if (cx == COLS - 2)
                    origColor = 'lightblue';
                $('#' + cellId).css('background-color', 'gold');
                selected = true;
                cy += 1;    // adjustment needed to properly mark legal moves

                // this for loop processes cells to the left of the selected one
                for (a = 0; a <= m; a++) {
                    for (b = 0; b <= a; b++) {
                        mx = (cx - m) + a;
                        myUp = cy - b;
                        myDown = cy + b;

                        if (mx < 1 || mx > COLS - 1 ||
                            myUp < 0 || myDown > (ROWS - 2))
                            continue;

                        if (gridContents[mx][myUp] == 0) {
                            cellId = xToCol(mx) + '-' + my;
                            $('#' + cellId).css('background-color', 'greenyellow');
                        }
                        if (gridContents[mx][myDown] == 0) {
                            cellId = xToCol(mx) + '-' + my;
                            $('#' + cellId).css('background-color', 'greenyellow');
                        }
                    }
                }
                // this for loop processes cells to the right of the selected one

                for (a = (cx + m); a >= cx; a--) {
                    for (b = 0; b <= a; b++) {
                        mx = (cx + m) - a;
                        myUp = cy - b;
                        myDown = cy + b;

                        if (mx < 1 || mx > COLS - 1 ||
                            myUp < 0 || myDown > (ROWS - 2))
                            continue;

                        if (gridContents[mx][myUp] == 0) {
                            cellId = xToCol(mx) + '-' + myUp;
                            $('#' + cellId).css('background-color', 'greenyellow');
                        }
                        if (gridContents[mx][myDown] == 0) {
                            cellId = xToCol(mx) + '-' + myDown;
                            $('#' + cellId).css('background-color', 'greenyellow');
                        }
                    }
                }
            } // end if-NOT-selected block

            if (selected) {
                let moveDone = false;
                do {
                    await waitForClick(cellClass);
                    console.log("clickedId = " + clickedId);
                    if (document.getElementById(clickedId).style.backgroundColor == 'gold') {
                        document.getElementById(clickedId).style.backgroundColor = origColor;
                        alert("Selected TF Canceled");
                        $('.cell').each(function () {
                            if (this.style.backgroundColor == 'greenyellow')
                                this.style.backgroundColor = 'aquamarine';
                            if (this.cellClass == '.ijn')
                                this.style.backgroundColor = 'coral';
                        });
                        moveDone = true;
                    }
                    if (document.getElementById(clickedId).style.backgroundColor == 'greenyellow') {
                        alert("We can move here");
                        // move selected TF to this cell
                        // Mark TF as moved in the TF array
                        moveDone = true;
                    }
                    else
                        alert("We cannot move here");
                }
                while (!moveDone);
                selected = false;
            }
        }
    }

            
            // if second click is on original cell (0,0), then cancel the original selection
            // *** advanced rule *** see if the player would like to merge/mix the ships of another TF
            // If selected destination is a gray cell, warn player that they are "scuttling" the entire TF - propmt for yes/no
            // then move TF to second selected cell and set all appropriate booleans
            // check to see if all TFs have moved, if so, set allMoved = true
            // do
            // { }
            // while (allMoved === false);
});