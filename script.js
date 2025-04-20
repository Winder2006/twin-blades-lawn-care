// Initialize EmailJS
emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS user ID

// Calendar Initialization
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
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                yardSize: document.getElementById('yardSize').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                notes: document.getElementById('notes').value
            };

            // Send email using EmailJS
            emailjs.send("YOUR_EMAILJS_SERVICE_ID", "YOUR_EMAILJS_TEMPLATE_ID", formData)
                .then(function(response) {
                    alert('Booking request sent successfully! We will contact you shortly.');
                    bookingForm.reset();
                }, function(error) {
                    alert('There was an error sending your booking request. Please try again later.');
                    console.error('EmailJS Error:', error);
                });
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            // Send email using EmailJS
            emailjs.send("YOUR_EMAILJS_SERVICE_ID", "YOUR_EMAILJS_TEMPLATE_ID", formData)
                .then(function(response) {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                }, function(error) {
                    alert('There was an error sending your message. Please try again later.');
                    console.error('EmailJS Error:', error);
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