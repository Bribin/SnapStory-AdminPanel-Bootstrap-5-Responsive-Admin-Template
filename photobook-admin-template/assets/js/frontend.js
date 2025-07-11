// Frontend JavaScript (jQuery-based)
// All user-facing scripts are consolidated here.

// --- Global UI Interactions ---
$(function() {
    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(e) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 600);
        }
    });

    // Add scroll effect to navbar
    $(window).on('scroll', function() {
        var navbar = $('.navbar');
        if ($(window).scrollTop() > 50) {
            navbar.addClass('navbar-scrolled');
        } else {
            navbar.removeClass('navbar-scrolled');
        }
    });

    // Animate elements on scroll (Intersection Observer fallback)
    function isInViewport($el) {
        var elementTop = $el.offset().top;
        var elementBottom = elementTop + $el.outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop + 50 && elementTop < viewportBottom - 50;
    }
    function checkAnimations() {
        $('.feature-card, .step-number').each(function() {
            var $el = $(this);
            if (!$el.hasClass('animate-in') && isInViewport($el)) {
                $el.addClass('animate-in');
            }
        });
    }
    checkAnimations();
    $(window).on('scroll resize', checkAnimations);
});

// --- Preloader ---
$(window).on('load', function() {
    const $preloader = $('#globalPreloader');
    if ($preloader.length) {
        $preloader.addClass('preloader-hide');
        setTimeout(() => $preloader.hide(), 600);
    }
});

// --- Checkout Page Logic ---
// Enhanced checkout functionality
let currentStep = 1;
let orderData = {
    shipping: 'standard',
    promoCode: null,
    subtotal: 39.99,
    shippingCost: 0,
    discount: 0,
    total: 39.99
};

// Form validation
function validateForm(formId) {
    const $form = $('#' + formId);
    const $inputs = $form.find('input[required], select[required]');
    let isValid = true;
    $inputs.each(function() {
        $(this).removeClass('is-valid is-invalid');
        if (!$(this).val().trim()) {
            $(this).addClass('is-invalid');
            isValid = false;
        } else {
            $(this).addClass('is-valid');
        }
    });
    return isValid;
}

// Real-time validation
$('input, select').on('blur', function() {
    validateField(this);
});

function validateField(field) {
    const $field = $(field);
    $field.removeClass('is-valid is-invalid');
    const value = $field.val().trim();
    if (!value) {
        $field.addClass('is-invalid');
        return false;
    }
    // Specific validation rules
    if ($field.attr('type') === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            $field.addClass('is-invalid');
            return false;
        }
    }
    if ($field.attr('id') === 'cardNumber') {
        const cardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
        if (!cardRegex.test(value)) {
            $field.addClass('is-invalid');
            return false;
        }
    }
    if ($field.attr('id') === 'expiryDate') {
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(value)) {
            $field.addClass('is-invalid');
            return false;
        }
    }
    if ($field.attr('id') === 'cvv') {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            $field.addClass('is-invalid');
            return false;
        }
    }
    $field.addClass('is-valid');
    return true;
}

// Shipping options
$('.shipping-option').on('click', function() {
    $('.shipping-option').removeClass('selected');
    $(this).addClass('selected');
    const shippingType = $(this).data('shipping');
    updateShippingCost(shippingType);
});

function updateShippingCost(shippingType) {
    let cost = 0;
    switch(shippingType) {
        case 'standard': cost = 0; break;
        case 'express': cost = 9.99; break;
        case 'overnight': cost = 19.99; break;
    }
    orderData.shipping = shippingType;
    orderData.shippingCost = cost;
    updateOrderSummary();
}

// Payment method toggle
$('input[name="paymentMethod"]').on('change', function() {
    const method = this.id;
    showPaymentForm(method);
});

function showPaymentForm(method) {
    $('#creditCardForm, #paypalForm, #applePayForm').hide();
    switch(method) {
        case 'creditCard': $('#creditCardForm').show(); break;
        case 'paypal': $('#paypalForm').show(); break;
        case 'applePay': $('#applePayForm').show(); break;
    }
}

// Promo code
$('#applyPromo').on('click', function() {
    const promoCode = $('#promoCode').val().trim();
    if (!promoCode) {
        showPromoMessage('Please enter a promo code.', 'warning');
        return;
    }
    if (promoCode.toUpperCase() === 'SAVE10') {
        orderData.promoCode = promoCode;
        orderData.discount = 5.00;
        showPromoMessage('Promo code applied! $5.00 discount.', 'success');
        $('#promoDiscount').show();
    } else {
        showPromoMessage('Invalid promo code.', 'danger');
    }
    updateOrderSummary();
});

