function serializeFormObject($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        if (n['name'].indexOf('[]') >= 0) {
            if (empty(indexed_array[n['name']])) {
                indexed_array[n['name']] = new Array();
            }
            indexed_array[n['name']].push(n['value']);
        } else {
            indexed_array[n['name']] = n['value'];
        }
    });

    return indexed_array;
}

function empty(mixed_var) {
    // Checks if the argument variable is empty
    // undefined, null, false, number 0, empty string,
    // string "0", objects without properties and empty arrays
    // are considered empty
    var undef, key, i, len;
    var emptyValues = [undef, undefined, null, false, 0, "", "0"];

    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixed_var === emptyValues[i]) {
            return true;
        }
    }

    if (typeof mixed_var === "object") {
        for (key in mixed_var) {
            // TODO: should we check for own properties only?
            //if (mixed_var.hasOwnProperty(key)) {
            return false;
            //}
        }
        return true;
    }

    return false;
}


$(document).ready(function () {
    // if(readCookieData("qr-sb") == true){
    //   $('#sidebar').removeClass('active');
    //   $('.fixnav').removeClass('left_nav_hide');
    // }else{
    //   $('#sidebar').addClass('active');
    //   $('.fixnav').addClass('left_nav_hide');
    // }
    // $('#sidebarCollapse').on('click', function () {
    // 	$('#sidebar').toggleClass('active');
    // 	$('.fixnav').toggleClass('left_nav_hide');
    // 	if ($('#sidebar').hasClass('active')) {
    // 		$("#sidebarCollapse").removeClass("icon-cross")
    // 		$("#sidebarCollapse").addClass("icon-menu")
    // 		setCookieData("sb", '1', 365)
    // 		$(".qr_code_logo_click").attr("src", "/assets/images/qrcode-chimp.svg")
    // 		$(".qr_code_logo_click").show()

    // 	} else {
    // 		$("#sidebarCollapse").removeClass("icon-menu")
    // 		$("#sidebarCollapse").addClass("icon-cross")
    // 		$(".qr_code_logo_click").hide()

    // 		setCookieData("sb", '0', 365)
    // 	}
    // });

    $(".qr_code_logo_click").on("click", function (e) {
        location.href = 'https://www.qrcodechimp.com'
    })

    $(".account_limit_exhaust_form").on("submit", function (e) {
        e.preventDefault()
        const data = serializeFormObject($(this))
        $.post("//" + __api_domain + '/user/services/openapi', data, function (response) {
            if (!empty(response.data)) {
                $('.thank_you').removeClass("d-none")
                $('.account_limit_exhaust_form_wrapper').addClass("d-none")
            }

        })
    })
});

function readCookieData(name) {
    var data = readCookie(name);
    //alert(data);
    if (data != null) {
        data = decodeURIComponent(data);
        var dArr = data.split('&');
        data = {};
        for (var i = 0; i < dArr.length; ++i) {
            //alert(dArr[i]);
            var vals = dArr[i].split('=');
            if (vals.length > 1) {
                data[decodeURIComponent(vals[0])] = decodeURIComponent(vals[1]);
            }
            else if (vals.length == 1) {
                data[decodeURIComponent(vals[0])] = '';
            }
        }
    }
    else {
        data = {};
    }
    return data;
}

function setCookieData(name, data, days) {
    createCookie(name, encodeURIComponent(data), days);
}


function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
    var cookie_string = name + "=" + escape(value);
    if (exp_y) {
        var expires = new Date(exp_y, exp_m, exp_d);
        cookie_string += "; expires=" + expires.toGMTString();
    }
    if (path)
        cookie_string += "; path=" + escape(path);
    if (domain)
        cookie_string += "; domain=" + escape(domain);
    if (secure)
        cookie_string += "; secure";
    document.cookie = cookie_string;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    let prefix = "qr-";
    if (isDev()) {
        prefix += 'DEV-';
    } else if (isLocal()) {
        prefix += 'LOCAL-';
    } else if (isStag()) {
        prefix += 'STAG-';
    }
    document.cookie = prefix + name + "=" + value + expires + "; path=/; domain=." + location.host;
}

function isProd() {
    return !isLocal() && !isDev()
}

function isDev() {
    const subdomain = location.host.split('.')[0]
    return subdomain == 'dev' || subdomain == 'qd' || subdomain == 'dev-dashboard'
}

function isStag() {
    const subdomain = location.host.split('.')[0]
    return subdomain == 'sm' || subdomain == 's' || subdomain == 's-dashboard'
}

function isLocal() {
    const subdomain = location.host.split('.')[0]
    return subdomain == 'l' || subdomain == 'l-dashboard'
}


