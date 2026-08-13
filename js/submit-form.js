$(function () {
    'use strict';

    const forms = $('.needs-validation');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function phoneDigits(value) {
        return (value || '').replace(/\D/g, '');
    }

    function isValidPhone(value) {
        return phoneDigits(value).length >= 10;
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

        form.find('#phone').each(function () {
            if (this.value && !isValidPhone(this.value)) {
                this.setCustomValidity('invalid');
                customInvalid = true;
            } else {
                this.setCustomValidity('');
            }
        });

        if (!formEl.checkValidity() || customInvalid) {
            event.preventDefault();
            event.stopPropagation();
            form.addClass('was-validated');
            return;
        }

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

    $('#phone').on('input', function () {
        if (isValidPhone(this.value) || !this.value) {
            this.setCustomValidity('');
        }
    });
});
