/* global window document Clock */
window.onload = () => {
    const passageTextarea = document.getElementById('passage-text-area');
    const typingTextarea = document.getElementById('user-typing-text-area');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const passageSelect = document.getElementById('test-passage-select');
    const timeSelect = document.getElementById('time-select-title');
    const testPassage = 'This is some test';
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
    function passageComplete() {
        alert('finalising test results');
        finishedPassage = true;
        typingTextarea.style.color = '#868686';
        setTimeout(() => {
            typingTextarea.disabled = true;
        }, 1000);
    }

    function checkPassageEnd(index) {
        if (typingPassageCharList.length === index + 1) {
            passageComplete();
            return true;
        }
        return false;
    }

    // Move the current position indicator
    function movePosIndicator(currentIndex, direction) {
        let index = currentIndex;

        if (direction === 1) {
            typingPassageCharList[index].letterHandle.style.borderBottom = 'none';
            index += 1;
            typingPassageCharList[index].letterHandle.style.borderBottom = '1px solid white';
        } else if (direction === -1) {
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
            console.log('Correct letter');
        } else {
            typingPassageCharList[typedIndex].correct = false;
            console.log('Incorrect letter');
            typingPassageCharList[typedIndex].letterHandle.style.color = '#fc4a1a';
        }
        // Check if a word was completed
        if (typingPassageCharList[typedIndex].char === ' ') {
            grossWordsPerMin += 1;
            wpmDisplay.innerHTML = grossWordsPerMin;
            console.log(grossWordsPerMin);
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
        // create a new clock, providing the number of seconds
        // and handles to the seconds and minutes html elements
        const clock = new Clock(20, minutesDisplay, secondsDisplay);
        clock.startTimer();
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

    // // create a new clock, providing the number of seconds
    // // and handles to the seconds and minutes html elements
    // const clock = new Clock(150, minutesDisplay, secondsDisplay);
    // clock.startTimer();

    createCharacterList();
    passageTextarea.innerHTML = styledTestPassage;
    getLetterElementList();
    // Initialise typing cursor on first character
    typingPassageCharList[typedIndex].letterHandle.style.borderBottom = '1px solid white';
};