function readCookie(name) {
    let prefix = "qr-";
    if (isDev()) {
        prefix += 'DEV-';
    } else if (isLocal()) {
        prefix += 'LOCAL-';
    } else if (isStag()) {
        prefix += 'STAG-';
    }
    var nameEQ = prefix + name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {

    createCookie(name, '', 0);

    let prefix = "qr-";
    if (isDev()) {
        prefix += 'DEV-';
    } else if (isLocal()) {
        prefix += 'LOCAL-';
    } else if (isStag()) {
        prefix += 'STAG-';
    }
    document.cookie = prefix + name + '=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.qrcodechimp.com';
    document.cookie = prefix + name + '=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.www.qrcodechimp.com';
    document.cookie = prefix + name + '=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.' + location.host;
    document.cookie = prefix + name + '=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

function amILoggedIn() {
    if ($(".user_profile_header").hasClass("loggedIn")) {
        return true;
    }
    return false;
}

function logInUser(userData) {
    $(".user_profile_header").addClass("loggedIn")
    if (readCookie('sid')) {
        $("#subaccount_nav_dropdown_link").hide()
    } else {
        $("#subaccount_nav_dropdown_link").show()
    }
    let name = '';
    if (!empty(readCookie('sid'))) {
        name = extractDataFromArray(userData, ['sub_account_rec', 'name'], '');
        name = name.split(' ')[0]
    } else {
        name = userData['fname'];
    }
    $(".navbar_profile_pic").css("background-image", 'url(' + userData['user_img'] + ')')
    $(".dropdown-header").text(name)
    $("#nav_dashboard_link").removeClass("d-none")
    if (location.pathname == "/pricing") {
        Array.from($(".mypricing_content")).forEach(ele => {
            let button_text = 'CHOOSE PLAN';
            if ($(ele).data('plan') == extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR')) {
                button_text = 'CURRENT PLAN';
            }
            $(ele).find('.mypricing_price_btn a').text(button_text)
        })
    }
}

function logOutUser() {
    $(".user_profile_header").removeClass("loggedIn")
    $("#nav_dashboard_link").addClass("d-none")
    $('#sidebar').addClass('active');
    $('.fixnav').addClass('left_nav_hide');
}


function showToast(type, msg) {
    function showToastMsg(type, msg) {
        var title = '';
        var icon = '';
        switch (type) {
            case 'E':
                title = 'Error'
                icon = 'icon-cross'
                break
            default:
                title = 'Success'
                icon = 'icon-checkmark'
                break
        }
        $(".toast-container").append('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">\
										<div class="toast-header">\
											<i class="rounded mr-2 '+ icon + '" ></i>\
											<strong class="mr-auto">'+ title + '</strong>\
											<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\
												<span aria-hidden="true">&times;</span>\
											</button>\
										</div>\
										<div class="toast-body">'+ msg + '</div>\
									</div>')
    }
    if ($(".toast-container").length == 0) {
        $("body").append('<div aria-live="polite" aria-atomic="true" style="position: relative; min-height: 200px;">\
								<div class="toast-container" style="position: absolute; top: 0; right: 0;"></div>\
							</div>')

    }
    showToastMsg(type, msg)
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParameterByName(name, return_val = null, url = undefined) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return return_val;
    if (!results[2]) return return_val;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function removeUrlParameterByName(name) {
    let url = window.location.search.substring(1);
    let url_params = url.split("&")
    let new_url = "";
    url_params.forEach(param => {
        let param_name = param.split("=")[0]
        if (param_name != name) {
            new_url += "&" + param
        }
    })

    try { window.history.replaceState(null, null, window.location.origin + location.pathname + (empty(new_url) ? '' : "?" + new_url.substring(1))); }
    catch (e) { console.log(e) }
}

function appendReferrerToCookie() {
    if (!empty(document.referrer)) {
        if (document.referrer.search(location.origin) != 0) {
            let urls = decodeURIComponent(readCookie("broswer_ref")).split(",")
            if (urls[urls.length - 1] != document.referrer) {
                urls.push(document.referrer)
                set_cookie("qr-broswer_ref", urls.join(","), (new Date()).getFullYear() + 20, 1, 1, '/')
            }
        }
    }
}

appendReferrerToCookie()
var PageHeader = {
    startDate: null,
    endDate: null,
    onDateRageChange: null, //callback function set by the page
    productList: {},//storing here so once fetched it can be used inside pages if needed
    productListLoaded: false,
    init: function () {
        PageHeader.setupDatePicker();
        PageHeader.setupProductPicker();
        // PageHeader.setupBatchPicker();
        PageHeader.setSwalDefaults();
        PageHeader.setjQueryValidatorDefaults();
        DateFilter.init();

        $("#userList option:last").attr("selected", "selected");
        $('.select-search').select2();
    },
    setupDatePicker: function () {
        var clientSpecificTime = _getTimezoneSpecificTimeObj();
        if ($('.daterange-ranges').length == 0) {
            return;
        }

        $('.daterange-ranges').daterangepicker(
            {
                //startDate: moment().subtract(29, 'days'),
                endDate: clientSpecificTime,
                maxDate: clientSpecificTime,
                ranges: {
                    'Today': [clientSpecificTime, clientSpecificTime],
                    'Yesterday': [clientSpecificTime.subtract(1, 'days'), clientSpecificTime.subtract(1, 'days')],
                    'Last 7 Days': [clientSpecificTime.subtract(6, 'days'), clientSpecificTime],
                    'Last 30 Days': [clientSpecificTime.subtract(29, 'days'), clientSpecificTime],
                    'Last 90 Days': [clientSpecificTime.subtract(89, 'days'), clientSpecificTime],
                    'This Month': [clientSpecificTime.startOf('month'), clientSpecificTime],
                    'Last Month': [clientSpecificTime.subtract(1, 'month').startOf('month'), clientSpecificTime.subtract(1, 'month').endOf('month')]
                },
                opens: 'left',
                applyClass: 'btn-small bg-slate-600 btn-block',
                cancelClass: 'btn-small btn-default btn-block',
                format: 'DD/MM/YYYY'
            },
            function (start, end, label) {
                $('.daterange-ranges span').html(start.format('MMMM D') + ' - ' + end.format('MMMM D'));
                PageHeader.startDate = start.format('YYYY-MM-DD');
                PageHeader.endDate = end.format('YYYY-MM-DD');

                //added by aasim storing user search preference in local storage
                var strSearchDate = PageHeader.startDate + '|' + PageHeader.endDate;
                createCookie('searchDate', strSearchDate, 365);
                createCookie('searchDateLabel', label, 365);

                if (PageHeader.onDateRageChange) {
                    PageHeader.onDateRageChange();
                }
            }
        );
        var arrDate = getDateFromCookie();
        if (!empty(arrDate)) {
            PageHeader.startDate = moment(arrDate[0]).format('YYYY-MM-DD');
            PageHeader.endDate = moment(arrDate[1]).format('YYYY-MM-DD');
        } else {
            PageHeader.startDate = clientSpecificTime.subtract(29, 'days').format('YYYY-MM-DD');
            PageHeader.endDate = clientSpecificTime.format('YYYY-MM-DD');
        }
    },
    setupProductPicker: function () {
        if ($('#productList').length == 0) {
            return;
        }
        PageHeader.getProductList();
    },

    getDisplayTitle: function (title, length, wrapLength) {
        var l = title.length;
        length = length ? length : 30;
        wrapLength = wrapLength ? wrapLength : 45;
        if (l > wrapLength) {
            title = title.substring(0, length) + '...';
        }
        return title;
    },

    getProductList: function () {
        showLoaderOnBlock(".content-wrapper");
        $.get("//" + __api_domain + '/user/services/api?cmd=getProductList',
            function (response) {
                $(".content-wrapper").unblock();
                var json = parseResponse(response);
                if (json) {

                    var $productList = $('#productList, .productList');
                    $productList.empty();
                    PageHeader.productList = {};
                    $productList.append('<option value="All">All Products</option>');
                    for (var counter = 0; counter < json.data.length; ++counter) {
                        var element = json.data[counter];
                        $productList.append('<option value="' + element._id + '" title="' + element.pr_description.value.pr_title + '">' + PageHeader.getDisplayTitle(element.pr_description.value.pr_title) + '  (' + element.sku_id + ') </option>');
                        PageHeader.productList[element._id] = element;
                    }
                    $productList.select2();
                    PageHeader.productListLoaded = true;
                }
            });
    },

    // setupBatchPicker: function() {
    //     if($('#batchList').length == 0){
    //         return;
    //     }
    //     PageHeader.getBatchList();
    // },

    // getBatchList: function()
    // {
    //     showLoaderOnBlock(".content-wrapper");
    //     $.ajax({
    //         data: {'cmd' : 'getBatchList'},
    //         type: "POST",
    //         url: "//"+__api_domain+"/user/services/api",
    //         success: function(response) {
    //             $(".content-wrapper").unblock();
    //             var json = parseResponse(response);
    //             if(!json)
    //             {  
    //                 return
    //             }
    //             var $batchList = $('#batchList');
    //             $batchList.empty();
    //             // PageHeader.batchList = {};
    //             $batchList.append('<option value="All">All Batch</option>');
    //             for(var counter=0; counter<json.data.length; ++counter)
    //             {
    //                 var element = json.data[counter];   
    //                 $batchList.append(`<option value="${element._id}" >${element.client_batch_id}</option>`);
    //                 // PageHeader.productList[element._id] = element;
    //             }
    //             $batchList.select2();
    //             // PageHeader.productListLoaded = true;
    //         },
    //         error: function(XMLHttpRequest, textStatus, errorThrown) { 
    //             $(".content-wrapper").unblock();
    //             showAlertMessage('E',errorThrown);
    //         }
    //     })
    // },

    setSwalDefaults: function () {
        swal.setDefaults({
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-light'
        });
    },
    setjQueryValidatorDefaults: function () {
        jQuery.validator.setDefaults({
            ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
            errorClass: 'validation-invalid-label',
            successClass: 'validation-valid-label',
            validClass: 'validation-valid-label',
            highlight: function (element, errorClass) {
                $(element).removeClass(errorClass);
            },
            unhighlight: function (element, errorClass) {
                $(element).removeClass(errorClass);
            },
            success: function (label) {
                //label.removeClass('validation-invalid-label');
                label.remove();
                //label.addClass('validation-valid-label').text('Success.'); // remove to hide Success message
            },

            // Different components require proper error label placement
            errorPlacement: function (error, element) {

                // Unstyled checkboxes, radios
                if (element.parents().hasClass('form-check')) {
                    error.appendTo(element.parents('.form-check').parent());
                }

                // Input with icons and Select2
                else if (element.parents().hasClass('form-group-feedback') || element.hasClass('select2-hidden-accessible')) {
                    error.appendTo(element.parent());
                }

                // Input group, styled file input
                else if (element.parent().is('.uniform-uploader, .uniform-select') || element.parents().hasClass('input-group')) {
                    error.appendTo(element.parent().parent());
                }

                else if (element.hasClass('select2') && element.next('.select2-container').length) {
                    error.insertAfter(element.next('.select2-container'));
                }
                // Other elements
                else {
                    error.insertAfter(element);
                }
            },
            rules: {
                password: {
                    minlength: 5
                },
                repeat_password: {
                    equalTo: '#password'
                },
                email: {
                    email: true
                },
                repeat_email: {
                    equalTo: '#email'
                },
                minimum_characters: {
                    minlength: 10
                },
                maximum_characters: {
                    maxlength: 10
                },
                minimum_number: {
                    min: 10
                },
                maximum_number: {
                    max: 10
                },
                number_range: {
                    range: [10, 20]
                },
                url: {
                    url: true
                },
                date: {
                    date: true
                },
                date_iso: {
                    dateISO: true
                },
                numbers: {
                    number: true
                },
                digits: {
                    digits: true
                },
                creditcard: {
                    creditcard: true
                },
                basic_checkbox: {
                    minlength: 2
                },
                styled_checkbox: {
                    minlength: 2
                },
                switchery_group: {
                    minlength: 2
                },
                switch_group: {
                    minlength: 2
                }
            },
            messages: {
                custom: {
                    required: 'This is a custom error message'
                },
                basic_checkbox: {
                    minlength: 'Please select at least {0} checkboxes'
                },
                styled_checkbox: {
                    minlength: 'Please select at least {0} checkboxes'
                },
                switchery_group: {
                    minlength: 'Please select at least {0} switches'
                },
                switch_group: {
                    minlength: 'Please select at least {0} switches'
                },
                agree: 'Please accept our policy'
            }
        });
    },
    addButtonToDataTableDiv: function (filterCategory) {
        // $('.filterDiv').html(`<h3 class="heading-btn m-2"><span class="badge badge-pill badge-light" ><i class="icon-cancel-circle2 text-muted font20 `+filterCategory+`-close" style="cursor:pointer;" onclick="DateFilter.removeFilter();"></i>&nbsp;&nbsp;<span id="dateText" style="cursor:pointer;" data-toggle="modal" data-target="#dateFilterModal" onclick="PageHeader.showDateFilter();"></span></span></h3>`);        

        DateFilter.init('dataTable');
        //   DateFilter.removeFilter();
        PageHeader.showDateFilter();
    },
    showDateFilter: function () {
        // $('.dateRangeRadio').uniform({
        //     wrapperClass: 'border-primary-600 text-primary-800'
        // });

        $('#dateFilterModal').modal("show");
    }
}

var DateFilter = {

    calendar_startDate: null,
    calendar_endDate: null,
    minDate: -999,
    init: function (filterCategory) {
        if ($('#daterange_start_date, #daterange_end_date, #daterange_start_date_startToToday').length == 0) {
            return;
        }
        this.calendar_startDate = $('#daterange_start_date').pickadate({
            min: DateFilter.minDate,
            max: true,
            formatSubmit: 'yyyy-mm-dd',
            selectYears: true,
            selectMonths: true,
            today: false,
            clear: false,
            close: false
        });

        this.calendar_endDate = $('#daterange_end_date').pickadate({
            min: DateFilter.minDate,
            max: true,
            formatSubmit: 'yyyy-mm-dd',
            selectYears: true,
            selectMonths: true,
            today: false,
            clear: false,
            close: false
        });

        this.calendar_startToToday = $('#daterange_start_date_startToToday').pickadate({
            min: DateFilter.minDate,
            max: true,
            formatSubmit: 'yyyy-mm-dd',
            selectYears: true,
            selectMonths: true,
            today: false,
            clear: false,
            close: false
        });
        if (filterCategory == "dataTable") {
            if (!PageHeader.startDate && !PageHeader.endDate) {
                $('.dateRangeRadio[value = 30d]').prop('checked', false);
                $('.heading-btn span[id="dateText"]').html('');
                // $('.heading-btn').addClass("d-none");
            }
            else {
                $('.filterDiv').html(`<h3 class="heading-btn m-2"><span class="badge badge-pill badge-light" ><i class="icon-cancel-circle2 text-muted font20 dateRangeFilter-close" style="cursor:pointer;" onclick="DateFilter.removeFilter();"></i>&nbsp;&nbsp;<span id="dateText" style="cursor:pointer;" data-toggle="modal" data-target="#dateFilterModal" onclick="PageHeader.showDateFilter();"></span></span></h3>`);
                $('.heading-btn span[id="dateText"]').html(moment(PageHeader.startDate).format('MMMM D') + ' - ' + moment(PageHeader.endDate).format('MMMM D'));
            }
        }
        else {
            var start = _getTimezoneSpecificTimeObj().subtract(29, 'days');
            var end = _getTimezoneSpecificTimeObj();
            PageHeader.startDate = start.format('YYYY-MM-DD');
            PageHeader.endDate = end.format('YYYY-MM-DD');
            $('.heading-btn span[id="dateText"]').html(start.format('MMMM D') + ' - ' + end.format('MMMM D'));
        }
        // $('#customDateDiv').hide();
        $('#daterange_startToToday_div').hide();
        $('#daterange_end_date_div').hide();
        $('#daterange_start_date_div').hide();

        $('input[name="dateRangeOption"]').on('click', function (e) {
            DateFilter.hideShowCustomDate(e);
        });

        var moduleName = window.location.pathname.split("/")[1];
        var allowedModules = ['dashboard', 'im', 'tt', 'counterfeit'];
        /**
         * Commenting this if condition
         * Jira - 1822 : Client ==> Applied Date should be saved for all pages where calender is on top instead of filter (above table.)
         */

        /**
         * Adding true in or condition as this may change in future
         */
        if (allowedModules.includes(moduleName) || true) {
            var arrDate = getDateFromCookie();
            if (!empty(arrDate)) {
                PageHeader.startDate = moment(arrDate[0]).format('YYYY-MM-DD');
                PageHeader.endDate = moment(arrDate[1]).format('YYYY-MM-DD');
                if (!empty(arrDate[2])) {
                    $('.dateRangeRadio[value="' + arrDate[2] + '"]').prop('checked', true);
                    if (arrDate[2] == 'c') {
                        var pickerStartDate = this.calendar_startDate.pickadate('picker');
                        var pickerEndDate = this.calendar_endDate.pickadate('picker');

                        pickerStartDate.set('select', new Date(arrDate[0]));
                        pickerEndDate.set('select', new Date(arrDate[1]));
                        $('#daterange_start_date_div').show();
                        $('#daterange_end_date_div').show();
                    }
                    else if (arrDate[2] == 'startToToday') {
                        var pickerStartToToday = this.calendar_startToToday.pickadate('picker');

                        pickerStartToToday.set('select', new Date(arrDate[0]));
                        $('#daterange_startToToday_div').show();
                    }
                }
            }
        }
    },

    setDateRange: function () {
        var formObject = $('#dateRangeForm');
        var formData = serializeFormObject(formObject);
        var dateRangeOption = formData.dateRangeOption;
        var dateToDisplay = '';
        var start, end;
        if (!empty(dateRangeOption)) {
            switch (dateRangeOption) {

                case 'today':
                    dateToDisplay = _getTimezoneSpecificTimeObj().format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().format('MMMM D');
                    PageHeader.startDate = _getTimezoneSpecificTimeObj().format('YYYY-MM-DD');
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().format('YYYY-MM-DD');

                    break;

                case 'yesterday':
                    dateToDisplay = _getTimezoneSpecificTimeObj().subtract(1, 'days').format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().subtract(1, 'days').format('MMMM D');
                    PageHeader.startDate = _getTimezoneSpecificTimeObj().subtract(1, 'days').format('YYYY-MM-DD');
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().subtract(1, 'days').format('YYYY-MM-DD');

                    break;

                case '7d':
                    dateToDisplay = _getTimezoneSpecificTimeObj().subtract(6, 'days').format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().format('MMMM D');
                    PageHeader.startDate = _getTimezoneSpecificTimeObj().subtract(6, 'days').format('YYYY-MM-DD');
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().format('YYYY-MM-DD');
                    break;

                case '30d':
                    dateToDisplay = _getTimezoneSpecificTimeObj().subtract(29, 'days').format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().format('MMMM D');
                    PageHeader.startDate = _getTimezoneSpecificTimeObj().subtract(29, 'days').format('YYYY-MM-DD');
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().format('YYYY-MM-DD');
                    break;

                case '90d':
                    dateToDisplay = _getTimezoneSpecificTimeObj().subtract(89, 'days').format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().format('MMMM D');
                    PageHeader.startDate = _getTimezoneSpecificTimeObj().subtract(89, 'days').format('YYYY-MM-DD');
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().format('YYYY-MM-DD');
                    break;

                case 'currentMonth':
                    dateToDisplay = _getTimezoneSpecificTimeObj().startOf('month').format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().format('MMMM D');
                    PageHeader.startDate = _getTimezoneSpecificTimeObj().startOf('month').format('YYYY-MM-DD');
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().format('YYYY-MM-DD');
                    break;

                case 'lastMonth':
                    dateToDisplay = _getTimezoneSpecificTimeObj().subtract(1, 'month').startOf('month').format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().subtract(1, 'month').endOf('month').format('MMMM D');
                    PageHeader.startDate = _getTimezoneSpecificTimeObj().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
                    break;

                case 'c':
                    if (empty(formData.start_date_submit) || empty(formData.end_date_submit)) {
                        showAlertMessage('E', 'Please select start and end date.');
                        return;
                    }

                    if (moment(formData.end_date_submit).diff(moment(formData.start_date_submit), 'days') < 0) {
                        showAlertMessage('E', 'Start date should be less than or equal to the end date.');
                        return;
                    }
                    dateToDisplay = moment(formData.start_date_submit).format('MMMM D') + ' - ' + moment(formData.end_date_submit).format('MMMM D');
                    PageHeader.startDate = formData.start_date_submit;
                    PageHeader.endDate = formData.end_date_submit;
                    break;

                case 'startToToday':
                    if (empty(formData.startToToday_date_submit)) {
                        showAlertMessage('E', 'Please select start date.');
                        return;
                    }
                    dateToDisplay = moment(formData.startToToday_date_submit).format('MMMM D') + ' - ' + _getTimezoneSpecificTimeObj().format('MMMM D');
                    PageHeader.startDate = formData.startToToday_date_submit;
                    PageHeader.endDate = _getTimezoneSpecificTimeObj().format('YYYY-MM-DD');
                    break;
            }
            $('.filterDiv').html(`<h3 class="heading-btn m-2"><span class="badge badge-pill badge-light" ><i class="icon-cancel-circle2 text-muted font20 dateRangeFilter-close" style="cursor:pointer;" onclick="DateFilter.removeFilter();"></i>&nbsp;&nbsp;<span id="dateText" style="cursor:pointer;" data-toggle="modal" data-target="#dateFilterModal" onclick="PageHeader.showDateFilter();"></span></span></h3>`);
            $('.heading-btn').removeClass("d-none");
            $('.heading-btn span[id="dateText"]').html(dateToDisplay);

            var moduleName = window.location.pathname.split("/")[1];
            /**
             * Jira - 1822 : Applied Date should be saved for all pages where calender is on top instead of filter (above table.)
             */
            var allowedModules = ['dashboard', 'im', 'tt', 'counterfeit'];

            /**
             * Adding true in or condition as this may change in future
             */
            if (allowedModules.includes(moduleName) || true) {
                var strSearchDate = PageHeader.startDate + '|' + PageHeader.endDate;
                createCookie('searchDate', strSearchDate, 365);
                createCookie('searchDateLabel', dateRangeOption, 365);
            }
            if (PageHeader.onDateRageChange) {
                PageHeader.onDateRageChange();
            }
            $('#dateFilterModal').modal("hide");
        }
    },
    hideShowCustomDate: function (e) {
        var value = e.target.value;
        if (value == 'c') {
            $('#daterange_startToToday_div').hide();
            $('#daterange_end_date_div').show();
            $('#daterange_start_date_div').show();
            // $('#customDateDiv').show();
            $('#daterange_end_date').val('');
        }
        else if (value == "startToToday") {
            // $('#customDateDiv').show();
            $('#daterange_startToToday_div').show();
            $('#daterange_start_date_div').hide();
            var pickerEndDate = DateFilter.calendar_endDate.pickadate('picker');
            pickerEndDate.set('select', new Date());
            $('#daterange_end_date_div').hide();
        }
        else {
            $('#daterange_startToToday_div').hide();
            $('#daterange_end_date_div').hide();
            $('#daterange_start_date_div').hide();
        }
    },

    removeFilter: function () {
        $(event.target).parent().remove();
        $('.filterDiv').empty();

        /**
         * Commenting below code
         *  Jira - 1822 : defult 30 days filter should not be shown in datatable
         */
        // $('.dateRangeRadio[value = 30d]').prop('checked', true);
        // PageHeader.startDate = moment().subtract(29, 'days').format('YYYY-MM-DD');
        // PageHeader.endDate = moment().format('YYYY-MM-DD');

        $('.dateRangeRadio').prop('checked', false);
        PageHeader.startDate = null;
        PageHeader.endDate = null;

        if (PageHeader.onDateRageChange) {
            PageHeader.onDateRageChange();
        }
    }

}

function initInvoicePopups() {
    let __download_invoice_call = false;
    let current_user = user_info;
    if (page == 'users') {
        current_user = __current_user_info;
    }
    function showEditBillingInfoPopup() {
        let country_dropdown_html = '';
        const user_country = extractDataFromArray(current_user, ['billing_info', 'country'], extractDataFromArray(current_user, ['ip', 'country']))
        const user_state = extractDataFromArray(current_user, ['billing_info', 'state'], extractDataFromArray(current_user, ['ip', 'state']))
        Object.keys(countryCodeToName).forEach(code => {
            country_dropdown_html += '<option value="' + code + '" ' + (user_country == code ? 'selected' : '') + '>' + countryCodeToName[code] + '</option>'
        })
        let state_dropdown_html = '';
        IndianStateNames.forEach(state => {
            state_dropdown_html += '<option value="' + state + '" ' + (user_state == state ? 'selected' : '') + '>' + state + '</option>'
        })
        $(".stripe_billing_address").html()
        BillingInfo.listeners()
        Swal.fire({
            width: 600,
            title: 'Billing Details',
            html: `
            <div class="text-left">
                <div class="font-16 font-weight-semibold mb-2">Business Name</div>
                <div class="font-14">
                    <input type="text" class="form-control" name="name" value="`+ extractDataFromArray(current_user, ['billing_info', 'name'], current_user['fname'] + (empty(current_user['lname']) ? '' : ' ' + current_user['lname'])) + `" errormsg="Name is incomplete.">
                </div>
            </div>
            `+ BillingInfo.getBillingInfosForm(),
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'Save',
            willOpen: () => {
                BillingInfo.listeners()
                BillingInfo.inputValidations()
                $("#swal2-content input[name=name]").on("input", function (e) {
                    if (e.target.value == '') {
                        showInputInvalid("#swal2-content input[name=name]")
                    } else {
                        hideInputInvalid("#swal2-content input[name=name]")
                    }
                })
            },
            preConfirm: () => {
                let billing_info = BillingInfo.getFormData();
                if (!billing_info) {
                    return false
                }
                billing_info.name = $("#swal2-content input[name=name]").val();
                if (empty(billing_info.name)) {
                    showInputInvalid("#swal2-content input[name=name]")
                    return false
                }
                return billing_info
            }
        }).then(result => {
            if (result.isConfirmed) {
                $.post("//" + __api_domain + "/user/services/api", { cmd: 'updateProfile', formData: JSON.stringify({ billing_info: result.value }), user_id: getUrlParameterByName('user_id') }, function (response) {
                    if (!empty(response.data)) {
                        if (page == 'users') {
                            __current_user_info['billing_info'] = result.value
                        } else {
                            user_info['billing_info'] = result.value
                        }
                        $("#billing_info_name").text(result.value.name)

                        let address = result.value.line1 + '<br>'
                        if (!empty(result.value.city)) {
                            address += result.value.city + '<br>'
                        }
                        if (!empty(result.value.state)) {
                            address += result.value.state + '<br>'
                        }
                        address += 'Zip - ' + result.value.postal_code + '<br>' + countryCodeToName[result.value.country] + '<br>'

                        $("#billing_info_address").html(address)
                        if (result.value.country == 'IN' && !empty(result.value.gstpin)) {
                            $("#billing_info_gstpin").html("<strong>GST PIN: </strong>" + result.value.gstpin)
                            $("#billing_info_gstpin").show()
                        } else {
                            $("#billing_info_gstpin").hide()
                        }
                        SwalPopup.showSingleButtonPopup({
                            title: '',
                            icon: 'success',
                            text: "Saved",
                            confirmButtonText: 'Ok',
                        }, () => {
                            if (!empty(__download_invoice_call)) {
                                const inv_id = __download_invoice_call
                                __download_invoice_call = false
                                location.href = "//" + __api_domain + "/user/services/api?cmd=getInvoicePdf&inv_id=" + inv_id
                            }

                        })
                    }
                })
            }
        })

        $("select[name=country]").select2()
        $("select[name=state]").select2()
    }

    $("#btn_edit_biller_info").on("click", function (e) {
        showEditBillingInfoPopup()
    })
    $(document).on("click", '.btn_download_invoice', function (e) {
        __download_invoice_call = null
        if (empty(extractDataFromArray(current_user, ['billing_info', 'country']))) {
            __download_invoice_call = $(this).data('inv_id');
            showEditBillingInfoPopup()
        } else {
            location.href = "//" + __api_domain + "/user/services/api?cmd=getInvoicePdf&inv_id=" + $(this).data('inv_id')
        }
    })

    $(document).on("change", 'select[name=country]', function (e) {
        if (e.target.value == 'IN') {
            $("#gstpin_input").show()
            $("#state_input").show()
        } else {
            $("#gstpin_input").hide()
            $("#state_input").hide()
        }
    })


}


function toggleWatermark() {
    if (page != 'users') {
        if (extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR') == 'FR') {
            Swal.fire({
                title: 'Plan Upgrade Required',
                html: '<div class="py-4">You may remove the watermark only for paid plans. Please go to the <a href="/user/pricing">Pricing page</a> for more details.</div>',
                showCancelButton: true,
                confirmButtonText: "Upgrade Now",
                reverseButtons: true
            }).then(result => {
                if (result.isConfirmed) {
                    location.href = "/pricing"
                }
            })
            return;
        }
    }
    Swal.fire({
        title: 'Remove Watermark',
        text: 'Do you want to change?',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Confirm"
    }).then(result => {
        if (result.isConfirmed) {
            let data = {
                cmd: 'toggleWatermark',
                user_id: getUrlParameterByName('user_id')
            }
            if (page == 'users') {
                data.value = $("#show_watermark").prop("checked")
            } else {
                data.value = $("#qr_watermark").text() == 'Yes'
            }
            $.post("//" + __api_domain + '/user/services/api', data, function (response) {
                if ($("#qr_watermark").text() == 'Yes') {
                    $("#qr_watermark").text('No')
                } else {
                    $("#qr_watermark").text('Yes')
                }

                SwalPopup.showSingleButtonPopup({
                    icon: 'success',
                    text: 'Updated successfully!'
                })
            })
        } else {
            if (page == 'users') {
                $("#show_watermark").prop("checked", !$("#show_watermark").prop("checked"))
            }
        }
    })
}

function changeLocale() {
    Swal.fire({
        title: 'Change Locale',
        text: 'Do you want to change?',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Confirm"
    }).then(result => {
        if (result.isConfirmed) {
            let locale = $("#locale_select").val();
            let data = {
                cmd: 'updateProfile',
                user_id: getUrlParameterByName('user_id'),
                formData: JSON.stringify({ locale, redirect_domain: locale + ".qrcodechimp.com" })
            }

            $.post("//" + __api_domain + '/user/services/api', data, function (response) {
                SwalPopup.showSingleButtonPopup({
                    icon: 'success',
                    text: 'Updated successfully!'
                })
            })
        }
    })
}

function toggleSvgDownload() {

    Swal.fire({
        title: 'SVG Download Option',
        text: 'Do you want to toggle the option?',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "Confirm"
    }).then(result => {
        if (result.isConfirmed) {
            let data = {
                cmd: 'toggleSvgDownload',
                user_id: getUrlParameterByName('user_id')
            }
            data.value = $("#svg_download").prop("checked")

            $.post("//" + __api_domain + '/user/services/api', data, function (response) {


                SwalPopup.showSingleButtonPopup({
                    icon: 'success',
                    text: 'Updated successfully!'
                })
            })
        } else {
            $("#svg_download").prop("checked", !$("#svg_download").prop("checked"))
        }
    })
}

// const countryCodeToName = {
//     "BD": "Bangladesh",
//     "BE": "Belgium",
//     "BF": "Burkina Faso",
//     "BG": "Bulgaria",
//     "BA": "Bosnia and Herzegovina",
//     "BN": "Brunei",
//     "BO": "Bolivia",
//     "JP": "Japan",
//     "BI": "Burundi",
//     "BJ": "Benin",
//     "BT": "Bhutan",
//     "JM": "Jamaica",
//     "BW": "Botswana",
//     "BR": "Brazil",
//     "BS": "The Bahamas",
//     "BY": "Belarus",
//     "BZ": "Belize",
//     "RU": "Russia",
//     "RW": "Rwanda",
//     "RS": "Republic of Serbia",
//     "LT": "Lithuania",
//     "LU": "Luxembourg",
//     "LR": "Liberia",
//     "RO": "Romania",
//     "GW": "Guinea Bissau",
//     "GT": "Guatemala",
//     "GR": "Greece",
//     "GQ": "Equatorial Guinea",
//     "GY": "Guyana",
//     "GE": "Georgia",
//     "GB": "United Kingdom",
//     "GA": "Gabon",
//     "GN": "Guinea",
//     "GM": "Gambia",
//     "GL": "Greenland",
//     "KW": "Kuwait",
//     "GH": "Ghana",
//     "OM": "Oman",
//     "_3": "Somaliland",
//     "EH": "Western Sahara",
//     "XK": "Kosovo",
//     "_0": "Northern Cyprus",
//     "JO": "Jordan",
//     "HR": "Croatia",
//     "HT": "Haiti",
//     "HU": "Hungary",
//     "HN": "Honduras",
//     "PR": "Puerto Rico",
//     "PS": "West Bank",
//     "PT": "Portugal",
//     "PY": "Paraguay",
//     "PA": "Panama",
//     "PG": "Papua New Guinea",
//     "PE": "Peru",
//     "PK": "Pakistan",
//     "PH": "Philippines",
//     "PL": "Poland",
//     "ZM": "Zambia",
//     "EE": "Estonia",
//     "EG": "Egypt",
//     "ZA": "South Africa",
//     "EC": "Ecuador",
//     "AL": "Albania",
//     "AO": "Angola",
//     "KZ": "Kazakhstan",
//     "ET": "Ethiopia",
//     "ZW": "Zimbabwe",
//     "ES": "Spain",
//     "ER": "Eritrea",
//     "ME": "Montenegro",
//     "MD": "Moldova",
//     "MG": "Madagascar",
//     "MA": "Morocco",
//     "UZ": "Uzbekistan",
//     "MM": "Myanmar",
//     "ML": "Mali",
//     "MN": "Mongolia",
//     "MK": "Macedonia",
//     "MW": "Malawi",
//     "MR": "Mauritania",
//     "UG": "Uganda",
//     "MY": "Malaysia",
//     "MX": "Mexico",
//     "VU": "Vanuatu",
//     "FR": "France",
//     "FI": "Finland",
//     "FJ": "Fiji",
//     "FK": "Falkland Islands",
//     "NI": "Nicaragua",
//     "NL": "Netherlands",
//     "NO": "Norway",
//     "NA": "Namibia",
//     "NC": "New Caledonia",
//     "NE": "Niger",
//     "NG": "Nigeria",
//     "NZ": "New Zealand",
//     "NP": "Nepal",
//     "CI": "Ivory Coast",
//     "CH": "Switzerland",
//     "CO": "Colombia",
//     "CN": "China",
//     "CM": "Cameroon",
//     "CL": "Chile",
//     "CA": "Canada",
//     "CG": "Republic of the Congo",
//     "CF": "Central African Republic",
//     "CD": "Democratic Republic of the Congo",
//     "CZ": "Czech Republic",
//     "CY": "Cyprus",
//     "CR": "Costa Rica",
//     "CU": "Cuba",
//     "SZ": "Swaziland",
//     "SY": "Syria",
//     "KG": "Kyrgyzstan",
//     "KE": "Kenya",
//     "SS": "South Sudan",
//     "SR": "Suriname",
//     "KH": "Cambodia",
//     "SV": "El Salvador",
//     "SK": "Slovakia",
//     "KR": "South Korea",
//     "SI": "Slovenia",
//     "KP": "North Korea",
//     "SO": "Somalia",
//     "SN": "Senegal",
//     "SL": "Sierra Leone",
//     "SB": "Solomon Islands",
//     "SA": "Saudi Arabia",
//     "SE": "Sweden",
//     "SD": "Sudan",
//     "DO": "Dominican Republic",
//     "DJ": "Djibouti",
//     "DK": "Denmark",
//     "DE": "Germany",
//     "YE": "Yemen",
//     "AT": "Austria",
//     "DZ": "Algeria",
//     "US": "United States of America",
//     "LV": "Latvia",
//     "UY": "Uruguay",
//     "LB": "Lebanon",
//     "LA": "Laos",
//     "TW": "Taiwan",
//     "TT": "Trinidad and Tobago",
//     "TR": "Turkey",
//     "LK": "Sri Lanka",
//     "TN": "Tunisia",
//     "TL": "East Timor",
//     "TM": "Turkmenistan",
//     "TJ": "Tajikistan",
//     "LS": "Lesotho",
//     "TH": "Thailand",
//     "TF": "French Southern and Antarctic Lands",
//     "TG": "Togo",
//     "TD": "Chad",
//     "LY": "Libya",
//     "AE": "United Arab Emirates",
//     "VE": "Venezuela",
//     "AF": "Afghanistan",
//     "IQ": "Iraq",
//     "IS": "Iceland",
//     "IR": "Iran",
//     "AM": "Armenia",
//     "IT": "Italy",
//     "VN": "Vietnam",
//     "AR": "Argentina",
//     "AU": "Australia",
//     "IL": "Israel",
//     "IN": "India",
//     "TZ": "Tanzania",
//     "AZ": "Azerbaijan",
//     "IE": "Ireland",
//     "ID": "Indonesia",
//     "UA": "Ukraine",
//     "QA": "Qatar",
//     "MZ": "Mozambique"
// }

const countryCodeToName = {
    "BD" : "Bangladesh",
    "BE" : "Belgium",
    "BF" : "Burkina Faso",
    "BG" : "Bulgaria",
    "BA" : "Bosnia and Herzegovina",
    "BN" : "Brunei",
    "BO" : "Bolivia",
    "JP" : "Japan",
    "BI" : "Burundi",
    "BJ" : "Benin",
    "BT" : "Bhutan",
    "JM" : "Jamaica",
    "BW" : "Botswana",
    "BR" : "Brazil",
    "BS" : "The Bahamas",
    "BY" : "Belarus",
    "BZ" : "Belize",
    "RU" : "Russia",
    "RW" : "Rwanda",
    "RS" : "Republic of Serbia",
    "LT" : "Lithuania",
    "LU" : "Luxembourg",
    "LR" : "Liberia",
    "RO" : "Romania",
    "GW" : "Guinea Bissau",
    "GT" : "Guatemala",
    "GR" : "Greece",
    "GQ" : "Equatorial Guinea",
    "GY" : "Guyana",
    "GE" : "Georgia",
    "GB" : "United Kingdom",
    "GA" : "Gabon",
    "GN" : "Guinea",
    "GM" : "Gambia",
    "GL" : "Greenland",
    "KW" : "Kuwait",
//    "GH" : "Ghana",
    "OM" : "Oman",
//    "_3" : "Somaliland",
//    "EH" : "Western Sahara",
    "xk" : "Kosovo",
    "_0" : "Northern Cyprus",
    "JO" : "Jordan",
    "HR" : "Croatia",
//    "HT" : "Haiti",
    "HU" : "Hungary",
    "HN" : "Honduras",
    "PR" : "Puerto Rico",
    "PS" : "West Bank",
    "PT" : "Portugal",
    "PY" : "Paraguay",
    "PA" : "Panama",
    "PG" : "Papua New Guinea",
    "PE" : "Peru",
    "PK" : "Pakistan",
    "PH" : "Philippines",
    "PL" : "Poland",
//    "ZM" : "Zambia",
    "EE" : "Estonia",
    "EG" : "Egypt",
    "ZA" : "South Africa",
//    "EC" : "Ecuador",
    "AL" : "Albania",
//    "AO" : "Angola",
    "KZ" : "Kazakhstan",
    "ET" : "Ethiopia",
    "ZW" : "Zimbabwe",
    "ES" : "Spain",
    "ER" : "Eritrea",
    "ME" : "Montenegro",
    "MD" : "Moldova",
    "MG" : "Madagascar",
    "MA" : "Morocco",
    "UZ" : "Uzbekistan",
    "MM" : "Myanmar",
    "ML" : "Mali",
    "MN" : "Mongolia",
    "MK" : "Macedonia",
    "MW" : "Malawi",
    "MR" : "Mauritania",
//    "UG" : "Uganda",
    "MY" : "Malaysia",
    "MX" : "Mexico",
    "VU" : "Vanuatu",
    "FR" : "France",
    "FI" : "Finland",
    "FJ" : "Fiji",
    "FK" : "Falkland Islands",
    "NI" : "Nicaragua",
    "NL" : "Netherlands",
    "NO" : "Norway",
    "NA" : "Namibia",
    "NC" : "New Caledonia",
//    "NE" : "Niger",
//    "NG" : "Nigeria",
    "NZ" : "New Zealand",
    "NP" : "Nepal",
    "CI" : "Ivory Coast",
    "CH" : "Switzerland",
    "CO" : "Colombia",
    "CN" : "China",
    "CM" : "Cameroon",
    "CL" : "Chile",
    "CA" : "Canada",
//    "CG" : "Republic of the Congo",
//    "CF" : "Central African Republic",
//    "CD" : "Democratic Republic of the Congo",
    "CZ" : "Czech Republic",
    "CY" : "Cyprus",
    "CR" : "Costa Rica",
    "CU" : "Cuba",
    "SZ" : "Swaziland",
    "SY" : "Syria",
    "KG" : "Kyrgyzstan",
//    "KE" : "Kenya",
//    "SS" : "South Sudan",
    "SR" : "Suriname",
    "KH" : "Cambodia",
    "SV" : "El Salvador",
    "SK" : "Slovakia",
    "KR" : "South Korea",
    "SI" : "Slovenia",
    "KP" : "North Korea",
//    "SO" : "Somalia",
    "SN" : "Senegal",
    "SL" : "Sierra Leone",
    "SB" : "Solomon Islands",
    "SA" : "Saudi Arabia",
    "SE" : "Sweden",
    "SD" : "Sudan",
    "SG" : "Singapore",
    "DO" : "Dominican Republic",
    "DJ" : "Djibouti",
    "DK" : "Denmark",
    "DE" : "Germany",
    "YE" : "Yemen",
    "AT" : "Austria",
//    "DZ" : "Algeria",
    "US" : "United States of America",
    "LV" : "Latvia",
    "UY" : "Uruguay",
    "LB" : "Lebanon",
    "LA" : "Laos",
    "TW" : "Taiwan",
    "TT" : "Trinidad and Tobago",
    "TR" : "Turkey",
    "LK" : "Sri Lanka",
    "TN" : "Tunisia",
    "TL" : "East Timor",
    "TM" : "Turkmenistan",
    "TJ" : "Tajikistan",
    "LS" : "Lesotho",
    "TH" : "Thailand",
    "TF" : "French Southern and Antarctic Lands",
//    "TG" : "Togo",
//    "TD" : "Chad",
//    "LY" : "Libya",
    "AE" : "United Arab Emirates",
    "VE" : "Venezuela",
    "AF" : "Afghanistan",
    "IQ" : "Iraq",
    "IS" : "Iceland",
    "IR" : "Iran",
    "AM" : "Armenia",
    "IT" : "Italy",
    "VN" : "Vietnam",
    "AR" : "Argentina",
    "AU" : "Australia",
    "IL" : "Israel",
    "IN" : "India",
    "TZ" : "Tanzania",
    "AZ" : "Azerbaijan",
    "IE" : "Ireland",
    "ID" : "Indonesia",
    "UA" : "Ukraine",
    "QA" : "Qatar",
    "MZ" : "Mozambique"
}

const IndianStateNames = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
]


const SiteHeader = {
    logo: '/assets/images/qrcodechimp-icon.svg',
    logoClass: '',
    init: function () {
        SiteHeader.checkAndUpdateHeader()
        // SiteHeader.insertHeader()
    },
    checkAndUpdateHeader: function () {
        if (isUserLoggedIn()) {
            $("#nav_dashboard_link").removeClass("d-none")
            $(".user_profile_header").addClass("loggedIn")
            $(".user_profile_header .user_profile_icon").html(SiteHeader.getUserProfileIconHtml())
        } else {
            $(".user_profile_header").removeClass("loggedIn")
            $("#nav_dashboard_link").addClass("d-none")
        }
    },
    checkAndUpdateClassName: function () {
        if (extractDataFromArray(__sidebar_enabled_pages, [page], 0)) {
            $("#page_header").addClass("bg-white")
            SiteHeader.logoClass = "d-none"
        } else {
            $("#page_header").removeClass("bg-white")
            SiteHeader.logoClass = ""
        }
        SiteHeader.logo = '/assets/images/qrcode-chimp.svg';
    },
    insertHeader: function () {
        $("#page_header").html(`<div class="p-0">
        <nav class="navbar navbar-expand-md justify-content-between">
        <div>
            <a id="sidebarCollapse" class="`+ SiteHeader.isSidebarOpened() + ` header_nav_icon d-none"></a>
            <a class="navbar-brand" ><img alt="Qr Code Chimp Logo" loading="lazy" class="qr_code_logo_click `+ SiteHeader.logoClass + `" src="` + SiteHeader.logo + `" ></a>
            </div>
            <div class=" ml-auto ">
                <ul class="navbar-nav chimp_header mb-1 mr-4">
                    `+ SiteHeader.getHeaderNavListHTML() + `
                </ul>
            </div>
            `+ SiteHeader.getUserProfileHtml() + `
        </nav>
    </div>`)

    },
    isSidebarOpened: function () {
        // Add logic to check cookie and return icon class name either icon-cross or icon-menu
        return 'icon-cross'
    },
    getHeaderNavListHTML: function () {
        return `<li class="nav-item ` + (page == 'url' ? 'active' : '') + `">
                    <a class="nav-link" href="/">QR Code Generator</a>
                </li>
                <li class="nav-item ` + (page == 'createTemplate' ? 'active' : '') + `">
                    <a class="nav-link" href="/qr-code-services">Services</a>
                </li>
                <li class="nav-item ` + (isUserLoggedIn() ? '' : "d-none") + ' ' + (page == 'dashboard' ? 'active' : '') + `" id="nav_dashboard_link" >
                    <a class="nav-link" href="/user/dashboard">Dashboard</a>
                </li>
                <li class="nav-item `+ (page == 'pricing' ? 'active' : '') + `">
                    <a class="nav-link" href="/pricing">Pricing</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/articles">Articles</a>
                </li>
                <li class="nav-item `+ (page == 'faq' ? 'active' : '') + `">
                    <a class="nav-link" href="/qr-codes-faq">FAQs</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/contact-us">Contact Us</a>
                </li>`
    },
    getUserProfileHtml: function () {
        let fname = '', pro_pic = '', sub_account_rec = [];
        if (isUserLoggedIn()) {
            fname = extractDataFromArray(user_info, ['fname'], '');
            pro_pic = extractDataFromArray(user_info, ['user_img'], "/assets/images/profile_pic.svg");
            sub_account_rec = extractDataFromArray(user_info, ['sub_account_rec'], [])
            if (!empty(sub_account_rec)) {
                fname = extractDataFromArray(sub_account_rec, ['name'], '').split(' ')[0]
            }
        }
        return `<div class="user_profile_header ` + (page == 'signin' ? 'd-none' : '') + ` ` + (isUserLoggedIn() ? "loggedIn" : "") + `">
                    <div class="collapse navbar-collapse login_signup" id="navbarCollapse">
                        <div class="navbar-nav mr-auto">
                            
                        </div>
                        <div class="form-inline mt-2 mt-md-0">
                            <button class="btn btn-outline-primary mr-2 pl-4 pr-4" data-toggle="modal"
                            data-target="#signup-free">Sign In</button>
                            <button class="btn btn-primary  my-sm-0 pl-4 pr-4" data-toggle="modal"
                            data-target="#signup-free">Sign Up</button>
                        </div>
                    </div>
                    <div class="ml-auto user_profile_icon">
                        <div class="navbar_notification easin mr-2 d-none "><i class="icon-notification"></i></div>
                        <div class=" easin dropdown" >
                            <button class="dropdown-toggle navbar_profile_pic" id="user_profile_dropdown" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false" style="background-image:url(`+ pro_pic + `)" ></button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="user_profile_dropdown">
                                <h6 class="dropdown-header border-bottom">`+ fname + `</h6>
                                <a class="dropdown-item ` + (!empty(sub_account_rec) ? 'd-none' : '') + `" href="/user/settings?s=profile" id="subaccount_nav_dropdown_link">Profile</a>
                                <a class="dropdown-item d-none" href="/user/setting">Setting</a>
                                <div class="dropdown-item" href="" onclick="logout()">Sign Out</div>
                            </div>
                        </div>
                    </div>
                </div>`
    },
    getUserProfileIconHtml: function () {
        let fname = '', pro_pic = '', sub_account_rec = [];
        if (isUserLoggedIn()) {
            fname = extractDataFromArray(user_info, ['fname'], '');
            pro_pic = extractDataFromArray(user_info, ['user_img'], "/assets/images/profile_pic.svg");
            sub_account_rec = extractDataFromArray(user_info, ['sub_account_rec'], [])
            if (!empty(sub_account_rec)) {
                fname = extractDataFromArray(sub_account_rec, ['name'], '').split(' ')[0]
            }
        }
        return `<div class="navbar_notification easin mr-2 d-none "><i class="icon-notification"></i></div>
                <div class=" easin dropdown" >
                    <button class="dropdown-toggle navbar_profile_pic" id="user_profile_dropdown" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false" style="background-image:url(`+ pro_pic + `)" ></button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="user_profile_dropdown">
                        <h6 class="dropdown-header border-bottom">`+ fname + `</h6>
                        <a class="dropdown-item ` + (!empty(sub_account_rec) ? 'd-none' : '') + `" href="/user/settings?s=profile" id="subaccount_nav_dropdown_link">Profile</a>
                        <a class="dropdown-item d-none" href="/user/setting">Setting</a>
                        <div class="dropdown-item" href="" onclick="logout()">Sign Out</div>
                    </div>
                </div>`
    }

}

function formUPIurl(data) {
    let upi_url = 'upi://pay?'

    const vpa = extractDataFromArray(data, ['vpa'], '');
    if (!empty(vpa)) {
        upi_url += 'pa=' + vpa + '&'
    }

    const payee = extractDataFromArray(data, ['payee'], '');
    if (!empty(payee)) {
        upi_url += 'pn=' + payee + '&'
    }

    const amount = extractDataFromArray(data, ['amount'], '');
    if (!empty(amount)) {
        upi_url += 'am=' + amount + '&'
    }

    const currency = extractDataFromArray(data, ['currency'], '');
    if (!empty(currency)) {
        upi_url += 'cu=' + currency + '&'
    }

    const remark = extractDataFromArray(data, ['remark'], '');
    if (!empty(remark)) {
        upi_url += 'tn=' + remark + '&'
    }

    if (upi_url.indexOf('&') == upi_url.length - 1) {
        upi_url = upi_url.substr(0, upi_url.length - 1)
    }
    return upi_url

}

function isComponentBasedUI(qr_type = '') {
    qr_type = empty(qr_type) ? page : qr_type;
    return typeof __template_categories !== "undefined" && extractDataFromArray(__template_categories, [qr_type, 'component_based'], 0);
}