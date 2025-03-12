// === CIT 190 Northwestern Michigan College
// === 2025 Spring Semester
// === Michael J. Wildner Sr.
// === Created: January 23 2025
// === Last Modified: March 10 2025
// === Term Project - Wildman's War Room - war_room.js
// === Needed an extra javascript file to handle differences with links between the home page and the others

 document.getElementById("readme").addEventListener("click",function(){              
     window.open("../ReadMe.txt","readme","height=600","width=600","menubar=1","scrollbars=1","status=1","toolbar=1","titlebar=1");
    })
    document.getElementById("home").addEventListener("mouseover",function(){
        document.getElementById("message").innerHTML="<p>Games of World War II: click to select, hover over to see a description of the game.</p>";
    })
    document.getElementById("tank").addEventListener("mouseover",function(){
        document.getElementById("message").innerHTML="<em>Tanks 1943</em> 2-Player Hot Seat game of Tank Combat in World War II.";
    })
    document.getElementById("midway").addEventListener("mouseover",function(){
        document.getElementById("message").innerHTML="<em>Point Luck </em> 2-Player Hotseat game of the Battle of Midway in World War II";
    })    
    document.getElementById("luftwaffe").addEventListener("mouseover",function(){
        document.getElementById("message").innerHTML="<em>Luftwaffe Aces</em> Arcade style single player shooter game of Air Combat in World War II.";
    })
    document.getElementById("readme").addEventListener("mouseover",function(){
        document.getElementById("message").innerHTML="Includes game descriptions, file structure, contact information and copyright information.";
    }) 