// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
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
            selectConstraint: "businessHours",
            timeZone: 'local',
            slotMinTime: '08:00:00',
            slotMaxTime: '16:00:00',
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
                startTime: '08:00',
                endTime: '16:00'
            },
            validRange: {
                start: new Date().toISOString().split('T')[0]
            },
            selectConstraint: "businessHours",
            selectOverlap: false,
            select: function(info) {
                const dateInput = document.getElementById('date');
                const timeInput = document.getElementById('time');
                if (dateInput && timeInput) {
                    const selectedDate = new Date(info.start);
                    const now = new Date();
                    
                    // Ensure selected date is not in the past
                    if (selectedDate < now) {
                        alert('Please select a future date');
                        calendar.unselect();
                        return;
                    }
                    
                    // Format date for input
                    dateInput.value = info.startStr;
                    
                    // Set default time if within business hours
                    const hour = now.getHours();
                    if (hour >= 8 && hour < 16) {
                        timeInput.value = now.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                        });
                    } else {
                        timeInput.value = '08:00';
                    }
                }
            }
        });
        calendar.render();
    }

    // Helper function to handle form submission with retry and rate limiting
    async function handleFormSubmission(formData, serviceId, templateId, successMessage, maxRetries = 2) {
        const minTimeBetweenSubmissions = 2000; // 2 seconds
        const lastSubmissionTime = window.lastEmailSubmission || 0;
        const now = Date.now();

        if (now - lastSubmissionTime < minTimeBetweenSubmissions) {
            throw new Error('Please wait a moment before submitting again.');
        }

        // Check if EmailJS is properly initialized
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS is not properly initialized. Please refresh the page and try again.');
        }

        let retries = 0;
        while (retries <= maxRetries) {
            try {
                window.lastEmailSubmission = now;
                const response = await emailjs.send(serviceId, templateId, formData);
                console.log('SUCCESS!', response.status, response.text);
                return successMessage;
            } catch (error) {
                console.error(`Attempt ${retries + 1} failed:`, error);
                if (retries === maxRetries) {
                    if (error.text) {
                        throw new Error(`Email service error: ${error.text}`);
                    }
                    throw new Error('Failed to send email after multiple attempts. Please try again later.');
                }
                retries++;
                await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
            }
        }
    }

    // Helper function to sanitize form data with additional security
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/[&]/g, 'and') // Replace & with 'and'
            .replace(/[;{}()\\]/g, '') // Remove potentially dangerous characters
            .slice(0, 500); // Limit length
    }

    // Helper function to get form data
    function getFormData(form) {
        const formData = {};
        form.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.id) {
                if (element.tagName === 'SELECT') {
                    formData[element.id] = sanitizeInput(element.options[element.selectedIndex].text);
                } else {
                    formData[element.id] = sanitizeInput(element.value);
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
                alert('Please fill in all required fields correctly.');
                return;
            }

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                const formData = {
                    from_name: sanitizeInput(document.getElementById('name').value),
                    from_email: sanitizeInput(document.getElementById('email').value),
                    phone: sanitizeInput(document.getElementById('phone').value),
                    address: sanitizeInput(document.getElementById('address').value),
                    yard_size: sanitizeInput(document.getElementById('yardSize').value),
                    service_date: sanitizeInput(document.getElementById('date').value),
                    service_time: sanitizeInput(document.getElementById('time').value),
                    notes: sanitizeInput(document.getElementById('notes').value),
                    price: sanitizeInput(document.getElementById('yardSize').options[document.getElementById('yardSize').selectedIndex].text)
                };

                const message = await handleFormSubmission(
                    formData,
                    'service_obk7vl2',
                    'template_cownlse',
                    'Booking request sent successfully! We will contact you shortly.'
                );

                alert(message);
                bookingForm.reset();
                
                // Clear any remaining validation styles
                bookingForm.querySelectorAll('.is-invalid').forEach(element => {
                    element.classList.remove('is-invalid');
                });
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
                alert('Please fill in all required fields correctly.');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                const formData = {
                    from_name: sanitizeInput(document.getElementById('contactName').value),
                    from_email: sanitizeInput(document.getElementById('contactEmail').value),
                    subject: sanitizeInput(document.getElementById('contactSubject').value),
                    message: sanitizeInput(document.getElementById('contactMessage').value)
                };

                const message = await handleFormSubmission(
                    formData,
                    'service_obk7vl2',
                    'template_plk8gwk',
                    'Message sent successfully! We will get back to you soon.'
                );

                alert(message);
                contactForm.reset();
                
                // Clear any remaining validation styles
                contactForm.querySelectorAll('.is-invalid').forEach(element => {
                    element.classList.remove('is-invalid');
                });
            } catch (error) {
                console.error('Form Submission Error:', error);
                alert(error.message || 'There was an error sending your message. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Add input validation listeners with debouncing
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(event) {
            const element = event.target;
            const later = () => {
                clearTimeout(timeout);
                func(element);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        const debouncedValidation = debounce(function(element) {
            const value = element.value ? element.value.trim() : '';
            if (!value) {
                element.classList.add('is-invalid');
            } else {
                element.classList.remove('is-invalid');
                
                // Validate email and phone fields
                if (element.type === 'email' && !isValidEmail(value)) {
                    element.classList.add('is-invalid');
                } else if (element.type === 'tel' && !isValidPhone(value)) {
                    element.classList.add('is-invalid');
                }
            }
        }, 300);

        input.addEventListener('input', debouncedValidation);
        input.addEventListener('blur', debouncedValidation);
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
            input.setAttribute('title', 'This field is required');
        } else {
            input.classList.remove('is-invalid');
            input.removeAttribute('title');
            
            switch(input.type) {
                case 'email':
                    if (!isValidEmail(value)) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        input.setAttribute('title', 'Please enter a valid email address');
                    }
                    break;
                    
                case 'tel':
                    if (!isValidPhone(value)) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        input.setAttribute('title', 'Please enter a valid phone number');
                    }
                    break;
                    
                case 'time':
                    if (!isValidTime(value)) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        input.setAttribute('title', 'Please select a time between 8:00 AM and 4:00 PM');
                    }
                    break;
                    
                case 'date':
                    const selectedDate = new Date(value);
                    const now = new Date();
                    if (selectedDate < now) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        input.setAttribute('title', 'Please select a future date');
                    }
                    break;
            }
        }
    });

    return isValid;
}

// Email validation with more comprehensive regex
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Phone validation with more flexible format
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Add time validation
function isValidTime(time) {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const businessStart = 8;
    const businessEnd = 16;
    
    return hours >= businessStart && 
           hours < businessEnd && 
           minutes >= 0 && 
           minutes < 60;
} 