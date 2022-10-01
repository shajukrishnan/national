const NT_CONTEXT = {
    context_hash: {},
    set: function (key, val) {
        this.context_hash[key] = val;
    },
    has: function (key) {
        return (this.context_hash.hasOwnProperty(key));
    },
    get: function (key, defaultRetVal) {
        if (this.context_hash.hasOwnProperty(key)) {
            return this.context_hash[key];
        }
        else {
            return defaultRetVal;
        }
    }
};
let __signup_trigger_from = null;
let subdomain = location.host.split('.')[0]


function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

function isValidDomain(domain) {
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
    return domain.match(re);
}

function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}


var _lastClickedEvent;
var pageTitles = {
    "url": { "title": "Web Url", "type": "static" },
    "text": { "title": "Text", "type": "static" },
    "email": { "title": "Email", "type": "static" },
    "sms": { "title": "SMS", "type": "static" },
    "facebook": { "title": "SMS", "type": "static" },
}

var campaignData = null;
var static_short_url = '';
var TotalClicksAllowedCounter = 0;
function showDesignPopUp(idSelector) {
    $(idSelector).click();
    $("#desgin_qrcode_modal").modal("show");
}
$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

const FoldersSection = {
    init: function () {
        FoldersSection.initListeners();
        if ($("#folder-overview-heading").hasClass('d-none')) {
            return;
        }
        showLoaderOnBlock("#folder-Overview-Section");
        let folder_type = page == 'bulkUpload' ? 'bulk' : 'qr';
        $.get("//" + __api_domain + '/user/services/api', {
            cmd: 'getFolderDataOfUser',
            folder_type: folder_type,
            limit: 5
        }, function (response) {
            hideLoader("#folder-Overview-Section")
            if (!empty(response.data)) {
                if (parseInt(extractDataFromArray(response, ['data', 'total_count'], [])) > 5) {
                    $('.folder-overview-view-btn').removeClass("d-none");
                }
                FoldersSection.create(extractDataFromArray(response, ['data', 'all_folders'], []));
                if (extractDataFromArray(response, ['data', 'all_folders'], []).length > 5 && $('.folder-overview-view-btn').hasClass("d-none")) {
                    $('.folder-overview-view-btn').removeClass("d-none")
                }
            }
        });
    },
    create: function (folders) {
        $("#folder-Overview-Section").html('')
        folders.forEach(function (folder, index) {
            $("#folder-Overview-Section").append(FoldersSection.getFolderBoxHtml(folder, index))
        })
    },
    getFolderBoxHtml: function (folder, index) {
        let rmPadding = index == 4 ? 'pr-0' : '';
        let folderIcon = page == 'bulkUpload' ? 'icon-bulk_folder' : 'icon-folder1';
        return `<div class="dash-folder-parent ` + rmPadding + `">
                    <div class="card dashboard-folder-container" id="folderGridCol" data-id="`+ folder._id + `" data-type="` + folder.folder_type + `">
                        <div class="btn card-body p-2">
                            <span class="row normal-text-14 ml-2">
                                <i class="`+ folderIcon + ` folder-icon-med mr-2"></i>
                                <div title="`+ folder.folder_name + `" class="grid-folder-text">` + folder.folder_name + `</div>
                            </span>
                            <div> <span class="normal-text-12" style="color: #9FA4B3;">`+ getLocalTime(folder.update_time, 'DD-MMM-YYYY') + `</span>
                                <span class="dot normal-text-14 ml-1" id="grid_total_codes">`+ folder.total_codes + `</span>
                            </div>
                        </div>
                    </div>
                </div>`
    },
    initListeners: function () {
        $('#folder-Overview-Section').on("mousemove", ".dashboard-folder-container", function (e) {
            $(this).addClass("folder-highlighted");
        });

        $('#folder-Overview-Section').on("mouseout", ".dashboard-folder-container", function (e) {
            $(this).removeClass("folder-highlighted");
        });

        $('#folder-Overview-Section').on("click", ".dashboard-folder-container", function (e) {
            $(this).addClass("folder-highlighted");
            let folder_id = $(this).data('id');
            let folder_type = $(this).data('type');
            window.location.href = '/user/folder-details?folder_id=' + folder_id + '&folder_type=' + folder_type;
        });
    }
}


