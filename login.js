document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Hardcoded username and password for demonstration purposes
    const correctUsername = "admin";
    const correctPassword = "password123";
    
    if (username === correctUsername && password === correctPassword) {
        // Redirect to the main page after successful login
        window.location.href = "index.html";
    } else {
        document.getElementById("error-msg").textContent = "Invalid username or password";
    }
});
