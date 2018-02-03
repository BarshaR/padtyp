/* global window document */
window.onload = () => {
    const passageTextarea = document.getElementById('passage-text-area');
    const typingTextarea = document.getElementById('user-typing-text-area');
    const testPassage = 'This is some test text which you will be using to measure your typing skills. ' +
        'You are required to finish this as quickly as you can whilst minimising mistakes made.';

    let styledTestPassage = '';
    let typingPassageCharList = [];
    let typedIndex = 0;
    // fe
    const FORWARD = 1;
    const BACKWARD = -1;

    // Create array of character objects from passage
    function createCharacterList() {
        for (let i = 0; i < testPassage.length; i += 1) {
            typingPassageCharList[i] = { char: testPassage[i] };
            // Each letter inside an element for individual styling
            styledTestPassage += '<span id="char-' + i + '">' + testPassage[i] + '</span>';
        }
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
    }

    // Compare last typed letter with passage at current index
    function checkLetter(typedChar) {
        if (typedChar === typingPassageCharList[typedIndex].char) {
            typingPassageCharList[typedIndex].correct = true;
            typingPassageCharList[typedIndex].letterHandle.style.color = '#6cbf84';
            console.log('Correct letter');
            movePosIndicator(typedIndex, FORWARD);
        } else {
            typingPassageCharList[typedIndex].correct = false;
            console.log('Incorrect letter');
            typingPassageCharList[typedIndex].letterHandle.style.color = '#fc4a1a';
            movePosIndicator(typedIndex, FORWARD);
        }

        typedIndex += 1;
    }

    function getLetterElementList() {
        for (let i = 0; i < typingPassageCharList.length; i += 1) {
            const currentElement = document.getElementById('char-' + i);
            typingPassageCharList[i].letterHandle = currentElement;
        }
    }

    // Event listener for user typing textarea
    typingTextarea.addEventListener('keypress', (event) => {
        checkLetter(event.key);
    });

    // Event listener for backspace when typing
    typingTextarea.addEventListener('keydown', (event) => {
        if (event.which === 8 && typedIndex > 0) {
            movePosIndicator(typedIndex, BACKWARD);
            typedIndex -= 1;
            typingPassageCharList[typedIndex].letterHandle.style.color = '#bfbfbf';
        }
    });

    createCharacterList();
    passageTextarea.innerHTML = styledTestPassage;
    getLetterElementList();
    // Initialise typing cursor on first character
    typingPassageCharList[typedIndex].letterHandle.style.borderBottom = '1px solid white';
    console.log(typingPassageCharList);
};