function showPromoMessage(message, type) {
    const $messageDiv = $('#promoMessage');
    $messageDiv.attr('class', `alert alert-${type} mt-2`).text(message).show();
}

// Update order summary
function updateOrderSummary() {
    const shippingCost = orderData.shippingCost;
    const discount = orderData.discount;
    const total = orderData.subtotal + shippingCost - discount;
    $('#shippingCost').text(shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`);
    $('#orderTotal').text(`$${total.toFixed(2)}`);
    $('#placeOrderBtn').html(`<i class="fas fa-lock me-2"></i>Place Order - $${total.toFixed(2)}`);
    orderData.total = total;
}

// Place order
$('#placeOrderBtn').on('click', function() {
    if (!validateForm('shippingForm') || !validateForm('paymentForm')) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    const $btn = $(this);
    const originalText = $btn.html();
    $btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...');
    $btn.prop('disabled', true);
    setTimeout(() => {
        const modal = new bootstrap.Modal($('#orderConfirmationModal')[0]);
        modal.show();
        $btn.html(originalText);
        $btn.prop('disabled', false);
    }, 2000);
});

// Card number formatting
$('#cardNumber').on('input', function() {
    let value = $(this).val().replace(/\s/g, '').replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    $(this).val(value.substring(0, 19));
});

// Expiry date formatting
$('#expiryDate').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    $(this).val(value.substring(0, 5));
});

// CVV formatting
$('#cvv').on('input', function() {
    $(this).val($(this).val().replace(/\D/g, '').substring(0, 4));
});

// Initialize checkout
$(function() {
    updateOrderSummary();
    // Add entrance animations
    $('.card').each(function(index) {
        $(this).css({ opacity: 0, transform: 'translateY(20px)' });
        setTimeout(() => {
            $(this).css({ transition: 'all 0.6s ease-out', opacity: 1, transform: 'translateY(0)' });
        }, index * 100);
    });
});

// --- Dashboard Page Logic ---
// (Removed custom filtering/sorting logic for pure HTML + plugin use)

// --- Help Page Logic ---
// [Manual review may be needed for advanced JS below from help.html]:
// Search functionality
        $('#searchInput').on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            const faqItems = $('.faq-item');
            
            faqItems.each(function() {
                const question = $(this).find('.accordion-button').text().toLowerCase();
                const answer = $(this).find('.accordion-body').text().toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    $(this).css('display', 'block');
                } else {
                    $(this).css('display', 'none');
                }
            });
        });

        // FAQ category filtering
        $('input[name="faqCategory"]').on('change', function() {
            const category = this.id;
            console.log('FAQ category changed to:', category);
            // Add category filtering logic here
        });

        // Support ticket form
        $('#ticketForm').on('submit', function(e) {
            e.preventDefault();
            alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
            const modal = bootstrap.Modal.getInstance($('#ticketModal')[0]);
            modal.hide();
        });

        // Live chat functions
        function startLiveChat() {
            $('#chatButton').css('display', 'none');
            $('#chatWidget').css('display', 'block');
        }

        function closeChat() {
            $('#chatWidget').css('display', 'none');
            $('#chatButton').css('display', 'block');
        }

        function sendMessage() {
            const input = $('#chatInput');
            const message = input.val().trim();
            
            if (message) {
                const chatMessages = $('#chatMessages');
                const messageDiv = $(
                    `<div class="message sent">
                        <div class="message-content">
                            <p>${message}</p>
                            <small class="text-muted">You • Just now</small>
                        </div>
                    </div>`
                );
                chatMessages.append(messageDiv);
                input.val('');
                
                // Auto-scroll to bottom
                chatMessages.scrollTop(chatMessages[0].scrollHeight);
                
                // Simulate response
                setTimeout(() => {
                    const responseDiv = $(
                        `<div class="message received">
                            <div class="message-content">
                                <p>Thank you for your message. A support agent will be with you shortly.</p>
                                <small class="text-muted">Support Agent • Just now</small>
                            </div>
                        </div>`
                    );
                    chatMessages.append(responseDiv);
                    chatMessages.scrollTop(chatMessages[0].scrollHeight);
                }, 1000);
            }
        }

        // Other support functions
        function sendEmail() {
            window.location.href = 'mailto:support@photobook.com?subject=Support Request';
        }

        function callSupport() {
            window.location.href = 'tel:1-800-PHOTOBOOK';
        }

        // Enter key for chat
        $('#chatInput').on('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

// --- Login Page Logic ---
// Enhanced login functionality
const loginForm = $('#loginForm');
const loginPasswordInput = $('#password');
const loginTogglePassword = $('#togglePassword');
const loginBtn = $('#loginBtn');
const forgotPasswordLink = $('#forgotPassword');
const resetPasswordForm = $('#resetPasswordForm');

// Password visibility toggle
loginTogglePassword.on('click', function() {
    const type = loginPasswordInput.attr('type') === 'password' ? 'text' : 'password';
    loginPasswordInput.attr('type', type);
    $(this).html(type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>');
});

// Real-time validation
loginForm.find('input').on('blur', validateField);
loginForm.find('input').on('input', clearValidation);

function validateField(event) {
    const field = $(event.target);
    const value = field.val().trim();
    
    field.removeClass('is-valid is-invalid');
    
    let isValid = true;
    
    if (field.attr('type') === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } else if (field.attr('type') === 'password') {
        isValid = value.length > 0;
    }
    
    if (isValid) {
        field.addClass('is-valid');
    } else {
        field.addClass('is-invalid');
    }
}

function clearValidation(event) {
    const field = $(event.target);
    field.removeClass('is-valid is-invalid');
}

// Form submission
loginForm.on('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    loginForm.find('input[required]').each(function() {
        $(this).trigger('blur');
        if ($(this).hasClass('is-invalid')) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        alert('Please fix the errors in the form.');
        return;
    }
    
    // Show loading state
    const originalText = loginBtn.html();
    loginBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Signing In...');
    loginBtn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        alert('Login successful! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
});

// Forgot password functionality
forgotPasswordLink.on('click', function(e) {
    e.preventDefault();
    const modal = new bootstrap.Modal($('#forgotPasswordModal')[0]);
    modal.show();
});

resetPasswordForm.on('submit', function(e) {
    e.preventDefault();
    
    const email = $('#resetEmail').val();
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    
    alert('Password reset link sent to your email!');
    bootstrap.Modal.getInstance($('#forgotPasswordModal')[0]).hide();
});



// Initialize login page
$(function() {
    // Add entrance animations
    const featureCards = $('.feature-card');
    featureCards.each(function(index) {
        $(this).css({ opacity: 0, transform: 'translateY(20px)' });
        setTimeout(() => {
            $(this).css({ transition: 'all 0.6s ease-out', opacity: 1, transform: 'translateY(0)' });
        }, index * 200);
    });

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        $('#email').val(rememberedEmail);
        $('#rememberMe').prop('checked', true);
    }
});

// Remember me functionality
$('#rememberMe').on('change', function() {
    if ($(this).prop('checked')) {
        const email = $('#email').val();
        if (email) {
            localStorage.setItem('rememberedEmail', email);
        }
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

// --- Order Confirmation Page Logic ---
// Download invoice function
        function downloadInvoice() {
            // Simulate download
            alert('Invoice download started...');
        }

        // Track order function
        function trackOrder() {
            window.location.href = 'orders.html';
        }

        // Share order function
        function shareOrder() {
            if (navigator.share) {
                navigator.share({
                    title: 'My PhotoBook Order',
                    text: 'Check out my new photo book order!',
                    url: window.location.href
                });
            } else {
                // Fallback: copy URL
                navigator.clipboard.writeText(window.location.href);
                alert('Order link copied to clipboard!');
            }
        }

        // Add to order buttons
        $('.upsell-item .btn').on('click', function() {
            const itemName = $(this).closest('.upsell-item').find('h6').text();
            alert(`${itemName} added to your order!`);
            $(this).text('Added');
            $(this).removeClass('btn-outline-success');
            $(this).addClass('btn-success');
            $(this).prop('disabled', true);
        });

// --- Orders Page Logic ---
// Order data
        const orders = {
            '12345': {
                title: 'Summer 2024 Photo Book',
                status: 'Delivered',
                date: 'Dec 15, 2024',
                delivery: 'Dec 22, 2024',
                price: '$37.97',
                pages: '24 pages',
                tracking: '1Z999AA1234567890',
                address: 'John Doe, 123 Main St, New York, NY 10001'
            },
            '12346': {
                title: 'Wedding Album',
                status: 'In Transit',
                date: 'Dec 18, 2024',
                delivery: 'Dec 25, 2024',
                price: '$44.97',
                pages: '36 pages',
                tracking: '1Z999AA1234567891',
                address: 'John Doe, 123 Main St, New York, NY 10001'
            },
            '12347': {
                title: 'Family Portraits',
                status: 'Processing',
                date: 'Dec 19, 2024',
                delivery: 'Dec 28, 2024',
                price: '$32.97',
                pages: '18 pages',
                tracking: null,
                address: 'John Doe, 123 Main St, New York, NY 10001'
            }
        };

        // View order details
        function viewOrder(orderNumber) {
            const order = orders[orderNumber];
            if (!order) return;

            const modalBody = $('#orderModalBody');
            modalBody.html(`
                <div class="row">
                    <div class="col-md-6">
                        <h6>Order Information</h6>
                        <p><strong>Order Number:</strong> #${orderNumber}</p>
                        <p><strong>Product:</strong> ${order.title}</p>
                        <p><strong>Order Date:</strong> ${order.date}</p>
                        <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></p>
                        <p><strong>Expected Delivery:</strong> ${order.delivery}</p>
                        <p><strong>Price:</strong> ${order.price}</p>
                        <p><strong>Pages:</strong> ${order.pages}</p>
                    </div>
                    <div class="col-md-6">
                        <h6>Shipping Information</h6>
                        <p><strong>Address:</strong><br>${order.address}</p>
                        ${order.tracking ? `<p><strong>Tracking Number:</strong> ${order.tracking}</p>` : ''}
                    </div>
                </div>
            `);

            const trackBtn = $('#trackOrderBtn');
            if (order.tracking) {
                trackBtn.css('display', 'block');
                trackBtn.on('click', () => trackOrder(orderNumber));
            } else {
                trackBtn.css('display', 'none');
            }

            const modal = new bootstrap.Modal($('#orderModal')[0]);
            modal.show();
        }

        // Track order
        function trackOrder(orderNumber) {
            const order = orders[orderNumber];
            if (order && order.tracking) {
                // Open tracking in new window
                window.open(`https://www.ups.com/track?tracknum=${order.tracking}`, '_blank');
            }
        }

        // Download invoice
        function downloadInvoice(orderNumber) {
            alert(`Downloading invoice for order #${orderNumber}...`);
        }

        // Get status color
        function getStatusColor(status) {
            switch (status) {
                case 'Delivered': return 'success';
                case 'In Transit': return 'warning';
                case 'Processing': return 'info';
                default: return 'secondary';
            }
        }

       

