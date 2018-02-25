/* global window document Clock passageList */
window.onload = () => {
    // Get all DOM handles
    const passageTextarea = document.getElementById('passage-text-area');
    const typingTextarea = document.getElementById('user-typing-text-area');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const passageSelect = document.getElementById('test-passage-select');
    const timeSelect = document.getElementById('test-duration-select');
    const accuracyDisplay = document.getElementById('accuracy-percentage');
    const errorCountDisplay = document.getElementById('error-count');
    const wpmDisplay = document.getElementById('wpm-display');
    let testPassageText = '';

    const typingPassageCharList = [];
    const FORWARD = 1;
    const BACKWARD = -1;
    let styledTestPassage = '';
    let nextCharIndex = 0;
    let finishedPassage = false;
    let startedTest = false;
    let finishedTest = false;
    let grossWordsPerMin = 0;
    let errorCount = 0;
    let netWordsPerMin = 0;

    // Create array of character objects from passage
    function createCharacterList() {
        styledTestPassage = '';
        for (let i = 0; i < testPassageText.length; i += 1) {
            typingPassageCharList[i] = { char: testPassageText[i] };
            // Each letter inside an element for individual styling
            styledTestPassage += '<span id="char-' + i + '">' + testPassageText[i] + '</span>';
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
        const totalTypedChars = nextCharIndex + 1;
        grossWordsPerMin = Math.round((totalTypedChars / 5) / (secondsPassed / 60));
        wpmDisplay.innerHTML = grossWordsPerMin;
    }

    // Return the accuracy percentage
    const accuracyCalc = (numErrors, numTyped) => {
        accuracyDisplay.innerHTML = Math.round(100 - ((numErrors / numTyped) * 100)) + '%';
    };

    // Update the error count from the currently typed characters
    const countErrors = () => typingPassageCharList.filter(char => char.isCorrect === false).length;

    // Redraw the accuracy and percentage counters
    const updateErrorDisplays = () => {
        // Update the error count to match passage
        const numErrors = countErrors();
        // Update the accuracy counter
        accuracyCalc(numErrors, nextCharIndex + 1);
        // Update the error counter
        errorCountDisplay.innerHTML = numErrors;
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
    function movePosIndicator(direction) {
        let index = nextCharIndex;

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
        if (typedChar === typingPassageCharList[nextCharIndex].char) {
            typingPassageCharList[nextCharIndex].isCorrect = true;
            typingPassageCharList[nextCharIndex].letterHandle.style.color = '#6cbf84';
        } else {
            typingPassageCharList[nextCharIndex].isCorrect = false;
            typingPassageCharList[nextCharIndex].letterHandle.style.color = '#fc4a1a';
        }
        // Update the accuracy percentage and error counters
        updateErrorDisplays();
        // Check if the typing passage is complete
        if (checkPassageEnd(nextCharIndex)) {
            return false;
        }
        movePosIndicator(FORWARD);
        nextCharIndex += 1;
        return true;
    }

    function getLetterElementList() {
        for (let i = 0; i < typingPassageCharList.length; i += 1) {
            const currentElement = document.getElementById('char-' + i);
            typingPassageCharList[i].letterHandle = currentElement;
        }
    }

    // Populates the passages dropdown
    function populatePassageList() {
        passageList.passages.forEach((passage) => {
            const option = document.createElement('option');
            option.text = passage.title;
            option.value = passage.id;
            passageSelect.appendChild(option);
        });
    }

    // Find a passage by ID
    function getPassageById(id) {
        let passageText = '';
        passageList.passages.forEach((passage) => {
            if (passage.id === id) passageText = passage.text;
        });
        return passageText;
    }

    // Select a passage
    function selectPassage() {
        testPassageText = getPassageById(passageSelect.options[passageSelect.selectedIndex].value);
        if (testPassageText) {
            createCharacterList();
            passageTextarea.innerHTML = styledTestPassage;
            getLetterElementList();
            // Initialise typing cursor on first character
            typingPassageCharList[nextCharIndex].letterHandle.style.borderBottom = '1px solid white';
        } else {
            alert('passage not found!!');
        }
    }

    function startTest() {
        // TODO
        // Disable passage and timer selection
        passageSelect.disabled = true;
        passageSelect.style.color = '#868686';
        timeSelect.disabled = true;
        timeSelect.style.color = '#868686';

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

    // Event listener for passage select dropdown
    passageSelect.addEventListener('change', () => {
        selectPassage();
    });

    // Event listener for backspace when typing
    typingTextarea.addEventListener('keydown', (event) => {
        if (event.which === 8 && nextCharIndex > 0 && !finishedPassage) {
            movePosIndicator(BACKWARD);
            nextCharIndex -= 1;
            typingPassageCharList[nextCharIndex].letterHandle.style.color = '#bfbfbf';
            delete typingPassageCharList[nextCharIndex].isCorrect;
            // Reverse error and update displays
            updateErrorDisplays();
        } else if (event.which === 8 && nextCharIndex === 0 && !finishedPassage) {
            delete typingPassageCharList[nextCharIndex].isCorrect;
            typingPassageCharList[nextCharIndex].letterHandle.style.color = '#bfbfbf';
            updateErrorDisplays();
        }
    });

    // Populate the passage dropdown
    populatePassageList();
};

