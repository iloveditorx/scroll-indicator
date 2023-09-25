// Define the custom element class
class ScrollIndicator extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log('Custom element loaded');
    }

    static get observedAttributes() {
        return ['scroll-indicator-element-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback');

        if (name === 'scroll-indicator-element-id') {
            const pageSendData = JSON.parse(newValue);
            console.log('scroll-indicator-element-id:', pageSendData);
            // const scrollSync = pageSendData.scrollSyncElementId;

            if (pageSendData.scrollSync === 'Page') {
                // Scroll is sync with PAGE scroll
                init_PAGE_scrollIndicator(pageSendData.progressElement, pageSendData.growDirection);
            } else {
                // Scroll is sync with specific SECTION / CONTAINER scroll
                // if (pageSendData.scrollSyncElementId && pageSendData.scrollSyncElementId !== 'Undefined') {
                    init_ELEMENT_scrollIndicator(pageSendData.progressElement, pageSendData.scrollSyncElementId, pageSendData.setSyncElementManually, pageSendData.growDirection);
                // } else {
                //     console.log('The scroll indicator should be synchronized with a section or container but no ID element specified.');
                // }

            }

        }
    }

}

// Define the custom element using the 'code-snippet' tag name
customElements.define('scroll-indicator', ScrollIndicator);

function init_PAGE_scrollIndicator(scrollIndicatorElementId, growDirection) {

    // When the user scrolls the page, execute myFunction 
    const proggresIndicatorElement = document.getElementById(scrollIndicatorElementId);
    proggresIndicatorElement.style.width = "0%";
    proggresIndicatorElement.style.justifySelf = growDirection;

    sendActiveEvent();

    window.onscroll = function () { myFunction() };

    function myFunction() {
        console.log('Scroll inside the page');
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        proggresIndicatorElement.style.width = scrolled + "%";
    }
}

function init_ELEMENT_scrollIndicator(scrollIndicatorElementId, scrollSyncElementId, setSyncElementManually, growDirection) {
    const proggresIndicatorElement = document.getElementById(scrollIndicatorElementId);
    proggresIndicatorElement.style.width = "0%";
    proggresIndicatorElement.style.justifySelf = growDirection;
    sendActiveEvent(); 

    const customElement = document.getElementsByTagName("scroll-indicator")[0];

    // Get the scrollable div element
    // const scrollableDiv = document.getElementById(scrollSyncElementId);

    let scrollSyncElement;

    if (setSyncElementManually === 'true') {
        scrollSyncElement = findChildWithOverflow(scrollSyncElementId);
    } else {
        scrollSyncElement = findParentWithOverflow(customElement, 10);
    }
    // const childWithOverflow = findChildWithOverflow(scrollableDiv);
    // const parentWithOverflow = findParentWithOverflow(customElement, 10);

    // When the user scrolls the div, execute myFunction
    if (scrollSyncElement) {
        scrollSyncElement.onscroll = function () {
            myFunction();
        };
    } else {
        console.log('No element found with overflow content');
    }

    function myFunction() {
        console.log('Scroll inside an element');
        // Calculate the scroll position and progress based on the div
        const scrollTop = scrollSyncElement.scrollTop;
        const scrollHeight = scrollSyncElement.scrollHeight - scrollSyncElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;

        // Set the width of the progress bar
        proggresIndicatorElement.style.width = scrolled + "%";
    }
}

// Used when we have an input to put the container or section unique id.
function findChildWithOverflow(scrollSyncElementId) {
    const scrollableDiv = document.getElementById(scrollSyncElementId);
    // Check if the container itself has overflow content
    if (scrollableDiv.scrollHeight > scrollableDiv.clientHeight) {
        return scrollableDiv; // Return the container itself
    }

    // Loop through the container's child elements
    for (var i = 0; i < scrollableDiv.children.length; i++) {
        var child = scrollableDiv.children[i];

        // Check if the child has overflow content
        if (child.scrollHeight > child.clientHeight) {
            return child; // Return the first child with overflow content
        }
    }

    return null; // If no child with overflow content is found
}

// Used when we the scroll indicator custom element is placed inside a section or container
function findParentWithOverflow(element, maxGenerations) {
    let parent = element.parentElement;
    let generations = 0;

    while (parent && generations < maxGenerations) {
        // Check if the parent has overflow content
        if (parent.scrollHeight > parent.clientHeight) {
            return parent; // Return the first parent with overflow content
        }

        parent = parent.parentElement;
        generations++;
    }

    return null; // If no parent with overflow content is found within the specified limit
}

// Sending an event to show the scroll indicator element thet was hidden by default
function sendActiveEvent() {
    document.getElementsByTagName("scroll-indicator")[0].dispatchEvent(new CustomEvent('active'))
}