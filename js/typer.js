/* global window document Clock */
window.onload = () => {
    // Get all DOM handles
    const passageTextarea = document.getElementById('passage-text-area');
    const typingTextarea = document.getElementById('user-typing-text-area');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const passageSelect = document.getElementById('test-passage-select');
    const timeSelect = document.getElementById('time-select-title');
    const accuracyDisplay = document.getElementById('accuracy-percentage');
    const errorCountDisplay = document.getElementById('error-count');
    const wpmDisplay = document.getElementById('wpm-display');
    let testPassage = 'This is some test text which The system of annual inspection by private agencies was soon found to be unsatisfactory since the interested firms/manufacturers were not found to give a wholly correct and impartial picture of the condition of water works plants. On the termination of the First World War, another installment of reforms was conferred in';

    const typingPassageCharList = [];
    const FORWARD = 1;
    const BACKWARD = -1;
    let styledTestPassage = '';
    let typedIndex = 0;
    let finishedPassage = false;
    let startedTest = false;
    let finishedTest = false;
    let grossWordsPerMin = 0;
    let errorCount = 0;
    let netWordsPerMin = 0;

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
        finishedTest = true;
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
        grossWordsPerMin = Math.round((totalTypedChars / 5) / (secondsPassed / 60));
        wpmDisplay.innerHTML = grossWordsPerMin;
    }

    // Return the accuracy percentage
    const accuracyCalc = (numErrors, numTyped) => {
        accuracyDisplay.innerHTML = Math.round(100 - ((numErrors / numTyped) * 100)) + '%';
    };

    // Update the error count
    const countErrors = () => {
        // TODO
    };

    // Redraw the accuracy and percentage counters
    const updateErrorDisplays = () => {
        // Update the error count to match passage
        countErrors();
        // Update the accuracy counter
        accuracyCalc(errorCount, typedIndex + 1);
        // Update the error counter
        errorCountDisplay.innerHTML = errorCount;
    };

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
            errorCount += 1;
            typingPassageCharList[typedIndex].letterHandle.style.color = '#fc4a1a';
        }
        // Update the accuracy percentage and error counters
        updateErrorDisplays();
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
        // TODO
        // Disable UI elements (selectors for passage and time)
        // Pull values from passage and time selectors and begin the clock.\
        // When a passage is changed, automatically replace it in the text area
        // Will need to run all of the passage manipulation again.
        // Make this into a function

        // Create a new clock, providing the number of seconds
        // and handles to the seconds and minutes html elements
        const clock = new Clock(60, minutesDisplay, secondsDisplay);
        // Begin the timer, providing a callback for completion
        // and the words per minute calculation
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
            // Reverse error and update displays
            errorCount -= 1;
            updateErrorDisplays();
        }
    });

    createCharacterList();
    passageTextarea.innerHTML = styledTestPassage;
    getLetterElementList();
    // Initialise typing cursor on first character
    typingPassageCharList[typedIndex].letterHandle.style.borderBottom = '1px solid white';
};

