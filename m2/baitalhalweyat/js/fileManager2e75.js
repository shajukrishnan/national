const FileManager = {
    __upload_total: 0,
    __upload_count: 0,
    __click_count: 0,
    __timeout: 0,
    __max_file_size: 0,
    __total_size_capacity: 0,
    __total_file_size: 0,
    __refresh_image: '',
    __limit: 50,
    __start: 0,
    __trigger_by_code: false,
    __icon: {
        'svg': 'icon-image_4',
        'gif': 'icon-image_4',
        'jpg': 'icon-image_4',
        'png': 'icon-image_4',
        'jpeg': 'icon-image_4',
        'pdf': 'icon-pdf',
        'doc': 'icon-doc_4',
        'docx': 'icon-doc_4',
        'txt': 'icon-doc_4',
        'odt': 'icon-doc_4',
        'xls': 'icon-excel_4',
        'xlsx': 'icon-excel_4',
        'ods': 'icon-excel_4',
        'csv': 'icon-excel_4',
        'mp3': 'icon-tiktok',
        'mp4': 'icon-video_presentation',
        'avi': 'icon-video_presentation',
        'mkv': 'icon-video_presentation',
        'webm': 'icon-video_presentation',
        '3gp': 'icon-video_presentation',
        'css': 'icon-code',
        'css3': 'icon-code',
    },
    __card_color: {
        'PDF': "pdf_file_color",
        'DOC': "doc_file_color",
        'VIDEO': "video_file_color",
        'AUDIO': "video_file_color",
        'SHEET': "excel_file_color",
        'CSS': "excel_file_color",
    },
    file_type: 'all',
    assets: [],
    display_mode: 'popup',
    popup_id: "filemanager_popup",
    container_id: "filemanager_container",
    selected_type: 'All Files',
    sort_by: 'new_first',
    total_asset_count: 0,

    init: function (display_type = 'page') {
        FileManager.includeCss()
        FileManager.display_mode = display_type
        if (display_type == 'page') {
            FileManager.show()
        } else {
            FileManager.showPopup()
        }
        FileManager.initCardListeners()

    },
    initCardListeners: function () {
        // Copy this function and it should work
        function clicks(e) {
            if (e.target.nodeName == "INPUT") {
                return
            }
            const self = this;
            FileManager.__click_count++;
            if (FileManager.__click_count == 1) {
                setTimeout(function () {
                    if (FileManager.__click_count == 1) {
                        onAssetSingleClick(self)
                        // Single click code, or invoke a function 
                    } else {
                        onAssetDoubleClick(self)
                        // Double click code, or invoke a function 
                    }
                    FileManager.__click_count = 0;
                }, FileManager.__timeout || 100);
            } else {
                FileManager.__click_count--;
            }
        }
        function onAssetSingleClick(ele) {
            if ($(".asset_card.select").length == 0) {
                if ($("#asset_info_drawer").hasClass("expand")) {
                    $("#asset_info_drawer").removeClass('expand')
                } else {
                    FileManager.prepareDrawer($(ele).data('index'));
                    $("#asset_info_drawer").addClass('expand')
                }
            } else {
                if ($(ele).hasClass("select")) {
                    $(ele).removeClass("select")
                    $(ele).find('.select_box input').prop('checked', false)
                } else {
                    $(ele).addClass("select")
                    $(ele).find('.select_box input').prop('checked', true)
                }
                $("#asset_info_drawer").removeClass('expand')
                $('#asset_container .form-check-input-styled').uniform();
            }

            FileManager.updateSelectedCards()


        }

        function onAssetDoubleClick(ele) {
            if ($(".asset_card.select").length == 0) {
                $("#" + FileManager.popup_id).modal("hide")
                FileManager.callback([FileManager.assets[$(ele).data('index')]])
            }
        }

        $(document).on("change", ".asset_card .select_box input", function (e) {

            if (e.target.checked) {
                $(this).parents(".asset_card").addClass("select")
            } else {
                $(this).parents(".asset_card").removeClass("select")
            }
            FileManager.updateSelectedCards()
        })
        $(document).on("click", function (e) {
            if (!($(e.target).parents('#asset_info_drawer').length || $(e.target).attr('id') == '.asset_info_drawer')) {
                $("#asset_info_drawer").removeClass("expand")
                e.stopImmediatePropagation();
            }
        })

        $(document).on("click", ".asset_card", clicks)
            .on("dblclick", ".asset_card", clicks)
        $(document).on("click", ".asset_actions .btn_asset_img_preview", function (e) {
            e.preventDefault()
            e.stopImmediatePropagation()
            FileManager.showDetailedPreview($(this).parents('.asset_card').data('index'))
        })
        $(document).on("click", ".asset_actions .btn_asset_edit", function (e) {
            e.preventDefault()
            e.stopImmediatePropagation()
            FileManager.showEditAssetPopup($(this).parents('.asset_card').data('index'))
        })
        $(document).on("click", ".asset_actions .btn_delete_asset, #btn_multiple_asset_delete", function (e) {
            e.preventDefault()
            e.stopImmediatePropagation()
            let _ids = []
            if (this.id == "btn_multiple_asset_delete") {
                Array.from($(".asset_card.select")).forEach(ele => {
                    _ids.push($(ele).data('index'))
                })
            } else {
                _ids.push($(this).parents('.asset_card').data('index'))
            }

            showDeleteConfirmation("Delete File(s)", "Once deleted, file(s) can not be recovered. Please confirm.", "Confirm", function () {
                FileManager.deleteAssets(_ids)
            })
        })


        $(document).on("click", "#asset_info_drawer_close", function (e) {
            $("#asset_info_drawer").removeClass("expand")
        })
        $(document).on("click", ".img_url_sizes .nav-link", function (e) {
            e.preventDefault()
            $(".img_url_sizes .nav-link").removeClass("active")
            $(this).addClass("active")
            $("#drawer_image_url").html('<a href="' + $(this).attr('data-url') + '" target="_blank">https:' + $(this).attr('data-url') + '</a>')
        })

        $(document).on("click", "#asset_categories li", function (e) {
            // if(FileManager.__trigger_by_code){
            //     return
            // }
            $("#asset_categories li").removeClass('active')
            $(this).addClass("active")
            // let category = $(this).data('category')
            // if (category == "All") {
            //     $("#file_manager_type_filter").val("All")
            //     $("#file_manager_type_filter").prop('disabled', false)
            // } else {
            //     $("#file_manager_type_filter").val(FileManager.selectedCategory)
            //     $("#file_manager_type_filter").prop('disabled', true)
            // }
            // $("#file_manager_type_filter").change()
            $(".asset_card").remove()
            FileManager.assets = []
            FileManager.__total_file_size = 0
            FileManager.fetchAllAssets()
        })

        $(document).on("input", "#template_search", function (e) {
            $(".asset_card").remove()
            FileManager.assets = []
            FileManager.fetchAllAssets()
        })

        $(document).on("click", "#categories_dropdown li", function (e) {
            const category = $(this).data('category')
            let indexes = [];
            let _name = [];
            Array.from($(".asset_card.select")).forEach(ele => {
                indexes.push($(ele).data('index'))
            })
            FileManager.moveAssetsToCategory(indexes, category)
        })

        $(document).on("change", "#file_manager_type_filter", function (e) {
            if (FileManager.__trigger_by_code) {
                FileManager.__trigger_by_code = false
                return
            }
            FileManager.file_type = e.target.value
            // $("#asset_categories li").remove()
            FileManager.assets = []
            FileManager.fetchAllAssets()
        })
        $(document).on("change", "#file_manager_sort", function (e) {
            FileManager.sort_by = e.target.value
            FileManager.populateAssetsContainer($("#asset_categories li.active").data("category"), $("#template_search").val())
        })
        $(document).on("click", ".file_manager_upload_option", function (e) {
            e.preventDefault()
            e.stopImmediatePropagation()
            FileManager.initUploader($(this).data('file'))
        })
        $(document).on("click", "#select_single_asset", function (e) {
            e.preventDefault()
            e.stopImmediatePropagation()
            const index = $(this).parents('.asset_card').data('index')
            $("#" + FileManager.popup_id).modal("hide")
            FileManager.callback([FileManager.assets[index]])
            $("#asset_info_drawer").removeClass("expand")
        })
        $(document).on("click", "#select_multiple_assets", function (e) {
            let urls = [];
            Array.from($(".asset_card.select")).forEach(ele => {
                urls.push(FileManager.assets[$(ele).data('index')])
            })

            if (urls.length > FileManager.file_count) {
                showAlertMessage("M", "Max " + FileManager.file_count + " files can be selected!", function () { })
                return
            }
            $("#" + FileManager.popup_id).modal("hide")
            FileManager.callback(urls)
        })
        $(document).on("click", "#btn_new_category", function (e) {
            e.preventDefault()
            FileManager.showCategoryPopup("move")
        })
        $(document).on("click", "#btn_save_category", function (e) {
            let $input = $("#category_popup input[name=category_name]");
            const category = $input.val();
            if (!category) {
                $input.addClass('border-danger');
                return;
            } else {
                $input.removeClass('border-danger');
            }
            FileManager.createCategory(category, function () {
                if (FileManager.__category_action == 'move') {
                    let _ids = [];
                    Array.from($(".asset_card.select")).forEach(ele => {
                        FileManager.assets[$(ele).data('index')].category = category
                        _ids.push($(ele).data('index'))
                    })
                    FileManager.moveAssetsToCategory(_ids, category)
                }
            })

        })
        function traverseFileTree(item, path, category = '', index = 0) {
            console.log('checking item')
            path = path || "";
            if (item.isFile) {
                // Get file
                FileManager.__files += 1
                console.log('gng to access file')
                item.file(function (file) {
                    console.log('file accessed')
                    FileManager.__files_to_upload.push({ file: file, category: category.split('/')[0] })
                    // FileManager.uploadAsset(file, category);
                });
                console.log('next to file accessed')
            } else if (item.isDirectory) {
                // Get folder contents
                var dirReader = item.createReader();
                console.log('fng to entries')
                dirReader.readEntries(function (entries) {
                    FileManager.__files = -1
                    console.log('reading entries')
                    for (var i = 0; i < entries.length; i++) {
                        traverseFileTree(entries[i], path + item.name + "/", item.name);
                    }
                });
                console.log('next to entries')
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation()
            if (typeof e.dataTransfer != "undefined") {
                var items = e.dataTransfer.items;
            } else {
                var items = event.dataTransfer.items;
            }
            FileManager.__files_to_upload = []
            FileManager.__files = 0

            for (var i = 0; i < items.length; i++) {
                // webkitGetAsEntry is where the magic happens
                var item = items[i].webkitGetAsEntry();
                if (item) {
                    traverseFileTree(item, '', '', i);
                }
            }
            exponentialBackoff(function () { return FileManager.__files == -1 || (FileManager.__files && (FileManager.__files_to_upload.length == FileManager.__files)) }, 30, 1000, function () {
                if (FileManager.__files == -1) {
                    showAlertMessage("E", "Empty Folder")
                } else {
                    FileManager.uploadHandler(FileManager.__files_to_upload)
                }
            })

        }

        function handleDragover(e) {

            e.stopPropagation();
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy';

        }

        $(document).on('dragenter dragover', "#asset_container", handleDragover);
        $(document).on('drop', "#asset_container", handleDrop);

        $(document).on("change", "#assets_select_all", function (e) {
            if (e.target.checked) {
                $('.asset_card').addClass("select")
                $('.asset_card .select_box input').prop("checked", true);
            } else {
                $('.asset_card .select_box input').prop("checked", false);
                $('.asset_card').removeClass("select")
            }

            FileManager.updateSelectedCards()
        })
        $(document).on("click", ".upload_header_action", function (e) {
            if ($(this).find('i').hasClass("icon-arrow-down12")) {
                $("#upload_status_files").css('height', '0')
                $(this).find('i').addClass("icon-arrow-up12")
                $(this).find('i').removeClass("icon-arrow-down12")
            } else {
                $("#upload_status_files").css('height', "unset")
                $(this).find('i').removeClass("icon-arrow-up12")
                $(this).find('i').addClass("icon-arrow-down12")

            }
        })
        $(document).on("click", ".btn_delete_asset_category", function (e) {
            e.preventDefault()
            e.stopImmediatePropagation()
            const category = $(this).parents('li').data('category')
            showDeleteConfirmation("Delete Folder", "Once deleted, folder can not be recovered. Please confirm.", "Confirm", function () {
                FileManager.deleteCategory(category)
            })

        })
        $(document).on("click", "#btn_create_asset_category", function (e) {
            FileManager.showCategoryPopup("create")
        })
        $(document).on("click", ".btn_drawer_copy_url", function (e) {
            copyTextToClipboard($($(this).data("clipboard-target")).text())
        })

        $(document).on("click", "#copy_file_manager_path", function (e) {
            copyTextToClipboard("https://cdn03.qrcodechimp.com/qr/" + (subdomain == 'www' ? 'PROD' : (subdomain == 'dev' ? 'DEV' : 'LOCAL')) + "/" + readCookie('uid') + "/fm/")
        })

        $("#asset_container").scroll(function (e) {
            var elem = $(e.currentTarget);
            if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()) {
                if (FileManager.total_asset_count > FileManager.assets.length) {
                    FileManager.fetchAllAssets()
                }
            }
        });

    },
    updateSelectedCards: function () {
        const count = $(".asset_card.select").length
        let checked = false;
        if (count > 0) {
            checked = true
            $("#assets_selected").text(count + " selected")
            $("#asset_multiple_actions").removeClass("d-done")
            $("#asset_multiple_actions").addClass("d-flex")
        } else {
            $("#asset_multiple_actions").addClass("d-none")
            $("#asset_multiple_actions").removeClass("d-flex")
            $("#assets_selected").text("Select All")
        }
        $("#assets_select_all").prop("checked", checked)
        $('#assets_select_all').uniform();
        $('.asset_card .select_box input').uniform();
        if (FileManager.file_count == 1) {
            // $("#select_multiple_assets").hide()
        }
    },

    showFileManager: function (file_type = 'All', file_count = 2, callback = function () { }) {
        $("#upload_status_container").hide()
        $("#upload_status_files").html('')
        $(".asset_card.select").remove()
        if (FileManager.__max_file_size == 0) {
            FileManager.__max_file_size = parseInt(extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR'), 'FILE_MANAGER_MAX_FILE_SIZE']))
        }

        if (FileManager.__total_size_capacity == 0) {
            FileManager.__total_size_capacity = parseInt(extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR'), 'FILE_MANAGER_TOTAL_SIZE_CAPACITY']))
        }

        FileManager.file_type = file_type
        // FileManager.selectedCategory = file_type == "All" ? 'All Files' : file_type
        FileManager.__trigger_by_code = 1
        $("#file_manager_type_filter").val(file_type)
        $(".select").select2({ minimumResultsForSearch: Infinity })
        if (file_type != "All") {
            $("#file_manager_type_filter").prop("disabled", true)
        } else {
            $("#file_manager_type_filter").prop("disabled", false)
        }
        // $("#file_manager_type_filter").select2({ minimumResultsForSearch: Infinity })
        $("#" + FileManager.container_id + " .select2-container").css("width", 'unset')

        FileManager.selected_type = file_type
        FileManager.callback = callback
        FileManager.file_count = file_count
        if (file_count == 1) {
            $("#select_multiple_assets").hide()
        }
        $("#asset_categories li").remove()
        $(".asset_card").remove()
        FileManager.updateSelectedCards()
        FileManager.fetchCategories()
        if (FileManager.display_mode == 'popup') {
            $("#" + FileManager.popup_id).modal("show")
        }
    },
    show: function () {
        FileManager.prepareFileContainer()
    },
    showPopup: function () {
        if (document.getElementById(FileManager.popup_id) == null) {
            const modal = document.createElement('div');
            modal.id = FileManager.popup_id;
            modal.className = 'modal fade pr-0';
            modal.innerHTML = ` <div class="modal-dialog modal_full_size">
                                    <div class="modal-content">
                                        <div class="modal-header p-3 border-bottom align-items-center">
                                            <h5 class="modal-title font-weight-semibold ">File Manager </h5>
                                            <span class="text-muted font-12 ml-3" id="file_capacity"></span>
                                            <button type="button" class="btn btn-transparent btn-sm" id="copy_file_manager_path"><i class="icon-ic_content_copy mr-2"></i>Copy path</button>
                                            <button type="button" class="close pr-2" data-dismiss="modal"></button>
                                        </div>

                                        <div class="modal-body p-0">
                                            <div id="filemanager_container" class="row mx-0"></div>
                                        </div>
                                    </div>
                                </div>`
            document.body.appendChild(modal)
        }
        FileManager.prepareFileContainer()

        $("#" + FileManager.popup_id).on('hidden.bs.modal', function () {
            if (location.pathname.indexOf('/workspace/automation') > 0) {
                $('body').addClass('modal-open')
            }
        });


    },
    hidePopup: function () {
        $("#" + FileManager.popup_id).modal("hide")
    },
    prepareFileContainer: function () {
        $("#" + FileManager.container_id).html(`
            <div class="col-md-3 border-right p-3">
                <div class="form-group form-group-feedback form-group-feedback-left">
                    <input type="text" id="template_search" class="form-control form-control-lg" placeholder="Search file">
                    <div class="form-control-feedback form-control-feedback-lg">
                        <i class="darkgrey_color icon-search4"></i>
                    </div>
                </div>
                <div class=" d-none justify-content-between align-items-center mb-1">
                    <h5 class="mb-0">Folders </h5>
                    <a class="btn btn-link px-0" id="btn_create_asset_category"><i class="icon-plus3" ></i> Add New</a>
                </div>
                <ul class="list-unstyled secondary_color" id="asset_categories">
                </ul>
                </div>
            </div>
            <div class="col-md-9">
                <div class="row border-bottom justify-content-between p-3">
                    <div class="d-flex align-items-center">
                        <div class="" >
                            <form class="form-inline">
                                <input type="checkbox" class="form-check-input-styled" id="assets_select_all">
                                <span class="mx-1 mr-3" id="assets_selected">Select All</span>
                                <div class="d-flex" id="asset_multiple_actions">
                                    <div class="dropdown d-none">
                                        
                                        <button class="btn btn-outline-white-no-hover dropdown-toggle pr-4"
                                                type="button" id="move_to_dropdown" data-toggle="dropdown"
                                                aria-haspopup="true" aria-expanded="false">
                                            Move to
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="move_to_dropdown">
                                            <ul class="list-unstyled mb-1" id="categories_dropdown">

                                            </ul>
                                            <div class="border-top p-3">
                                                <button class="btn btn-primary w-100" id="btn_new_category">
                                                    Create new folder
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-danger ml-2" id="btn_multiple_asset_delete">Delete</button>
                                    <button type="button" class="btn btn-primary ml-2 `+ (FileManager.display_mode == 'popup' ? "d-none" : "d-none") + `" id="select_multiple_assets">Select</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="">
                        <form class="form-inline">
                            <label class="mr-2">Type :</label>
                            <select class="form-control select " id="file_manager_type_filter">
                                <option value="All">All</option>
                                <option value="IMAGE">Images</option>
                                <option value="PDF">PDF</option>
                                <option value="DOC">Doc</option>
                                <option value="SHEET">Sheet</option>
                                <option value="AUDIO">Audio</option>
                                <option value="VIDEO">Video</option>
                                <option value="CSS">CSS</option>
                            </select> 
                            <label class="ml-3 mr-2">Sort by :</label>
                            <select class="form-control select" id="file_manager_sort">
                                <option value="new_first">Newest First</option>
                                <option value="old_first">Oldest First</option>
                                <option value="name_asc">A - Z</option>
                                <option value="name_desc">Z - A</option>
                                <option value="size_asc">Smallest First</option>
                                <option value="size_desc">Largest First</option>
                            </select>
                            <div class="dropdown ml-3">
                                <button class="btn btn-primary dropdown-toggle pl=4 d-flex align-items-center"
                                        type="button" id="upload_dropdown" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false" data-file="any"> 
                                
                                    <i class="icon-icons_line_plus mr-1"></i>
                                    New Upload
                                    <i class="icon-downarrow_4 ml-2"></i>
                                </button>
                                <input type="file" class="d-none" id="file_manager_upload_file" accept="" multiple>
                                <input type="file" class="d-none" id="file_manager_upload_folder" webkitdirectory multiple>
                                <div class="dropdown-menu" aria-labelledby="upload_dropdown">
                                    <a class="dropdown-item file_manager_upload_option" data-file="any">File</a>
                                    <a class="dropdown-item file_manager_upload_option" data-file="folder">Folder</a>
                                </div> 
                            </div>
                        </form>
                    </div>
                </div>
                <div id="asset_container_overlay">
                    <div class="row p-3 thinScrollBar" id="asset_container" >
                        `+ FileManager.prepareInfoDrawer() + `
                        <div id="no_asset_data">
                                <div class="text-center">
                                    <i class="nt-icon nt-icon-fileupload_1 nt-icon-size-42"></i><br>
                                    Drop files here or <br>use new upload button.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="" id="upload_status_container" style="display:none">
                    <div class="upload_status_header bg-secondary text-light p-2 d-flex justify-content-lg-between">
                        <div><span class="upload_text">Upload Status </span></div>
                        <span class="upload_header_action"><i class="icon-downarrow_4"></i></span>
                    </div>
                    <ul class="list-unstyled mb-0" id="upload_status_files">
                    
                    </ul>

                </div>
            </div>`)
        $(".select").select2({ minimumResultsForSearch: Infinity })
        $("#" + FileManager.container_id + " .select2-container").css("width", 'unset')
        $('.tokenfield').tokenfield();
        $('.form-check-input-styled').uniform();
        // let clipboard = new ClipboardJS('#btn_drawer_copy_url');
        // clipboard.on('success', function (e) {
        //     SwalPopup.showSingleButtonPopup({
        //         text: 'Copied to Clipboard',
        //         icon: 'success'
        //     })
        //     e.clearSelection();
        // });
    },
    prepareInfoDrawer: function () {
        return `<div id="asset_info_drawer" class="easin">
                        <div class="card mb-0">
                            <div class="card-header d-flex justify-content-between">
                                <div class="file_header d-flex">
                                    <div class="file_icon mr-2"><i class="icon-file-pdf"></i></div>
                                    <div class="file_name">File name</div>
                                </div>
                                <div class="close" id="asset_info_drawer_close">
                                </div>
                            </div>
                            <div class="card-body p-3">
                                <div class="preview_img pdf_file_color">
                                    <i class="icon-file-pdf"></i>
                                </div>
                                <table class="mt-3">
                                    <tbody>
                                        <tr class="d-none">
                                            <td>Folder</td>
                                            <td id="drawer_file_category">PDF</td>
                                        </tr>
                                        <tr>
                                            <td>Alt Name</td>
                                            <td id="drawer_file_alt_name">PDF</td>
                                        </tr>
                                        <tr>
                                            <td>Type</td>
                                            <td id="drawer_file_type">PDF</td>
                                        </tr>
                                        <tr>
                                            <td>Size</td>
                                            <td id="drawer_file_size">12KB</td>
                                        </tr>
                                        <!-- <tr>
                                            <td>Owner</td>
                                            <td id="drawer_file_owner">Danny</td>
                                        </tr> -->
                                        <tr>
                                            <td>Modified</td>
                                            <td id="drawer_file_modified">12 Mar 2020 09:45AM</td>
                                        </tr>
                                        <tr>
                                            <td>Created</td>
                                            <td id="drawer_file_created">12 Mar 2020 09:45AM</td>
                                        </tr>
                                        <tr class="non_img_file">
                                            <td>File URL <button class="btn btn-transparent p-0 btn_drawer_copy_url" data-clipboard-target="#drawer_file_url">
                                            <i class="icon-ic_content_copy"></i>
                                        </button></td>
                                            <td id="drawer_file_url"></td>
                                        </tr>
                                        <tr class="img_file" style="display:none;">
                                            <td>Image URL <button class="btn btn-transparent p-0 btn_drawer_copy_url" data-clipboard-target="#drawer_image_url">
                                            <i class="icon-ic_content_copy"></i>
                                        </button></td>
                                            <td >
                                                
                                                <div id="drawer_image_url">
                                                    
                                           
                                                    
                                                </div>
                                                <ul class="nav nav-pills img_url_sizes mt-2 pt-2 border-top">
                                                    <li class="nav-item">
                                                        <a class="nav-link active btn-sm py-1 px-2" id="drawer_image_url_og" href="#!">Original</a>
                                                    </li>
                                                    <li class="nav-item">
                                                        <a class="nav-link btn-sm py-1 px-2" href="#!"  id="drawer_image_url_md">Medium</a>
                                                    </li>
                                                    <li class="nav-item">
                                                        <a class="nav-link btn-sm py-1 px-2" href="#!"  id="drawer_image_url_th">Thumbnail</a>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="form-group mt-3">
                                    <label class="form-label">Tags</label>
                                    <input class="form-control tokenfield" id="drawer_file_tags" disabled>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control border-0 bg-white" id="drawer_file_desc" rows="3" disabled></textarea>
                                </div>
                            </div>
                        </div>
                    </div>`
    },
    sortAssets: function () {
        switch (FileManager.sort_by) {
            case 'new_first':
                FileManager.assets.sort(function (a, b) {
                    return (new Date(b.create_time)) - (new Date(a.create_time))
                })
                break;
            case 'old_first':
                FileManager.assets.sort(function (a, b) {
                    return (new Date(a.create_time)) - (new Date(b.create_time))
                })
                break;
            case 'name_asc':
                FileManager.assets.sort(function (a, b) {
                    if (a.asset_name < b.asset_name) { return -1; }
                    if (a.asset_name > b.asset_name) { return 1; }
                    return 0;
                })
                break;
            case 'name_desc':
                FileManager.assets.sort(function (a, b) {
                    if (b.asset_name < a.asset_name) { return -1; }
                    if (b.asset_name > a.asset_name) { return 1; }
                    return 0;
                })
                break;
            case 'size_asc':
                FileManager.assets.sort(function (a, b) {
                    return a.asset_size - b.asset_size
                })
                break;
            case 'size_desc':
                FileManager.assets.sort(function (a, b) {
                    return b.asset_size - a.asset_size
                })
                break;
        }
    },
    populateAssetsContainer: function (selectedCategory = 'All Files', search_str = '') {
        $("#asset_container .asset_card").remove()
        FileManager.sortAssets()
        FileManager.__total_file_size = 0;
        FileManager.assets.forEach((asset, index) => {
            FileManager.__total_file_size += asset.asset_size
            if (asset.category !== '' && $("#asset_categories li[data-category='" + asset.category + "']").length == 0) {
                FileManager.prepareCategorySidebarItem(asset.category)
                FileManager.prepareCategoryDropdown(asset.category)
            }

            if (selectedCategory != 'All Files') {
                if (selectedCategory == asset.category) {
                    $("#asset_container").append(FileManager.prepareAssetCard(asset, index, search_str))
                }
            } else {
                $("#asset_container").append(FileManager.prepareAssetCard(asset, index, search_str))
            }
        })
        $("#file_capacity").text("(" + nFormatter(FileManager.__total_file_size) + "B / " + nFormatter(FileManager.__total_size_capacity * 1024 * 1024) + "B)")
        FileManager.__refresh_image = '';
        if (FileManager.assets.length == 0) {
            $("#no_asset_data").addClass("show")
        } else {
            $("#no_asset_data").removeClass("show")
        }

        $('#asset_container .form-check-input-styled').uniform();


    },
    checkForStringMatch: function (asset, search_str) {
        const keys = ['asset_name', 'asset_alt_name', 'category']
        let matched = false
        keys.forEach(key => {
            if (asset[key].toLowerCase().indexOf(search_str.toLowerCase()) > -1) {
                matched = true;
            }
        })

        asset.tags.forEach(tag => {
            if (tag.toLowerCase().indexOf(search_str.toLowerCase()) > -1) {
                matched = true;
            }
        })
        return matched
    },
    prepareAssetCard: function (asset, index, search_str) {
        if (search_str != "" && !FileManager.checkForStringMatch(asset, search_str)) {
            return '';
        }

        if (FileManager.selected_type != "All") {
            if (asset.asset_type != FileManager.selected_type) {
                return
            }
        }

        let ext = asset.asset_url.split(".")
        ext = ext[ext.length - 1].toLowerCase();


        let className = 'preview_card_img ' + extractDataFromArray(FileManager.__card_color, [asset.asset_type], '')


        let title = nFormatter(asset.asset_size) + "B - " + asset.category + "/" + asset.asset_name
        if (asset.category == "") {
            title = nFormatter(asset.asset_size) + "B - " + asset.asset_name
        }
        let preview_img = '';
        if (asset.asset_type == 'IMAGE') {
        }
        return `<div class="asset_card card" data-index="` + index + `">
                        <div class="`+ className + `" style="` + (asset.asset_type == "IMAGE" ? `background-image:url('` + asset.asset_url + FileManager.__refresh_image + `')` : '') + `">
                            `+ (asset.asset_type != "IMAGE" ? `<i class="` + FileManager.__icon[ext] + ` mr-1"></i>` : '') + `
                            <div class="select_box">
                                <input class="form-check-input-styled" type="checkbox">
                            </div>
                        </div>
                        <div class="card-body p-2">
                            <div class="asset_name" title="`+ asset.asset_name + `"><i class="` + FileManager.__icon[ext] + ` mr-1"></i>` + title + `</div>
                            <div class="d-flex `+ (FileManager.file_count == 1 ? 'justify-content-between' : 'justify-content-end') + ` mt-2">
                                `+ (FileManager.file_count == 1 ? '<button class="btn btn-primary" id="select_single_asset" >Select</button>' : '') + `
                                <div class="asset_actions text-right mt-2">
                                    `+ (asset.asset_type == 'IMAGE' ? '<a class="icon-zoomin3 btn_asset_img_preview" title="Image Preview"><i class="icon-image"></i></a>' : '') + `
                                    <a class="icon-pencil btn_asset_edit" title="Edit File"></a>
                                    <a class="icon-trash btn_delete_asset" title="Delete File"><i class="icon-bin"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>`
    },
    prepareCategorySidebar: function () {
        FileManager.categories.forEach(category => {
            if (category != '' && $("#asset_categories li[data-category='" + category + "']").length == 0 && (FileManager.file_type == 'All' || category == 'All Files' || category == FileManager.file_type)) {
                FileManager.prepareCategorySidebarItem(category)
                FileManager.prepareCategoryDropdown(category)
            }
        })

        if (empty(FileManager.selectedCategory) && $("#asset_categories li.active").length == 0) {
            $("#asset_categories li[data-category='All Files']").click()
        } else if (FileManager.selectedCategory != "All Files") {
            $("#asset_categories li[data-category='" + FileManager.selectedCategory + "']").click()
        } else {
            $("#asset_categories li[data-category='All Files']").click()
        }
    },

    prepareCategorySidebarItem: function (category, active = '') {
        $("#asset_categories").append(`<li class="` + active + `" data-category="` + category + `">
                                        <span>` + category + `</span>
                                        <div class="d-flex">
                                            <span class="category_count mr-2">`+ extractDataFromArray(FileManager.category_counts, [category], 0) + `</span>
                                            <div class="dropdown d-none`+ (category == 'All Files' ? '' : '') + `">
                                                <a class="icon-moreoption rotate-90" href="#" data-toggle="dropdown">
                                                </a>
                                                <div class="dropdown-menu ">
                                                    <a class="dropdown-item btn_delete_asset_category">Delete</a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>`)
    },

    prepareCategoryDropdown: function (category) {
        // if(category == "All Files")
        $("#categories_dropdown").append(`
            <li class="d-flex justify-content-between" data-category="` + category + `">
                <span>` + category + `</span>
                <span class="category_count mr-2">`+ extractDataFromArray(FileManager.category_counts, [category], 0) + `</span>
            </li>`)
    },

    fetchAllAssets: function () {
        const current_api_cal = random_int();
        FileManager.__latest_fetch_call = current_api_cal
        const data = {
            cmd: 'fetchAllAssets',
            type: FileManager.file_type,
            limit: FileManager.__limit,
            start: FileManager.assets.length,
            search_str: $("#template_search").val(),
            category: $("#asset_categories li.active").data("category")
        }
        showLoaderOnBlock("#asset_container_overlay")
        $.post("//" + __api_domain + "/user/services/api", data, function (response) {
            if (current_api_cal == FileManager.__latest_fetch_call) {
                FileManager.assets = [...FileManager.assets, ...extractDataFromArray(response, ['data', 'records'], [])];
                FileManager.total_asset_count = extractDataFromArray(response, ['data', 'count'], 0)
                $(".asset_card").remove()
                FileManager.updateSelectedCards()
                FileManager.populateAssetsContainer()
            }
            hideLoader("#asset_container_overlay")
        })
    },
    fetchCategories: function () {
        // $.post("//"+__api_domain+"/user/services/api", { cmd: 'fetchCategories', category: FileManager.file_type }, function (response) {
        $.post("//" + __api_domain + "/user/services/api", { cmd: 'fetchCategories', file_type: FileManager.file_type }, function (response) {
            $("#asset_categories li").remove()
            $("#categories_dropdown li").remove()
            FileManager.categories = extractDataFromArray(response, ['data', 'categories'], []);
            FileManager.category_counts = extractDataFromArray(response, ['data', 'counts'], []);
            FileManager.prepareCategorySidebar()
            FileManager.updateCategoryDeleted()
        })
    },
    showCategoryPopup: function (action) {
        FileManager.__category_action = action
        if (document.getElementById("category_popup") == null) {
            const modal = document.createElement('div')
            modal.id = 'category_popup'
            modal.className = 'modal fade modal_center'
            modal.innerHTML = `<div class="modal-dialog modal-sm">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Create New Folder</h5>
                                            <button type="button" class="close" data-dismiss="modal"></button>
                                        </div>

                                        <div class="modal-body">
                                            <div class="form-group">
                                                <label class="form-label">Folder Name</label>
                                                <input type="text" class="form-control" name="category_name" placeholder="Enter a folder name" pattern="[A-Za-z0-9_\-]{3}">
                                            </div>
                                        </div>

                                        <div class="modal-footer justify-content-between">
                                            <button type="button" class="btn btn-outline-grey" data-dismiss="modal">Cancel</button>
                                            <button type="button" class="btn bg-primary" id="btn_save_category">Create</button>
                                        </div>
                                    </div>
                                </div>`
            document.body.append(modal)
        }


        $("#category_popup input[name=category_name]").val("")
        $("#category_popup").modal("show")
    },
    showDetailedPreview: function (index) {
        if (document.getElementById("detailed_preview_popup") == null) {
            const modal = document.createElement('div')
            modal.id = 'detailed_preview_popup'
            modal.className = 'modal fade'
            modal.innerHTML = `<div class="image_nav prev">
                                    <i class="icon-arrow-left12"></i>
                                </div>
                                <div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Detailed Preview<span class="ml-1 font12" id="detailed_preview_title"></span><span class="ml-1 darkgrey_color font12" id="detailed_preview_timestamp"></span></h5>
                                            <div class="close" data-dismiss="modal"></div>
                                            <div class="btn-toolbar justify-content-center d-none">
                                                <div class="btn-group mr-2">
                                                    <button type="button" class="btn btn-light">
                                                        <i class="icon-move-vertical"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-light">
                                                        <i class="icon-screen-full"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-light">
                                                        <i class="icon-alignment-unalign"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-light" data-dismiss="modal">
                                                        <i class="icon-x"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="modal-body">
                                            <div class="image_previewer" id="image_previewer">
                                               
                                            </div>
                                        </div>

                                        <div class="modal-footer justify-content-start">
                                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                                <label class="btn btn-light active">
                                                    <input type="radio" name="asset_preview_size" id="asset_preview_size" autocomplete="off" checked value="">
                                                    Original
                                                </label>
            
                                                <label class="btn btn-light">
                                                    <input type="radio" name="asset_preview_size" id="asset_preview_size" autocomplete="off" value="_l">
                                                    L (1024x1024)
                                                </label>
            
                                                <label class="btn btn-light">
                                                    <input type="radio" name="asset_preview_size" id="asset_preview_size" autocomplete="off" value="_m">
                                                    M (512x512)
                                                </label>
            
                                                <label class="btn btn-light">
                                                    <input type="radio" name="asset_preview_size" id="asset_preview_size" autocomplete="off" value="_t">
                                                    S (112x112)
                                                </label>
            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="image_nav next">
                                    <i class="icon-arrow-right13"></i>
                                </div>`
            document.body.append(modal)
            $("#detailed_preview_popup .image_nav").on("click", function (e) {
                var ele = null
                if ($(this).hasClass("prev")) {
                    if ($(".asset_card[data-index=" + FileManager.current_index + "]").index() == 2) {
                        ele = $($(".asset_card[data-index=" + FileManager.current_index + "]").parent().children()[$(".asset_card").length + 1])
                    } else {
                        ele = $(".asset_card[data-index=" + FileManager.current_index + "]").prev()
                    }
                } else {
                    if ($(".asset_card[data-index=" + FileManager.current_index + "]").index() - 1 == $(".asset_card").length) {
                        ele = $($(".asset_card[data-index=" + FileManager.current_index + "]").parent().children()[2])
                    } else {
                        ele = $(".asset_card[data-index=" + FileManager.current_index + "]").next()
                    }

                }
                FileManager.current_index = ele.data('index')
                FileManager.preparePreviewInfo()
            })

            $("#detailed_preview_popup input[name=asset_preview_size]").on("change", function (e) {
                $("#image_previewer").html('<img src="' + FileManager.assets[FileManager.current_index]['asset_url' + e.target.value] + '" class="">')
            })
        }
        FileManager.current_index = index;
        FileManager.preparePreviewInfo()
        $("#detailed_preview_popup").modal("show")
    },
    preparePreviewInfo: function () {
        const asset = FileManager.assets[FileManager.current_index];
        $("#image_previewer").html('<img src="' + asset.asset_url + '" class="">')
        $("#detailed_preview_title").text(asset.asset_name + " (" + nFormatter(asset.asset_size) + "B)")
        $("#detailed_preview_timestamp").text(getLocalTime(asset.create_time))

    },

    showEditAssetPopup: function (index) {
        if (document.getElementById("edit_asset_popup") == null) {
            const modal = document.createElement('div')
            modal.id = 'edit_asset_popup'
            modal.className = 'modal fade'
            modal.innerHTML = `<div class="modal-dialog modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Edit</h5>
                                            <div class="close" data-dismiss="modal"></div>
                                        </div>

                                        <div class="modal-body row">
                                            <div class="col-md-7">
                                                <div class="edit_img_preview">
                                                
                                                </div>
                                            </div>
                                            <div class="col-md-5">
                                                <form id="edit_asset_form">
                                                    <div class="form-group">
                                                        <label class="form-label">Alt Name</label>
                                                        <input type="text" class="form-control" name="asset_alt_name">
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="form-label">Tags</label>
                                                        <input type="text" class="form-control tokenfield" name="tags">
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="form-label">Name</label>
                                                        <input type="text" class="form-control" name="asset_name">
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="form-label">Description</label>
                                                        <textarea type="text" class="form-control" name="asset_desc"></textarea>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="form-label">File Path</label>
                                                        <textarea type="text" class="form-control" id="edit_asset_path" readonly rows=4></textarea>
                                                    </div>
                                                </form>
                                            </div>
                                               
                                        </div>

                                        <div class="modal-footer justify-content-between">
                                            <button class="btn btn-outline-grey" data-dismiss="modal">Cancel</button>
                                            <button class="btn btn-primary" id="btn_save_asset">Save</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="image_nav next">
                                    <i class="icon-arrow-right13"></i>
                                </div>`
            document.body.append(modal)
            $("#btn_save_asset").on("click", function (e) {
                FileManager.saveAssetInfo(serializeFormObject($("#edit_asset_form")))
            })
        }
        FileManager.prepareEditAsset(index)
        $("#edit_asset_popup").modal("show")
    },
    prepareEditAsset: function (index) {
        const asset = FileManager.assets[index];
        FileManager.current_index = index
        $("#edit_asset_form input[name=asset_alt_name]").val(asset.asset_alt_name)
        $("#edit_asset_form input[name=asset_name]").val(asset.asset_name)
        $("#edit_asset_form textarea[name=asset_desc]").val(asset.asset_desc)
        $("#edit_asset_path").text(asset.asset_url)
        if (asset.asset_type == "IMAGE") {
            $("#edit_asset_popup .edit_img_preview").html('<img src="' + asset.asset_url + '" class="img-fluid">')
        } else {
            let ext = asset.asset_url.split(".")
            ext = ext[ext.length - 1];

            $("#edit_asset_popup .edit_img_preview").html('<i class="' + FileManager.__icon[ext] + '"></i>')
            // $("#edit_asset_popup .edit_img_preview").html('<i class="'+FileManager.__icon[ext]+'"></i>')
        }

        $("#edit_asset_form input[name=tags]").removeAttr('data-fouc').tokenfield('destroy');
        $("#edit_asset_form input[name=tags]").val(asset.tags.join(', '))
        $("#edit_asset_form input[name=tags]").tokenfield();

        // $('#edit_asset_form input[name=tags]').tokenfield('setTokens',asset.tags);
    },
    saveAssetInfo: function (form_data) {
        if (empty(form_data['asset_name'])) {
            showAlertMessage("E", 'Name cannot be empty');
            return;
        }
        form_data['_id'] = FileManager.assets[FileManager.current_index]._id;
        form_data['tags'] = form_data['tags'].split(",")
        const data = {
            'cmd': 'saveAssetInfo',
            'update_rec': form_data
        }
        $.post("//" + __api_domain + "/user/services/api", data, function (response) {
            if (extractDataFromArray(response, ['data'], 0)) {
                showToastAlert("success", "Success", "Saved successfully!")
                let current_name = $(".asset_card[data-index='" + FileManager.current_index + "'] .asset_name").html()
                $(".asset_card[data-index='" + FileManager.current_index + "'] .asset_name").attr("title", form_data.asset_name)
                current_name = current_name.replace(FileManager.assets[FileManager.current_index].asset_name, form_data.asset_name)
                $(".asset_card[data-index='" + FileManager.current_index + "'] .asset_name").html(current_name)
                form_data['update_time'] = moment().format();
                FileManager.assets[FileManager.current_index] = { ...FileManager.assets[FileManager.current_index], ...form_data }
                $("#edit_asset_popup").modal("hide")
            } else {
                showToastAlert("error", "Error", "Please try again.")
            }
        })

    },
    deleteAssets: function (indexes) {
        let _ids = []
        indexes.forEach((id, index) => {
            _ids.push(FileManager.assets[id]._id)
        })

        const data = {
            'cmd': 'deleteAssets',
            '_ids': _ids
        }
        $.post("//" + __api_domain + "/user/services/api", data, function (response) {
            if (extractDataFromArray(response, ['data'], 0)) {
                showToastAlert("success", "Success", "Asset deleted!")
                var count;
                indexes.reverse().forEach((id, index) => {
                    var asset = FileManager.assets[id]
                    FileManager.assets.splice(id, 1)
                    if (asset.category != '') {
                        count = parseInt($("#asset_categories li[data-category='" + asset.category + "'] .category_count").text())
                        $("#asset_categories li[data-category='" + asset.category + "'] .category_count").text(count - 1)
                        $("#categories_dropdown li[data-category='" + asset.category + "'] .category_count").text(count - 1)
                    }
                    $(".asset_card[data-index=" + id + "]").remove()
                })
                count = parseInt($("#asset_categories li[data-category='All Files'] .category_count").text())
                $("#asset_categories li[data-category='All Files'] .category_count").text(count - indexes.length)
                $("#categories_dropdown li[data-category='All Files'] .category_count").text(count - indexes.length)
                FileManager.updateCategoryDeleted()

                FileManager.updateSelectedCards()
                $("#asset_categories li").remove()

                FileManager.fetchCategories()
            } else {
                showToastAlert("error", "Error", "Please try again.")
            }
        })
    },
    checkAssetExists(name, category, i = 0, callback = function () { }) {
        const data = {
            'cmd': 'checkAssetExists',
            'name': name,
            'category': category
        }
        $.post("//" + __api_domain + "/user/services/api", data, function (response) {
            const data = extractDataFromArray(response, ['data'], 0);
            if (data) {
                FileManager.showFileExistsPopup(name, category, function (replace) {
                    callback(replace)
                })
            } else {
                callback(!data)
            }
        })
    },

    moveAssetsToCategory: function (indexes, category) {
        FileManager.__skip_file_exists = 0;
        let i = 0;
        showLoaderOnBlock("#asset_container_overlay")
        const updateCategoryCounts = function (from_category, to_category) {
            if (to_category != 'All Files') {
                const to_category_count = parseInt($("#asset_categories li[data-category='" + to_category + "'] .category_count").text())
                $("#asset_categories li[data-category='" + to_category + "'] .category_count").text(to_category_count + 1)
                $("#categories_dropdown li[data-category='" + to_category + "'] .category_count").text(to_category_count + 1)
            }
            if (from_category != 'All Files') {
                const from_category_count = parseInt($("#asset_categories li[data-category='" + from_category + "'] .category_count").text())
                $("#asset_categories li[data-category='" + from_category + "'] .category_count").text(from_category_count - 1)
                $("#categories_dropdown li[data-category='" + from_category + "'] .category_count").text(from_category_count - 1)
            }
        }
        const moveAssetToCategory = function (indexes, replace = false, i = 0) {
            const data = {
                'cmd': 'moveAssetToCategory',
                '_id': FileManager.assets[indexes[i]]['_id'],
                'category': category,
                'replace': replace
            }
            $.post("//" + __api_domain + "/user/services/api", data, function (response) {
                if (extractDataFromArray(response, ['data'], 0)) {
                    if (i < indexes.length) {
                        updateCategoryCounts($("#asset_categories li.active").data('category'), category)
                        i += 1;
                        if (i == indexes.length) {
                            $("#asset_categories li[data-category='" + category + "']").click()
                            hideLoader("#asset_container_overlay")
                            FileManager.updateCategoryDeleted()
                            FileManager.updateSelectedCards();
                            FileManager.selectedCategory = category
                            FileManager.fetchCategories()
                            return;
                        }
                        if (FileManager.__skip_file_exists) {
                            moveAssetToCategory(indexes, FileManager.__file_exists_action, i)
                        } else {
                            FileManager.checkAssetExists(FileManager.assets[indexes[i]]['asset_name'], category, i, function (data) {
                                moveAssetToCategory(indexes, data, i)
                            })
                        }
                    }
                } else {
                    showToastAlert("error", "Error", "Please try again.")
                }
            })
        }
        FileManager.checkAssetExists(FileManager.assets[indexes[i]]['asset_name'], category, i, function (data) {
            moveAssetToCategory(indexes, data, i)
        })

    },
    getAssetById: function (id) {
        let matched_asset = {};
        FileManager.assets.forEach(asset => {
            if (asset._id == id) {
                matched_asset = asset
            }
        })
        return matched_asset;
    },
    prepareDrawer: function (index) {
        const asset = FileManager.assets[index]
        if (asset.asset_type == 'IMAGE' && !(asset.asset_url.toLowerCase()).endsWith(".gif") && !(asset.asset_url.toLowerCase()).endsWith(".svg")) {
            $(".img_file").show()
            $(".non_img_file").hide()
            $(".img_url_sizes .nav-link").removeClass("active")
            $("#drawer_image_url").html('<a href="' + asset.asset_url + '" target="_blank">https:' + asset.asset_url + '</a>')
            $("#drawer_image_url_og").attr("data-url", asset.asset_url)
            $("#drawer_image_url_md").attr("data-url", asset.asset_url_m)
            $("#drawer_image_url_th").attr("data-url", asset.asset_url_t)
            $("#drawer_image_url_og").addClass("active")
        } else {
            $(".img_file").hide()
            $(".non_img_file").show()
            $("#drawer_file_url").html('<a href="' + asset.asset_url + '" target="_blank">https:' + asset.asset_url + '</a>')
        }
        $("#drawer_file_category").text(asset.category == '' ? '-' : asset.category)
        $("#drawer_file_type").text(asset.asset_type)
        $("#drawer_file_url").html('<a href="' + asset.asset_url + '" target="_blank">https:' + asset.asset_url + '</a>')
        $("#drawer_file_alt_name").text(asset.asset_alt_name)
        $("#drawer_file_size").text(nFormatter(asset.asset_size) + "B")
        // $("#drawer_file_owner").text(asset.asset_owner ? asset.asset_owner : '-')
        $("#drawer_file_modified").text(getLocalTime(asset.update_time))
        $("#drawer_file_created").text(getLocalTime(asset.create_time))
        $("#asset_info_drawer .tokenfield").removeAttr('data-fouc').tokenfield('destroy');
        $("#drawer_file_tags").val(asset.tags.join(', '))
        $("#drawer_file_tags").tokenfield();
        $("#drawer_file_desc").val(empty(asset.asset_desc) ? '-' : asset.asset_desc)
        let className = 'preview_img '
        let icon = 'icon-image_4';
        switch (asset.asset_type) {
            case 'PDF':
                className += "pdf_file_color"
                icon = "icon-pdf"
                break;
            case 'DOC':
                className += "doc_file_color"
                icon = "icon-doc_4"
                break;
            case 'VIDEO':
                className += "video_file_color"
                icon = "icon-video_presentation"
                break;
            case 'AUDIO':
                className += "video_file_color"
                icon = "icon-tiktok"
                break;
            case 'SHEET':
                className += "excel_file_color"
                icon = "icon-excel_4"
                break;
            case 'CSS':
                className += "excel_file_color"
                icon = "icon-code"
                break;
        }
        $("#asset_info_drawer .file_header .file_icon").html("<i class='" + icon + "'></i>")
        $("#asset_info_drawer .file_header .file_name").text(asset.asset_name)
        $("#asset_info_drawer .preview_img")[0].className = className
        if (icon != "") {
            $("#asset_info_drawer .preview_img").html("<i class='" + icon + "' style='font-size:80px'></i>")
        }

        if (asset.asset_type == 'IMAGE') {
            $("#asset_info_drawer .preview_img").html('')
            $("#asset_info_drawer .preview_img").css("background-image", 'url(' + asset.asset_url + ')')
        } else {
            $("#asset_info_drawer .preview_img").css("background-image", 'unset')
        }

        // fontsLoader.loadGracefully()
    },
    initUploader: function (chosen_option) {
        const file_formats = {
            "IMAGE": 'image/*',
            "PDF": '.pdf',
            "DOC": '.docx,.doc,.odt,.txt',
            "AUDIO": '.mp3',
            "SHEET": '.xlsx,.xls,.ods,.csv,.tsv',
            "CSS": '.css,.css3',
            "VIDEO": '.mp4,.mkv,.avi,.webm,.3gp',
            // "VIDEO": 'video/*',
        }
        let format = '';
        if (chosen_option == 'any' && FileManager.file_type == 'All') {
            Object.keys(file_formats).forEach(type => {
                format += file_formats[type] + ','
            })
            $("#file_manager_upload_file").attr("accept", format.slice(0, -1))
            $("#file_manager_upload_file").click()
        } else if ((chosen_option == 'folder')) {
            $("#file_manager_upload_folder").click()
        } else {
            $("#file_manager_upload_file").attr("accept", file_formats[FileManager.file_type])
            $("#file_manager_upload_file").click()
        }

        FileManager.uploadlisteners()
    },

    showUploadingStatus: function () {
        $("#upload_status_container").show()
        $("#upload_status_container .upload_text").text("Processing ")
        // $("#upload_status_container .total_upload").text(FileManager.__files_to_upload.length)
        // $("#upload_status_container .uploaded_count").text(FileManager.__upload_total)
        $("#upload_status_container .final_status").text(", Uploaded " + FileManager.__upload_count)
        // if (i == 0) {
        // $("#upload_status_files").html("");
        // }
    },
    hideUploadingStatusBar: function () {
        $("#upload_status_container").hide();
    },
    clearUploadingStatusBar: function () {
        $("#upload_status_files").html("");
    },
    addFileToUploadStatus: function (file_name, type = "success", tooltip = '') {
        let icon_set = { success: '', error: 'icon-warning_error_1' }
        $("#upload_status_files").append(`<li data-name="` + file_name + `"><div class="file_name" title="` + file_name + `">` + file_name + `</div><div class="status" title="` + tooltip + `" ><i class="` + icon_set[type] + `"></i></div></li>`);

        $("#upload_status_files").scrollTop(function () { return this.scrollHeight; });
    },
    uploadlisteners: function () {
        $("#file_manager_upload_file, #file_manager_upload_folder").off("change").on("change", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation()
            var files = []
            for (var i = 0; i < e.target.files.length; i++) {
                var temp = {
                    file: e.target.files[i],
                    category: ''
                }
                if (typeof e.target.files[i].webkitRelativePath != 'undefined') {
                    temp.category = e.target.files[i].webkitRelativePath.split('/')[0]

                }
                files.push(temp)
            }

            FileManager.uploadHandler(files)
        })

    },
    getFileExtension: function (file_name) {
        let ext = file_name.split(".")
        ext = ext[ext.length - 1];
        return ext.toLowerCase();
    },
    uploadHandler: function (fileList) {
        showLoaderOnBlock("#asset_container_overlay")
        FileManager.clearUploadingStatusBar();
        if (fileList.length == 0) {
            hideLoader("#asset_container_overlay")
            return;
        }
        // if ((files.length) > FileManager.__max_files) {
        //     showAlertMessage("E", "Max " + FileManager.__max_files + " are allowed")
        //     e.target.value = "";
        //     return;
        // }
        var files = [];
        var i = 0;
        const allowed_files = {
            "IMAGE": {
                ".jpg": 1,
                ".jpeg": 1,
                ".png": 1,
                ".svg": 1,
                ".gif": 1,
            },
            "PDF": { '.pdf': 1 },
            "DOC": {
                '.docx': 1,
                '.doc': 1,
                '.odt': 1,
                '.txt': 1
            },
            "SHEET": {
                '.xlsx': 1,
                '.xls': 1,
                '.ods': 1,
                '.csv': 1,
                '.tsv': 1,
            },
            "AUDIO": {
                ".mp3": 1
            },
            "VIDEO": {
                ".mp4": 1,
                ".mkv": 1,
                ".avi": 1,
                ".webm": 1,
                ".3gp": 1,
            },
            "CSS": {
                ".css": 1,
                ".css3": 1,
            }
        }
        FileManager.error_files = [];
        let total_uploaded_file_size = 0;
        for (i = 0; i < fileList.length; ++i) {
            total_uploaded_file_size += fileList[i].file.size


            if (total_uploaded_file_size / 1048576 + FileManager.__total_file_size / 1048576 > FileManager.__total_size_capacity) {
                Swal.fire({
                    title: 'Max capacity reached',
                    text: 'Max capacity of file storage is ' + nFormatter(FileManager.__total_size_capacity * 1024 * 1024) + "B",
                    icon: 'warning',
                    confirmButtonText: 'Upgrade Plan',
                    showCancelButton: true,
                    reverseButtons: true,
                    cancelButtonText: 'Close',
                }).then(result => {
                    if (result.isConfirmed) {
                        location.href = '/pricing'
                    }
                })
                $("#file_manager_upload_file").val('')
                return;
            }

            if (fileList[i].file.size / 1048576 > FileManager.__max_file_size) {
                // if (fileList.length == 1) {
                //     showToastAlert('warning', 'Too big file', 'Max allowed file size is ' + nFormatter(FileManager.__max_file_size * 1024 * 1024) + 'B', () => {
                //         $("#file_manager_upload_file").val('')
                //         setTimeout(() => {
                //             hideLoader("#asset_container_overlay")
                //         }, 250)
                //     })

                //     return;
                // }

                FileManager.error_files.push({
                    name: fileList[i].file.name,
                    type: 'big_file',
                    size: fileList[i].file.size,
                    error_msg: 'Max allowed file size is ' + nFormatter(FileManager.__max_file_size * 1024 * 1024) + 'B'
                })
                continue;
            }

            let ext = FileManager.getFileExtension(fileList[i].file.name);

            if (FileManager.file_type == 'All' && !allowed_files.hasOwnProperty(FileManager.file_type)) {
                allowed_files['All'] = {}
                Object.keys(allowed_files).forEach(file_type => {
                    Object.keys(allowed_files[file_type]).forEach(extension => {
                        allowed_files['All'][extension] = 1;
                    })
                })
            }
            if (allowed_files.hasOwnProperty(FileManager.file_type)) {
                if (!allowed_files[FileManager.file_type].hasOwnProperty("." + ext)) {
                    let allowed_exts = '';
                    Object.keys(allowed_files[FileManager.file_type]).forEach(extension => {
                        allowed_exts += extension + ", "
                    })
                    // SwalPopup.showSingleButtonPopup({
                    //     icon: 'warning',
                    //     html: ext + " format is not allowed. <br />Only " + allowed_exts.substr(0, allowed_exts.length - 2) + " are allowed."
                    // }, () => {
                    //     setTimeout(() => {
                    //         hideLoader("#asset_container_overlay")
                    //     }, 250)
                    // })
                    FileManager.error_files.push({
                        name: fileList[i].file.name,
                        type: 'not_supported',
                        ext,
                        error_msg: "<div class='mb-2'>" + ext + " format is not allowed. </div><div class='mb-2'>Please select the correct type and upload only " + allowed_exts.substr(0, allowed_exts.length - 2) + " file."
                    })
                    continue;
                    // FileManager.addFileToUploadStatus(fileList[i].file.name, 'error', 'File format not supported')

                }
            }

            files.push(fileList[i]);

        }
        if (empty(files)) {
            FileManager.showFileUploadErrorMsg()
            $("#file_manager_upload_file").val('')
            return
        }
        FileManager.__files_to_upload = files;
        FileManager.__skip_file_exists = 0;
        FileManager.showUploadingStatus()
        FileManager.checkAndProceedToNextFile(-1);


    },
    showFileUploadErrorMsg: function () {
        if (empty(FileManager.error_files.length)) {
            return;
        }
        if (FileManager.error_files.length == 1) {
            SwalPopup.showSingleButtonPopup({
                icon: 'warning',
                title: 'Error in Uploading',
                html: FileManager.error_files[0].error_msg
            }, () => {
                setTimeout(() => {
                    hideLoader("#asset_container_overlay")
                }, 250)
            })
        } else {
            FileManager.showUploadingStatus()
            FileManager.error_files.forEach(file => {
                FileManager.addFileToUploadStatus(file.name, 'error', file.type == 'big_file' ? file.error_msg : 'File format not supported')
            })
            SwalPopup.showSingleButtonPopup({
                icon: 'warning',
                title: 'Upload Incomplete',
                text: 'Two of your files failed to upload. Please check the error logs in the upload status section.'
            }, () => {
                setTimeout(() => {
                    hideLoader("#asset_container_overlay")
                }, 250)
            })
        }
    },

    uploadAsset: function (file, category, replace, i) {
        if (!isUndefined(file.file)) {
            file = file.file
        }
        FileManager.__upload_count += 1

        category = category == '' ? $("#asset_categories li.active").data('category') : category;
        category = category == 'All Files' ? '' : category;
        if (typeof file.webkitRelativePath != 'undefined' && empty(category)) {
            category = file.webkitRelativePath.split('/')[0]
        }

        let data = new FormData();

        data.append('file', file);
        data.append("params", JSON.stringify([["l", 1024, 1024, 93, 0], ["m", 512, 512, 93, 0], ["t", 112, 112, 93, 0]]));//
        data.append("cmd", "uploadAsset");
        data.append("category", category);
        data.append("replace", replace);
        $.ajax({
            data: data,
            type: "POST",
            url: "//" + __api_domain + "/user/services/api",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (!empty(response.data) && extractDataFromArray(response, ['data', 'asset_url'], false)) {
                    $("#upload_status_files li[data-name='" + file.name + "']").find(".status").html('<i class="icon-tickmark text-success"></i>')
                    if ($("#asset_categories li[data-category='" + category + "']").length == 0 && category != '') {
                        $("#asset_categories li.active").removeClass("active")
                        FileManager.prepareCategorySidebarItem(category, 'active')
                        $("#asset_categories li.active").click()
                        FileManager.selectedCategory = category
                    } else {
                        FileManager.assets.push(response.data)
                        let count = $("#asset_categories li[data-category='" + category + "'] .category_count")
                        $("#asset_categories li[data-category='" + category + "'] .category_count").text(parseInt(count) + 1)
                        $("#asset_container").append(FileManager.prepareAssetCard(response.data, FileManager.assets.indexOf(response.data), ''))
                        $('#asset_container .form-check-input-styled').uniform();
                    }
                }
                else {
                    $("#upload_status_files li[data-name='" + file.name + "']").find(".status").html('<i class="icon-warning_error_1 red_color"></i>');
                }
                FileManager.checkAndProceedToNextFile(i);

            }
        });
    },

    checkAndProceedToNextFile: function (i) {
        if (i >= 0 && i < FileManager.__files_to_upload.length) {
            FileManager.__files_to_upload[i] = null;
        }
        ++i;
        if (i >= FileManager.__files_to_upload.length) {
            hideLoader("#asset_container_overlay")

            $("#asset_categories li").remove()
            FileManager.__refresh_image = "?v=" + random_int();
            FileManager.fetchCategories();
            FileManager.__skip_file_exists = 0;
            FileManager.__file_exists_action = 0;
            FileManager.__files_to_upload = [];
            FileManager.__upload_count = 0;
            FileManager.__upload_total = 0;

            FileManager.showFileUploadErrorMsg()
            $("#file_manager_upload_file").val('')

            return;
        }

        FileManager.__upload_total += 1;
        FileManager.showUploadingStatus(i);

        var fileObj = FileManager.__files_to_upload[i];
        $("#upload_status_files").append(`<li data-name="` + fileObj.file.name + `"><div class="file_name" title="` + fileObj.file.name + `">` + fileObj.file.name + `</div><div class="status"><i class="icon-refresh spinner"></i></div></li>`);

        $("#upload_status_files").scrollTop(function () { return this.scrollHeight; });

        if (FileManager.__skip_file_exists) {
            if (FileManager.__file_exists_action != 2) { //make sure its not ignore
                _imageCompressor.initImageCompress(fileObj, "", function (imageData) {
                    FileManager.uploadAsset(imageData, fileObj.category, FileManager.__file_exists_action, i)
                    imageData = null;
                }, FileManager.__file_exists_action, i);
            } else {
                FileManager.__skip_file_exists = 0;
                FileManager.__file_exists_action = 0;
                FileManager.__files_to_upload = [];
                FileManager.__upload_count = 0;
                FileManager.__upload_total = 0;
                hideLoader("#asset_container_overlay")
                $("#upload_status_container").hide()
                return
            }
        } else {
            FileManager.checkAssetExists(fileObj.file.name, fileObj.category, i, function (replaceFile) {
                // FileManager.uploadAsset(files, replaceFile, i)

                if (replaceFile != 2) //NOT TO skip the file
                {
                    _imageCompressor.initImageCompress(fileObj, "", function (imageData) {
                        FileManager.uploadAsset(imageData, fileObj.category, replaceFile, i)
                        imageData = null;
                    }, replaceFile, i);
                }
                else //skip file
                {
                    $("#upload_status_files li[data-name='" + fileObj.file.name + "']").find(".status").html('<i class="text-success">skipped...</i>')
                    //$("#upload_status_files").append(`<li data-name="` + fileObj.file.name + `"><div class="file_name" title="` + fileObj.file.name + `">` + fileObj.file.name + `</div><div class="status"><i>skipped...</i></div></li>`)
                    $("#file_exists_popup").modal("hide")
                    FileManager.checkAndProceedToNextFile(i)
                }
            })
        }
    },


    showFileExistsPopup: function (file_name, category, callback = () => { }) {
        if (document.getElementById("file_exists_popup") == null) {
            const modal = document.createElement('div')
            modal.id = 'file_exists_popup'
            modal.className = 'modal fade modal_center'
            modal.innerHTML = `<div class="modal-dialog modal-md">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">File name already exists!</h5>
                                            <button type="button" class="close" data-dismiss="modal" id="close_file_exists_popup">×</button>
                                        </div>

                                        <div class="modal-body">
                                            <label class="">This file name (<span id="file_exists_filename"></span>) already exists in this folder. How do you want to proceed?</label>
                                            <div class="form-group mt-2 mb-0">
                                                <div class="form-check form-check-inline">
                                                    <label class="form-check-label">
                                                        <input type="checkbox" class="form-check-input-styled" id="file_exists_action_check">
                                                        Do this action for all files
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="modal-footer justify-content-between">
                                        
                                        <div>
                                        <button type="button" class="btn btn-success" id="btn_file_name_skip">Skip File</button>
                                        <button type="button" class="btn btn-danger" id="btn_file_name_replace">Replace</button>
                                        <button type="button" class="btn bg-primary" id="btn_new_file_name">New File</button>
                                        </div>
                                            <button type="button" class="btn btn-outline-grey" id="btn_file_name_abort">Cancel</button>
                                        </div>
                                    </div>
                                </div>`
            document.body.append(modal)
        }
        $("#close_file_exists_popup, #btn_file_name_abort").off("click").on("click", function (e) {
            hideLoader('#asset_container_overlay')
            FileManager.updateSelectedCards();
            $("#file_exists_popup").modal("hide")
            $("#upload_status_container").hide()
        })
        $("#btn_file_name_skip").off("click").on("click", function (e) {
            if ($("#file_exists_action_check").prop("checked")) {
                FileManager.__skip_file_exists = 1;
                FileManager.__file_exists_action = 2
            }
            // $("#file_exists_popup").modal("hide")
            callback(2)
        })
        $("#btn_new_file_name").off("click").on("click", function (e) {
            if ($("#file_exists_action_check").prop("checked")) {
                FileManager.__skip_file_exists = 1;
                FileManager.__file_exists_action = false
            }
            $("#file_exists_popup").modal("hide")
            callback(false)
        })
        $("#btn_file_name_replace").off("click").on("click", function (e) {
            if ($("#file_exists_action_check").prop("checked")) {
                FileManager.__skip_file_exists = 1;
                FileManager.__file_exists_action = true
            }
            $("#file_exists_popup").modal("hide")
            callback(true)
        })

        $("#file_exists_filename").text(file_name)
        $("#file_exists_category").text(category)
        $("#file_exists_popup input[type=checkbox]").uniform()
        setTimeout(() => {
            $("#file_exists_popup").modal("show")
        }, 1000);
    },
    showCategoryExistsPopup: function (callback = () => { }) {
        if (document.getElementById("category_exists_popup") == null) {
            const modal = document.createElement('div')
            modal.id = 'category_exists_popup modal_center'
            modal.className = 'modal fade'
            modal.innerHTML = `<div class="modal-dialog modal-sm">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">File name already exists!</h5>
                                            <button type="button" class="close" data-dismiss="modal">×</button>
                                        </div>

                                        <div class="modal-body">
                                            <label class="">This file name (<span id="file_exists_filename"></span>) already exists under <span id="file_exists_category"></span>. Do you want to replace the file or create new file name?</label>
                                            <div class="form-group mt-2 mb-0">
                                                <div class="form-check form-check-inline">
                                                    <label class="form-check-label">
                                                        <input type="checkbox" class="form-check-input-styled" >
                                                        Do this action for all files
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="modal-footer justify-content-between">
                                            <button type="button" class="btn btn-danger" id="btn_file_name_override">Replace</button>
                                            <button type="button" class="btn bg-primary" id="btn_new_file_name">New Filename</button>
                                        </div>
                                    </div>
                                </div>`
            document.body.append(modal)
        }

        $("#category_exists").text(category)
        $("#category_exists_popup input[type=checkbox]").uniform()
        $("#category_exists_popup").modal("show")
    },
    updateCategoryDeleted: function () {
        $(".btn_delete_asset_category").addClass("disabled")
        Array.from($("#asset_categories li")).forEach(item => {
            if ($(item).find(".category_count").text() == '0') {
                $(item).find(".btn_delete_asset_category").removeClass("disabled")
            }
        })
    },
    createCategory: function (category, callback = function () { }) {
        const data = {
            'cmd': 'createCategory',
            'category': category
        }
        $.post("//" + __api_domain + "/user/services/api", data, function (response) {
            if (extractDataFromArray(response, ['errorCode'], 0) == 0) {
                $("#category_popup").modal("hide")
                callback()
                showToastAlert('success', 'Success', 'Folder created successfully!')
                FileManager.fetchCategories()
            } else {
                showToastAlert('error', 'Error occurred', extractDataFromArray(response, ['errorMsg'], 'Please try again.'))
            }
        })
    },
    deleteCategory: function (category) {
        const data = {
            'cmd': 'deleteCategory',
            'category': category
        }
        $.post("//" + __api_domain + "/user/services/api", data, function (response) {
            if (extractDataFromArray(response, ['data'], 0)) {
                $("#asset_categories li[data-category='" + category + "']").remove()
                $("#asset_categories li[data-category='All Files']").click()
                showToastAlert('success', 'Success', 'Folder deleted successfully!')
            } else {
                showToastAlert('error', 'Error occurred', 'Please try again')
            }
        })
    },
    includeCss: function () {
        let style = document.createElement('style')
        style.innerHTML = `:root{--file-manager-light-color:#eceef7}#filemanager_popup .modal_full_size{max-width:98%;margin:1em}#filemanager_popup{overflow:hidden!important}margin #filemanager_popup .modal-content{height:calc(100vh - 2em)!important}#category_popup,#detailed_preview_popup,#edit_asset_popup,#file_exists_popup,#filemanager_popup{z-index:9999}#category_popup .modal-header .close,#detailed_preview_popup .modal-header .close,#filemanager_popup .modal-header .close{background-image:url(/assets/images/close.svg);background-size:16px;position:relative;top:10px;right:15px;background-repeat:no-repeat}#filemanager_popup .border-bottom,#filemanager_popup .border-right{border-color:var(--file-manager-light-color)!important}#asset_categories li{padding:5px 5px;cursor:pointer;overflow-wrap:anywhere;display:flex;justify-content:space-between}#categories_dropdown{min-width:250px}#categories_dropdown li{padding:10px;cursor:pointer}#asset_categories .active{color:var(--primary-color)!important}#asset_container .asset_card{border:1px solid #ddd;border-radius:8px;box-shadow:unset;cursor:pointer;width:210px;margin-right:19px;margin-bottom:19px}#asset_container .asset_card.select{border-color:var(--primary-color)!important}#edit_asset_popup .edit_img_preview i{font-size:80px}#edit_asset_popup .edit_img_preview img{height:auto}#asset_container .asset_card .preview_card_img i{font-size:80px;color:#fff}#asset_container .asset_card .preview_card_img{width:100%;height:185px;border-radius:8px 8px 0 0;background-size:contain;background-repeat:no-repeat;background-position:center;display:flex;justify-content:center;align-items:center}#asset_container .asset_card .card-body{background-color:var(--file-manager-light-color);border-radius:0 0 8px 8px}#asset_container .asset_card .asset_name i{vertical-align:sub}#asset_container .asset_card .asset_name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#asset_container .asset_card .asset_actions a{padding:5px;cursor:pointer}#asset_container{max-height:calc(100vh - 11em);min-height:calc(100vh - 11em);overflow-y:scroll;padding-right:0!important;align-items:start;align-content:baseline}#filemanager_container .dropdown-toggle::after{display:none;color:unset!important;right:7px}.btn-outline-grey{color:var(--secondary_color);background-color:var(--file-manager-light-color);border-color:var(--lightgrey_color)}.btn-outline-grey:hover{background-color:var(--lightgrey_color)!important}.btn-outline-white-no-hover{background-color:#fff;color:var(--secondary_color);border-color:var(--lightgrey_color)}.asset_card .preview_card_img .select_box{position:absolute;top:10px;background:#fff;left:10px}.asset_card .preview_card_img .select_box span{border-color:var(--darkgrey_color)!important}.asset_card.select .preview_card_img .select_box .checked{border-color:var(--primary-color)!important;color:var(--primary-color)!important}#asset_info_drawer{width:0;height:calc(100vh - 11em);overflow-y:scroll;position:absolute;right:0;z-index:2;top:70px;box-shadow:-4px 0 16px -13px rgba(0,0,0,.75)}#filemanager_popup select{height:auto!important}#asset_info_drawer.expand{width:39%}#asset_info_drawer .card-header{background-color:var(--file-manager-light-color)}#asset_info_drawer .tokenfield.disabled{border:0;background:unset}#asset_info_drawer .card-header .close{background-image:url(/assets/images/close.svg);background-repeat:no-repeat;width:18px;height:18px}#asset_info_drawer table tbody tr td:nth-child(2){max-width:270px}#asset_container .pdf_file_color{background-color:#ffa3a3}#asset_container .doc_file_color{background-color:#acffa3}#asset_container .excel_file_color{background-color:#a3acff}#asset_container .video_file_color{background-color:#ffe8a3}#asset_info_drawer .file_header .file_icon i{width:25px}#asset_info_drawer .file_header .file_name{max-width:290px;text-overflow:ellipsis;overflow:hidden;/*height:1.2em*/;white-space:nowrap}#asset_info_drawer .preview_img{width:100%;height:150px;display:flex;align-items:center;justify-content:center;font-size:40px;color:#fff;border-radius:4px;background-size:contain;background-position:center;background-repeat:no-repeat}#asset_info_drawer table tr td:first-child{color:var(--lightgrey_color);padding:5px}#detailed_preview_popup .image_previewer{height:67vh;display:flex;justify-content:center;align-items:center;width:100%;overflow:hidden}#detailed_preview_popup{display:block;background:#000000ab}#detailed_preview_popup .image_nav i:hover{border-radius:50%;background:#ddd3}#detailed_preview_popup .image_nav{position:absolute;top:47%;font-size:50px;color:var(--lightgrey_color);transform:translate(0,-20%);cursor:pointer}#detailed_preview_popup .prev{left:10%}#detailed_preview_popup .next{right:10%}#edit_asset_popup .modal-header .close{background-image:url(/assets/images/close.svg);background-size:16px;position:relative;top:25px;background-repeat:no-repeat}#edit_asset_popup .edit_img_preview{display:flex;justify-content:center;align-items:center;width:100%;height:calc(100vh - 300px);border:1px solid var(--file-manager-light-color);padding:20px}#file_manager_type_filter{min-width:100px}.upload_status_header .close{background-image:url(/view/common/images/modal-close-white.svg);background-size:16px;position:relative;top:2px;background-repeat:no-repeat;width:15px;height:15px}#upload_status_container{position:absolute;bottom:0;right:1.25rem;width:300px;border:1px solid var(--lightgrey_color);border-radius:4px;background-color:#fff}#upload_status_files li{padding:15px;border-bottom:1px solid var(--file-manager-light-color);display:flex;justify-content:space-between}#upload_status_files li .file_name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:215px}#upload_status_files{max-height:260px;overflow:scroll}#asset_categories .btn_delete_asset_category.disabled{color:var(--lightgrey_color);pointer-events:none}#no_asset_data.show{display:flex!important}#no_asset_data{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;background:var(--file-manager-light-color);height:300px;border-radius:50%;display:none;justify-content:center;align-items:center}#btn_create_asset_category{color:var(--primary-color)!important}.modal_center{top:50%;left:50%;transform:translate(-50%,-50%)}.report-card{cursor:pointer;padding:15px}.sankey_tooltip{z-index:999999;background-color:#fff;color:var(--secondary_color);border:1px solid var(--file-manager-light-color);box-shadow:0 1px 10px rgba(0,0,0,.1)}#template_name_editor{display:none}#template_name_editor.show{display:flex!important}.select2-container{outline:0;position:relative;display:inline-block;vertical-align:middle;text-align:left;min-width:150px}.select2-selection--single{cursor:pointer;outline:0;display:block;height:36px;padding:7px 0;line-height:1.5384616;position:relative;border:1px solid transparent;white-space:nowrap;border-radius:3px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.select2-container--open .select2-selection--single,.select2-selection--single:focus,.select2-selection--single:hover{-webkit-box-shadow:0 0 0 100px rgba(0,0,0,.01) inset;box-shadow:0 0 0 100px rgba(0,0,0,.01) inset}.select2-selection--single:not([class*=bg-]){background-color:#fff;color:#333}.select2-selection--single:not([class*=bg-]):not([class*=border-]){border-color:#ddd}.select2-container--open .select2-selection--single[class*=bg-],.select2-selection--single[class*=bg-]:focus,.select2-selection--single[class*=bg-]:hover{-webkit-box-shadow:0 0 0 100px rgba(0,0,0,.025) inset;box-shadow:0 0 0 100px rgba(0,0,0,.025) inset}.select2-selection--single[class*=bg-] .select2-selection__placeholder{color:#fff}.select2-container--disabled .select2-selection--single[class*=bg-] .select2-selection__placeholder{color:rgba(255,255,255,.75)}.select2-selection--single .select2-selection__rendered{display:block;padding-left:12px;padding-right:31px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.select2-selection--single .select2-selection__rendered>i{margin-right:10px}.select2-selection--single .select2-selection__clear{position:relative;cursor:pointer;float:right;font-size:0;line-height:1;margin-top:2px;margin-left:5px;opacity:.75}.select2-selection--single .select2-selection__clear:hover{opacity:1}.select2-selection--single .select2-selection__clear:after{content:'\ed6b';font-family:icomoon;display:inline-block;font-size:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.select2-selection--single .select2-selection__placeholder{color:#999}.select2-selection--single .select2-selection__arrow:after{content:'\\e995';font-family:Icomoon;display:inline-block;position:absolute;top:50%;right:12px;margin-top:-8px;font-size:16px;line-height:1;color:inherit;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.select2-container--open .select2-selection--single .select2-selection__arrow:after{content:'\\e997'}.select2-selection--single .select2-selection__arrow b{display:none}.select2-container--disabled .select2-selection--single{cursor:not-allowed;-webkit-box-shadow:none;box-shadow:none}.select2-container--disabled .select2-selection--single:not([class*=bg-]){background-color:#fafafa;color:#999}.select2-container--disabled .select2-selection--single[class*=bg-]{-webkit-box-shadow:0 0 0 100px rgba(255,255,255,.25) inset;box-shadow:0 0 0 100px rgba(255,255,255,.25) inset}.select2-container--disabled .select2-selection--single .select2-selection__clear{display:none}.select2-selection--multiple{display:block;border:1px solid transparent;border-radius:3px;cursor:text;outline:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.select2-selection--multiple:not([class*=bg-]){background-color:#fff}.select2-selection--multiple:not([class*=bg-]):not([class*=border-]){border-color:#ddd}.select2-selection--multiple .select2-selection__rendered{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;list-style:none;margin:0;padding:0 2px 2px 2px;width:100%}.select2-selection--multiple .select2-selection__placeholder{color:#999}.select2-container--disabled .select2-selection--multiple:not([class*=bg-]){background-color:#fafafa;color:#999}.select2-container--disabled .select2-selection--multiple[class*=bg-]{-webkit-box-shadow:0 0 0 100px rgba(255,255,255,.25) inset;box-shadow:0 0 0 100px rgba(255,255,255,.25) inset}.select2-container--disabled .select2-selection--multiple[class*=bg-] .select2-selection__choice{opacity:.9}.select2-container--disabled .select2-selection--multiple,.select2-container--disabled .select2-selection--multiple .select2-search__field,.select2-container--disabled .select2-selection--multiple .select2-selection__choice{cursor:not-allowed}.select2-selection--multiple .select2-selection__choice{background-color:#455a64;color:#fff;border-radius:3px;cursor:default;float:left;margin-right:2px;margin-top:2px;padding:7px 12px}.select2-selection--multiple .select2-selection__choice>i{margin-right:10px}.select2-selection--multiple .select2-selection__choice .select2-selection__choice__remove{cursor:pointer;float:right;font-size:14px;margin-top:3px;line-height:1;margin-left:7px;opacity:.75}.select2-selection--multiple .select2-selection__choice .select2-selection__choice__remove:hover{opacity:1}.select2-container--disabled .select2-selection--multiple .select2-selection__choice{opacity:.6}.select2-container--disabled .select2-selection--multiple .select2-selection__choice .select2-selection__choice__remove{display:none}.select2-selection--multiple .select2-search--inline{float:left}.select2-selection--multiple .select2-search--inline .select2-search__field{font-size:100%;margin-top:2px;padding:7px 0;background-color:transparent;border:0;outline:0;margin-left:7px;-webkit-appearance:textfield}.select2-selection--multiple .select2-search--inline .select2-search__field::-webkit-search-cancel-button{-webkit-appearance:none}.select2-dropdown{background-color:#fff;color:#333;border:1px solid #ddd;border-radius:3px;display:block;position:absolute;left:-100000px;width:100%;z-index:9999;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.1);box-shadow:0 1px 3px rgba(0,0,0,.1)}.select2-results{display:block}.select2-results__options{list-style:none;margin:0;padding:0}.select2-results>.select2-results__options{padding-bottom:7px;max-height:250px;overflow-y:auto}.select2-search--hide+.select2-results>.select2-results__options{padding-top:7px}.select2-results:first-child>.select2-results__options{padding-top:7px}.select2-results__option{padding:7px 12px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.select2-results__option+.select2-results__option{margin-top:1px}.select2-results__option i{margin-right:10px}.select2-results__option i.icon-undefined{display:none}.select2-results__option[role=group]{padding:0}.select2-results__option.select2-results__option--highlighted{background-color:#f5f5f5}.select2-results__option[aria-disabled=true]{color:#999;cursor:not-allowed}.select2-dropdown[class*=bg-] .select2-results__option[aria-disabled=true]{color:rgba(255,255,255,.6)}.select2-results__option[aria-selected=true]{background-color:#2196f3;color:#fff}.select2-results__options--nested>.select2-results__option{padding-left:24px;padding-right:24px}.select2-results__group{display:block;padding:7px 12px;font-size:11px;line-height:1.82;text-transform:uppercase;cursor:default;margin-top:7px;margin-bottom:7px}.select2-results__option:first-child>.select2-results__group{margin-top:0}.select2-results__message{color:#999;cursor:default}.select2-dropdown[class*=bg-] .select2-results__message{color:rgba(255,255,255,.75)}.select2-results__option.loading-results{padding-top:0}.select2-results__option.loading-results+.select2-results__option{margin-top:7px}.select2-results__option--load-more{text-align:center;margin-top:7px;cursor:default}.select2-container--open .select2-dropdown{left:0}.select2-container--open .select2-dropdown--above{border-bottom:0;border-bottom-left-radius:0;border-bottom-right-radius:0}.select2-container--open .select2-dropdown--above[class*=bg-]{border-bottom:1px solid rgba(255,255,255,.2)}.select2-container--open.select2-container--above .select2-selection--multiple,.select2-container--open.select2-container--above .select2-selection--single{border-top-right-radius:0;border-top-left-radius:0}.select2-container--open .select2-dropdown--below{border-top:none;border-top-left-radius:0;border-top-right-radius:0}.select2-container--open .select2-dropdown--below[class*=bg-]{border-top:1px solid rgba(255,255,255,.2)}.select2-container--open.select2-container--below .select2-selection--multiple,.select2-container--open.select2-container--below .select2-selection--single{border-bottom-right-radius:0;border-bottom-left-radius:0}.select2-search--dropdown{display:block;position:relative;padding:12px}.select2-search--dropdown:after{content:'\\e9a1';font-family:icomoon;position:absolute;top:58%;left:24px;color:inherit;display:block;font-size:12px;margin-top:-6px;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;opacity:.6}.select2-search--dropdown+.select2-results .select2-results__message:first-child{padding-top:0}.select2-search--dropdown .select2-search__field{height:36px;padding:7px 12px;padding-left:36px;border-radius:3px;border:1px solid #ddd;outline:0;width:100%}.select2-search--dropdown .select2-search__field::-webkit-search-cancel-button{-webkit-appearance:none}.select2-search--dropdown.select2-search--hide{display:none}.select-lg.select2-selection--single{height:40px;padding:9px 0;font-size:14px}.select-lg.select2-selection--single .select2-selection__rendered{padding-left:15px;padding-right:34px}.select-lg.select2-selection--single .select2-selection__arrow:after{right:15px}.select-lg.select2-selection--multiple .select2-selection__choice{padding:9px 15px;font-size:14px}.select-lg.select2-selection--multiple .select2-search--inline .select2-search__field{padding:9px 0;font-size:14px}.select-sm.select2-selection--single{height:34px;padding:6px 0;font-size:12px;line-height:1.6666667}.select-sm.select2-selection--single .select2-selection__rendered{padding-left:11px;padding-right:26px}.select-sm.select2-selection--single .select2-selection__arrow:after{right:11px}.select-sm.select2-selection--multiple .select2-selection__choice{padding:6px 11px;font-size:12px;line-height:1.6666667}.select-sm.select2-selection--multiple .select2-search--inline .select2-search__field{padding:6px 0}.select-xs.select2-selection--single{height:32px;padding:5px 0;font-size:12px;line-height:1.6666667}.select-xs.select2-selection--single .select2-selection__rendered{padding-left:10px;padding-right:24px}.select-xs.select2-selection--single .select2-selection__arrow:after{right:10px}.select-xs.select2-selection--multiple .select2-selection__choice{padding:5px 10px;font-size:12px;line-height:1.6666667}.select-xs.select2-selection--multiple .select2-search--inline .select2-search__field{padding:5px 0;font-size:12px;line-height:1.6666667}.select2-selection--multiple[class*=bg-] .select2-selection__choice{background-color:rgba(0,0,0,.25)}.select2-dropdown[class*=bg-] .select2-search--dropdown .select2-search__field{background-color:rgba(0,0,0,.2);border-color:transparent;color:#fff}.select2-dropdown[class*=bg-] .select2-results__option[aria-selected=true]{background-color:rgba(0,0,0,.2)}.select2-dropdown[class*=bg-] .select2-results__option--highlighted{background-color:rgba(0,0,0,.1)}.select2-close-mask{border:0;margin:0;padding:0;display:block;position:fixed;left:0;top:0;min-height:100%;min-width:100%;height:auto;width:auto;z-index:99;background-color:#fff;opacity:0}.select2-hidden-accessible{border:0!important;clip:rect(0 0 0 0)!important;height:1px!important;margin:-1px!important;overflow:hidden!important;padding:0!important;position:fixed!important;width:1px!important}.select2-result-repository{padding-top:7px;padding-bottom:7px}.select2-result-repository__avatar{float:left;width:60px;margin-right:15px}.select2-result-repository__avatar img{width:100%;height:auto;border-radius:100px}.select2-result-repository__meta{margin-left:70px}.select2-result-repository__title{font-weight:500;word-wrap:break-word;margin-bottom:2px}.select2-result-repository__forks,.select2-result-repository__stargazers,.select2-result-repository__watchers{display:inline-block;font-size:12px}.select2-result-repository__description{font-size:12px}.select2-result-repository__forks,.select2-result-repository__stargazers{margin-right:15px}.uniform-checker,.uniform-choice{position:relative;cursor:pointer;vertical-align:middle}.uniform-checker,.uniform-checker input,.uniform-checker span,.uniform-choice,.uniform-choice input,.uniform-choice span{width:1.25rem;height:1.25rem}.uniform-checker span,.uniform-choice span{border:.125rem solid #455a64;display:inline-block;text-align:center;position:relative}.uniform-checker span.checked:after,.uniform-choice span.checked:after{opacity:1}.uniform-checker input[type=checkbox],.uniform-checker input[type=radio],.uniform-choice input[type=checkbox],.uniform-choice input[type=radio]{border:0;background:0 0;display:inline-block;margin:0;cursor:pointer;position:absolute;top:-.125rem;left:-.125rem;visibility:visible;opacity:0;z-index:2}.form-check.form-check-inline .uniform-checker input[type=checkbox],.form-check.form-check-inline .uniform-checker input[type=radio],.form-check.form-check-inline .uniform-choice input[type=checkbox],.form-check.form-check-inline .uniform-choice input[type=radio]{margin-left:0;margin-right:0}.form-check .uniform-checker,.form-check .uniform-choice{position:absolute;top:.00002rem;left:0}.form-check-right .uniform-checker,.form-check-right .uniform-choice{left:auto;right:0}.form-check-inline .uniform-checker,.form-check-inline .uniform-choice{position:static;margin-right:.625rem;margin-top:.00002rem}.form-check-inline.form-check-right .uniform-checker,.form-check-inline.form-check-right .uniform-choice{margin-right:0;margin-left:.625rem}.uniform-checker.disabled,.uniform-choice.disabled{opacity:.5}.uniform-checker.disabled,.uniform-checker.disabled input,.uniform-choice.disabled,.uniform-choice.disabled input{cursor:default}.uniform-checker span{color:#455a64;border-radius:.125rem;transition:border-color ease-in-out .15s,color ease-in-out .15s}@media screen and (prefers-reduced-motion:reduce){.uniform-checker span{transition:none}}.uniform-checker span:after{content:"\\ea10";font-family:icomoon;font-size:.6rem;position:absolute;top:4px;left:3px;line-height:1;opacity:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:opacity ease-in-out .15s}@media screen and (prefers-reduced-motion:reduce){.uniform-checker span:after{transition:none}}.form-check-light .uniform-checker span{border-color:#fff;color:#fff}.uniform-checker[class*=border-] span{border-color:inherit;color:inherit}.uniform-choice{border-radius:100px}.uniform-choice span{border-radius:100px;transition:border-color ease-in-out .15s}@media screen and (prefers-reduced-motion:reduce){.uniform-choice span{transition:none}}.uniform-choice span:after{content:"";position:absolute;top:.1875rem;left:.1875rem;border:.3125rem solid;border-color:inherit;width:0;height:0;border-radius:100px;opacity:0;transition:all ease-in-out .15s}@media screen and (prefers-reduced-motion:reduce){.uniform-choice span:after{transition:none}}.form-check-light .uniform-choice span{border-color:#fff}.uniform-choice[class*=border-] span{border-color:inherit}.uniform-choice[class*=border-] span:after{border-color:inherit}.dropdown-menu:not([class*=bg-]) .dropdown-item.active:not(.disabled) .uniform-checker span{border-color:#fff;color:#fff}.dropdown-menu:not([class*=bg-]) .dropdown-item.active:not(.disabled) .uniform-choice span{border-color:#fff}.dropdown-item.form-check .form-check-label{padding-left:3.25rem}.dropdown-item.form-check .uniform-checker,.dropdown-item.form-check .uniform-choice{margin-top:.50002rem;left:1rem}.dropdown-item.form-check.form-check-right .form-check-label{padding-right:3.25rem}.dropdown-item.form-check.form-check-right .uniform-checker,.dropdown-item.form-check.form-check-right .uniform-choice{left:auto;right:1rem}.dropdown-menu[class*=bg-]:not(.bg-white):not(.bg-transparent):not(.bg-light) .uniform-checker span{border-color:#fff;color:#fff}.dropdown-menu[class*=bg-]:not(.bg-white):not(.bg-transparent):not(.bg-light) .uniform-choice span{border-color:#fff}.uniform-uploader{position:relative;display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch}.uniform-uploader .filename{color:#999;padding:.4375rem .875rem;-ms-flex:1;flex:1;border:1px solid #ddd;border-right:0;background-color:#fff;text-align:left;word-break:break-word;border-top-left-radius:.1875rem;border-bottom-left-radius:.1875rem}.uniform-uploader .action{z-index:1;border-radius:0;border-top-right-radius:.1875rem;border-bottom-right-radius:.1875rem}.uniform-uploader input[type=file]{width:100%;margin-top:0;position:absolute;top:0;right:0;bottom:0;min-height:2.25003rem;border:0;cursor:pointer;z-index:10;opacity:0}.uniform-uploader.disabled .filename{background-color:#fafafa}.uniform-uploader.disabled .filename,.uniform-uploader.disabled input[type=file]{cursor:default}.form-control-styled-lg input[type=file]{min-height:2.50002rem}.form-control-styled-lg .filename{padding:.5625rem 1rem;font-size:.875rem;line-height:1.4286}.form-control-styled-sm input[type=file]{min-height:2.00002rem}.form-control-styled-sm .filename{padding:.3125rem .75rem;font-size:.75rem;line-height:1.6667}.uniform-select{position:relative;display:block;width:100%;height:2.25003rem;padding:.4375rem .875rem;font-size:.8125rem;line-height:1.5385;color:#333;background-color:#fff;border:1px solid #ddd;border-radius:.1875rem;transition:all ease-in-out .15s}@media screen and (prefers-reduced-motion:reduce){.uniform-select{transition:none}}.uniform-select:focus,.uniform-select:hover{box-shadow:0 0 0 62.5rem rgba(0,0,0,.01) inset}.uniform-select[class*=bg-]:not(.bg-white):not(.bg-light):not(.bg-transparent){color:#fff}.uniform-select[class*=bg-]:not(.bg-white):not(.bg-light):not(.bg-transparent):focus,.uniform-select[class*=bg-]:not(.bg-white):not(.bg-light):not(.bg-transparent):hover{box-shadow:0 0 0 62.5rem rgba(0,0,0,.04) inset}.uniform-select span{display:block;position:relative;text-align:left;padding-right:1.875rem;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.uniform-select span:after{content:'\e9c5';font-family:icomoon;display:inline-block;position:absolute;top:0;right:0;font-size:1rem;margin-top:-.12502rem;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.uniform-select select{width:100%;margin-top:0;position:absolute;top:0;right:0;bottom:0;height:2.25003rem;border:0;cursor:pointer;z-index:10;opacity:0}.uniform-select.disabled:not([class*=bg-]){color:#999;background-color:#fafafa}.uniform-select.disabled:focus,.uniform-select.disabled:hover{box-shadow:none!important}.uniform-select.disabled select{cursor:default}.uniform-select.disabled[class*=bg-]:not(.bg-white):not(.bg-light):not(.bg-transparent){opacity:.75}.form-control-styled-lg select:not([size]):not([multiple]){height:2.50002rem}.form-control-styled-lg .uniform-select{height:2.50002rem;padding:.5625rem 1rem;font-size:.875rem;line-height:1.4286}.form-control-styled-sm select:not([size]):not([multiple]){height:2.00002rem}.form-control-styled-sm .uniform-select{height:2.00002rem;padding:.3125rem .75rem;font-size:.75rem;line-height:1.6667}#asset_categories li a{color:var(--secondary_color)}.spinner{animation: rotation 1s linear infinite;}#asset_categories li a:hover{color:var(--hightlight-color)}@-webkit-keyframes rotation { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } }@media (max-width: 767px) { .design_nav .nav-link{padding:8px 10px !important; font-size: 14px;} #asset_categories{display: none;} #filemanager_container .col-md-3.border-right.p-3{ display: none;} #filemanager_container label.mr-2{display: none;} #filemanager_container .uniform-checker{display: none;} #filemanager_container #assets_selected{display: none;} #filemanager_container .select2.select2-container{display: none;} #copy_file_manager_path{display: none;} #asset_info_drawer.expand{width: 100% !important; top: -60px;} #asset_info_drawer{top: -60px; height: calc(100vh + 60px);} #detailed_preview_popup .justify-content-start.modal-footer .btn-group .btn{font-size: 12px;} #asset_container { max-height: calc(100vh - 20em) !important; min-height: calc(100vh - 20em) !important; } .design_nav .nav{display: -webkit-box;padding-left: 5px;width: 740px;overflow: auto; overflow-y: hidden;flex-wrap: nowrap;}
        `;

        document.head.appendChild(style)
    },

}

