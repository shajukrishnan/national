window.addEventListener("load", function (event) {
    contactUSForm();
});



function contactUSForm() {
    function listenerAction(e) {
        const form_data = serializeFormObject($("#contact_us_form"))
        if (empty(form_data['first_name'].trim())) {
            showToastAlert("error", 'Enter valid first name')
            return;
        }

        $.post("//"+__api_domain+'/user/services/openapi', form_data, function (response) {
            showToastAlert("success","Response Submitted!","Our representative will contact you shortly")
            $("#contact_us_success").removeClass("d-none")
            $("#contact_us_form").addClass("d-none")
        })
    }

    $("#contact_us_form").on("submit", function (e) {
        e.preventDefault()
        listenerAction(e)
    })
    $("#show_contact_us_form_btn").on("click", function (e) {
        e.preventDefault()
        $("#contact_us_first_name").val('')
        $("#contact_us_last_name").val('')
        $("#contact_us_email").val('')
        $("#contact_us_phone").val('')
        $("#contact_us_message").val('')
        $("#contact_us_success").addClass("d-none")
        $("#contact_us_form").removeClass("d-none")
        $("#contact_us_modal").modal("show")
    })
}