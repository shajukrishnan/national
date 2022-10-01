let __signup_callback =false
$(document).ready(function () {
    $(".signup_form input[type=radio]").on("change", function (e) {
        $(".signup_form input[name=name]").val('')
        $(".signup_form input[name=email]").val('')
        $(".signup_form input[name=pass]").val('')
        $(".signup_form input[name=verify_pass]").val('')
        $(".signup_form input[name=agree_to_terms]").prop("checked", true)
        $(".signup_form button[type=submit]").removeClass("disabled")
        if(e.target.value == "signup"){
            $(".signin-header").text("Please signup to continue, it's completely free!")
            $(".signup_block").show()
            $(".signup_block input").prop('required',true)

            $("#forgot_password").hide()
        }else{
            $(".signin-header").text("Please signin to continue")
            $(".signup_block").hide()
            $(".signup_block input").prop('required',false)
            $("#forgot_password").show()
        }
        clearSignInErrorMsg();
    })

    $(".signup_form input[name=agree_to_terms]").on("change", function(e){
        if(e.target.checked){
            $(".signup_form button[type=submit]").removeClass("disabled")
        }else{
            $(".signup_form button[type=submit]").addClass("disabled")

        }
    })

    $(".signup_form").on("submit", function (e) {
        e.preventDefault();
        clearSignInErrorMsg();
        var data = serializeFormObject($(this))
        if (data.login_type == "signup") {
            data.cmd = "signUp"
            if(empty(data.name.trim())){
                $("#signInErrorMsg").html("Name cannot be empty");
                return
            }
            if(data.pass !== data.verify_pass){
                $("#signInErrorMsg").html("Password doesn't match!");
                return
            }
        } else {
            data.cmd = "signIn"
        }
        data.referred_by = getUrlParameterByName('referral')
        showLoaderOnBlock()
        //$.post("//"+__api_domain+'/user/services/openapi', data, function (response) {
        $.post('/user/services/openapi', data, function (response) {
            hideLoader()
            if(!empty(response.data)){
                includeSignedinJs();
                window.user_info = response.data
                logInUser(response.data) 
                let done = getUrlParameterByName("done");
                if(!empty(done)){
                    done = decodeURIComponent(done)
                    done = (!done.startsWith('/'))?"/":done; //make sure done is not sent to some other site
                    location.href = done
                }else if(page == 'signin'){
                    location.href = "/"
                }
                PopulateSelectFolderSectionForQR.init()
                clearSignInErrorMsg()
                $("#signInSuccessMsg").html("Successfully "+(data.cmd == 'signIn'?'Signed In.':'Signed Up.'))
                $(".signup_form button[type=submit]").addClass("disabled")
                setTimeout(function(){
                    if(page == 'pricing'){
                        location.reload()
                    }
                    clearSignInErrorMsg()
                    $("#signup-free").modal("hide")
                    if(page == 'redeemCoupon'){
                        validateCouponCode()
                        return;
                    }
                    if(page == 'claim-qr-code'){
                        if(ClaimOpenQrcodes._signin){
                            ClaimOpenQrcodes._signin = false;
                            location.reload()
                            return
                        }
                        ClaimOpenQrcodes.claimOpenQrCode()
                        return
                    }
                    if(typeof checkAndReGenerate != "undefined"){
                        checkAndReGenerate()

                    }
                    if(__signup_trigger_from == 'bulk_upload_switch'){
                        $(".page_form").addClass("show_bulk_upload")
                    }
                    if(__signup_callback){
                        if(typeof __signup_callback == 'function'){
                            __signup_callback()
                            __signup_callback = false
                        }else{
                            __signup_callback = false
                            if($(".submit_qr_code").length ==1){
                                $(".submit_qr_code").trigger("click")
                            }
                        }
                    }
                },2000)
            }
            else
            {
                $("#signInErrorMsg").html(response.errorMsg);
            }
            
        })

    })

    $("#forgot_password").on("click", function(e){
        e.preventDefault()
        showForgotPasswordPopup()
    })

    $(".forgot_password_form").on("submit", function(e){
        e.preventDefault()
        var data = serializeFormObject($(this))
       
    })    
})

function showForgotPasswordPopup(){
    $("#signup-free").modal("hide")
    Swal.fire({
        title: 'Forgot Password!',
        input: 'email',
        inputLabel: 'Enter your registered email',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Send Reset Link',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            return !isValidEmailAddress(value)?"Enter a valid Email ID!":''
        }
    }).then(result => {
        if (result.isConfirmed) {
            $.post("//"+__api_domain+'/user/services/openapi', {cmd : "forgotPassword", email: result.value}, function (response) {
                if(response.errorCode == 0){
                    SwalPopup.showSingleButtonPopup({
                        title  : 'Forgot Password',
                        text : response.errorMsg,
                        icon : 'success'
                    })
                }else{
                    SwalPopup.showSingleButtonPopup({
                        title  : 'Forgot Password',
                        text : response.errorMsg,
                        icon : 'error'
                    },(result)=>{
                        if (result.isConfirmed) {
                            showForgotPasswordPopup()
                        }
                    })
                }
                
            })
        }
    })
}

function clearSignInErrorMsg()
{
    $("#signInErrorMsg").html('');
    $("#signInSuccessMsg").html('');
}

function logout(gotoHome){

    logoutCookies();

    logOutUser()

    $.post("//"+__api_domain+'/user/services/openapi', {cmd : "signOut"},function(){
        //location.href = '/'
    })
    if(typeof gotoHome == 'undefined') gotoHome = 1;

    if(gotoHome)
    {
        location.href = '/'
    }
}

function logoutCookies()
{
    eraseCookie("userwork");
    eraseCookie("login");
    eraseCookie("email");
    eraseCookie("uid");
    eraseCookie("sid");
    eraseCookie("bulk_folders-grid-layout");
    eraseCookie("qr_folders-grid-layout");

    logoutAllCookies();
}


function getCookie(cookiename) 
{
    var cookiestring = RegExp(cookiename+"=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function logoutAllCookies()
{
    var pairs = document.cookie.split(";");
    for (var i=0; i<pairs.length; ++i)
    {
        var pair = pairs[i].split("=");
        var c = (pair[0]+'').trim();

        let prefix = "qr-";
        if (isDev()) {
            prefix += 'DEV-';
        } else if (isLocal()) {
            prefix += 'LOCAL-';
        } else if (isStag()) {
            prefix += 'STAG-';
        }

        if(c.startsWith(prefix))
        {
            c = c.replace(prefix, '');
            if(c != '' && c != 'B' && c != 'b')
            {
                eraseCookie(c);
            }
        }
    }
}

function includeSignedinJs()
{
    let i = 0;
    for(i = 0; i < ___JS_FILES_SIGNEDIN.length; ++i)
    {
        
        if(typeof ___JS_FILES_SIGNEDIN[i] != "undefined" && ___JS_FILES_SIGNEDIN[i] != "")
        {
            if ($('script[src="' + ___JS_FILES_SIGNEDIN[i] + '"]').length == 0)
            {
                //console.log(___JS_FILES_SIGNEDIN[i]);
                try{
                    let script = document.createElement("script"); 
                    script.src = ___JS_FILES_SIGNEDIN[i]; 
                    document.head.appendChild(script);
                } catch(e){console.log(e)}
            }
        }
    }
}