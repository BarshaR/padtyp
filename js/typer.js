/* global window document Clock */
window.onload = () => {
    const passageTextarea = document.getElementById('passage-text-area');
    const typingTextarea = document.getElementById('user-typing-text-area');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const passageSelect = document.getElementById('test-passage-select');
    const timeSelect = document.getElementById('time-select-title');
    const testPassage = 'This is some test text which you will need to try and type as quickly as you can. The words perminute count is running so you will need to try and type this passage in under one minute or you will not be doing very well. Thanks';
    const typingPassageCharList = [];
    const FORWARD = 1;
    const BACKWARD = -1;
    let styledTestPassage = '';
    let typedIndex = 0;
    let finishedPassage = false;
    let startedTest = false;
    let finishedTest = false;
    let grossWordsPerMin = 0;
    let netWordsPerMin = 0;
    let wpmDisplay = document.getElementById('wpm-display');

    // Create array of character objects from passage
    function createCharacterList() {
        for (let i = 0; i < testPassage.length; i += 1) {
            typingPassageCharList[i] = { char: testPassage[i] };
            // Each letter inside an element for individual styling
            styledTestPassage += '<span id="char-' + i + '">' + testPassage[i] + '</span>';
        }
    }

    // Finalise test results
    // Accept timeout to ensure event completion
    function testComplete(timeout) {
        console.log('test complete');
        finishedPassage = true;
        typingTextarea.style.color = '#868686';
        if (timeout) {
            setTimeout(() => {
                typingTextarea.disabled = true;
            }, timeout);
        } else {
            typingTextarea.disabled = true;
        }
    }

    // Calculate words per minute
    function wpmCalc(secondsPassed) {
        const totalTypedChars = typedIndex + 1;
        wpmDisplay.innerHTML = Math.round((totalTypedChars / 5) / (secondsPassed / 60));
    }

    // Return the accuracy percentage
    const accuracyCalc = (numErrors, numTyped) => (numErrors / numTyped) * 100;

    function checkPassageEnd(index) {
        if (typingPassageCharList.length === index + 1) {
            // Complete the passage with a timeout of 1 second
            testComplete(1000);
            return true;
        }
        return false;
    }

    // Move the current position indicator
    function movePosIndicator(currentIndex, direction) {
        let index = currentIndex;

        if (direction === FORWARD) {
            typingPassageCharList[index].letterHandle.style.borderBottom = 'none';
            index += 1;
            typingPassageCharList[index].letterHandle.style.borderBottom = '1px solid white';
        } else if (direction === BACKWARD) {
            typingPassageCharList[index].letterHandle.style.borderBottom = 'none';
            index -= 1;
            typingPassageCharList[index].letterHandle.style.borderBottom = '1px solid white';
        }
        return true;
    }

    // Compare last typed letter with passage at current index
    function checkLetter(typedChar) {
        if (typedChar === typingPassageCharList[typedIndex].char) {
            typingPassageCharList[typedIndex].correct = true;
            typingPassageCharList[typedIndex].letterHandle.style.color = '#6cbf84';
        } else {
            typingPassageCharList[typedIndex].correct = false;
            typingPassageCharList[typedIndex].letterHandle.style.color = '#fc4a1a';
        }
        // Check if the typing passage is complete
        if (checkPassageEnd(typedIndex)) {
            return false;
        }
        movePosIndicator(typedIndex, FORWARD);
        typedIndex += 1;
        return true;
    }

    function getLetterElementList() {
        for (let i = 0; i < typingPassageCharList.length; i += 1) {
            const currentElement = document.getElementById('char-' + i);
            typingPassageCharList[i].letterHandle = currentElement;
        }
    }

    function startTest() {
        // Create a new clock, providing the number of seconds
        // and handles to the seconds and minutes html elements
        const clock = new Clock(60, minutesDisplay, secondsDisplay);
        // Begin the timer, providing a callback for completion
        clock.startTimer(testComplete, wpmCalc);
    }


    // Event listener for user typing textarea
    typingTextarea.addEventListener('keypress', (event) => {
        if (!startedTest) {
            startedTest = true;
            startTest();
        }
        checkLetter(event.key);
    });

    // Event listener for backspace when typing
    typingTextarea.addEventListener('keydown', (event) => {
        if (event.which === 8 && typedIndex > 0 && !finishedPassage) {
            movePosIndicator(typedIndex, BACKWARD);
            typedIndex -= 1;
            typingPassageCharList[typedIndex].letterHandle.style.color = '#bfbfbf';
        }
    });

    // create a new clock, providing the number of seconds
    // and handles to the seconds and minutes html elements
    // const clock = new Clock(150, minutesDisplay, secondsDisplay);
    // clock.startTimer();

    createCharacterList();
    passageTextarea.innerHTML = styledTestPassage;
    getLetterElementList();
    // Initialise typing cursor on first character
    typingPassageCharList[typedIndex].letterHandle.style.borderBottom = '1px solid white';
};

