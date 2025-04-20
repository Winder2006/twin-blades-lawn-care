// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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

    // Booking Form Submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(bookingForm)) {
                alert('Please fill in all required fields.');
                return;
            }

            // Show loading state
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Get form data
            const formData = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                yard_size: document.getElementById('yardSize').value,
                service_date: document.getElementById('date').value,
                service_time: document.getElementById('time').value,
                notes: document.getElementById('notes').value,
                price: document.getElementById('yardSize').options[document.getElementById('yardSize').selectedIndex].text
            };

            // Send email using EmailJS
            emailjs.send('service_obk7vl2', 'template_cownlse', formData)
                .then(function() {
                    alert('Booking request sent successfully! We will contact you shortly.');
                    bookingForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                })
                .catch(function(error) {
                    alert('There was an error sending your booking request. Please try again later.');
                    console.error('EmailJS Error:', error);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm(contactForm)) {
                alert('Please fill in all required fields.');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Get form data
            const formData = {
                from_name: document.getElementById('contactName').value,
                from_email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            // Send email using EmailJS
            emailjs.send('service_obk7vl2', 'template_plk8gwk', formData)
                .then(function() {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                })
                .catch(function(error) {
                    alert('There was an error sending your message. Please try again later.');
                    console.error('EmailJS Error:', error);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
        });
    }
});

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// Add input validation listeners
document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.classList.remove('is-invalid');
        }
    });
}); 