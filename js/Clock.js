/* eslint-disable no-unused-vars */
function Clock(totalSeconds, minutesDisplay, secondsDisplay) {
    this.totalSeconds = totalSeconds;
    this.secondsLeft = totalSeconds % 60;
    this.minutesLeft = Math.floor(totalSeconds / 60);
    this.timerComplete = false;
    this.minDisplay = minutesDisplay;
    this.secDisplay = secondsDisplay;
    this.intervalTimer = 0;

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

    // Stops the timer and returns the time elapsed
    this.stopTimer = () => {
        clearInterval(this.intervalTimer);
        return this.getTimeElapsed();
    };

    // Returns the time elapsed in seconds
    this.getTimeElapsed = () => this.totalSeconds - ((this.minutesLeft * 60) + this.secondsLeft);

    this.startTimer = () => {
        this.intervalTimer = setInterval(() => {
            if (this.timerComplete === true) this.stopTimer();
            // Advance the time
            this.tick();
            // Update the HTML elements passed in
            this.minDisplay.innerHTML = this.minutesLeft < 10 ? '0' + this.minutesLeft : this.minutesLeft;
            this.secDisplay.innerHTML = this.secondsLeft < 10 ? '0' + this.secondsLeft : this.secondsLeft;
        }, 1000);
    };
}
