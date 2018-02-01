window.onload = function (){

	var passageTextarea = document.getElementById("passage-text-area");
	var typingTextarea = document.getElementById("user-typing-text-area");
	var testPassage = "This is some test text which you will be using to measure your typing skills. " + 
		"You are required to finish this as quickly as you can whilst minimising mistakes made.";
		testPassage += "You are required to finish this as quickly as you can whilst minimising mistakes made.";
		
	var styledTestPassage = "";
	var typingPassageCharList = [];
	var typingUserCharList = [];
	var letterCounter = 0, totalWordCount = 0, correctWordCount = 0, incorrectWordCount = 0,
		typedIndex = 0;

	const FORWARD = 1;
	const BACKWARD = -1;

	// Create array of character objects from passage
	function createCharacterList() {
		for (var i = 0; i < testPassage.length; i++){
			typingPassageCharList[i] = {char: testPassage[i]};
			// Each letter inside an element for individual styling
			styledTestPassage += "<span id='char-" + i + "'>" + testPassage[i] + "</span>";
		}
	}

	// Event listener for user typing textarea
	typingTextarea.addEventListener('keypress', function (event) {
		checkLetter(event.key);
	});

	// Event listener for backspace when typing
	typingTextarea.addEventListener('keydown', function (event) {
		if (event.which === 8 && typedIndex > 0){
			movePosIndicator(typedIndex, "backward");
			typingPassageCharList[--typedIndex].letterHandle.style.color = "#bfbfbf";
			// typedIndex--;
		}
	});

	// Compare last typed letter with passage at current index
	function checkLetter(typedChar) {
		if (typedChar === typingPassageCharList[typedIndex].char){
			typingPassageCharList[typedIndex].correct = true;
			typingPassageCharList[typedIndex].letterHandle.style.color = "#6cbf84";
			console.log("Correct letter");
			movePosIndicator(typedIndex, "forward");
		} else {
			typingPassageCharList[typedIndex].correct = false;
			console.log("Incorrect letter");
			typingPassageCharList[typedIndex].letterHandle.style.color = "#fc4a1a";
			movePosIndicator(typedIndex, "forward");
		}

		typedIndex++;
	}

	// Move the current position indicator
	function movePosIndicator(currentIndex, direction) {
		if (direction == "forward"){
			typingPassageCharList[currentIndex].letterHandle.style.borderBottom = "none";
			typingPassageCharList[++currentIndex].letterHandle.style.borderBottom = "1px solid white";
		} else if (direction == "backward"){
			typingPassageCharList[currentIndex].letterHandle.style.borderBottom = "none";
			typingPassageCharList[--currentIndex].letterHandle.style.borderBottom = "1px solid white";
		}
	}

	function getLetterElementList() {
		for (var i = 0; i < typingPassageCharList.length; i++){
			var currentElement = document.getElementById("char-" + i);
			typingPassageCharList[i].letterHandle = currentElement;
		}
	}

	createCharacterList();
	passageTextarea.innerHTML = styledTestPassage;
	getLetterElementList();
	// Initialise typing cursor on first character
	typingPassageCharList[typedIndex].letterHandle.style.borderBottom = "1px solid white";
	console.log(typingPassageCharList);
};