const PopulateSelectFolderSectionForQR = {
    init: function () {
        if ($("select[name=folder-select-for-qr]").hasClass('d-none')) {
            return;
        }
        // let folder_type = getUrlParameterByName('bulk') == 1 ? 'bulk' : 'qr';
        let qrServicesPages = ['url', 'text', 'email', 'sms', 'vcard', 'facebook', 'event', 'coupons', 'appdownload', 'businesspage', 'image', 'menu', 'gallery', 'vcardWeb', 'socialMedia', 'rating', 'google', 'googleMaps', 'youtube', 'googleReview', 'googleForms', 'googleCalendar', 'feedbackForm', 'pdf', 'payments', 'presentation', 'googleMeet', 'zoomMeeting', 'meeting', 'calendar', 'videoPreview', 'resume', 'landingpage', 'product', 'whatsapp', 'signin', 'dynamic-url', 'wifi', 'upi', 'smart-rules', 'redeemCoupon', 'digital-business-card', 'pet-id-tags', 'coupon-code'];
        if (qrServicesPages.includes(page)) {
            $.get("//" + __api_domain + "/user/services/api?cmd=loadFolderSelectionData&folder_type=qr", function (response) {
                if (!empty(response.data)) {
                    if (typeof __JsonPageData == 'undefined') __JsonPageData = {};
                    __JsonPageData.qr_count = extractDataFromArray(response, ['data', 'count'], []);
                    __JsonPageData.required_plan = extractDataFromArray(response, ['data', 'required_plan'])
                    __JsonPageData.user_plan = extractDataFromArray(response, ['data', 'user_plan'])
                    __JsonPageData.folder_limit = extractDataFromArray(response, ['data', 'folder_limit'])
                    PopulateSelectFolderSectionForQR.createOptions(extractDataFromArray(response, ['data', 'all_folders'], []))
                }
            });
        }
    },
    createOptions: function (folders) {
        let selected_folder_id = getUrlParameterByName('folder_id');
        folders.forEach(function (folder) {
            var $option = $("<option />", {
                value: folder['_id'],
                text: folder['folder_name']
            });
            $('select[name=folder-select-for-qr]').append($option);
        })
        if (!empty(selected_folder_id)) {
            $('select[name=folder-select-for-qr]').val(selected_folder_id);
        }
    },
    initListener: function () {
    }
}

const allowed_shared_actions = { 'MOVE': 'moved', 'PAUSE': 'paused', 'ACTIVATE': 'activated', 'DELETE': 'deleted', 'UPDATE': 'updated', 'COPY': 'copied' };
const LogSharedInfo = {
    callLoggingApi: function (action, action_on, subject_id, check_for_shared = false) {
        let activeLink = $("#folderTab").find('.active');
        let type = $(activeLink).parents().data('type');
        if (type == 'shared_folders' || getUrlParameterByName('folder_type') == 'shared' || check_for_shared == true) {
            showLoaderOnBlock();
            let formdata = {};
            formdata["cmd"] = "logSharedChanges";
            formdata["action"] = action;
            formdata["action_on"] = action_on;
            formdata['subject_id'] = subject_id;
            formdata['folder_id'] = getUrlParameterByName('folder_id');
            console.log(formdata);

            $.post("//" + __api_domain + '/user/services/api', formdata, function (response) {
                response = parseResponse(response);
                // hideLoader();
                // let errorMsg = getObjectData(response, ['errorMsg']);
                // let errorCode = getObjectData(response, ['errorCode']);
                // if (errorCode === 1) {
                //     // showToastAlert("error", "", (empty(errorMsg) ? "Something went wrong!" : errorMsg));
                // } else if (errorCode === 0) {
                //     //TO DO 
                // }
            });
        }
    },
    hideIrrelevantOptions: function () {
        //console.log(sharedAccessType);
        if (!empty(sharedAccessType)) {
            if (!$('#shared_folder_tab').hasClass('active')) {
                let activeLink = $("#folderTab").find('.active');
                let tab_active = $(activeLink).attr('id');
                $('#' + tab_active).removeClass('active');
                $('#shared_folder_tab').addClass('active')
            }
        }

        if (sharedAccessType == 'view') {
            $('#requestForAccessMenu').removeClass('d-none');
            $('.request_edit_access').removeClass('d-none');
            $('.action-column-div-css .btn').addClass('disabled');
            $('.dropdown-shared-menu .dropdown-item').addClass('disabled');
            $('.download_qr_code').removeClass('disabled');
            $('.view_bulk_qr_codes').removeClass('disabled');
            $('.edit_folder_name_details').addClass('disabled');
            $('.folder_details_create_qr').addClass('disabled');
            $('.edit_folder_name').addClass('disabled');
            $('.edit_template_name').addClass('disabled');
        }

        if (getUrlParameterByName('folder_type') == 'shared' || !empty(sharedAccessType)) {
            $('.bulk_move_to_folder').addClass('d-none');
            $('.move_to_folder').addClass('d-none');
            $('.delete_folder_details').addClass('d-none');
            $('.folder_details_create_qr').addClass('disabled');
            $('.folder_no_qr_create_qr').addClass('disabled');
        }

        if (getUrlParameterByName('openSharingSettings') == 1) {
            if (extractDataFromArray(__JsonPageData, ['folder_data', 'is_owner']) == true) {
                let url = window.location.href.split('&openSharingSettings')[0];
                window.history.pushState({}, document.title, url);
                $('.share_folder_details').trigger("click");
            }
            // let url = window.location.href.split('&openSharingSettings')[0];
            // window.history.pushState({}, document.title, url);
        }
    }
}

