//Transformation
$(document).ready(function(){
    $('.message a').click(function(){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
});

//jelszó
document.addEventListener("DOMContentLoaded", function() {
    var registrationForm = document.querySelector(".register-form");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function(event) {
            var név = document.querySelector('input[name="név"]').value;
            var jelszó = document.querySelector('input[name="password1"]').value;
            var confirm_password = document.querySelector('input[name="password2"]').value;

            // Custom validation
            if (!név.trim()) {
                alert("A név nem lehet üres!");
                event.preventDefault(); // Prevent form submission
            }

            if (!containsUpperAndLower(jelszó) || !containsNumber(jelszó) || jelszó.length < 10) {
                alert("A jelszónak legalább 10 karakter hosszúnak kell lennie és tartalmaznia kell kisbetűt, nagybetűt és számot is!");
                event.preventDefault(); // Prevent form submission
            }

            if (jelszó != confirm_password) {
                alert("A jelszavak nem eggyeznek!");
                event.preventDefault(); // Prevent form submission
            }
        });

        // Add event listeners to toggle jelszó visibility
        var togglePasswordIcons = document.querySelectorAll('.jelszó-toggle-icon');
        togglePasswordIcons.forEach(function(icon) {
            icon.addEventListener('click', function() {
                var targetId = icon.getAttribute('data-target');
                var targetInput = document.getElementById(targetId);
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    icon.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Change eye icon to hide jelszó
                } else {
                    targetInput.type = 'password';
                    icon.innerHTML = '<i class="fas fa-eye"></i>'; // Change eye icon to show jelszó
                }
            });
        });
    } else {
        console.error("Regisztrációs form nem található.");
    }

    // Function to check if the jelszó contains both lowercase and uppercase letters
    function containsUpperAndLower(jelszó) {
        return /[a-z]/.test(jelszó) && /[A-Z]/.test(jelszó);
    }

    // Function to check if the jelszó contains at least one number
    function containsNumber(jelszó) {
        return /\d/.test(jelszó);
    }
});

//Login
document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.querySelector(".login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form submission for debugging

            var név = document.querySelector('#id_username').value;
            var jelszó = document.querySelector('#id_password').value;

            // Client-side validation
            if (!név.trim() || !jelszó.trim()) {
                alert("Név és jelszó szükséges!");
                return; // Exit the function to prevent further execution
            }
            // Form submission
            this.submit(); // Submit the form if validation passes
        });
    } else {
        console.error("Belépési form nem található.");
    }
});


