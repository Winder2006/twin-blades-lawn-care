// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Verify EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS failed to load. Please check your internet connection and try again.');
        return;
    }

    // Initialize calendar
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            selectable: true,
            select: function(info) {
                const dateInput = document.getElementById('date');
                if (dateInput) {
                    dateInput.value = info.startStr;
                }
            },
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5, 6],
                startTime: '08:00',
                endTime: '16:00'
            }
        });
        calendar.render();
    }

    // Helper function to handle form submission
    async function handleFormSubmission(formData, serviceId, templateId, successMessage) {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS is not available. Please refresh the page and try again.');
        }

        try {
            const response = await emailjs.send(serviceId, templateId, formData);
            console.log('SUCCESS!', response.status, response.text);
            return successMessage;
        } catch (error) {
            console.error('FAILED...', error);
            if (error.text) {
                throw new Error(error.text);
            }
            throw error;
        }
    }

    // Helper function to get form data
    function getFormData(form) {
        const formData = {};
        form.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.id) {
                if (element.tagName === 'SELECT') {
                    formData[element.id] = element.options[element.selectedIndex].text;
                } else {
                    formData[element.id] = element.value.trim();
                }
            }
        });
        return formData;
    }

    // Booking Form Submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(bookingForm)) {
                alert('Please fill in all required fields.');
                return;
            }

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                const formData = {
                    from_name: document.getElementById('name').value.trim(),
                    from_email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    address: document.getElementById('address').value.trim(),
                    yard_size: document.getElementById('yardSize').value,
                    service_date: document.getElementById('date').value,
                    service_time: document.getElementById('time').value,
                    notes: document.getElementById('notes').value.trim(),
                    price: document.getElementById('yardSize').options[document.getElementById('yardSize').selectedIndex].text
                };

                const message = await handleFormSubmission(
                    formData,
                    'service_obk7vl2',
                    'template_cownlse',
                    'Booking request sent successfully! We will contact you shortly.'
                );

                alert(message);
                bookingForm.reset();
            } catch (error) {
                console.error('Form Submission Error:', error);
                alert(error.message || 'There was an error sending your booking request. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(contactForm)) {
                alert('Please fill in all required fields.');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                const formData = {
                    from_name: document.getElementById('contactName').value.trim(),
                    from_email: document.getElementById('contactEmail').value.trim(),
                    subject: document.getElementById('contactSubject').value.trim(),
                    message: document.getElementById('contactMessage').value.trim()
                };

                const message = await handleFormSubmission(
                    formData,
                    'service_obk7vl2',
                    'template_plk8gwk',
                    'Message sent successfully! We will get back to you soon.'
                );

                alert(message);
                contactForm.reset();
            } catch (error) {
                console.error('Form Submission Error:', error);
                alert(error.message || 'There was an error sending your message. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Add input validation listeners
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
            } else {
                this.classList.add('is-invalid');
            }
        });

        // Add blur event for validation
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('is-invalid');
            }
        });
    });
});

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        if (!value) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
            
            // Additional validation for email fields
            if (input.type === 'email' && !isValidEmail(value)) {
                isValid = false;
                input.classList.add('is-invalid');
            }
            
            // Additional validation for phone fields
            if (input.type === 'tel' && !isValidPhone(value)) {
                isValid = false;
                input.classList.add('is-invalid');
            }
        }
    });

    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
} 