// --- Press Page Logic ---
// [Manual review may be needed for advanced JS below from press.html]:
window.on("load", function() {
            const preloader = document.getElementById('globalPreloader');
            if (preloader) {
                preloader.classList.add('preloader-hide');
                setTimeout(() => preloader.style.display = 'none', 600);
            }
        });

// --- Pricing Page Logic ---
// Enhanced accordion functionality
    $(function() {
      const accordionHeaders = $('.accordion-header');

      accordionHeaders.on("click", function() {
        const chevron = $(this).find('.fa-chevron-down');
        const isExpanded = $(this).attr('aria-expanded') === 'true';

          // Add click animation
          $(this).css('transform', 'scale(0.98)');
          setTimeout(() => {
            $(this).css('transform', '');
          }, 150);
      });
    });

// --- Profile Page Logic ---
// [Manual review may be needed for advanced JS below from profile.html]:
// Form submissions
        $('#personalForm').on('submit', function(e) {
            e.preventDefault();
            alert('Personal information updated successfully!');
        });

        $('#passwordForm').on('submit', function(e) {
            e.preventDefault();
            alert('Password updated successfully!');
        });

        $('#paymentForm').on('submit', function(e) {
            e.preventDefault();
            alert('Payment method added successfully!');
        });

        $('#addressForm').on('submit', function(e) {
            e.preventDefault();
            alert('Address added successfully!');
        });

        // Two-factor authentication toggle
        $('#twoFactor').on('change', function() {
            if ($(this).prop('checked')) {
                alert('Two-factor authentication enabled. You will receive a verification code on your next login.');
            } else {
                alert('Two-factor authentication disabled.');
            }
        });

        // Theme toggle
        $('input[name="theme"]').on('change', function() {
            const theme = this.id;
            console.log('Theme changed to:', theme);
            // Add theme switching logic here
        });