function acceptClose() {
    $('#cookies_div').hide();
    createCookie('privacyAccepted', 'Y', 60);
}

function closeChromeExtensionButton() {
    $('#chrome_extension_btn').remove();
    createCookie('chromeExtensionButton', 'Y', 7);
}

function getFullUrlFromThumbnail(url) {
    var temp = url.split('_t.');
    if (temp.length == 1) {
        return url;
    } else {
        return temp.join('.');
    }
}

function deepCopy(aObject) {
    if (!aObject) {
        return aObject;
    }
    if (typeof aObject == "object" || typeof aObject == "array") //the type of array too is object, but just in case
    {
        let v;
        let bObject = Array.isArray(aObject) ? [] : {};
        for (const k in aObject) {
            if (aObject.hasOwnProperty(k)) {
                v = aObject[k];
                bObject[k] = (typeof v === "object") ? deepCopy(v) : v;
            }
        }
        return bObject;
    }
    return aObject;
}

function extractDataFromArray(dataArr, paramsArr, defaultRetVal = '') {
    var data = defaultRetVal;
    try {
        if (!isEmpty(dataArr) && !isUndefined(paramsArr)) {
            data = dataArr;
            var len = paramsArr.length;
            for (var i = 0; i < len; ++i) {
                if (!isUndefined(paramsArr[i])) {
                    data = data[paramsArr[i]];
                }
            }
        }
        if (isUndefined(data)) {
            data = defaultRetVal;
        }
    }
    catch (e) {
        data = defaultRetVal;
    }
    return data;
}

function extractEscapeHtmlDataFromArray(dataArr, paramsArr, defaultRetVal = '') {
    return escapeHTML(extractDataFromArray(dataArr, paramsArr, defaultRetVal));
}

function extractUnescapeHtmlDataFromArray(dataArr, paramsArr, defaultRetVal = '') {
    return unescapeHTML(extractDataFromArray(dataArr, paramsArr, defaultRetVal));
}

function setValueIfEmpty(variable, value) {
    if (empty(variable)) {
        variable = value
    }
    return variable;
}

function isEmpty(str) {
    if (isUndefined(str)) return true;

    if (!empty(str)) {
        str += '';
        if (str == 'undefined') return true;
        str.replace(/^\s+|\s+$/g, '');
        return (str == '' || str == 0);
    }
    return true;
}

function isUndefined(mixed_var) {
    if (typeof mixed_var == "undefined" || mixed_var === undefined || mixed_var === null) {
        return true;
    }
    mixed_var += '';
    if (mixed_var == 'undef' || mixed_var == 'undefined') return true;
    return false;
}

function isDefined(mixed_var) {
    return !isUndefined(mixed_var);
}


function _getTimezoneSpecificTimeObj() {
    var clientOffset = typeof _ClientSpecificTimezoneOffset != "undefined" ? _ClientSpecificTimezoneOffset : 0;
    var momentObj = moment.utc();
    return momentObj.add(clientOffset, 'seconds');
}

function getLocalTime(time, format) {

    var localTime = '';
    try {
        format = empty(format) ? 'DD-MMM-YYYY hh:mm A' : format;

        if (!empty(time)) {
            var momentObj = moment.utc(time);
        }
        else {
            var momentObj = _getTimezoneSpecificTimeObj();
        }

        if (momentObj.isValid()) {
            //localTime = momentObj.add(_ClientSpecificTimezoneOffset, 'seconds').format(format);
            // localTime = momentObj.tz(_clientsTimezoneStr).format(format);
            localTime = momentObj.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format(format);
        }
    } catch (e) {
        console.warn(e);
        localTime = '';
    }

    return localTime;
}

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getObjectData(obj, keysArr, defaultVal = null) {
    return extractDataFromArray(obj, keysArr, defaultVal);
    /*
    var retVal = defaultVal;
    try
    {
        for (let i = 0; i < keysArr.length; ++i) 
        {
            let key = keysArr[i];
            if(typeof obj == 'object' && obj[key] != "undefined" && i < (keysArr.length-1))
            {
                obj = obj[key];
            }
            else if(i == (keysArr.length-1) && typeof obj == 'object' && obj[key] != "undefined")
            {
                retVal = obj[key];
                break;
            }
        }
    }
    catch(err)
    {console.log(err)}
    return retVal;
    */
}

function showAlertModal(heading, text) {
    if (typeof heading == "undefined" || heading == "") heading = "Alert";
    if (typeof text == "undefined" || text == "") heading = "Some error has occurred. Please refresh the page and try again.";
    $(".modal").modal("hide");
    $("#alert_modal #alert_modal_heading").html(heading);
    $("#alert_modal #alert_modal_text").html(text);
    $("#alert_modal").modal("show");
}

