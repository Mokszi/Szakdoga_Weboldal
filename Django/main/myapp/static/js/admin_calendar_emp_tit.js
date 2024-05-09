//DISPLAY CALENDAR
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const monthYear = document.getElementById('monthYear');
    const dates = document.getElementById('dates');
    const buttonFinalize = document.getElementById('button-finalize');
    const finalizedTimeLabel = document.getElementById('finalized-time'); // New element to display the finalized time
    let currentDate = new Date();
  
    function displayCalendar() {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
  
        let calendarHTML = '';
  
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarHTML += '<div class="date"></div>';
        }
  
        for (let i = 1; i <= daysInMonth; i++) {
            calendarHTML += `<div class="date">${i}</div>`;
        }
  
        dates.innerHTML = calendarHTML;
    }
  
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Check if the cookie contains the name we're looking for
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
  
    displayCalendar();
  
    prevBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        displayCalendar();
    });
  
    nextBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        displayCalendar();
    });
  
    buttonFinalize.addEventListener('click', function() {
        const activeDate = document.querySelector('.date.active');
        if (activeDate !== null) {
            const dayOfMonth = parseInt(activeDate.textContent);
  
            // Get the month and year from the current date
            const selectedMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
            const selectedYear = currentDate.getFullYear();
  
            // Construct the finalized date using the selected month, year, and day
            const finalizedDate = new Date(selectedYear, selectedMonth - 1, dayOfMonth + 1);
  
            // Format the finalized date as a string in the format expected by Django
            const finalizedDateStr = finalizedDate.toISOString().slice(0, 10); // Extract YYYY-MM-DD portion
  
            // Log the finalized date string
            console.log('Véglegesített dátum string:', finalizedDateStr);
  
            // Set the finalized date next to the finalize button
            finalizedTimeLabel.textContent = `Véglegesített dátum: ${finalizedDateStr}`;
  
            // Get CSRF token using getCookie function
            const csrfToken = getCookie('csrftoken');
  
            // Make an AJAX POST request to the Django view
            fetch('save_finalized_date_emp_tit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    finalized_date: finalizedDateStr
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Véglegesített dátum sikeresen mentve');
                    // Optionally, you can handle success response here
                } else {
                    console.error('Hiba a véglegesített dátum mentésekor:', data.error);
                    // Optionally, you can handle error response here
                }
            })
            .catch(error => {
                console.error('Hiba a véglegesített dátom mentése közben:', error);
                // Optionally, you can handle the error here
            });
        }
    });
  
    // Click event listener for dates
    dates.addEventListener('click', function(event) {
        const clickedDate = event.target;
        const allDates = document.querySelectorAll('.date');
        allDates.forEach(function(date) {
            date.classList.remove('active');
        });
        clickedDate.classList.add('active');
    });
  
  });
  