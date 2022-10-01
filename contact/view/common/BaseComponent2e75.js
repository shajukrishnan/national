class BaseComponent {

    constructor(id, className, tagName = 'div', signalGroupId = '') {
        this.id = id;
        this.tagName = tagName;
        if (typeof className == "undefined") {
            this.className = "component";
        } else {
            this.className = className;
        }
        this.signalGroupId = signalGroupId;

    }

    Clear() {
        _removeListeners();
        this.html = '';
    }

    Create(dataJSON) {
        this.html = '';
        console.log("Create IS NOT IMPLEMENTED");
    }

    Show(selector, eraseOld) {

        var html = `<${this.tagName} class="${this.className}" id="${this.id}">${this.html}</${this.tagName}>`;

        if (typeof eraseOld != "undefined" && eraseOld) {
            $(selector).html(html);
        } else {
            //console.log("appending to " + selector + $(selector).length);
            $(selector).append(html);
        }

        this._attachListeners();
    }
    
    AddTitle(selector, title, className, tagName = 'div') {
        var html = `<` + tagName + ` class="` + className + `">` + title + `</` + tagName + `>`;
        $(selector).before(html);

    }

    GetHTML() {
        return {
            html: `<div class="${this.className}" id="${this.id}">${this.html}</div>`,
            listners: this._attachListeners
        };
    }

    SetsignalGroupId(signalGroupId)
    {
        this.signalGroupId = signalGroupId;
    }

    CanEmitSignal(signalId, signalGroupId = '')
    {
        if(signalGroupId != '' && signalGroupId != this.signalGroupId)
        {
            return false;
        }
        var signalEmitList = this._getSignalEmitList();
        return (typeof signalEmitList == "object" && Array.isArray(signalEmitList)) ? signalEmitList.includes(signalId) : false;
    }

    CanReceiveSignal(signalId, signalGroupId = '')
    {
        if(signalGroupId != '' && signalGroupId != this.signalGroupId)
        {
            return false;
        }
        var signalReceiveList = this._getSignalReceiveList();
        return (typeof signalReceiveList == "object" && Array.isArray(signalReceiveList)) ? signalReceiveList.includes(signalId) : false;
    }

    _attachListeners() {
        console.log("_attachListeners IS NOT IMPLEMENTED"); ////this must be implemented in each subclass
    }

    _removeListeners() {
        console.log("_removeListeners IS NOT IMPLEMENTED"); ////this must be implemented in each subclass
    }

    _getSignalEmitList()
    {
        console.log("_getSignalEmitList IS NOT IMPLEMENTED"); ////this must be implemented in each subclass, return array of signalIds to emit
        return false;
    }

    _getSignalReceiveList()
    {
        console.log("_getSignalReceiveList IS NOT IMPLEMENTED"); ////this must be implemented in each subclass, return array of signalIds to receive
        return false;
    }   

    _handleSignal(signalId, params, object)
    {
        console.log("_handleSignal IS NOT IMPLEMENTED"); //this must be implemented in each subclass, handle the signal
        return false;
    } 

    //call emitSignal from the subclass implementation whenever need to emit
    emitSignal(signalId, params)
    {
        if(this.CanEmitSignal(signalId))
        {
            Signal.Emit(signalId, this.signalGroupId, params);
        }
        else
        {
            console.log("Error:: Not allowed to emit Signal:: " + signalId);
        }
    }

    //this is registered by registerSignals() as callback for receiving the signal by this object
    //you must implement _handleSignal(signalId, params) is each of the subclasses
    handleSignal(signalId, signalGroupId, params, object)
    {
        if(this.obj.CanReceiveSignal(signalId, signalGroupId))
        {
            this.obj._handleSignal(signalId, params, object);
        }
    }

    //call this method after the object of the subclass has been constructed or from within constructor after calling the base class constructor
    registerSignals()
    {
        var signalReceiveList = this._getSignalReceiveList();
        signalReceiveList.forEach(function (signalId, index) {
            Signal.RegisterToReceive(signalId, this.signalGroupId, this.handleSignal, this);
        }, this);
    }

    //call this method before the object of the subclass need to be freed
    unregisterSignals()
    {
        var signalReceiveList = this._getSignalReceiveList();
        signalReceiveList.forEach(function (signalId, index) {
            Signal.UnRegisterToReceive(signalId, this.signalGroupId, this.handleSignal, this);
        }, this);
    }
}