function setCssVar($varName, $val, $selector = ":root") {
    try {
        document.querySelector($selector).style.setProperty('--' + $varName, $val);
    } catch (e) { }
}

function getFloat(x, retVal = 0) {
    const parsed = parseFloat(x);
    //console.log(parsed);
    if (isNaN(parsed)) { return retVal; }
    return parsed;
}

function getInt(x, retVal = 0, base = 10) {
    const parsed = parseInt(x, base);
    if (isNaN(parsed)) { return retVal; }
    return parsed;
}

function random_int() {
    return Math.floor(Math.random() * 100000);
}

function random_str(length = 8, case_sensitive = 0) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if(case_sensitive){
        characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function nFormatter(num) {
    if (num >= 1024 * 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024 * 1024)).toFixed(1).replace(/\.0$/, '') + 'T';
    }
    if (num >= 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024)).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1024 * 1024) {
        return (num / (1024 * 1024)).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1024) {
        return (num / 1024).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

function showToastAlert(type, title = '', text = '', cb = () => { }) {
    SwalPopup.showSingleButtonPopup({
        icon: type,
        title: title,
        text: text
    }, cb)
}

function showDeleteConfirmation(title, message, confirmButtonText, callback) {
    if (empty(confirmButtonText)) { confirmButtonText = 'Confirm Delete'; }
    Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonClass: 'btn btn-danger mr-auto',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
        allowEnterKey: false//we dont enter button to work accidently for delete confirmation
    }).then((result) => {
        if (typeof callback == "function" && result.isConfirmed) {
            callback(result.value);
        }
    });
}

function forceDynamicUsage(url) {
    if (!validURL(url)) {
        return false;
    }
    if (checkIfChimpDomain(url)) {
        $("#dynamic").prop("checked", true)
        $("#dynamic").prop("disabled", true)
    } else {
        $("#dynamic").prop("disabled", false)
    }
    $("#dynamic").trigger("change")
}
function checkIfChimpDomain(url) {
    let parsed_url = new URL(prependHTTP(url))
    return (parsed_url.host.indexOf("qrcodechimp") > -1);
}

function prependHTTP(url) {
    if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url;
    }
    return url;
}

function validURL(str) {

    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function isSafariBrowser() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function isChromeBrowser() {
    return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
}

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function expandSectionsWithErrors() {
    $('.text-danger').parents('.card.collapse_card').each(function () {
        if ($(this).find('.card-header').hasClass("collapsed") && !$(this).find('.text-danger.campaign_name_qr_alert').length) {
            // console.log($( this ).find('.text-danger')[0].outerHTML);
            $(this).find('.card-header').click();
        }
    });
}

function shiftArrayToRight(arr, places) {
    for (var i = 0; i < places; i++) {
        arr.unshift(arr.pop());
    }
}

function exponentialBackoff(toTry, max, delay, callback, onFail = () => { console.log('we give up'); }) {
    console.log('max', max, 'next delay', delay);
    var result = toTry();

    if (result) {
        callback();
    } else {
        if (max > 0) {
            setTimeout(function () {
                var updatedDelay = delay / 2 < 1000 ? 1000 : delay / 2;
                exponentialBackoff(toTry, --max, updatedDelay, callback);
            }, delay);

        } else {
            onFail()
        }
    }
}

function checkAndAdjustURL(url) {
    if (empty(url)) {
        return '';
    }
    if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0 || url.indexOf("//") == 0) {
        return url
    } else {
        return "//" + url
    }
}

function showAlertMessage(type, message, callback) {
    if (!callback) {
        callback = function () { };
    }

    switch (type) {
        case 'E':
            SwalPopup.showSingleButtonPopup({
                title: 'Error',
                text: message,
                icon: 'error',
                onClose: callback
            });
            break;
        case 'S':
            SwalPopup.showSingleButtonPopup({
                title: 'Done',
                text: message,
                icon: 'success',
                onClose: callback
            });
            break;
        case 'M':
            SwalPopup.showSingleButtonPopup({
                title: 'Warning',
                text: message,
                icon: 'warning',
                onClose: callback
            });
        default:
            break;
    }
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        SwalPopup.showSingleButtonPopup({
            text: 'Copied to Clipboard',
            icon: 'success'
        })

    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text, show_success_popup = true) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        if (show_success_popup) {

            SwalPopup.showSingleButtonPopup({
                text: 'Copied to Clipboard',
                icon: 'success'
            }, () => {
                if (page == 'claim-qr-code') {
                    ClaimOpenQrcodes.showSuccessPopup()
                }
            })
        }

    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}


