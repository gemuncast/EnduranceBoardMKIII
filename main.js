const rows = 18;
const columns = 21;
var MoveCount = 0
let tellMove = new SpeechSynthesisUtterance()
var internalTimer
var secondTimer
var sequenceId = []
var sequenceBase = []
let x = Math.floor(Math.random() * columns);
let y = 5;
var dx = 0
var dy = 0


document.getElementById('context').addEventListener('click', function (event) {
    nextMove()
});

function paintHoldRight(hold) {
    document.getElementById(hold).classList.add("rightCircle");
}

function paintHoldLeft(hold) {
    document.getElementById(hold).classList.add("leftCircle");
}

function paintHoldstart(hold) {
    document.getElementById(hold).classList.add("startCircle");
}

function clearHold(hold) {
    document.getElementById(hold).classList.remove("rightCircle");
    document.getElementById(hold).classList.remove("leftCircle");
    document.getElementById(hold).classList.remove("startCircle");
}

function holdID(col, row) {
    return String.fromCharCode((65 + col)) + row
}

function nextMove() {
    // Starting position within the matrix
    paintHoldstart(holdID(x, y))

    //speech
    tellMove.text = holdID(x, y)
    window.speechSynthesis.speak(tellMove)

    //log start hold
    sequenceId.push(holdID(x, y))
    sequenceBase.push([x, y])

    // Define possible movements (up, down, left, right)

    const movementsForRight = [
        [-1, 3],  [0, 3],  [1, 3],  [2, 3],  [3, 3],  
        [-1, 2],  [0, 2],  [1, 2],  [2, 2],  [3, 2],  
        [-1, 1],  [0, 1],  [1, 1],  [2, 1],  [3, 1],  
        [-1, 0],           [1, 0],  [2, 0],  [3, 0],  
        [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1], 
        [-1, -2], [0, -2], [1, -2], [2, -2], [3, -2] 
   ]

   const movementsForLeft = [ 
        [-3, 3],  [-2, 3],  [-1, 3],  [0, 3],  [1, 3],  
        [-3, 2],  [-2, 2],  [-1, 2],  [0, 2],  [1, 2],  
        [-3, 1],  [-2, 1],  [-1, 1],  [0, 1],  [1, 1],  
        [-3, 0],  [-2, 0],  [-1, 0],           [1, 0],  
        [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], 
        [-3, -2], [-2, -2], [-1, -2], [0, -2], [1, -2]
   ]

    // Function to move after a delay
    function moveAfterDelay() {

        //finishthe sequence
        if (MoveCount >= 50) {
            console.log('walk end')
            console.log(sequenceId)
            console.log(sequenceBase)
            return;
        }
        else {
            MoveCount++
        }

        //clean previous holds
        if(MoveCount >= 2){
            clearHold(sequenceId[sequenceId.length-2])}

        //validate that you dont repeat 1 or two previous moves
        do {
            [dx, dy] = (MoveCount%2==0) ? movementsForRight[(Math.floor(Math.random() * movementsForRight.length))] : movementsForLeft[(Math.floor(Math.random() * movementsForLeft.length))];
            x = (x + dx);
            y = (y + dy);
            if (x >= 21) { x = 21 }
            if (x <= 0) { x = 0 }
            if (y >= 18) { y = 18 }
            if (y <= 1) { y = 1 }

        } while (
            (sequenceBase.length >= 2 && x === sequenceBase[sequenceBase.length - 2][0] && y === sequenceBase[sequenceBase.length - 2][1]) 
            //to not match hands
            // ||(sequenceBase.length >= 2 && x === sequenceBase[sequenceBase.length - 1][0] && y === sequenceBase[sequenceBase.length - 1][1])
          );

        //increase move
        if (MoveCount == 0) {
            MoveCount++
        }

        //define left or right hand hold
        (MoveCount%2==0) ? paintHoldRight(holdID(x, y)) : paintHoldLeft(holdID(x, y))
        //log hold
        sequenceId.push(holdID(x, y))
        sequenceBase.push([x, y])   

        //Speech
        tellMove.text = holdID(x, y)
        window.speechSynthesis.speak(tellMove)

        // Recursive call after a delay
        internalTimer = setTimeout(moveAfterDelay, 3000); // 3 seconds delay (3000 milliseconds)
    }

    // Start the movement after the initial delay
    secondTimer = setTimeout(moveAfterDelay, 3000); // Start after 3 seconds

}
