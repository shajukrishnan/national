const WebSiteURLs = {
    init: function () {
        WebSiteURLs.initListensers()
    },
    initListensers: function () {
        $(".add_more_website_links").on("click", function (e) {
            WebSiteURLs.addNewWebsite(this)
        })

        $(document).on("input", '.web_url_container input', function (e) {
            WebSiteURLs.updateWebsiteUrlsPreview()
        })

        $(document).on("click", '.web_url_container .action_items .website_move_up', function (e) {
            e.preventDefault()
            WebSiteURLs.moveWebsite(this, 'up')
        })
        $(document).on("click", '.web_url_container .action_items .website_move_down', function (e) {
            e.preventDefault()
            WebSiteURLs.moveWebsite(this, 'down')
        })
        $(document).on("click", '.web_url_container .action_items .website_delete', function (e) {
            e.preventDefault()
            $(this).parents('.web_url_container').remove()
            WebSiteURLs.updateWebsiteUrlsPreview()
        })
    },
    addNewWebsite: function (ele) {
        $(`<div class="row web_url_container">
                    <div class="col-md-3 social_icon_list"></div>
                    <div class="col-md-3 pr-0">
                        <div class="form-group">
                            <input type="text" class="form-control" name="website_title" placeholder="My Website" value="">
                        </div>
                    </div>
                    <div class="col-md-6 ">
                        <div class="form-group">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="icon-worldwide"></i></span>
                                </div>
                                <input type="text" class="form-control" name="website_url" value="" placeholder="www.yourweburl.com">
                            </div>
                        </div>
                        <div class="action_items">
                            <button type="button" class="btn btn-link pr-0 website_move_up">
                                <icon class="icon-arrow-up2"></i>
                            </button>
                            <button type="button" class="btn btn-link pr-0 website_move_down">
                                <icon class="icon-arrow-down2"></i>
                            </button>
                            <button type="button" class="btn btn-link website_delete">
                                <icon class="icon-bin"></i>
                            </button>
                        </div>
                    </div>
                </div>`).insertBefore($(ele).parent())
    },
    updateWebsiteUrlsPreview: function () {
        if ($("#website_card_wrapper").length == 1) {
            let show_website_preview = false;
            var arr = $("#website_card_wrapper .web_url_container")
            $(".qr_page_preview .website_urls").html('')

            for (var i = 0; i < arr.length; i++) {
                var title = $(arr[i]).find('input[name=website_title]').val().trim()
                var url = $(arr[i]).find('input[name=website_url]').val().trim()
                if (isEmpty(title) || isEmpty(url)) {
                    continue;
                }
                show_website_preview = true;
                $(".qr_page_preview .website_urls").append(`
                        <li>
                            <div class="rg-t"><a class="primary-color" id="p-website" target="_blank" href="`+ checkAndAdjustURL(url) + `">` + title + `</a></div>
                        </li>
                `)
            }
            if (show_website_preview) {
                $(".website_url_preview_card").show()
            } else {
                $(".website_url_preview_card").hide()
            }
        }
    },
    moveWebsite: function (ele, action = 'up') {
        const parent = $(ele).parents('.web_url_container')
        if (action == 'up') {
            $(parent).insertBefore($(parent).prev())
        } else {
            $(parent).insertAfter($(parent).next())
        }
        WebSiteURLs.updateWebsiteUrlsPreview()
    },
}
const InlineEditor = {
    init: function () {
        $(document).on("click", ".inline_edit_btn", function (e) {
            $('.inline_editor').removeClass("show")
            $(this).parent().addClass("show")
        })
        $(document).on("click", ".inline_edit_cancel_btn", function (e) {
            $(this).parents('.inline_editor').removeClass("show")
        })
        $(document).on("click", ".inline_edit_save_btn", function (e) {
            const value = $(this).parent().find("input").val()
            if (empty(value.trim())) {
                SwalPopup.showSingleButtonPopup({
                    icon: 'error',
                    text: 'Field cannot be emty!'
                })
                return
            }
            $(this).parents('.inline_editor').find(".inline_value").text()
            $(this).parents('.inline_editor').removeClass("show")
        })

        $(document).on("click", function (e) {
            if ($(".inline_editor.show").length > 0 && $(e.target).parents(".inline_editor").length == 0) {
                $('.inline_editor').removeClass("show")
            }
        })
        InlineEditor.checkAndAddEditor()
    },
    checkAndAddEditor: function () {
        const editor = Array.from(document.getElementsByClassName("inline_editor"))
        editor.forEach(ele => {
            if (!$(ele).attr('data-editor')) {
                InlineEditor.AddEditor(ele)
            }
        })
    },
    AddEditor: function (ele) {
        $(ele).attr('data-editor', true)
        let value = $(ele).text().trim()
        $(ele).html(`
            <div class="inline_value">
             `+ value + `
            </div>
            <div class="inline_input" >
                <input class="form-control" type="text" value="`+ value + `">
                <button type="button" class="btn btn-transparent inline_edit_cancel_btn text-secondary"><i class="icon-cross"></i></button>
                <button type="button" class="btn btn-transparent inline_edit_save_btn text-success"><i class="icon-tickmark"></i></button>
            </div>
            <button type="button" class="btn btn-transparent inline_edit_btn text-secondary pl-0 font-16"><i class="icon-pencil"></i></button>
        `)
    },


}
const SortableComponent = {
    __parent: null,
    init: function () {
        SortableComponent.__parent = document.getElementById("other_info_card_wrapper");
        SortableComponent.initListensers()
        SortableComponent.prepareComponents()
    },
    initListensers: function () {
        InlineEditor.init()
        $(document).on("click", '.component_card_move_up', function (e) {
            const parent = $(this).parents(".sortable_card")[0]
            $(parent).insertBefore($(parent).prev()).hide().show('slow')
        })
        $(document).on("click", '.component_card_delete', function (e) {
            const ele = $(this).parents(".sortable_card")[0]

            Swal.fire({
                icon: 'warning',
                text: 'Do you want to delete this?',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'Delete',
                // cancelButtonText : 'Cancel',
                confirmButtonClass: 'btn btn-danger'
            }).then(result => {
                if (result.isConfirmed) {
                    if ($(ele).parent().children().length == 2) {
                        $(ele).parent().find(".component_card_delete").hide()
                    }
                    ele.remove()
                }
            })
        })
        $(document).on("click", '.component_add_more', function (e) {
            const component = eval($(this).data("component"))
            component.addRow($(this).parent().prev())
        })

        
    },
    prepareComponents: function () {
        if (SortableComponent.__parent == null || typeof __sortable_components == "undefined") {
            return;
        }
        SortableComponent.__parent_body = $(SortableComponent.__parent).find(".card-body")
        SortableComponent.__parent_body.html('')
        __sortable_components.forEach(component => {
            SortableComponent.prepareComponentHtml(component)
        })


    },
    prepareComponentHtml: function (component) {
        let label = extractDataFromArray(SortableComponent, [component.type, 'label'], 'Component')
        let title = extractDataFromArray(component, ['title'], '')
        title = empty(title) ? label : title;
        SortableComponent.__parent_body.append(`
            <div class="component_card sortable_card">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">
                            <h6>`+ label + `</h6>
                            <div class="component_actions">
                                <button type="button" class="btn btn-transparent component_card_move_up"><i class="icon-arrow-up2"></i></button>
                                <button type="button" class="btn btn-transparent component_card_move_down"><i class="icon-arrow-down2"></i></button>
                                <button type="button" class="btn btn-transparent component_card_delete pr-0"><i class="icon-bin"></i></button>
                            </div>
                        </div>
                        <div class="">
                            <input class="form-control" name="component_title" type="text" value="`+ title + `">
                        </div>
                    </div>
                    <div class="card-body">
                        `+ extractDataFromArray(SortableComponent, [component.type, 'getComponentHtml'])(component.data) + `
                    </div>
                </div>
            </div>` )
        let componentListenser = extractDataFromArray(SortableComponent, [component.type, 'componentListenser'])
        if(!empty(componentListenser)){
            componentListenser()
        }
    },
    //Components

    specification: {
        label: 'Specification',
        default: {
            type: 'specification',
            title: '',
            data: [
                { key: '', value: '' }]
        },
        getComponentHtml: function (specification_list) {
            list_html = '';
            specification_list.forEach(list => {
                list_html += `
                <div class="d-flex align-items-center specification_wrapper sortable_card">
                    <input class="form-control mr-2 mb-0" name="spec_title" type="text" placeholder="Title" value="`+ list.key + `">
                    <input class="form-control mr-2 mb-0" name="spec_desc" type="text" placeholder="Specification" value="`+ list.value + `">
                    <button type="button" class="btn btn-transparent component_card_delete pr-0"><i class="icon-bin"></i></button>
                    <button type="button" class="btn btn-transparent component_card_move_up"><i class="icon-arrow-up2"></i></button>
                    <button type="button" class="btn btn-transparent component_card_move_down"><i class="icon-arrow-down2"></i></button>
                </div>`
            })
            return `
            <div class="specification_container sortable_card_wrapper">
                    `+ list_html + `
            </div>
            <div class="">
                <button type="button" class="btn btn-link component_add_more" data-component="Specification"><i class="icon-plus mr-2"></i>Add More</button>
            </div>`
        }

    },
    contact: {
        label: 'Contact',
        default: {
            type: 'contact',
            title: '',
            data: {
                first_name : {
                    value : '',
                    label : 'Contact First Name'
                },
                last_name : {
                    value : '',
                    label : 'Contact Last Name'
                },
                phone : {
                    value : '',
                    label : 'Contact Number'
                },
                email : {
                    value : '',
                    label : 'Contact Email'
                },
                address : {
                    value : '',
                    label : 'Address'
                },
            }
        },
        getComponentHtml: function (contact_details) {

            return `
            <div class="contact_container row">
            <div class="col-md-6 contact_wrapper">
                <div class="inline_editor">
                    `+ contact_details.first_name.label+ `
                </div>
                <div class="contact_value">
                    <input type="text" class="form-control" name="first_name" value=" `+ contact_details.first_name.value+ `" placeholder="Contact Person First Name">
                </div>
            </div>
            <div class="col-md-6 contact_wrapper">
                <div class="contact_label inline_editor ">
                `+ contact_details.last_name.label+ `
                </div>
                <div class="contact_value">
                    <input type="text" class="form-control" name="last_name" value=" `+ contact_details.last_name.value+ `" placeholder="Contact Person Last Name">
                </div>
            </div>
            <div class="col-md-6 contact_wrapper">
                <div class="contact_label inline_editor">
                `+ contact_details.phone.label+ `
                </div>
                <div class="contact_value">
                    <input type="text" class="form-control" name="phone" value=" `+ contact_details.phone.value+ `" placeholder="Contact Number">
                </div>
            </div>
            <div class="col-md-6 contact_wrapper">
                <div class="contact_label inline_editor">
                `+ contact_details.email.label+ `
                </div>
                <div class="contact_value">
                    <input type="email" class="form-control" name="email" value=" `+ contact_details.email.value+ `" placeholder="Contact Email">
                </div>
            </div>
            <div class="col-md-12 contact_wrapper mb-2">
                <div class="contact_label inline_editor">
                `+ contact_details.address.label+ `
                </div>
                <div class="contact_value">
                    <textarea rows="5" class="form-control" name="address" placeholder="Contact Address"> `+ contact_details.address.value+ `</textarea>
                </div>
            </div>
            <div class="col-md-4 contact_wrapper d-flex align-items-center">
                <span>
                    Save To Contact Button
                </span>
            </div>
            <div class="col-md-8 contact_wrapper">
                <select class="select form-control" name="save_to_contact_btn">
                    <option value="">None</option>
                    <option value="section" selected>On Section</option>
                    <option value="floating">Floating Button</option>
                </select>
            </div>
        </div>`
        },
        componentListenser : function(){
            $(".select").select2({ minimumResultsForSearch: Infinity })
        }

    },
}

const Specification = {
    addRow: function (parent) {
        parent.append(`
            <div class="d-flex align-items-center specification_wrapper sortable_card">
                <input class="form-control mr-2 mb-0" name="spec_title" type="text" placeholder="Title" value="">
                <input class="form-control mr-2 mb-0" name="spec_desc" type="text" placeholder="Specification" value="">
                <button type="button" class="btn btn-transparent component_card_delete pr-0"><i class="icon-bin"></i></button>
                <button type="button" class="btn btn-transparent component_card_move_up"><i class="icon-arrow-up2"></i></button>
                <button type="button" class="btn btn-transparent component_card_move_down"><i class="icon-arrow-down2"></i></button>
            </div>
        `)
    },
    getData: function (parent) {

    }
}
SortableComponent.init()