function showFolderLimitPopUp(type, user_plan, required_plan, folder_limit) {
    if (user_plan['PLAN'] != 'ULx5') {
        Swal.fire({
            title: "Folder Limit Exceeded",
            html: `<div class="my-2 text-left">Max allowed ` + type + ` folders for this plan : ` + folder_limit + `<br> Please upgrade your plan to create more ` + type + ` folders. </div>
                <div class="text-left">Current Plan : `+ user_plan['LABEL'] + `
                <div class="text-left">Required Plan : `+ required_plan + `
            `,
            showCancelButton: true,
            confirmButtonText: 'Upgrade Plan',
            reverseButtons: true
        }).then(result => {
            if (result.isConfirmed) {
                location.href = '/pricing'
            }
        });
    } else {
        SwalPopup.showSingleButtonPopup({
            title: "Folder Limit Exceeded",
            html: `<div class="my-2 text-left">Max allowed ` + type + ` folders for this plan : ` + folder_limit + `<br> Please contact support team for more information </div>`
        })
    }
}

function renderDownloadVcfElement() //will add appropriate html in <span class="addToContact"...></span>
{
    /*
    <a id="addToContact" fname="Gonzalo" lname="de la Barra" mobile="9998887776" tel="" email="abc@xyz.com" designation="boss" street="Market Street" city="San Jose" state="California" country="US" website="https://www.qrcodechimp.com" company="QrCodeChimp" zipcode="95136" href="//"+__api_domain+"/user/services/openapi?cmd=downloadVcfForParams&fname=Gonzalo&...." class="btn-floating btn-primary add_to_contact primary_wrapper_color primary-color-bg">Save To Contacts<i class="icon-contact round_icon"></i></a>
    $.param({a:"1=2", b:"Test 1"})
    */
    if ($('a#addToContact').length > 0) {
        var $elem = $('a#addToContact');
        var params = {
            fname: $elem.attr('fname') == "undefined" ? '' : $elem.attr('fname'),
            lname: $elem.attr('lname') == "undefined" ? '' : $elem.attr('lname'),
            mobile: $elem.attr('mobile') == "undefined" ? '' : $elem.attr('mobile'),
            tel: $elem.attr('tel') == "undefined" ? '' : $elem.attr('tel'),
            email: $elem.attr('email') == "undefined" ? '' : $elem.attr('email'),
            designation: $elem.attr('designation') == "undefined" ? '' : $elem.attr('designation'),
            street: $elem.attr('street') == "undefined" ? '' : $elem.attr('street'),
            city: $elem.attr('city') == "undefined" ? '' : $elem.attr('city'),
            state: $elem.attr('state') == "undefined" ? '' : $elem.attr('state'),
            country: $elem.attr('country') == "undefined" ? '' : $elem.attr('country'),
            company: $elem.attr('company') == "undefined" ? '' : $elem.attr('company'),
            zipcode: $elem.attr('zipcode') == "undefined" ? '' : $elem.attr('zipcode')
        }

        var p = $.param(params);
        var href = `/user/services/openapi?cmd=downloadVcfForParams&${p}`;
        $elem.attr("href", href);
    }

}

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

function isUserLoggedIn() {
    return (typeof user_info != "undefined" && !empty(extractDataFromArray(user_info, ['email'], false))) || amILoggedIn();
}

function isAlphaNumericKeycode(e) {
    var specialKeys = new Array();
    specialKeys.push(8);  //Backspace
    specialKeys.push(9);  //Tab
    specialKeys.push(46); //Delete
    specialKeys.push(36); //Home
    specialKeys.push(35); //End
    specialKeys.push(37); //Left
    specialKeys.push(39); //Right

    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    return ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || keyCode == 32 || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
}

