const SwalPopup = {
    showSingleButtonPopup: function (config, callback = () => { }) {
        if (empty(config)) {
            alert("config cannot be empty for swal")
            return;
        }
        if(typeof config['customClass'] == "undefined"){
            config['customClass'] = {}
        }
        config['customClass']['actions'] = 'swal2-actions-single-button';
       
        Swal.fire(config).then(result => {
            callback(result);
        })
    }
}