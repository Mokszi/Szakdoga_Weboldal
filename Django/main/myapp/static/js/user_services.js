/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// Function to calculate and display the sum of 'Bérként' input fields
function calculateBerkentSum() {
  let sum = 0;
  const berkentInputs = document.querySelectorAll('.input-table input[id^="berkent_"]');
  berkentInputs.forEach(input => {
      sum += parseInt(input.value) || 0; // Convert input value to integer, default to 0 if NaN
  });
  document.getElementById('berkent_sum').innerText = sum; // Update the sum display

  return sum;
}

function calculateBruttoSum() {
    let sum = 0;
    const sumTds = document.querySelectorAll('td[id$="_sum"]');
    sumTds.forEach(td => {
        sum += parseInt(td.textContent) || 0; // Convert content of td to integer, default to 0 if NaN
    });
    document.getElementById('brutto_sum').innerText = sum; // Update the sum display

    // Save brutto_sum in a cookie
    document.cookie = `brutto_sum=${sum}; path=/`;
    return sum;
}

// Function to calculate and display the sum of 'Önkéntes Nyugdíjpénztár' input fields
function calculateNyugdijSum() {
  let sum = 0;
  const nyugdijInputs = document.querySelectorAll('.input-table input[id^="nyugdij_"]');
  nyugdijInputs.forEach(input => {
      sum += parseInt(input.value) || 0; // Convert input value to integer, default to 0 if NaN
  });
  document.getElementById('nyugdij_sum').innerText = sum; // Update the sum display

  return sum;
}

function calculateEgeszsegSum() {
  let sum = 0;
  const egeszsegInputs = document.querySelectorAll('.input-table input[id^="egeszseg_"]');
  egeszsegInputs.forEach(input => {
      sum += parseInt(input.value) || 0; // Convert input value to integer, default to 0 if NaN
  });
  document.getElementById('egeszseg_sum').innerText = sum; // Update the sum display

  return sum;
}

