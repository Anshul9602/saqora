$(function () {
    'use strict';

    const forms = $('.needs-validation');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneInput = $('#phone');
    const countryCodeSelect = $('#country_code');
    const fullPhoneInput = $('#full_phone');

    function phoneDigits(value) {
        return (value || '').replace(/\D/g, '');
    }

    function getCountryCode() {
        return countryCodeSelect.val() || '+1';
    }

    function getMaxPhoneLength(countryCode) {
        switch (countryCode) {
            case '+1':
            case '+91':
                return 10;
            case '+44':
                return 11;
            case '+61':
            case '+971':
                return 10;
            case '+65':
                return 8;
            default:
                return 15;
        }
    }

    function sanitizePhoneValue(value, countryCode) {
        let digits = phoneDigits(value);
        const maxLen = getMaxPhoneLength(countryCode);

        digits = digits.slice(0, maxLen);

        if (countryCode === '+91' && digits.length > 0) {
            digits = digits.replace(/^[^6-9]+/, '');
            digits = digits.slice(0, maxLen);
        }

        return digits;
    }

    function isValidMobile(countryCode, value) {
        const digits = phoneDigits(value);

        if (!digits.length) {
            return false;
        }

        switch (countryCode) {
            case '+1':
                return digits.length === 10;
            case '+91':
                return digits.length === 10 && /^[6-9]/.test(digits);
            case '+44':
                return digits.length >= 10 && digits.length <= 11;
            case '+61':
                return digits.length >= 9 && digits.length <= 10;
            case '+971':
                return digits.length >= 9 && digits.length <= 10;
            case '+65':
                return digits.length === 8;
            default:
                return digits.length >= 7 && digits.length <= 15;
        }
    }

    function applyPhoneLimits() {
        if (!phoneInput.length) {
            return;
        }

        const countryCode = getCountryCode();
        const maxLen = getMaxPhoneLength(countryCode);

        phoneInput.attr('maxlength', maxLen);
        phoneInput.val(sanitizePhoneValue(phoneInput.val(), countryCode));
    }

    function syncFullPhone() {
        if (!fullPhoneInput.length) {
            return;
        }

        const digits = phoneDigits(phoneInput.val());
        fullPhoneInput.val(digits ? getCountryCode() + digits : '');
    }

    function validatePhoneField(showValidity) {
        if (!phoneInput.length) {
            return true;
        }

        const countryCode = getCountryCode();
        const isValid = isValidMobile(countryCode, phoneInput.val());

        phoneInput[0].setCustomValidity(isValid ? '' : 'invalid');

        if (showValidity) {
            phoneInput.toggleClass('is-invalid', !isValid);
            countryCodeSelect.toggleClass('is-invalid', !isValid);
        }

        syncFullPhone();
        return isValid;
    }

    forms.on('submit', function (event) {
        const form = $(this);
        const formEl = form[0];
        const actionInput = form.find("input[name='action']");
        let customInvalid = false;

        form.find('#email').each(function () {
            if (this.value && !emailPattern.test(this.value.trim())) {
                this.setCustomValidity('invalid');
                customInvalid = true;
            } else {
                this.setCustomValidity('');
            }
        });

        applyPhoneLimits();

        if (phoneInput.length && !validatePhoneField(true)) {
            customInvalid = true;
        }

        if (!formEl.checkValidity() || customInvalid) {
            event.preventDefault();
            event.stopPropagation();
            form.addClass('was-validated');
            return;
        }

        syncFullPhone();
        event.preventDefault();
        $('.submit_form').html('Sending...');
        $('.submit_subscribe').html('Sending...');
        const toast = new bootstrap.Toast($('.success_msg')[0]);
        var formData = form.serialize();
        $.ajax({
            type: "POST",
            url: "php/form_process.php",
            data: formData,
            success: function (response) {
                if (response === 'success') {
                    if (actionInput.length > 0) {
                        if (actionInput.val() === 'subscribe') {
                            $('.submit_subscribe').html('Subscribe');
                            const toast_comment = new bootstrap.Toast($('.success_msg_subscribe')[0]);
                            toast_comment.show();
                        }
                    } else {
                        toast.show();
                        $('.submit_form').html('Send Message');
                    }
                } else {
                    console.log('errorrrrrr');
                    $('.submit_form').html('Send Message');
                    $('.submit_subscribe').html('Subscribe');
                }
            }
        });

        form.addClass('was-validated');
    });

    $('#email').on('input', function () {
        if (emailPattern.test(this.value.trim()) || !this.value) {
            this.setCustomValidity('');
        }
    });

    phoneInput.on('input', function () {
        this.value = sanitizePhoneValue(this.value, getCountryCode());
        validatePhoneField(false);
    });

    countryCodeSelect.on('change', function () {
        applyPhoneLimits();
        validatePhoneField(false);
    });

    applyPhoneLimits();
});
