    // MultipleFiles/projet.js
    "use strict";

    // Get the form element by its ID
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault(); // Prevent default form submission

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const meetingDateInput = document.getElementById('meeting-date');
            const meetingTimeInput = document.getElementById('meeting-time');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const meetingDate = meetingDateInput.value; // Get the date string
            const meetingTime = meetingTimeInput.value; // Get the time string

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, Message)!');
                return;
            }

            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address!');
                return;
            }

            try {
                // Send data to your Node.js backend API
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        meetingDate,
                        meetingTime,
                        message
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Message sent successfully!');
                    // Clear the form after successful submission
                    contactForm.reset();
                } else {
                    // Handle errors from the backend
                    alert(`Failed to send message: ${result.message || 'Unknown error'}`);
                    if (result.errors) {
                        console.error('Backend validation errors:', result.errors);
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while sending your message. Please check your console for details.');
            }
        });
    } else {
        console.error('Contact form with ID "contactForm" not found!');
    }

    // Reset functionality (already present, just ensure it clears new fields)
    document.querySelector('form').addEventListener('reset', function () {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
        document.getElementById('meeting-date').value = ''; // Clear date input
        document.getElementById('meeting-time').value = ''; // Clear time input
    });

    // Existing mousemove/mouseleave effects for service images
    document.querySelectorAll('.service-image').forEach((card) => {
        if (!(card instanceof HTMLElement)) {
            console.warn('Found a .service-image element that is not an HTMLElement:', card);
            return;
        }
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 12;
            const rotateX = ((centerY - y) / centerY) * 8;
            card.style.transform = `scale(1.08) perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'scale(1.03) perspective(600px) rotateY(0deg) rotateX(0deg)';
        });
    });
    