// --- Signup Page Logic ---
// Enhanced signup functionality
const signupForm = $('#signupForm');
const progressBar = $('#signupProgress');
const signupPasswordInput = $('#password');
const confirmPasswordInput = $('#confirmPassword');
const passwordStrength = $('#passwordStrength');
const passwordFeedback = $('#passwordFeedback');
const signupTogglePassword = $('#togglePassword');
const toggleConfirmPassword = $('#toggleConfirmPassword');
const signupBtn = $('#signupBtn');

let formProgress = 0;

// Password visibility toggle
signupTogglePassword.on('click', function() {
    const type = signupPasswordInput.attr('type') === 'password' ? 'text' : 'password';
    signupPasswordInput.attr('type', type);
    $(this).html(type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>');
});

toggleConfirmPassword.on('click', function() {
    const type = confirmPasswordInput.attr('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.attr('type', type);
    $(this).html(type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>');
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;

    if (strength < 25) feedback = 'Very weak';
    else if (strength < 50) feedback = 'Weak';
    else if (strength < 75) feedback = 'Good';
    else feedback = 'Strong';

    return { strength, feedback };
}

signupPasswordInput.on('input', function() {
    const { strength, feedback } = checkPasswordStrength(this.value);
    
    passwordStrength.css('width', strength + '%');
    
    if (strength < 25) {
        passwordStrength.addClass('bg-danger');
    } else if (strength < 50) {
        passwordStrength.addClass('bg-warning');
    } else if (strength < 75) {
        passwordStrength.addClass('bg-info');
    } else {
        passwordStrength.addClass('bg-success');
    }
    
    passwordFeedback.text(feedback);
    updateFormProgress();
});

// Form progress tracking
function updateFormProgress() {
    const inputs = signupForm.find('input[required]');
    let filledInputs = 0;
    
    inputs.each(function() {
        if ($(this).attr('type') === 'checkbox') {
            if ($(this).prop('checked')) filledInputs++;
        } else {
            if ($(this).val().trim() !== '') filledInputs++;
        }
    });
    
    formProgress = (filledInputs / inputs.length) * 100;
    progressBar.css('width', formProgress + '%');
    
    if (formProgress === 100) {
        progressBar.addClass('bg-success');
    } else if (formProgress > 50) {
        progressBar.addClass('bg-info');
    } else {
        progressBar.addClass('bg-warning');
    }
}

// Real-time validation
signupForm.find('input').on('input', updateFormProgress);
signupForm.find('input').on('blur', validateField);

function validateField(event) {
    const field = $(event.target);
    const value = field.val().trim();
    
    // Remove existing validation classes
    field.removeClass('is-valid is-invalid');
    
    // Validate based on field type
    let isValid = true;
    
    switch(field.attr('type')) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            break;
        case 'password':
            if (field.attr('id') === 'password') {
                isValid = value.length >= 8;
            } else if (field.attr('id') === 'confirmPassword') {
                const password = $('#password').val();
                isValid = value === password;
            }
            break;
        case 'checkbox':
            isValid = field.prop('checked');
            break;
        default:
            isValid = value.length > 0;
    }
    
    if (isValid) {
        field.addClass('is-valid');
    } else {
        field.addClass('is-invalid');
    }
}

// Form submission
signupForm.on('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    signupForm.find('input[required]').each(function() {
        $(this).trigger('blur');
        if ($(this).hasClass('is-invalid')) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        alert('Please fix the errors in the form.');
        return;
    }
    
    // Show loading state
    const originalText = signupBtn.html();
    signupBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...');
    signupBtn.prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        alert('Account created successfully! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 2000);
});



// Initialize form
$(function() {
    updateFormProgress();
    
    // Add entrance animations
    const benefitItems = $('.benefit-item');
    benefitItems.each(function(index) {
        $(this).css({ opacity: 0, transform: 'translateX(20px)' });
        setTimeout(() => {
            $(this).css({ transition: 'all 0.6s ease-out', opacity: 1, transform: 'translateX(0)' });
        }, index * 200);
    });
});

// --- Terms Page Logic ---
// [Manual review may be needed for advanced JS below from terms.html]:
window.on("load", function() {
            const preloader = document.getElementById('globalPreloader');
            if (preloader) {
                preloader.classList.add('preloader-hide');
                setTimeout(() => preloader.style.display = 'none', 600);
            }
        });
