const _plan_label = {
    'FR': 'FREE',
    'ST': 'STARTER',
    'PF': 'PRO',
    'UL': 'ULTIMA',
    'ULx2': 'ULTIMA X@',

}

const _plan_popup = {

    config: {
        'scan_limit_near': {
            'upgrade_modal_left_img': '/assets/images/popup/upgrade_image_2.png',
            'header': 'Your Dynamic QR codes limit is ending, upgrade your plan today to unlock more features!'
        },
        'scan_limit_reached': {
            'upgrade_modal_left_img': '/assets/images/popup/upgrade_image_5.png',
            'header': 'Your Dynamic QR codes limit is over, upgrade your plan today to unlock more features!'
        },
        'code_limit_near': {
            'upgrade_modal_left_img': '/assets/images/popup/upgrade_image_1.png',
            'header': 'Your Dynamic QR codes limit is ending, upgrade your plan today to unlock more features!'
        },
        'code_limit_reached': {
            'upgrade_modal_left_img': '/assets/images/popup/upgrade_image_4.png',
            'header': 'Your Dynamic QR codes limit is over, upgrade your plan today to unlock more features!'
        },
        'upgrade_statistics': {
            'upgrade_modal_left_img': '/assets/images/popup/upgrade_image_3.png',
            'header': 'Get advanced QR code Statistics, upgrade your plan today to unlock more features!'
        }
    },
    showModal: function (modal_type = 'scan_limit_near') {
        if (document.getElementById('upgrade_custom_modal') == null) {
            $('body').append(` <div class="modal cstm_modal  fade upgrade_custom_modal" id="upgrade_custom_modal">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <!-- Modal body -->
                                            <div class="modal-body text-center">
                                                <div class="close_btn" data-dismiss="modal">&times;</div>
                                                <div class="row justify-content-end">
                                                    
                                                    <div class="col-7 order-md-2">
                                                        <div class="cstm_form_content upgrade_box_wrapper">
                                                            <h3 class="upgrade_popup_title">Your Dynamic QR codes limit is ending, upgrade your plan today to unlock more features! </h3>
                                                            <div class="row equal">
                                                                <div class="col p-2">
                                                                    <div class="upgrade_box wd_card_3 p-4">
                                                                        Your Plan<br/>
                                                                        <strong class="current_user_plan">FREE</strong>
                                                                    </div>
                                                                </div>
                                                                <div class="col p-2">
                                                                    <div class="upgrade_box plan_info_text wd_card_2 p-4">
                                                                       
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row mt-4">
                                                                <div class="col p-2">
                                                                    <a href="/pricing" class="btn btn-primary btn-dark  py-2 btn-block">Upgrade Now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-5 mt-4 cstm_modal_left_img order-md-1 text-center">
                                                        <img class="img-fluid upgrade_modal_left_img" src="/assets/images/popup/upgrade_image_1.png"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`)
        }

        $("#upgrade_custom_modal .upgrade_modal_left_img").attr('src', _plan_popup.config[modal_type].upgrade_modal_left_img)
        $("#upgrade_custom_modal .upgrade_popup_title").text(_plan_popup.config[modal_type].header)
        $("#upgrade_custom_modal .current_user_plan").text(extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR'), 'LABEL']))
        $("#upgrade_custom_modal .plan_info_text").html(_plan_popup.getPlanStats(modal_type.split('_')[0]))
        $("#upgrade_custom_modal").modal('show')
    },

    getPlanStats: function (type) {
        switch (type) {
            case 'scan':
                return 'Usage Alert<br/><strong>' + extractDataFromArray(user_info, ['scan_count', ((new Date()).getMonth() + 1) + '' + ((new Date()).getFullYear())], 0) + '/' + extractDataFromArray(__plan_info, [user_info.plan_info.plan, 'MAX_SCAN'], 10) + '</strong><br/>QR scans are used'
            case 'code':
                return 'Usage Alert<br/><strong>' + extractDataFromArray(user_info, ['active_dynamic_codes'], 0) + '/' + extractDataFromArray(__plan_info, [user_info.plan_info.plan, 'DYNAMIC_QR'], 10) + '</strong><br/>QR codes are used'
            case 'statistics':
                return value;
        }
    },
    checkPlanStatus: function () {
        if (typeof user_info != 'undefined') {
            if (typeof __plan_info == "undefined") __plan_info = {};
            const max_scans = extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR'), 'MAX_SCAN'], 1000);
            const max_dynamic_codes = extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR'), 'DYNAMIC_QR'], 10);
            if (user_info['active_dynamic_codes'] == max_dynamic_codes && max_dynamic_codes != -1) {
                _plan_popup.showModal('code_limit_reached')
            } else if (user_info['active_dynamic_codes'] >= (max_dynamic_codes * 0.8) && max_dynamic_codes != -1) {
                _plan_popup.showModal('code_limit_near')
            } else if (extractDataFromArray(user_info, ['scan_count', ((new Date()).getMonth() + 1) + '' + ((new Date()).getFullYear())], 0) == max_scans && max_scans != -1) {
                _plan_popup.showModal('code_limit_reached')
            } else if (extractDataFromArray(user_info, ['scan_count', ((new Date()).getMonth() + 1) + '' + ((new Date()).getFullYear())], 0) >= (max_scans * 0.8) && max_scans != -1) {
                _plan_popup.showModal('code_limit_near')
            }
        }
    }
}

const _successPopup = {
    init: function () {
        if (document.getElementById('success_code_popup') == null) {
            $('body').append(` <div class="modal fade" id="success_code_popup">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                             <div class="modal-header">
                                                <h5 class="modal-title d-block w-100" id="exampleModalLabel">Success</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <!-- Modal body -->
                                            <div class="modal-body">
                                                <div class="row justify-content-center">
                                                    <span class="text-success">Your QR Code saved successfully!</span>
                                                </div>
                                            </div>
                                            <div class="modal-footer d-flex justify-content-between">
                                                <button type="button" class="btn btn-outline-secondary " data-dismiss="modal">Close</button>
                                                <a href="/user/dashboard" class="btn btn-primary">Go to Dashboard</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>`)
        }
    },
    showModal: function () {
        _successPopup.init()
        $("#success_code_popup").modal('show')
    }
}

const _checkOutPopup = {
    _choosen: null,
    callback: null,
    auto_renewal: true,
    init: function (api = 0) {
        if (document.getElementById('checkout_popup') == null) {
            $('body').append(` <div class="modal fade" id="checkout_popup">
                                    <div class="modal-dialog modal-lg modal-dialog-centered">
                                        <div class="modal-content">
                                             <div class="modal-header">
                                                <h5 class="text-center modal-title d-block w-100" id="exampleModalLabel">Please verify the purchase details to proceed for the payment</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <!-- Modal body -->
                                            <div class="modal-body p-5">
                                                <div class="row pb-4">
                                                    <div class="col-md-4">
                                                        <span class="">Package Name</span>
                                                        <h4 class="font-weight-semibold mt-2" id="ch_plan_label">PRO</h4>
                                                    </div>
                                                    <div class="col-md-8">
                                                        <div class="row">
                                                            <div class="col-md-8">
                                                                <span class="font-12">Payment Plan</span>
                                                                <select id="ch_plan_dropdown" class="form-control mt-2" `+(_checkOutPopup.disable_select?'disabled':'')+`>
                                                                    <option>For a year</option>
                                                                </select>
                                                            </div>
                                                            <div class="col-md-4 text-right ">
                                                                <span class="font-12">Amount</span>
                                                                <h4 class="font-weight-semibold mt-3 ch_total_amount">$9.99</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                                <div class="row border-top pt-4">
                                                    <div class="col-md-4">

                                                    </div>
                                                    <div class="col-md-8">
                                                        <div class="row mb-4">
                                                            <div class="col-md-8">
                                                                <div class="font-weight-semibold font-14 mb-2">Auto Renewal</div>
                                                                <div class="text-muted">Automatically charge the card to renew subscription</div>
                                                            </div>
                                                            <div class="col-md-4 p-2 pr-3 text-right">
                                                                <label class="switch">
                                                                    <input type="checkbox" id="auto_renewal" checked>
                                                                    <span class="slider round"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="row border-top total_wrapper">
                                                            <div class="col-md-6">
                                                                <span class="font-weight-semibold ch_total_text">Total</span>
                                                            </div>
                                                            <div class="col-md-6">
                                                                <h4 class="font-weight-semibold mt-2 ch_total_amount">$9.99</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer border-0 d-flex justify-content-end modal-footer pb-5 pr-5">
                                                <button type="button" class="btn btn-primary" id="ch_proceed_btn">Proceed for Payment</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>`)
            $("#ch_proceed_btn").on("click", function (e) {
                // TODO:: restrict period change from Yearly to monthly
                $("#checkout_popup").modal('hide')
                _checkOutPopup.callback(_checkOutPopup.plan, _checkOutPopup.period, $("#auto_renewal").prop("checked") ? 1 : 0)
            })
        }

        $("#ch_plan_label").text(api?'API':extractDataFromArray(__plan_info, [_checkOutPopup.plan, 'LABEL']))

        $("#ch_plan_dropdown").html('')
        $("#ch_plan_dropdown").append('<option value="MONTHLY" ' + (_checkOutPopup.period == 'MONTHLY' ? 'selected' : '') + '>For a Month</option>')
        $("#ch_plan_dropdown").append('<option value="YEARLY" ' + (_checkOutPopup.period == 'YEARLY' ? 'selected' : '') + '>For a Year (with 30% Discount)</option>')
        // $("#auto_renewal").prop("checked", _checkOutPopup.period == 'MONTHLY')
        $("#ch_plan_dropdown").off("change").on("change", function (e) {
            _checkOutPopup.period = e.target.value
            _checkOutPopup.updatePlanPrice()
        })

        _checkOutPopup.updatePlanPrice()



    },
    updatePlanPrice: function () {
        if (_checkOutPopup.period == 'MONTHLY') {
            $("#checkout_popup .ch_total_amount").text('$' + _checkOutPopup.plan_data.month)
        } else {
            $("#checkout_popup .ch_total_amount").html('$' + (_checkOutPopup.plan_data.year * 12).toFixed(2) + `<br/><span style="font-size:12px;font-weight:normal;" class="text-muted">($${_checkOutPopup.plan_data.year} x 12 months)</span>`)
        }
    },
    showModal: function (plan, period, callback) {
        _checkOutPopup.callback = callback
        _checkOutPopup.plan = plan
        _checkOutPopup.period = period

        if ($(".mypricing_content[data-plan=" + _checkOutPopup.plan + "]").length > 0) {
            const parent_container = $(".mypricing_content[data-plan=" + _checkOutPopup.plan + "]");
            _checkOutPopup.plan_data = parent_container.find(".mypricing_price_tag .currency").data()
        } else {
            _checkOutPopup.plan_data = _checkOutPopup._choosen.data()
        }

        _checkOutPopup.init()
        $("#checkout_popup").modal('show')
    },
    showModalForAPI: function (plan, period, callback) {
        _checkOutPopup.callback = callback
        _checkOutPopup.plan = plan
        _checkOutPopup.period = period

        _checkOutPopup.plan_data = {
            month : 9.99,
            year : 6.99,
            plan : 'API'
        }

        _checkOutPopup.init(1)
        $("#checkout_popup").modal('show')
    }
}

const _designEditConfirmPopup = {
    init: function () {
        if (document.getElementById('design_edit_confirm_popup') == null) {
            $('body').append(` <div class="modal fade" id="design_edit_confirm_popup">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                             <div class="modal-header d-none">
                                                <h5 class="modal-title d-block w-100" id="exampleModalLabel">Success</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </div>
                                            <!-- Modal body -->
                                            <div class="modal-body">
                                                <div class="row justify-content-center">
                                                    <span class="py-4">Do you want to save the changes?</span>
                                                </div>
                                            </div>
                                            <div class="modal-footer d-flex justify-content-between">
                                                <button type="button" class="btn btn-outline-secondary " data-dismiss="modal">Discard</button>
                                                <button type="button" class="btn btn-primary" id="btn_design_edit_confirm">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`)
            $("#btn_design_edit_confirm").on("click", function (e) {
                saveQROptions();
            })
        }
    },
    showModal: function () {
        _designEditConfirmPopup.init()
        $("#design_edit_confirm_popup").modal('show')
    }
}

const DownloadQRCode = {
    _clickFrom: false,
    show: function () {
        $("#desgin_qrcode_modal").modal('hide')
        if (page == 'dashboard' || page == 'qr-gifts' || page == 'bulkUpload' || page == 'folders' || page == 'stats' || page == 'folder-details' || !empty(extractDataFromArray(__savedQrCodeParams, ['id'], null))) {
            DownloadQRCode.download()
            return
        }
        DownloadQRCode._clickFrom = true;
        saveQRCode()
    },
    download: function () {
        Swal.fire({
            width: '50rem',
            title: 'Download QR Codes',
            html: `<div class="row mt-4">
                        <div class="col-md-3">
                            <div class="text-left">File format</div>
                        </div>
                        <div class="col-md-1">:</div>
                        <div class="col-md-8">
                            <ul class="nav nav-pills dwld_file_type" >
                                <li class="nav-item">
                                    <a class="nav-link border active" href="#!" data-type="png">PNG</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link border " href="#!" data-type="pdf">PDF</a>
                                </li>
                                <li class="nav-item `+ (extractDataFromArray(user_info, ['svg_download'], false) ? '' : 'd-none') + `">
                                    <a class="nav-link border " href="#!" data-type="svg">SVG</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="row my-4 qr_svg_alert" style="display:none;">
                        <div class="col-md-3">
                            <div class="text-left"></div>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-8 text-left text-danger font-16">
                            <i class="icon-information mr-2 text-danger"></i>SVGs will work in Chrome browser, please print from Chrome. May not work in Illustrator and other image viewers.
                        </div>
                    </div>
                    <div class="row my-4 qr_download_size">
                        <div class="col-md-3">
                            <div class="text-left">QR Size</div>
                        </div>
                        <div class="col-md-1">:</div>
                        <div class="col-md-8">
                            <ul class="nav nav-pills border dwld_qr_size" style="width:fit-content">
                                <li class="nav-item">
                                    <a class="nav-link" href="#!" data-file_size="256">256px</a>
                                </li>
                                <li class="nav-item border">
                                    <a class="nav-link" href="#!" data-file_size="512">512px</a>
                                </li>
                                <li class="nav-item border ">
                                    <a class="nav-link active" href="#!" data-file_size="1024">1024px</a>
                                </li>
                                <li class="nav-item border">
                                    <a class="nav-link" href="#!" data-file_size="2048">2048px</a>
                                </li>
                                <li class="nav-item border">
                                    <a class="nav-link" href="#!" data-file_size="4096">4K</a>
                                </li>
                                <!-- li class="nav-item border">
                                    <a class="nav-link" href="#!" data-file_size="8192">8K</a>
                                </li -->
                            </ul>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col-md-4"></div>
                        <div class="col-md-8">
                            <div class="custom-control custom-checkbox dwld_inc_name" style="width:200px;" >
                                <input type="checkbox" class="custom-control-input" id="dwld_inc_name_check">
                                <label class="custom-control-label" for="dwld_inc_name_check">Add name below QR</label>
                            </div>
                        </div>
                    </div>`,
            confirmButtonText: 'Download',
            showCancelButton: true,
            reverseButtons: true,
            showCloseButton: true,
            // returnFocus: false,
            willOpen: function () {
                $(document).on("click", ".dwld_file_type li", function (e) {
                    e.preventDefault()
                    $(".dwld_file_type li a").removeClass("active")
                    $(this).find('a').addClass('active')
                    // debugger
                    if ($(this).find('a').data('type') != 'svg') {
                        $(".qr_download_size").show()
                        $(".qr_svg_alert").hide()
                        $(".dwld_inc_name").show()
                    } else {
                        $(".qr_download_size").hide()
                        $(".qr_svg_alert").show()
                        $(".dwld_inc_name").show()
                    }
                })
                $(document).on("click", ".dwld_qr_size li", function (e) {
                    e.preventDefault()
                    $(".dwld_qr_size li a").removeClass("active")
                    $(this).find('a').addClass('active')
                })
            }

        }).then(result => {
            if (result.isConfirmed) {
                var name = '';
                if (page == 'dashboard') {
                    name = selectedData.name;
                } else if (page == 'folder-details' && typeof __JsonPageData != 'undefined' && extractDataFromArray(__JsonPageData, ['folder_data', 'folder_type']) == 'qr' && empty(selectedData.folder_name)) {
                    name = selectedData.name;
                } else if (page == 'folder-details' && typeof __JsonPageData != 'undefined' && extractDataFromArray(__JsonPageData, ['folder_data', 'folder_type']) == 'bulk' && empty(selectedData.folder_name)){
                    name = selectedData.name;
                    BulkUpload.file_size = parseInt($(".dwld_qr_size li a.active").data('file_size'))
                    BulkUpload.file_format = $(".dwld_file_type li a.active").data('type')
                    BulkUpload.include_name = $("#dwld_inc_name_check").prop('checked')
                    BulkUpload.downloadQRCodes()
                    return
                } else if (page == 'bulkUpload') {
                    name = selectedData.name;
                    if (!getUrlParameterByName('id')) {
                        BulkUpload.file_size = parseInt($(".dwld_qr_size li a.active").data('file_size'))
                        BulkUpload.file_format = $(".dwld_file_type li a.active").data('type')
                        BulkUpload.include_name = $("#dwld_inc_name_check").prop('checked')
                        BulkUpload.downloadQRCodes()
                        return
                    }
                } else if (page == 'qr-gifts') {
                    name = selectedData.name;
                    QRCodesGiftsDataTable.downloadQRCodes(selectedData['_id'], selectedData['name'], parseInt($(".dwld_qr_size li a.active").data('file_size')), $(".dwld_file_type li a.active").data('type'), $("#dwld_inc_name_check").prop('checked'));
                    return
                } else if ((page == 'folders' || page == 'folder-details') && !empty(selectedData.folder_name)) {
                    // folder_file_size = parseInt($(".dwld_qr_size li a.active").data('file_size'))
                    // folder_file_format = $(".dwld_file_type li a.active").data('type')
                    // folder_include_name = $("#dwld_inc_name_check").prop('checked')
                    // DownloadFolder.downloadFolderQRCodes()
                    name = selectedData.folder_name;
                    BulkUpload.file_size = parseInt($(".dwld_qr_size li a.active").data('file_size'))
                    BulkUpload.file_format = $(".dwld_file_type li a.active").data('type')
                    BulkUpload.include_name = $("#dwld_inc_name_check").prop('checked')
                    BulkUpload.downloadFolderQRCodes()
                    return
                } else {
                    name = extractDataFromArray(__savedQrCodeParams, ['template_name'], '')
                }
                downloadImage(parseInt($(".dwld_qr_size li a.active").data('file_size')), name, $(".dwld_file_type li a.active").data('type'), $("#dwld_inc_name_check").prop('checked'))
            }
            DownloadQRCode._clickFrom = false;
            hideLoader()
        })
    }
}

const BillingInfo = {
    getCountryDropdown: function (country = '') {
        let options = '';
        let option_selected = false;
        Object.keys(countryCodeToName).forEach(country_code => {
            let selected = '';
            if (country == country_code) {
                option_selected = true;
                selected = 'selected';
            }
            options += '<option value="' + country_code + '" ' + selected + '>' + countryCodeToName[country_code] + '</option>';
        })
        options = '<option value="" disabled ' + (option_selected ? '' : 'selected') + '>Select a country</option>' + options
        return options;
    },
    getBillingInfosForm: function () {
        let line1 = extractDataFromArray(user_info, ['billing_info', 'line1'], extractDataFromArray(user_info, ['billing_info', 'address'], ''))
        let line2 = extractDataFromArray(user_info, ['billing_info', 'line2'], '');
        let city = extractDataFromArray(user_info, ['billing_info', 'city'], '');
        let state = extractDataFromArray(user_info, ['billing_info', 'state'], '');
        let country = extractDataFromArray(user_info, ['billing_info', 'country'], extractDataFromArray(user_info, ['ip', 'country'], ''));
        let postal_code = extractDataFromArray(user_info, ['billing_info', 'postal_code'], '');
        let gst_pin = extractDataFromArray(user_info, ['billing_info', 'gstpin'], '');
        country = country == 'UK' ? 'GB' : country;
        return `<div class="billing_info_form row ` + (page == 'pricing' ? 'mx-0 mt-4' : '') + `">
                    <div class="col-md-12 font-16 font-weight-semibold mb-2">Billing Address</div>
                    <div class="col-md-12 mb-2">
                        <label>Country</label>
                        <select type="text" class="form-control select2" id="billing_info_country" value="`+ country + `" placeholder="Country" errormsg="Country is empty.">
                            `+ BillingInfo.getCountryDropdown(country) + `
                        </select>
                    </div>
                    <div class="col-md-12">
                        <label>Street Address</label>
                        <input type="text" class="form-control" id="billing_info_line1" value="`+ line1 + `" placeholder="Line 1"  errormsg="Address is empty.">
                    </div>
                    <div class="col-md-6">
                        <label>City</label>
                        <input type="text" class="form-control" id="billing_info_city" value="`+ city + `" placeholder="City">
                    </div>
                    <div class="col-md-6">
                        <label>State</label>
                        <input type="text" class="form-control" id="billing_info_state" value="`+ state + `" placeholder="State">
                    </div>
                    <div class="col-md-6">
                        <label>Zip</label>
                        <input type="text" class="form-control" id="billing_info_postal_code" value="`+ postal_code + `" placeholder="Zip"  errormsg="Zipcode is empty.">
                    </div>
                    `+ (page == 'pricing' ? `<div class="col-md-6 ">
                                                <label>Phone Number</label>
                                                <input type="text" class="form-control" id="billing_info_phone" value="" placeholder="Phone"  errormsg="Phone is empty.">
                                            </div>` : '') + `  
                    `+ (page == 'settings' ? `
                    <div class="col-md-6 billing_info_gst_pin_wrapper" style="` + (country != 'IN' ? 'display:none;' : '') + `">
                        <label>GST PIN</label>
                        <input type="text" class="form-control" id="billing_info_gst_pin" value="`+ gst_pin + `" placeholder="Optional">
                    </div>` : '') + `  
                    
                </div>`
    },
    listeners: function () {
        $("#billing_info_country").off().on("change", function (e) {
            if (e.target.value == 'IN') {
                $(".billing_info_gst_pin_wrapper").show()
            } else {
                $(".billing_info_gst_pin_wrapper").hide()
            }
        })
        $("#billing_info_country").select2()
    },
    inputValidations: function () {
        $(".billing_info_form input").off("input").on("input", function (e) {
            if (e.target.value.trim() == '') {
                showInputInvalid("#" + e.target.id)
            } else {
                hideInputInvalid("#" + e.target.id)
            }
        })
    },
    getFormData: function () {
        let address = {}
        Array.from($(".billing_info_form input")).forEach(ele => {
            if (ele.value.trim() == '' && ele.getAttribute('errormsg')) {
                showInputInvalid("#" + ele.id)
            } else {
                address[ele.id.replace('billing_info_', '')] = ele.value.trim()
            }
        })
        if ($(".invalid-input-alert").length == 0) {
            address['country'] = $("#billing_info_country").val()
        } else {
            address = false
        }
        return address
    }

}


window.addEventListener("load", function (event) {
    if (page == 'createTemplate') {
        _plan_popup.checkPlanStatus()
    }
});

function showInputInvalid(selector) {
    if (!$(selector).next().hasClass("invalid-input-alert") && $(selector).attr('errormsg')) {
        let message = $(selector).attr('errormsg')
        $(selector).addClass("invalid-input")
        $('<span class="invalid-input-alert">' + message + '</span>').insertAfter($(selector))
    }
}

function hideInputInvalid(selector) {
    $(selector).removeClass("invalid-input")
    if ($(selector).next().hasClass("invalid-input-alert")) {
        $(selector).next().remove()
    }
}