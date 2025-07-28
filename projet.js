"use strict";
document.querySelector('form').addEventListener('submit', function (e) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message) {
        alert('Please fill in all fields!');
        e.preventDefault();
        return;
    }
    if (!emailPattern.test(email)) {
        alert('Please enter a valide email adress!');
        e.preventDefault();
        return;
    }
});
document.querySelector('form').addEventListener('reset', function () {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
});
document.querySelectorAll('.service-image').forEach((card) => {
    if (!(card instanceof HTMLElement)) {
        console.warn('Found a .service-image element that is not an HTMLElement:', card);
        return; // Skip if it's not an HTMLElement
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
