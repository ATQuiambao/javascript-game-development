// console.log("Hello World!");

// Declaring our variable for our 2d array, score, row and columns
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
// Declaring variable used for touch input
let startX = 0;
let startY = 0;

function setGame(){
	board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){
			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}

	// For Random Tile
    setTwo();
    setTwo();
}


function updateTile(tile, num){

    tile.innerText = ""; 
    
    tile.classList.value = ""; 
   
    tile.classList.add("tile");

    if(num > 0) {

        tile.innerText = num.toString();

        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

window.onload = function() {
	setGame();
}

function filterZero(tiles){
    return tiles.filter(num => num != 0) ;
}


function slide(tiles){
   
    tiles = filterZero(tiles); 

    for(let i = 0; i < tiles.length - 1; i++){
        if(tiles[i] == tiles[i+1]){
            tiles[i] *= 2;    
            tiles[i+1] = 0;
            score += tiles[i];  
        } 
    }

    tiles = filterZero(tiles);

    while(tiles.length < board.length){
        tiles.push(0);
    }

    return tiles;
}

function slideLeft(){

    for(let r = 0; r < rows; r++){
        let row = board[r];

        let originalRow = row.slice();

        row = slide(row);
        board[r] = row; 

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {  
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            
            updateTile(tile, num);
        }
    }
}

function slideRight() {

    for(let r = 0; r < rows; r++){
        let row = board[r];

        // original is for animation
        let originalRow = row.slice();

        row.reverse(); 
        row = slide(row); 
        row.reverse(); 
        board[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {  
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num);
        }
    }
}

function slideUp(){
    for(let c = 0; c < columns; c++) {

        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice();

        col = slide(col);

        for(let r = 0; r < rows; r++){

            board[r][c] = col[r]
            
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Animation - Add sliding effect by animating the movement of the tile
            if (originalCol[r] !== num && num !== 0) {   // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-bottom 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

function slideDown(){
    for(let c = 0; c < columns; c++) {

        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // Animation
        let originalCol = col.slice();

        col.reverse();
        col = slide(col) 
        col.reverse();

        for(let r = 0; r < rows; r++){

            board[r][c] = col[r]
            
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Animation - Add sliding effect by animating the movement of the tile
            if (originalCol[r] !== num && num !== 0) {   // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-top 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

function handleSlide(e) {

    console.log(e.code);

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        
        e.preventDefault(); 
        
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;

    setTimeout(() => {
        if (hasLost()) {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
        }
        else{
            checkWin();
        }
    }, 100);
}

document.addEventListener("keydown", handleSlide);


function hasEmptyTile(){
    
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0){
                return true
            }
        }
    }
    
    return false;
}

function setTwo(){
   
    if(!hasEmptyTile()){
        return;
    }

    
    let found = false;
    
    while(!found){
        
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        
        if(board[r][c] == 0){
            
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            found = true;
        }
    }
}

function checkWin(){

    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){

            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');
                is2048Exist = true;
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true; 
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                
                return false;
            }

            const currentTile = board[r][c];

            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                return false;
            }
        }
    }

    return true;
}

function restartGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    
    score = 0;
    setTwo()

}

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {

    if(!e.target.className.includes("tile")){
        return
    }

    e.preventDefault(); // This line disables scrolling
}, { passive: false }); // Use passive: false to make preventDefault() work

// Listen for the 'touchend' event on the entire document
document.addEventListener('touchend', (e) => {
    
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
        } else {
            slideDown(); // Call a function for sliding down
            setTwo(); // Call a function named "setTwo"
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
});