function saveQRCode() {
    if (typeof QRPageComponents != "undefined" && isComponentBasedUI()) {
        QRPageComponents.saveQRCode()
        return
    }
    var week_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    var fieldsToSkip = ['primary_color', 'secondary_color', 'bg_url', 'pr_url', 'ld_url', 'short_url', 'template_name', 'playstore_url', 'appstore_url', 'dynamic', 'valid_date']
    var data = serializeFormObject($(".page_form"));
    var keys = Object.keys(data);
    var proceed = true;
    if (page != 'whatsapp') {
        $("#whatsapp_input_error").addClass("d-none")
    }
    for (var i = 0; i < keys.length; i++) {
        if (page != 'whatsapp') {
            $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
        }
        if (fieldsToSkip.indexOf(keys[i]) > -1) {
            continue
        }

        if (typeof _required_inputs != "undefined" && _required_inputs.indexOf(keys[i]) == -1) {
            continue
        }
        if (data[keys[i]] == "") {
            if (data['page'] == 'url') {
                if (keys[i] == "dynamic") {
                    continue
                }
            }
            if (data['page'] == 'vcard') {
                if (keys[i] != "first_name" && keys[i] != "phone_number") {
                    continue
                }
            }
            if (data['page'] == 'whatsapp') {
                $("#whatsapp_input_error").removeClass("d-none")
            } else if ($("input[name=" + keys[i] + "]").length == 1 && $("input[name=" + keys[i] + "]").parent().children('.text-danger').length == 0) {
                $("input[name=" + keys[i] + "]").parent().append('<span class="text-danger">Input Required</span>')
            } else if ($("textarea[name=" + keys[i] + "]").length == 1 && $("textarea[name=" + keys[i] + "]").parent().children('.text-danger').length == 0) {
                $("textarea[name=" + keys[i] + "]").parent().append('<span class="text-danger">Input Required</span>')
            }
            if (data['page'] == 'socialMedia' || data['page'] == 'vcardWeb') {
                if (keys[i].indexOf("_link_") > 0 || keys[i].indexOf("_url") > 0) {
                    if ($("." + keys[i].split("_")[0] + "_link").css("display") == "none" || $(".row." + keys[i].split("_")[0]).css("display") == "none") {
                        $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
                        continue
                    }
                }
            }
            if (data['page'] == 'businesspage') {
                week_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                if (week_days.indexOf(keys[i].split("_")[0]) > -1) {
                    if ($("input[name=" + keys[i].split("_")[0] + "]").val() == 'true') {
                        if (keys[i].indexOf("_time2_") > 0) {
                            if (($("input[name=" + keys[i].split("_")[0] + "_time2]").val() == 'true')) {
                                $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
                                continue
                            }
                        }

                    } else {
                        $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
                        continue
                    }

                }
            }

            proceed = false
        } else if (keys[i] == "email_id") {
            if (!isValidEmailAddress(data[keys[i]])) {
                if ($("input[name=" + keys[i] + "]").length == 1 && $("input[name=" + keys[i] + "]").parent().children('.text-danger').length == 0) {
                    $("input[name=" + keys[i] + "]").parent().append('<span class="text-danger">Invalid Email</span>')
                }
                proceed = false
            } else {
                $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
            }
        } else {
            $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
            $("textarea[name=" + keys[i] + "]").parent().children('.text-danger').remove()
        }
    }
    if (typeof SmartRule != "undefined") {
        if (!SmartRule.validate()) {
            proceed = false
        } else {
            data['smart_rules'] = SmartRule.config
        }
    }
    if ($("#website_card_wrapper").length == 1) {
        data['web_urls'] = [];
        var arr = $("#website_card_wrapper .web_url_container")
        for (var i = 0; i < arr.length; i++) {
            // $(arr[i]).find('input[name=website_title]').parent().children('.text-danger').remove()
            // $(arr[i]).find('input[name=website_url]').parent().parent().children('.text-danger').remove()
            var title = $(arr[i]).find('input[name=website_title]').val().trim()
            var url = $(arr[i]).find('input[name=website_url]').val().trim()
            // if (empty(title)) {
            //     $(arr[i]).find('input[name=website_title]').parent().append('<span class="text-danger">Input Required</span>')
            //     proceed = false
            // }
            // if (empty(url)) {
            //     $(arr[i]).find('input[name=website_url]').parent().parent().append('<span class="text-danger">Input Required</span>')
            //     proceed = false
            // }

            data['web_urls'].push({
                'title': title,
                'url': url,
            })

        }
    }
    if (typeof EmailSignature != "undefined") {
        data['email_signature_template'] = 1;
    }
    if (data['page'] == 'landingpage') {
        data['landing_page_html'] = tinymce.get("landing_page_html").getContent();
        if (data['page_type'] == 'html') {
            $("input[name=landing_page_url]").parent().children('.text-danger').remove()
            if (!empty(data['landing_page_html'])) {
                proceed = true
                $("textarea[name=landing_page_html]").parent().children('.text-danger').remove()
            }
        } else {
            $("textarea[name=landing_page_html]").parent().children('.text-danger').remove()
            if (!empty(data['landing_page_url'])) {
                proceed = true
            }

        }
    } else if (data['page'] == 'whatsapp') {
        data['weburl'] = BulkUpload.getQRContentFromQrcode(data)
    }

    if (!proceed) {
        showAlertModal("Input Required", "Please check and fill the mandatory fields to proceed.");
        expandSectionsWithErrors();
    }
    if (proceed) {
        if (data.hasOwnProperty('dynamic')) {
            if ($("input[id=dynamic]").is(":checked")) {
                data['qr_type'] = 'D'
                data['dynamic'] = 'true'
            } else {
                data['qr_type'] = 'S'
                data['dynamic'] = 'false'
            }
        }
        if (data['page'] == 'socialMedia' || data['page'] == 'vcardWeb') {
            // var arr = $(".social_icon_list li.active")
            // data['link_order'] = [];
            // for (var i = 0; i < arr.length; i++) {
            //     data['link_order'].push($(arr[i]).data('type').split("_")[0])
            // }
            var arr = $(".social_link_container input")
            data['link_order'] = [];
            for (var i = 0; i < arr.length; i++) {
                if ($(arr[i]).parents(".row").css("display") == 'none') {
                    continue
                }
                var social_platform = $(arr[i]).attr('name').split("_")[0];
                if (empty(social_platform)) {
                    continue;
                }
                if (data['link_order'].indexOf(social_platform) == -1) {
                    data['link_order'].push(social_platform)
                }
            }
            if (typeof galleryImages != "undefined")
                data['images'] = galleryImages;
        } else if (data['page'] == 'gallery' || data['page'] == 'image' || data['page'] == 'menu') {
            // var imagesDiv = $(".list_uploaded_img").children()
            // for (var i = 0; i < imagesDiv.length; i++) {
            //     debugger
            // }
            data['images'] = galleryImages;
        } else if (data['page'] == 'businesspage') {
            week_days.forEach(day => {
                data[day] = $("input[name=" + day + "]").prop("checked")
            })
        }



        campaignData = data
        var short_url;
        if (campaignData['template_name'] == '') {
            if (!$("#folder-select").hasClass("select2-hidden-accessible")) {
                $("#folder-select").select2({
                    placeholder: "Select Folder",
                    templateResult: function (data, container) {
                        if (data.element) {
                            $(container).addClass($(data.element).attr("class"));
                        }
                        return data.text;
                    }
                });
            }
            $("#template_name_modal").modal("show")
            return

        } else {
            if ($("input[name=short_url]").length == 1) {
                short_url = $("input[name=short_url]").val()
            } else {
                short_url = campaignData['template_name']
                short_url = short_url.toLocaleLowerCase()
                short_url = short_url.replace(/ /g, '_');
            }
            showLoaderOnBlock()

            if (typeof _qrOptions != "undefined") {
                saveQrCodeTemplate(campaignData)
            } else {
                $.post("//" + __api_domain + '/user/services/api', {
                    cmd: 'saveQRCode',
                    qr_img: '',
                    formData: JSON.stringify(campaignData),
                    qrData: JSON.stringify(qrCodeParams),
                }, function (response) {
                    // if (!empty(response.data)) {
                    if (response.errorMsg == "RCP") {
                        $("#signup-free").modal("show")

                    } else if (!empty(response.data)) {
                        getQrImageUrl(short_url, function () {
                            hideLoader()
                            location.href = '/user/dashboard'
                        })
                    } else if (response.data == 0) {
                        $(".campaign_name_qr_alert").text("Name Already Exists")
                        $(".campaign_name_qr_alert").removeClass("d-none")
                    }

                    // }
                })
            }

        }




    }
}
function cleanName(name) {
    name = htmlDecode(name);
    name = name.replace(/'/g, "_");
    name = name.replace(/"/g, "_");
    return name.replace(/&#039;/g, "_");
}

function cleanQRNameForDownload(file_name) {
    let temp_split = file_name.split("::");
    if (temp_split.length > 1) {
        file_name = temp_split[1];
    } else {
        file_name = temp_split[0];
    }
    return cleanName(file_name);
}

function parseResponse(response) {
    if (response == undefined || response == null || typeof response != "object") //beware null typeof is object
    {
        response = { errorCode: "-1", errorMsg: "Unknown Error, malformed response received.", html: "" };
    }
    return response;
}

function eventPreventDefault(e) {
    if (typeof e.cancelable !== 'boolean' || e.cancelable) {
        // The event can be canceled, so we do so.
        e.preventDefault();
    }
    else {
        // The event cannot be canceled, so it is not safe
        // to call preventDefault() on it.
        console.warn(`The following event couldn't be canceled:`);
        console.dir(e);
    }
}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (typeof is_xhtml == 'undefined' || is_xhtml) ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


function getCurrentEnvironment() {
    var env = '';
    env = location.host.split('.')[0] == 'dev' ? 'DEV' : env;
    env = location.host.split('.')[0] == 'l' ? 'LOCAL' : env;
    return env;
}

function isPageType(type) //'LANDING'
{
    return (typeof type != 'undefined' && typeof __PageType != 'undefined' && __PageType == type);
}


function FAQPageListeners() {

}


function checkForSignupAndshow() {
    if (amILoggedIn()) {
        $('#view_all_designs').modal('hide');
        $('.open_design_code_popup').click();
        if (typeof window.scrollTo != "undefined") {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    else {
        $('#signup-free').modal('show');
    }
}

function downloadJson(data, file_name) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    var dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", file_name);
    dlAnchorElem.click();
}


function getMainDomain() {
    const subdomain = location.host.split('.')[0]
    if (subdomain == 'dashboard') {
        return '//www.qrcodechimp.com'
    }
    return '//' + (subdomain.split('-dashboard')[0]) + '.qrcodechimp.com'
}



function newTemplatePageListeners() {
    $(document).scroll(function () {
        if ($(document).scrollTop() > 300) {
            $('.qr_code_page_preview').addClass("card_fixed")
        } else {
            $('.qr_code_page_preview').removeClass("card_fixed")
        }
    });

    $(".preview_nav .btn-group button").on("click", function (e) {
        $(".preview_nav .btn-group button").removeClass('active')
        $(this).addClass('active')
        if ($(this).data("view") == 'page') {
            $(".landing_page_preview_frame").show()
            $(".qr_page_code_preview").hide()
        } else {
            $(".landing_page_preview_frame").hide()
            $(".qr_page_code_preview").show()
        }
    })
}

function showVideoPopup(videoSrc) {
    if ($('#quick_video').length == 0) {
        var html = `
            <div class="modal fade" id="quick_video" role="dialog" aria-hidden="true" tabindex="-1">
                <div class="modal-dialog qr-modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-body qr-modal-body" style="padding:0;"><button type="button" class="close qr-close" style="padding:0 5px;" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <!-- 16:9 aspect ratio -->
                            <div class="embed-responsive embed-responsive-16by9 mt-1"><iframe width="100%" class="embed-responsive-item" src="" id="iframeVideo" allowfullscreen="1" allowscriptaccess="always" allow="autoplay"></iframe></div>
                        </div>
                    </div>
                </div>
            </div>`;
        $('body').append(html);

        // stop playing the youtube video when I close the modal
        $("#quick_video").on("hide.bs.modal", function (e) {
            $("#quick_video #iframeVideo").attr("src", '');
        })
    }

    console.log(videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    $("#quick_video").modal().show();
    $("#quick_video #iframeVideo").attr("src", videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");

}



function pingAPI() {
    $.post("//" + __api_domain + "/user/services/api", { cmd: 'ping' }, function (response) {
        if (response.errorMsg == 'RCP') {
            location.href = '/user/signin?done=' + location.pathname + location.search
            return
        }
    })
}

function checkAndUpdateShortUrl() {
    if ($("input[name=short_url]").length && $("input[name=id]").val() == 'new') {
        $.post("//" + __api_domain + "/user/services/openapi", { cmd: 'checkAndUpdateShortUrl', short_url: $("input[name=short_url]").val() }, function (response) {
            let short_url = extractDataFromArray(response, ['data'], '')
            if (!empty(short_url)) {
                $("input[name=short_url]").val(short_url)
            }
        })
    }
}

var __escape = document.createElement('textarea');
function escapeHTML(html) {
    __escape.textContent = html;
    return __escape.innerHTML;
}

function unescapeHTML(html) {
    __escape.innerHTML = html;
    return __escape.textContent.replace(/"/g, '&quot;');
}

String.prototype.cleanReplace = function (searchFor, replaceBy) {
    return this.replace(searchFor, replaceBy.replace(/\$/g, '$$$$'));
}


function captureDivToPng(selector, callback) {
    //get this enabled first by adding the js file => include_js("/view/common/js/plugins/html2canvas.min.js");
    if (typeof html2canvas === 'function') {
        html2canvas(document.querySelector(selector)).then(canvas => {
            //document.body.appendChild(canvas)
            callback(canvas.toDataURL("image/png"));
        });
    }
    else {
        callback(null);
    }
}

function cleanJSTags(text)
{
	var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi;
	while (SCRIPT_REGEX.test(text)) {
		text = text.replace(SCRIPT_REGEX, "");
	}
    if(typeof String.prototype.replaceAll == "undefined") {
        return text.replace(/<script/gi, "");  
    }
    return text.replaceAll(/<script/gi, "");
}

function displayPrivacyPopup() {
    if (readCookie('privacyAccepted') != 'Y' && (typeof __white_labelled_domain == 'undefined' || !__white_labelled_domain)) {
        $('body').append(`<div class="cookies_msg" id="cookies_div">
                            <strong>Privacy & Cookies:</strong> This site uses cookies. By continuing to use this website, you agree to their use. 
                            To find out more, including how to control cookies, see here : <a href="/privacy">Cookie Policy</a> <a class="cookies_accept" onclick="acceptClose()">Accept & Close</a>
                            </div>`);
    }
}

function validateShortUrlCode(short_url_code) {
    short_url_code = short_url_code.trim()
    if (short_url_code == '') {
        return "Short url slug cannot be empty"
    } else if (short_url_code.length < 5) {
        return "Minimum 5 characters required"
    } else {
        var testExp = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9\-]+$", "gi");
        if (!testExp.test(($("#short_url_input_popup").val()).trim())) {
            $(".short_url_qr_alert").text("Only alphanumeric and hypen is allowed.")
            $(".short_url_qr_alert").removeClass("d-none")
            hideLoader()
            return
        }
    }
}

function shouldDisplaySection(sectionId)
{
    if(empty(sectionId)) 
        return true;
    var sId = "displaysection_"+sectionId;
    return (readCookie(sId) != 'closed');
}

function markSectionClosed(sectionId, days, hide=true)
{
    if(empty(sectionId)) 
        return;

    if(typeof hide == 'undefined' || hide) 
        $('#'+sectionId).hide();

    if(empty(days)) 
        days = 30;

    var sId = "displaysection_"+sectionId;
    createCookie(sId, 'closed', days);
}