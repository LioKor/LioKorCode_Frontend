import {getChildrenHeight} from "./utils";

const hidingTimeouts = [];
export function show(element, _classname = 'show') {
    element.classList.remove('hide', 'hidden');
    element.classList.add(_classname);
    hidingTimeouts.forEach((timeout, idx) => {
        if (timeout.element === element) {
            clearTimeout(timeout.timeout);
            hidingTimeouts.splice(idx, 1);
        }
    });
}
export function showfast(element) {
    show(element, 'showed');
}

export function hide(element, _classname = 'hide') {
    element.classList.remove('show', 'showed');
    element.classList.add(_classname);
    hidingTimeouts.push({
        element: element,
        timeout: setTimeout(() => { element.classList.add('hidden'); }, 300)
    });
}
export function hidefast(element) {
    hide(element, 'hidden');
}


export function isClosedRoll(element) {
    return element.getAttribute('data-open-roll') === null;
}
export function closeRoll(element) {
    element.removeAttribute('data-open-roll');
    element.style.removeProperty("height");
}
export function openRoll(element) {
    element.setAttribute('data-open-roll', '');
    element.style.height = element.scrollHeight + "px";
}
export function adjustRoll(element) {
    let height = 0;
    for (const child of Array.from(element.children)) {
        const style = getComputedStyle(child);
        console.log(child.offsetHeight, parseInt(style.marginTop))
        height += child.offsetHeight + parseInt(style.marginTop);// + parseInt(style.marginBottom);
    }
    if (height === 0) {
        closeRoll(element);
        return;
    }
    element.setAttribute('data-open-roll', '');
    element.style.height = height + "px";
}
export function toggleRoll(element) {
    if (isClosedRoll(element)) {
        closeRoll(element);
    } else {
        openRoll(element);
    }
}
export function fastRoll(element) {
    element.setAttribute('data-open-roll', '');
    const buffer = element.style.transition;
    element.style.transition = 'none';
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + "px";
    element.style.transition = buffer;
}
