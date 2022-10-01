let __tooltip_contents = []

$(document).ready(function () {
    $.get("//" + __api_domain + '/user/services/openapi', {
        cmd: "getHelpInfo",
    }, function (response) {
        if (!empty(response)) {
            __tooltip_contents = response.data.help_data; //array

            Array.from($(".help-popup")).forEach(ele => {
                let help_id = $(ele).attr('help-id')
                initTippyToolTip(help_id)
            })
            // listenForNewElementsAdded()
        }
    })
})


function listenForNewElementsAdded() {
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if ($(mutation.target).hasClass = ".help-popup") {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                } else if (mutation.type === 'attributes') {
                    console.log(`The ${mutation.attributeName} attribute was modified.`);
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

function getTooltipHtml(help_id) {
    let content = extractDataFromArray(__tooltip_contents, [help_id], {})
    return `<div id="add_help_popover" style="text-align: left;">           
                <div class="help-popover-title" style="color:#061244">
                    `+ extractDataFromArray(content, ['help_title'], '') + `
                </div>
                <div class="pt-1 help-popover-subtitle" style="color:#76839c;">
                    `+ extractDataFromArray(content, ['help_subtitle'], '') + `
                </div>
                <div class="pt-2 help-popover-body">
                    `+ extractDataFromArray(content, ['help_desc'], '') + `
                </div>
            </div>`
}

function initTippyToolTip(help_id) {

    let selector = "[help-id='" + help_id + "']"
    tippy(selector, {
        content: getTooltipHtml(help_id),
        allowHTML: true,
        theme: 'light',
        placement: 'bottom',
        maxWidth: 350,
        interactive: true,
        appendTo: document.body,
    });
}
