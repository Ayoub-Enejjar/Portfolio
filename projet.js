document.querySelector('form').addEventListener('submit', function(e){
    const name=document.getElementById('name').value.trim();
    const email=document.getElementById('email').value.trim();
    const message=document.getElementById('message').value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message){
        alert('Please fill in all fields!'); 
        e.preventDefault();
        return;
    }

    if(!emailPattern.test(email)){
        alert('Please enter a valide email adress!');
        e.preventDefault();
        return;
    }
    
});

