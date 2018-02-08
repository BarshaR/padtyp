/* eslint-disable no-unused-vars */
function Clock(totalSeconds, minutesDisplay, secondsDisplay) {
    this.totalSeconds = totalSeconds;
    this.secondsLeft = totalSeconds % 60;
    this.minutesLeft = Math.floor(totalSeconds / 60);
    this.timerComplete = false;
    this.minDisplay = minutesDisplay;
    this.secDisplay = secondsDisplay;

    this.tick = () => {
        if (this.secondsLeft > 0) {
            this.secondsLeft -= 1;
        } else if (this.secondsLeft === 0 && this.minutesLeft > 0) {
            this.minutesLeft -= 1;
            this.secondsLeft = 59;
        } else if (this.secondsLeft === 0 && this.minutesLeft === 0) {
            this.timerComplete = true;
        }
    };

    this.startTimer = () => {
        const intervalTimer = setInterval(() => {
            if (this.timerComplete === true) {
                clearInterval(intervalTimer);
            }
            this.tick();
            this.minDisplay.innerHTML = this.minutesLeft;
            this.secDisplay.innerHTML = this.secondsLeft;
        }, 1000);
    };
}
