$(document).ready(function () {
    if (typeof __faq != "undefined")
        __faq.init()
    if (typeof __page_settings != "undefined")
        __page_settings.init()
    if (typeof __help_info != "undefined")
        __help_info.init();
    $(".open_design_code_popup").on("click", function (e) {
        if (amILoggedIn() || ++TotalClicksAllowedCounter <= 5) {
            $($(this).data('target')).click()
            $("#desgin_qrcode_modal").modal("show")
        } else {
            $("#signup-free").modal("show")
        }
    })

    if (!amILoggedIn()) {
        $("#bulk_upload_switch").on("click", function (e) {
            if (!amILoggedIn()) {
                __signup_trigger_from = "bulk_upload_switch"
                $("#signup-free").modal("show");
                return
            }
        });
    }

    if ((getUrlParameterByName('bulk') != null && page != 'createTemplate') || page == 'bulkUpload') {
        BulkUpload.showPurchasePlanPopup()
    }

    PopulateSelectFolderSectionForQR.init()

    if ($("input[name=short_url]").length == 1) {
        if (typeof __savedQrCodeOptions != "undefined" && __savedQrCodeOptions != null) {
            _qrOptions = __savedQrCodeOptions;
        } else if (typeof __savedQrCodeParams != "undefined" && __savedQrCodeParams != null) {
            qrCodeParams = __savedQrCodeParams
            if (qrCodeParams.logoImage != undefined) {
                var img = new Image()
                var img_src = qrCodeParams.logoImage
                qrCodeParams.logoImage = img
                img.onload = () => {
                    if (qrCodeParams.backgroundImage != undefined) {
                        var bg_img = new Image()
                        var img_src = qrCodeParams.backgroundImage
                        qrCodeParams.backgroundImage = bg_img
                        bg_img.onload = () => {
                            require(['/assets/js/chimpqr'], function (ChimpQR) {
                                //console.log(ChimpQR);
                                ChimpQR.create(qrCodeParams);
                            }
                            );

                        };
                        bg_img.src = img_src
                    } else {
                        require(['/assets/js/chimpqr'], function (ChimpQR) {
                            //console.log(ChimpQR);
                            ChimpQR.create(qrCodeParams);
                        }
                        );

                    }
                };
                img.src = img_src
            } else if (qrCodeParams.backgroundImage != undefined) {
                var bg_img = new Image()
                var img_src = qrCodeParams.backgroundImage
                qrCodeParams.backgroundImage = bg_img
                bg_img.onload = () => {
                    require(['/assets/js/chimpqr'], function (ChimpQR) {
                        //console.log(ChimpQR);
                        ChimpQR.create(qrCodeParams);
                    }
                    );

                };
                bg_img.src = img_src
            } else {
                generate()

            }
        } else {
            // qrCodeParams.text = 'http://'+__short_url_domain+'/' + $("input[name=short_url]").val();
            // generate()
        }


    }
    $(".js_qr_preview_btn").on("click", function () {
        $(".qr_page_preview").toggleClass("d-none");
        $(".qr_page_code_preview").toggleClass("d-none");
        if ($(this).data("type") == "qr") {
            $(this).data("type", "pr");
            $(".js_qr_preview_btn i").attr('class', 'icon-mobile ml-2');
            $(".js_qr_preview_btn span").text('Page');
            $(".qr_page_pre_more").hide();
        }
        else {
            $(this).data("type", "qr");
            $(".js_qr_preview_btn i").attr('class', 'icon-qrcode ml-2');
            $(".js_qr_preview_btn span").text('QR Code');
        }

    })

    $(".js_qr_page_more").on("click", function () {
        $(".qr_page_pre_more").show();
    })

    $(".qr_page_pre_more button").on("click", function () {
        $(".qr_page_pre_more").hide();
    })


    $('.backbtn_qrcodetype').on('click', function (e) {
        e.stopImmediatePropagation()
        setTimeout(function () {
            window.history.back();
        }, 100)

    })

    $(".qr_file_upload").on("click", function (e) {
        if (amILoggedIn()) {
            let max_limit = extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR'), 'DYNAMIC_QR'], 10);
            max_limit = Math.ceil(max_limit * 1.2)
            if ($(this).parents("ul").children(".uploaded_bg_image").length <= max_limit) {
                ImageUploader.ele = this
                ImageUploader.type = $(this).parents("ul").data('type')
                if (ImageUploader.type == undefined) {
                    ImageUploader.type = "ga"
                }
                $(this).parents("ul").children(".image_uploader").click()
            } else {
                SwalPopup.showSingleButtonPopup({
                    icon: 'warning',
                    text: 'Max no of images allowed : ' + max_limit + '.'
                })
            }
        }
        else {
            $("#signup-free").modal("show")
        }
    })

    $('#folderTab .nav-item').on('click', function (e) {
        let type = $(this).data('type').split("_")[0];
        if (typeof __JsonPageData == "undefined") __JsonPageData = null;
        let user_plan = extractDataFromArray(__JsonPageData, ['user_plan', 'PLAN']) ? extractDataFromArray(__JsonPageData, ['user_plan', 'PLAN']) : extractDataFromArray(__JsonPageData, ['data', 'user_plan', 'PLAN']);
        if (page != 'folders') {
            if (type == 'bulk' && (user_plan == 'ST' || user_plan == 'FR')) {
                BulkUpload.showPurchasePlanPopup();
                $('#bulk_folder_tab').removeClass('active')
                $('#qr_folder_tab').addClass('active')
            } else {
                window.location.href = '/user/folders?folder_type=' + type;
            }
        } else {
            window.history.replaceState(null, null, location.origin + location.pathname + "?folder_type=" + type);
        }
    });

    $('select[name=folder-select-for-qr]').change(function () {
        if ($(this).val() == 'create-new-folder') {
            if (typeof __JsonPageData != 'undefined' && __JsonPageData['qr_count'] >= __JsonPageData['folder_limit']) {
                showFolderLimitPopUp('QR', __JsonPageData['user_plan'], __JsonPageData['required_plan'], __JsonPageData['folder_limit']);
                $('select[name=folder-select-for-qr]').val('0').trigger('change');
                if (!empty(getUrlParameterByName('folder_id'))) {
                    $('select[name=folder-select-for-qr]').val(getUrlParameterByName('folder_id')).trigger('change');
                }
            } else {
                $('select[name=folder-select-for-qr]').val('0').trigger('change');
                $('#create-folder-input').css("display", "block");
            }
        } else {
            $('#create-folder-input').css("display", "none");
        }
    });

    $('.close-folder-input').on("click", function (e) {
        $("input[name=new_folder_name]").val("");
        $('#create-folder-input').css("display", "none");
    });

    $('.add-new-folder').on("click", function (e) {
        if (typeof __JsonPageData == 'undefined') __JsonPageData = {};
        let type = 'qr';
        if ($('#bulk_upload_switch').is(":checked")) {
            type = 'bulk';
        }
        let formdata = {};
        formdata["cmd"] = "createNewFolder";
        formdata["folder_name"] = $("input[name=new_folder_name]").val();
        formdata["folder_type"] = type;

        if (formdata["folder_name"] && formdata["folder_type"] && formdata["folder_name"] != 0) {
            $.post("//" + __api_domain + '/user/services/api', formdata, function (response) {
                response = parseResponse(response);
                let errorMsg = extractDataFromArray(response, ['errorMsg']);
                let errorCode = extractDataFromArray(response, ['errorCode']);
                let data = extractDataFromArray(response, ['data']);
                //    hideLoader()
                if (errorCode === 1) {
                    showToastAlert("error", "", (empty(errorMsg) ? "Something went wrong!" : errorMsg));
                    $('#create-folder-input').css("display", "none");
                } else if (errorCode === 0) {
                    //    $('#template_name_modal').modal('hide');
                    let folder_id = extractDataFromArray(data, ['_id']);
                    $("<option value='" + folder_id + "'>" + formdata["folder_name"] + "</option>").insertAfter("#folder-select option:nth-child(2)");
                    $("input[name=new_folder_name]").val("");
                    showToastAlert("success", "", "Folder created successfully.");
                    $('#create-folder-input').css("display", "none");
                    $('select[name=folder-select-for-qr]').val(data['_id']);
                    __JsonPageData[type + '_count'] = parseInt(__JsonPageData[type + '_count']) + 1;
                }
            });

        } else if (empty(formdata["folder_name"])) {
            showToastAlert("error", "", "Folder name cannot be empty.");
        }
        else { }
    });

    $(".submit_qr_code").on("click", function (e) {
        //$("#afterSaveThankyouModal").modal("show");
        //return;
        if (amILoggedIn()) {
            if (page == 'url' && location.pathname == '/' && $("input[name=dynamic]").val() != 'true') {

                Swal.fire({
                    title: 'Please Wait... Read Carefully',
                    width: 600,
                    html: `<div class="text-left my-4">
                    You are saving this QR code as static. To change any content later you will have to reprint the QR Code.
                <br><br>
                Change to dynamic to save as dynamic QR and edit the content any time, without reprinting the QR Code.
                </div>`,
                    showCancelButton: true,
                    confirmButtonText: 'Change to dynamic',
                    cancelButtonText: 'Continue as static',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        $("#dynamic").prop("checked", true)
                        $("input[name=dynamic]").val('true')
                    }
                    checkAndReGenerate()
                    saveQRCode()
                })
            } else {
                saveQRCode()
            }

        } else {
            $("#signup-free").modal("show")
            __signup_callback = true
        }
    })

    $(".save_qr_campaign").on("click", function (e) {
        showLoaderOnBlock()
        $(".campaign_name_qr_alert").addClass("d-none")
        if ($("#campaign_name_qr").val() == '') {
            $(".campaign_name_qr_alert").text("Name cannot be empty")
            $(".campaign_name_qr_alert").removeClass("d-none")
            hideLoader()
            return
        }
        if ($(".short_url_slug_input").css("display") != "none") {
            if (($("#short_url_input_popup").val()).trim() == '') {
                $(".short_url_qr_alert").text("Short url slug cannot be empty")
                $(".short_url_qr_alert").removeClass("d-none")
                hideLoader()
                return
            } else if (($("#short_url_input_popup").val()).trim().length < 5) {
                $(".short_url_qr_alert").text("Minimum 5 characters required")
                $(".short_url_qr_alert").removeClass("d-none")
                hideLoader()
                return
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

        if (!extractDataFromArray(__template_categories, [page, 'component_based'], 0)) {

            if ($("input[name=short_url]").length == 1 && !(campaignData['page'] == "url" && (campaignData['dynamic'] == '' || campaignData['dynamic'] == false))) {
                var short_url = $("input[name=short_url]").val()
            } else {
                var short_url = $("#campaign_name_qr").val()
                short_url = short_url.toLocaleLowerCase()
                short_url = short_url.replace(/ /g, '_');
            }
            campaignData['template_name'] = $("#campaign_name_qr").val()
        } else {
            $('input[name=template_name]').val($("#campaign_name_qr").val())
            QRPageComponents.saveQRCode(QRPageComponents._save_callback)
            return
        }
        // campaignData['folder_id'] = $('select[name=folder-select-for-qr]').val(); 
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
    })

    $("#campaign_name_qr").on("keyup", function (e) {
        if (e.target.value == '') {
            $(".campaign_name_qr_alert").removeClass("d-none")
            $(".campaign_name_qr_alert").text("*Field required")
        } else {
            $(".campaign_name_qr_alert").addClass("d-none")
        }
    })

    $('#desgin_qrcode_modal').on('hidden.bs.modal', function (e) {
        $(".sp-container").addClass("sp-hidden")
        if (typeof QRDesignComponents != "undefined") {
            QRDesignComponents.getWrapperHtml()
        }
        if (typeof _qrOptions != "undefined") {
            if (QrOptionsUtils.isDesignDataEdited && (location.pathname.indexOf("dashboard") > 0 || location.pathname.indexOf("bulkUpload") > 0 || location.pathname.indexOf("qr-gifts") > 0 || page == 'qr-gifts' || location.pathname.indexOf("stats") > 0) || location.pathname.indexOf("folder-details") > 0) {
                if (typeof QRCodesDataTable != "undefined" && QRCodesDataTable.newQRcodeCopy) {
                    selectedElement = $(".actions[data-id=" + QRCodesDataTable.newQRcodeCopy + "]")
                    selectedData = { _id: QRCodesDataTable.newQRcodeCopy }
                    saveQROptions()
                    return
                }
                let checkbox = '';
                let bulk_check = false;
                if (typeof __JsonPageData != 'undefined' && extractDataFromArray(__JsonPageData, ['folder_data', 'folder_type']) == 'bulk') bulk_check = true;
                if ((page == 'bulkUpload' && !getUrlParameterByName('id')) || bulk_check) {
                    checkbox = `<div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="swal-input1" checked>
                                    <label class="custom-control-label" for="swal-input1">Overwrite individually changed QR codes too</label>
                                </div> `;
                }
                Swal.fire({
                    title: 'Save QR Code changes',
                    // icon:'question',
                    html: `
                        <div class="text-left py-2">
                            <div class="mb-2">Do you want to save the changes?</div> `+ checkbox + `
                        </div>  
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Save QR Code',
                    reverseButtons: true,
                    cancelButtonText: 'Discard',
                    preConfirm: () => {
                        return { overwrite: document.getElementById('swal-input1') && document.getElementById('swal-input1').checked }
                    }
                }).then(result => {
                    if (result.isConfirmed) {
                        saveQROptions(null, result.value.overwrite);
                    }
                })
                return;
            }
        }
        if (typeof _qrOptions != "undefined") {
            saveQROptions();
            return;
        }
        var short_url = qrCodeParams.text.split('/')[qrCodeParams.text.split('/').length - 1]
        if (typeof selectedElement != "undefined" && selectedElement.parents(".card-body").find(".qrlist_link").css("opacity") == '0') {
            short_url = selectedElement.parents(".card-body").find(".qrlist_name").text()
            short_url = (short_url.replace(/ /g, '_')).toLowerCase()
        }

        if (qrCodeParams.logoImage) {
            qrCodeParams.logoImage = qrCodeParams.logoImage.src
        }

        if (qrCodeParams.backgroundImage) {
            qrCodeParams.backgroundImage = qrCodeParams.backgroundImage.src
        }
        var id = (typeof selectedElement != "undefined") ? selectedElement.parents('.qrlist_card').data('id') : $("input[name=id]").val()
        if (id == 'new') {
            return
        }
        $.post("//" + __api_domain + '/user/services/api', {
            cmd: 'saveQRparams',
            id: id,
            qrData: JSON.stringify(qrCodeParams),
        }, function (response) {
            if (!empty(response.data)) {

                getQrImageUrl(short_url, function (url) {
                    // debugger
                    if (typeof selectedElement != "undefined") {
                        selectedElement.parents('.qrlist_card').find('.qrlist_qr_prev').children().attr("src", '');
                        selectedElement.parents('.qrlist_card').find('.qrlist_qr_prev').children().attr("src", url + '?v=' + Math.floor((Math.random() * 100) + 1));
                    }
                    // setTimeout(function(){
                    //     debugger

                    // },100)

                })

            }
        })

    })

    $(".load_more_options").on("click", function (e) {
        e.preventDefault()
        e.stopImmediatePropagation()
        // if (amILoggedIn()) {
        //     location.href = '/user/createTemplate'
        // } else {
        //     $("#signup-free").modal("show")
        // }

        location.href = getMainDomain() + '/user/createTemplate'
    })

    //displayPrivacyPopup()

    /*if (readCookie('chromeExtensionButton') != 'Y' && page != 'displayPage' && isChromeBrowser() && !isMobile.any()) {
        $('body').append(`<div class="d-flex chrome_extension_btn" id="chrome_extension_btn" >
                            <div class="chrome_icon"></div>
                            <div class="d-flex flex-column pl-2">
                                <div class="d-flex align-items-center">
                                    <div class="chimp_icon mr-2"></div>
                                    <div class="font-12 font-weight-semibold">QrCodeChimp Chrome Extension</div>
                                 
                                </div>
                                <div class="extension_rating my-1">
                                    <div class="mr-2">5</div>
                                    <div class="rating_star_icon"></div>
                                    <div class="rating_star_icon"></div>
                                    <div class="rating_star_icon"></div>
                                    <div class="rating_star_icon"></div>
                                    <div class="rating_star_icon"></div>
                                </div>
                                <div class="" style="line-height:1">
                                    <span>Available in the</span>
                                    <div class="font-18 font-weight-bold">Chrome Web Store</span>
                                </div>
                            </div>
                             <a class="close_extension_btn" onclick="closeChromeExtensionButton()"></a>
                            </div>`);
    }*/


    $(".btn_copy_img_url").on("click", function (e) {
        let image = $(this).prev().find("li.active .qr_bg_image_wr").css("background-image")
        image = image.replace('url("', '')
        image = image.replace('")', '')
        if (image == "none") {
            SwalPopup.showSingleButtonPopup({
                icon: 'warning',
                text: 'Select an image to copy'
            })
            return
        }
        copyTextToClipboard(image)
    })



    $(".gntr_sticker_list_more").on("click", function (e) {
        if (amILoggedIn() || ++TotalClicksAllowedCounter <= 5) {
            $($(this).data('target')).click()
            $("#desgin_qrcode_modal").modal("show")
        } else {
            $("#signup-free").modal("show")
        }
    })

    $(".gntr_custom_link").on("click", function (e) {
        if (amILoggedIn() || ++TotalClicksAllowedCounter <= 5) {
            $($(this).data('target')).click()
            $("#desgin_qrcode_modal").modal("show")
        } else {
            $("#signup-free").modal("show")
        }
    })

    // $(".gntr_custom_link").on("click", function (e) {
    //     if (amILoggedIn()) {
    //         $("#desgin_qrcode_modal").modal("show")
    //     } else {
    //         $("#signup-free").modal("show")
    //     }
    // })

    $("#signup-free").on('shown.bs.modal', function (e) {
        $("input[name=login_type]").prop("checked", false)
        $(".signup_form input[name=name]").val('')
        $(".signup_form input[name=email]").val('')
        $(".signup_form input[name=pass]").val('')
        $(".signup_form input[name=verify_pass]").val('')
        let action = $(e.relatedTarget).data('action');
        if (typeof ClaimOpenQrcodes != "undefined" && ClaimOpenQrcodes._signin) {
            action = 'signin'
        }
        if (action == 'signin') {
            $(".signin-header").text("Please signin to continue")
            $("input[name=login_type][value=login]").prop("checked", true)
            $(".signup_block").hide()
            $("#forgot_password").show()
        } else {
            $("input[name=login_type][value=signup]").prop("checked", true)
            $(".signup_block").show()
            $("#forgot_password").hide()
        }
    });

    $(".website_urls a").attr("target", "_blank")

    $social_url_links = Array.from($(".pr_social_cards li"))
    $social_url_links.forEach(url => {
        $(url).attr("onclick", "window.open(" + ($(url).attr("onclick").split("href=")[1]) + ",'_blank')")
    })

    $("#dynamic").on("change", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $("input[name=dynamic]").val(e.target.checked)
        $("input[name=qr_type]").val(e.target.checked ? 'D' : 'S')

        if (amILoggedIn()) {
            checkAndReGenerate(e);
        } else {
            __signup_trigger_from = 'dynamic_checkbox';
            $("input[name=dynamic]").val(false);
            $("#signup-free").modal("show");
        }
    })

    $('#signup-free').on('hidden.bs.modal', function () {
        const dynamic_checkbox = $("#dynamic").length && $("#dynamic")[0].checked
        const bulkupload_checkbox = $("#bulk_upload_switch").length && $("#bulk_upload_switch").prop("checked")
        if (!amILoggedIn() && (dynamic_checkbox || bulkupload_checkbox)) {
            switch (__signup_trigger_from) {
                case "dynamic_checkbox":
                    $("#dynamic")[0].checked = false;
                    break;
                case "bulk_upload_switch":
                    $("#bulk_upload_switch").prop("checked", false)
                    break;
            }
        } else {
            if (__signup_trigger_from == "bulk_upload_switch") {
                BulkUpload.showPurchasePlanPopup()
            }
        }

        if (!amILoggedIn() && page == 'claim-qr-code') {
            ClaimOpenQrcodes.prepareClaimPopup()
        }
    })

    $('.gntr-qr-btn').on("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        recreateQRCode();
    })

    $("#step_by_step_guide_btn").on("click", function (e) {
        e.preventDefault()
        let ele = document.getElementById("step_by_step_guide")
        if (ele) {
            ele.scrollIntoView()
        }
    })

    $("#chrome_extension_btn").on("click", function (e) {
        if (e.target.nodeName != "A") {
            window.open(
                "https://chrome.google.com/webstore/detail/qr-code-generator-and-bea/fjhiihinnfloeepbkkidlhkfnbnjdaod",
                '_blank' // <- This is what makes it open in a new window.
            );
        }
    })

    $(".social_icon_list li").on('click', function (e) {
        let type = $(this).data('type').split('_')[0]

        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
            $(".social_link_container ." + type).hide()
            $(".pr_social_cards ." + type + '_card').remove()

            if ($(".social_icon_list li.active").length == 0) {
                $(".pr_social_cards_wrapper").hide()
            }
        } else {
            addSocialMediaLink(type)
            $(this).addClass('active')
            $(".social_link_container ." + type).insertBefore($(".social_icon_list_container"));
            $(".social_link_container ." + type).show()
            $(".pr_social_cards_wrapper").show()
        }
    })

    if (typeof WebSiteURLs != "undefined") {
        WebSiteURLs.init()
    }
    if (typeof ImageUploader != 'undefined') {
        ImageUploader.uploadImageCallback = function (url) {
            $(ImageUploader.ele).parents("ul").children("li").removeClass("active")
            changePreviewImages(url)
            if (ImageUploader.type == 'ga') {
                $(".list_uploaded_img").append('<li class="list-group-item">\
        <div class="uploaded_img_wrapper">\
            <div class="uploaded_img" style="background-image:url(' + url + ');">\
            </div>\
            <div class="uploaded_caption">\
                <input type="text" class="form-control uploaded_caption_text" placeholder="Title of your gallery page.">\
            </div>\
            <button type="button" class="btn btn-default uploaded_img_trash"><i class="icon-cross"></i></button>\
            <button type="button" class="btn btn-default uploaded_img_move"><i class="icon-down-arrow"></i></button>\
        </div>\
    </li>')

                if (typeof galleryImages != "undefined") {

                    $("#image_gallery").append(`<div class="img_gallery_wr">
                                        <a href="`+ url + `" data-toggle="lightbox" data-lightbox="roadtrip" data-title="" data-gallery="example-gallery"><img src="` + url + `" /></a>
                                    </div>`)
                    try { if (galleryImages) galleryImages.push({ "url": url, "title": "" }) } catch (err) { console.log(err) }
                }

            } else {
                $(`<li class="uploaded_bg_image active">
                        <div class="qr_bg_image_wr"  style="background-image:url(` + url + `);">
                            <div class="delete_image" style="display: none;"><i class="icon-bin"></i></div>
                        </div>
                    </li>`).insertBefore($(ImageUploader.ele).parents("ul").children('.image_uploader'))
            }
        }
    }

    $(document).on("mousemove", ".qr_bg_wrapper li", function (e) {
        $(this).find('.delete_image').show()
    })

    $(document).on("mouseout", ".qr_bg_wrapper li", function (e) {
        $(this).find('.delete_image').hide()
    })

    $(document).on("click", ".qr_bg_wrapper li", function (e) {
        if ($(this).children('.qr_file_upload').length == 1) {
            return
        }
        if ($(e.target).hasClass('delete_image') || $(e.target).parent().hasClass('delete_image')) {
            return
        }

        $(this).parents("ul").children("li").removeClass("active")
        $(this).addClass("active")


        var image = this.children[0].style['backgroundImage']
        image = image.replace('url("', '')
        image = image.replace('")', '')
        image = getFullUrlFromThumbnail(image)
        var type = $(this).parents("ul").data('type')
        if (type == 'bg') {
            if (page == 'facebook') {
                $(".fb_cover img").attr('src', '');
                $(".fb_cover img").attr('src', image);
            } else if (page == 'image' || page == 'menu') {
                $(".topbg_cover").css('background-image', "url()");
                $(".topbg_cover").css('background-image', "url(" + image + ")");
            } else {
                $(".topbg_cover img").attr('src', '');
                $(".topbg_cover img").attr('src', image);
            }
            // $(".fb_cover img").attr('src', image);
            // $("input[name=bg_url]").val(image)
        } else if (type == 'pr') {
            // $("input[name=pr_url]").val(image)
            $(".page_profile").css('background-image', 'url()');
            $(".page_profile").css('background-image', 'url(' + image + ')');
        }
        $("input[name=" + type + "_url]").val(image)
    })

    $(document).on("click", ".qr_bg_wrapper li .delete_image", function (e) {
        const ele = $(this).parents('li.uploaded_bg_image');
        const type = $(this).parents('.qr_bg_wrapper').data('type');
        let img = $(this).parents('.qr_bg_image_wr').css('background-image')
        img = img.replace('url("', '')
        img = img.replace('")', '')
        img = img.replace(/""/g, '"')
        $.post("//" + __api_domain + "/user/services/api", { cmd: 'deleteUserMedia', img: img, type: type }, function (response) {
            if (ele.hasClass('active')) {
                if (type == 'bg') {
                    if (page == 'facebook') {
                        $(".fb_cover img").attr('');
                    } else if (page == 'image' || page == 'menu') {
                        $(".topbg_cover").css('background-image', "url()");
                    } else {
                        $(".topbg_cover img").attr('src', '');
                    }
                } else if (type == 'pr') {
                    $(".page_profile").css('background-image', 'url("")');
                }
                $("input[name=" + type + "_url]").val('')
                if (ele.hasClass("active")) {
                    $(ele.parent().children()[0]).addClass("active")
                }
            }
            ele.remove()
            SwalPopup.showSingleButtonPopup({
                icon: 'success',
                text: 'Image removed',

            })
        })
    })
    if ($(".select2_no_search").length) {
        $(".select2_no_search").select2({ minimumResultsForSearch: Infinity })
    }

    /* NOT NEEDED as we are already calling generateDesignOptions
    if(typeof checkAndReGenerate != "undefined"){
        checkAndReGenerate();
    }*/
    newTemplatePageListeners()
})