exports.slidingInit = function (leftBlock, rightBlock, slideLine) {
    function applySlide(leftPercentage) {
        if (leftPercentage <= 2) { // due to padding can't hide if only width is 0
            leftBlock.style.display = 'none';
            rightBlock.style.width = '100%';
            slideLine.style.width = '50px';
        } else if (leftPercentage >= 98) {
            leftBlock.style.width = '100%';
            rightBlock.style.display = 'none';
            slideLine.style.width = '50px';
        } else {
            leftBlock.style.display = 'block';
            leftBlock.style.width = leftPercentage + '%';
            slideLine.style.width = null;

            rightBlock.style.display = 'block';
            rightBlock.style.width = (100 - leftPercentage) + '%';
        }
    }

    applySlide(window.localStorage.getItem('leftPercentage') || 30);

    let slideLineSlide = false;
    let bodyEl = document.querySelector('body');

    function startSlide() {
        slideLineSlide = true;
        bodyEl.style.userSelect = 'none';
        bodyEl.style.cursor = 'pointer';
    }
    function endSlide() {
        if (slideLineSlide) {
            slideLineSlide = false;
            bodyEl.style.userSelect = 'auto';
            bodyEl.style.cursor = 'inherit';

            let leftPercentage = 0;
            if (rightBlock.style.display === 'none') {
                leftPercentage = 100;
            } else if (leftBlock.style.display !== 'none') {
                leftPercentage = leftBlock.style.width.slice(0, leftBlock.style.width.length - 1);
            }

            window.localStorage.setItem('leftPercentage', leftPercentage.toString());
        }
    }
    function slideEvent(e) {
        if (slideLineSlide) {
            let percPos = Math.round(e.pageX / window.innerWidth * 100);
            applySlide(percPos);
        }
    }

    slideLine.addEventListener('mousedown', startSlide);
    slideLine.addEventListener('touchstart', startSlide);
    window.addEventListener('mouseup', endSlide);
    window.addEventListener('touchend', endSlide);
    window.addEventListener('mousemove', slideEvent);
    window.addEventListener('touchmove', slideEvent);
};