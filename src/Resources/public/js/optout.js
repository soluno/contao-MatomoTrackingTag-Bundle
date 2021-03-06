var matomoOptOut = function (options) {
    this.options = this.merge(
        {
            selectors: {
                btn: 'matomo-optout-btn',
                activatedStatus: 'matomo-status-activated',
                deactivatedStatus: 'matomo-status-deactivated',
                noNotTrackStatus: 'matomo-status-do-not-track'
            },
            api: {
                uri: 'index.php?module=API&format=json&method=',
                isTracked: 'AjaxOptOut.isTracked',
                doTrack: 'AjaxOptOut.doTrack',
                doIgnore: 'AjaxOptOut.doIgnore'
            }
        },
        options || {}
    );

    this.btn = document.getElementById(this.options.selectors.btn);

    if (this.btn.getAttribute('data-do-not-track') === '1' && navigator.doNotTrack === "1") {
        this.doNotTrackStatus = document.getElementById(this.options.selectors.noNotTrackStatus);
        this.doNotTrackStatus.setAttribute('style', '');

        return;
    }

    this.activatedStatus   = document.getElementById(this.options.selectors.activatedStatus);
    this.deactivatedStatus = document.getElementById(this.options.selectors.deactivatedStatus);

    this.deactivateLabel = this.btn.getAttribute('data-label-deactivate');
    this.activateLabel   = this.btn.getAttribute('data-label-activate');
    this.matomoUrl       = this.btn.getAttribute('data-matomo-url');
    this.cookieError     = this.btn.getAttribute('data-cookie-error');
    this.enabled         = null;

    this.btn.addEventListener('click', this.onClick.bind(this));

    this.api(this.options.api.isTracked);
};

matomoOptOut.prototype.update = function (enabled) {
    if (this.enabled === enabled) {
        alert(this.cookieError);
    }

    this.enabled = enabled;

    if (this.enabled) {
        this.btn.innerHTML = this.deactivateLabel;
        this.activatedStatus.setAttribute('style', '');
        this.deactivatedStatus.setAttribute('style', 'display:none');
    } else {
        this.btn.innerHTML = this.activateLabel;
        this.activatedStatus.setAttribute('style', 'display:none');
        this.deactivatedStatus.setAttribute('style', '');
    }

    this.btn.setAttribute('style', '');
};

matomoOptOut.prototype.onIsTracked = function (response) {
    this.update(response.value);
};

matomoOptOut.prototype.onDoIgnore = function (response) {
    this.api(this.options.api.isTracked);
};

matomoOptOut.prototype.onDoTrack = function (response) {
    this.api(this.options.api.isTracked);
};

matomoOptOut.prototype.onClick = function () {
    if (this.enabled) {
        this.api(this.options.api.doIgnore);
    } else {
        this.api(this.options.api.doTrack);
    }
};

matomoOptOut.prototype.api = function (method) {
    var callback = method.split('.')[1];
    callback     = callback.charAt(0).toUpperCase() + callback.slice(1);

    window.jsonp(this.matomoUrl + this.options.api.uri + method, {
        callbackName: 'matomoOptOut.on' + callback
    });
};

matomoOptOut.prototype.merge = function (object, src) {
    var extended = {};
    var key;

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            extended[key] = object[key];
        }
    }

    for (key in src) {
        if (src.hasOwnProperty(key)) {
            extended[key] = src[key];
        }
    }

    return extended;
};

document.addEventListener('DOMContentLoaded', function () {
    window.matomoOptOut = new matomoOptOut();
});