function calculateSzepSum() {
  let sum = 0;
  const szepInputs = document.querySelectorAll('.input-table input[id^="szep_"]');
  szepInputs.forEach(input => {
      sum += parseInt(input.value) || 0; // Convert input value to integer, default to 0 if NaN
  });
  document.getElementById('szep_sum').innerText = sum; // Update the sum display

  return sum;
}
//TD DISPLAY
document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and populate saved data
    function populateSavedData() {
        // Extract név from label text
        const labelText = document.querySelector('label').innerText;
        const név = labelText.split(' ')[0]; // Assuming the név is the first word in the label text

        fetch('fetch_saved_services/?név=' + név, { // Add név as a query parameter
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const savedData = data.data; // Assuming the returned data has a 'data' key containing the saved data
                // Loop through each input field and set its value from saved data
                const inputIds = ['ajandek_I', 'berlet_I', 'kultur_I', 'sport_I', 'ovi_I'];
                inputIds.forEach(inputId => {
                    const inputValue = savedData[inputId] || '0'; // Use saved value or default to '0'
                    document.getElementById(inputId).value = inputValue; // Set value to input field
                    document.getElementById(inputId + '_sum').textContent = inputValue; // Set value to corresponding td

                    // No need to calculate netto value
                });
            } else {
                console.error('Nem sikerült az elmentett adatot behívni.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Call the function to populate saved data when the page loads
    populateSavedData();
});

    // Function to get CSRF token from cookies
function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
}

//INPUT DISPLAY
document.addEventListener('DOMContentLoaded', function() {
    let dataPopulated = false; // Flag to track if input fields have been populated with data

    // Function to fetch and populate saved data
    function populateSavedData() {
        // Extract név from label text
        const labelText = document.querySelector('label').innerText;
        const név = labelText.split(' ')[0]; // Assuming the név is the first word in the label text

        fetch('fetch_saved_services/?név=' + név, { // Add név as a query parameter
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const savedData = data.data; // Assuming the returned data has a 'data' key containing the saved data
                if (Object.keys(savedData).length > 0) {
                    // Data exists in the database for the current user
                    // Loop through each input field and set its value from saved data
                    const inputs = document.querySelectorAll('.input-table input[type="number"]');
                    inputs.forEach(input => {
                        const columnName = input.id;
                        if (columnName in savedData) {
                            input.value = savedData[columnName];
                        }
                    });
                    dataPopulated = true;
                function calculateBerkentNetto() {
                    // Get the values of berkent_sum and berkent_szorzo
                    var berkentSumValue = calculateBerkentSum();
                    var berkentSzorzoValue = parseFloat(document.getElementById('berkent_szorzo').innerText.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                    // Calculate berkent_netto
                    var berkentNettoValue = berkentSumValue / berkentSzorzoValue;
                  
                    // Update the berkent_netto element with the calculated value
                    document.getElementById('berkent_netto').innerText = Math.round(berkentNettoValue); // Display up to 2 decimal places
                  }
                  // Call the function to calculate berkent_netto
                  calculateBerkentNetto();
                  
                  function calculateNyugdijNetto() {
                    // Get the values of berkent_sum and berkent_szorzo
                    var nyugdijSumValue = calculateNyugdijSum();
                    var nyugdijSzorzoValue = parseFloat(document.getElementById('nyugdij_szorzo').innerText.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                    // Calculate berkent_netto
                    var nyugdijNettoValue = nyugdijSumValue / nyugdijSzorzoValue;
                  
                    // Update the berkent_netto element with the calculated value
                    document.getElementById('nyugdij_netto').innerText = Math.round(nyugdijNettoValue); // Display up to 2 decimal places
                  }
                  // Call the function to calculate nyugdij_netto
                  calculateNyugdijNetto();

                  function calculateEgeszsegNetto() {
                    // Get the values of berkent_sum and egeszseg_szorzo
                    var egeszsegSumValue = calculateEgeszsegSum();
                    var egeszsegSzorzoValue = parseFloat(document.getElementById('egeszseg_szorzo').innerText.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                    // Calculate berkent_netto
                    var egeszsegNettoValue = egeszsegSumValue / egeszsegSzorzoValue;
                  
                    // Update the berkent_netto element with the calculated value
                    document.getElementById('egeszseg_netto').innerText = Math.round(egeszsegNettoValue); // Display up to 2 decimal places
                  }
                  // Call the function to calculate berkent_netto
                  calculateEgeszsegNetto();

                  function calculateSzepNetto() {
                    // Get the values of berkent_sum and egeszseg_szorzo
                    var szepSumValue = calculateSzepSum();
                    var szepSzorzoValue = parseFloat(document.getElementById('szep_szorzo').innerText.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                    // Calculate berkent_netto
                    var szepNettoValue = szepSumValue / szepSzorzoValue;
                  
                    // Update the berkent_netto element with the calculated value
                    document.getElementById('szep_netto').innerText = Math.round(szepNettoValue); // Display up to 2 decimal places
                  }
                  // Call the function to calculate berkent_netto
                  calculateSzepNetto();

                calculateBruttoSum();
                  
                  // Function to calculate the sum of all _netto tds and print it out
                    function calculateNettoSum() {
                        // Get all _netto tds
                        const nettoTds = document.querySelectorAll('td[id$="_netto"]');
                        
                        let nettoSum = 0;

                        // Iterate over each _netto td
                        nettoTds.forEach(td => {
                            // Parse the text content as an integer and add it to nettoSum
                            nettoSum += parseInt(td.textContent) || 0;
                        });

                        // Set the total sum to the netto_sum td
                        document.getElementById('netto_sum').textContent = nettoSum;
                    }
                    function calculateAjandekNetto() {
                        // Get the values of ajandek_I and ajandek_szorzo
                        var ajandekValue = parseFloat(document.getElementById('ajandek_I').value);
                        var ajandekSzorzoValue = parseFloat(document.getElementById('ajandek_szorzo').textContent.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                        // Calculate ajandek_netto
                        var ajandekNettoValue = ajandekValue / ajandekSzorzoValue;
                    
                        // Update the ajandek_netto element with the calculated value
                        document.getElementById('ajandek_netto').textContent = Math.round(ajandekNettoValue); // Display up to 2 decimal places
                    }
                    
                    function calculateBerletNetto() {
                        // Get the values of berlet_I and berlet_szorzo
                        var berletValue = parseFloat(document.getElementById('berlet_I').value);
                        var berletSzorzoValue = parseFloat(document.getElementById('berlet_szorzo').textContent.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                        // Calculate berlet_netto
                        var berletNettoValue = berletValue / berletSzorzoValue;
                    
                        // Update the berlet_netto element with the calculated value
                        document.getElementById('berlet_netto').textContent = Math.round(berletNettoValue); // Display up to 2 decimal places
                    }
                    function calculateKulturNetto() {
                        // Get the values of kultur_I and kultur_szorzo
                        var kulturValue = parseFloat(document.getElementById('kultur_I').value);
                        var kulturSzorzoValue = parseFloat(document.getElementById('kultur_szorzo').textContent.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                        // Calculate kultur_netto
                        var kulturNettoValue = kulturValue / kulturSzorzoValue;
                    
                        // Update the kultur_netto element with the calculated value
                        document.getElementById('kultur_netto').textContent = Math.round(kulturNettoValue); // Display up to 2 decimal places
                    }
                    
                    function calculateSportNetto() {
                        // Get the values of sport_I and sport_szorzo
                        var sportValue = parseFloat(document.getElementById('sport_I').value);
                        var sportSzorzoValue = parseFloat(document.getElementById('sport_szorzo').textContent.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                        // Calculate sport_netto
                        var sportNettoValue = sportValue / sportSzorzoValue;
                    
                        // Update the sport_netto element with the calculated value
                        document.getElementById('sport_netto').textContent = Math.round(sportNettoValue); // Display up to 2 decimal places
                    }
                    
                    function calculateOviNetto() {
                        // Get the values of ovi_I and ovi_szorzo
                        var oviValue = parseFloat(document.getElementById('ovi_I').value);
                        var oviSzorzoValue = parseFloat(document.getElementById('ovi_szorzo').textContent.replace(',', '.')); // Parse the value, replace comma with dot for parseFloat
                    
                        // Calculate ovi_netto
                        var oviNettoValue = oviValue / oviSzorzoValue;
                    
                        // Update the ovi_netto element with the calculated value
                        document.getElementById('ovi_netto').textContent = Math.round(oviNettoValue); // Display up to 2 decimal places
                    }
                    calculateAjandekNetto();
                    calculateBerletNetto();
                    calculateKulturNetto();
                    calculateSportNetto();
                    calculateOviNetto();
                    // Similarly, create functions for kultur, sport, and ovi
                    
                    // Call the function to calculate the netto sum
                    calculateNettoSum();
                } else {
                    // No data exists in the database for the current user
                    // Set default values of 0 for input fields
                    const inputs = document.querySelectorAll('.input-table input[type="number"]');
                    inputs.forEach(input => {
                        input.value = 0;
                    });
                }
            } else {
                console.error('Nem sikerült az elmentett adatot behívni.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Call the function to populate saved data when the page loads
    populateSavedData();

    // Function to save data
    function saveData() {
        console.log('Mentés gomb megnyomva, mentés folyamatban...');
        // Loop through each input field and get its value
        const inputs = document.querySelectorAll('.input-table input[type="number"]');
        const data = {};
        inputs.forEach(input => {
            const columnName = input.id;
            // Check if the column starts with any supported category and contains a number in its value
            if (/\d/.test(input.value)) {
                const parts = columnName.split('_');
                const category = parts[0];
                let month = parts[1];
                if (category === 'szep') {
                    // Convert szep month abbreviations to full month names
                    const szepMonthMap = { 'I': 'Mar', 'II': 'Jun', 'III': 'Sze', 'IV': 'Dec' };
                    month = szepMonthMap[month];
                } else if (category === 'ajandek' || category === 'berlet' || category === 'kultur' || category === 'sport' || category === 'ovi') {
                    month = 'Jan';
                }                
                if (month !== undefined) {
                    const columnValue = input.value === '' ? 0 : parseInt(input.value); // Set default value to 0 if empty
                    if (!data[category]) {
                        data[category] = {};
                    }
                    data[category][month] = {
                        hónap: month, // Assign the extracted month name
                        összeg: columnValue
                    };
                }
            }
        });
    
        // Extract the név from the label text
        const labelText = document.querySelector('label').innerText;
        const név = labelText.split(' ')[0]; // Assuming the név is the first word in the label text
    
        // Add the név to the data object
        data['név'] = név;
    
        // Send the data to the server using AJAX
        fetch('save_services/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Ensure CSRF token is included
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Data saved successfully
                console.log('Adatok sikeresen elmentve.');
                location.reload();
            } else {
                // Error handling
                console.error('Hiba az adatok mentése során');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Attach saveData function to the save button click event
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', saveData);
});

  // Function to get CSRF token from cookies
  function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.startsWith(name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

//SAVE BUTTON AND ERRORS
document.addEventListener('DOMContentLoaded', function() {
    // Get the difference element
    var differenceElement = document.getElementById('difference');
    
    // Get the text content of the difference element
    var differenceText = differenceElement.textContent.trim();
    
    // Extract the numerical value from the text content
    var differenceValue = parseInt(differenceText.split(': ')[1]); // Assuming the text is formatted as "maradvány összeg: value"
    
    // Check if differenceValue is less than 0
    if (differenceValue < 0) {
        // Show an alert with the error message
        alert('Túl lépted a pénz keretedet.');

        // Disable the finalize button
        var finalizeBtn = document.getElementById('finalizeBtn');
        finalizeBtn.disabled = true;
    }
});

//FINALIZE BUTTON
document.addEventListener('DOMContentLoaded', function() {
    // Get the finalize button element
    var finalizeBtn = document.getElementById('finalizeBtn');

    // Add click event listener to the finalize button
    finalizeBtn.addEventListener('click', function() {
        // Display a confirmation dialog
        var confirmation = confirm("Biztos vagy benne hogy véglegesíteni akarsz?");

        // If user confirms, proceed with finalization
        if (confirmation) {
            // Prepare the data to send
            var data = {
                'beadási_határidő': new Date().toISOString()
            };

            // Send a POST request to the Django view using fetch
            fetch('finalize/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) {
                    // Disable the finalize button
                    finalizeBtn.disabled = true;
                    saveBtn.disabled = true;
                } else {
                    console.error('Error:', data.error);
                }
            })
            .catch(error => {
                // Handle network error
                console.error('Error:', error);
            });
        } else {
            // If user cancels, do nothing
        }
    });

    // Check if the button should be disabled based on beadási_határidő value in the ember table
    fetch('check_hand_in_time_finalize/')
    .then(response => response.json())
    .then(data => {
        if (data.beadási_határidő) {
            // Disable the finalize button
            finalizeBtn.disabled = true;
            saveBtn.disabled = true;
        }
    })
    .catch(error => {
        // Handle network error
        console.error('Error:', error);
    });
});

//ALERT ON ARRIVAL
window.onload = function() {
    alert("Mielőtt rányomnál a véglegesítés gombra, győződj meg róla hogy mentettél különben lehetséges hogy a mentés előtti állapotot fogja véglegesíteni!");
  };

//PRINT
document.addEventListener('DOMContentLoaded', function() {
    // Function to handle printing when the button is clicked
    function printPage() {
        // Print the current page
        window.print();
    }

    // Add click event listener to the print button
    document.getElementById('printButton').addEventListener('click', printPage);
});


