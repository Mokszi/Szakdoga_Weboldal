//Open the full screen search box
function openSearch() {
    document.getElementById("myOverlay").style.display = "block";
  }

//Close the full screen search box
function closeSearch() {
    document.getElementById("myOverlay").style.display = "none";
  }

// REMOVE BUTTON
document.addEventListener('DOMContentLoaded', function() {

    // Function to delete checked items
    function deleteCheckedItems() {
        const listItems = document.querySelectorAll('#scrollable-list li');

        // Function to handle deletion after confirmation
        function deleteItem(beosztás) {
            const csrftoken = getCookie('csrftoken');

            fetch('delete_position/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({
                    'beosztás': beosztás
                })
            })
            .then(response => {
                if (response.ok) {
                    document.querySelector(`#scrollable-list li[data-beosztás="${beosztás}"]`).remove();
                } else {
                    console.error('Hiba az elem törlésekot');
                }
            })
            .catch(error => {
                console.error('Hiba az elem törlése közben:', error);
            });
        }

        // Function to display confirmation dialog
        function confirmDelete(beosztás) {
            const confirmResult = confirm('Biztos vagy benne hogy törölni akarsz?');
            if (confirmResult) {
                deleteItem(beosztás);
            }
        }

        listItems.forEach(function(item) {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                const beosztás = item.dataset.beosztás;

                confirmDelete(beosztás);
            }
        });
    }

  // Function to get CSRF token from cookie
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

  // Add event listener to the delete button
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", deleteCheckedItems);
});

  //PLUS BUTTON and checkbox toggle
document.addEventListener('DOMContentLoaded', function() {
    // Function to toggle checkbox when clicking the row
    function addCheckboxClickListener(item) {
      item.addEventListener('click', function(event) {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (!event.target.matches('input[type="checkbox"]')) {
          checkbox.checked = !checkbox.checked; // Toggle checkbox
        }
      });
    }
  
    // Function to add event listener to an item
    function addEventListenerToItem(item) {
      addCheckboxClickListener(item);
    }
  
    // Function to add event listeners to existing items
    function addEventListenersToExistingItems() {
      const listItems = document.querySelectorAll('#scrollable-list li');
      listItems.forEach(function(item) {
        addEventListenerToItem(item);
      });
    }
  
    // Call the function to add event listeners to existing items
    addEventListenersToExistingItems();

// Function to add a new item to the list
function addNewItem(beosztás, pénz) {
  // Get CSRF token from cookie
  const csrftoken = getCookie('csrftoken');

  // Send a POST request to your Django backend to add the item to the database
  fetch('add_item_to_database/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken // Include CSRF token in the headers
      },
      body: JSON.stringify({
          'beosztás': beosztás,
          'pénz': pénz
      })
  })
}

// Function to get CSRF token from cookie
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


// Function to open the add modal
function openAddModal() {
  // Create modal element
  const modal = document.createElement('div');
  modal.classList.add('modal');

  // Create close button
  const closeButton = document.createElement('span');
  closeButton.classList.add('close');
  closeButton.innerHTML = '&times;';
  closeButton.onclick = function() {
      document.body.removeChild(modal);
  };

  // Create form element
  const form = document.createElement('form');

  // Create label and text input for beosztás
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'beosztás:';
  const titleInput = document.createElement('input');
  titleInput.setAttribute('type', 'text');
  titleInput.setAttribute('placeholder', 'Enter beosztás');

  // Create label and text input for pénz
  const moneyLabel = document.createElement('label');
  moneyLabel.textContent = 'pénz:';
  const moneyInput = document.createElement('input');
  moneyInput.setAttribute('type', 'number');
  moneyInput.setAttribute('placeholder', 'Enter pénz');

  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.textContent = 'Submit';

  // Append elements to form
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(document.createElement('br'));
  form.appendChild(moneyLabel);
  form.appendChild(moneyInput);
  form.appendChild(document.createElement('br'));
  form.appendChild(submitButton);

  // Append form to modal
  modal.appendChild(form);

  // Append close button to modal
  modal.appendChild(closeButton);

  // Append modal to body
  document.body.appendChild(modal);

  // Submit button click event listener
  submitButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent form submission

      // Get the new beosztás and pénz entered in the text input fields
      let newTitle = titleInput.value.trim();
      const newMoney = moneyInput.value.trim();

      // Convert the new beosztás to uppercase
      newTitle = newTitle.toUpperCase();

      // Add new item to the list and database
      addNewItem(newTitle, newMoney);

      // Close the modal
      document.body.removeChild(modal);
  });

  // Add button click event listener
  addButton.addEventListener('click', openAddModal);


  submitButton.addEventListener('click', function() {
    // Reload the current page
    location.reload();
  });
}

      // Add button click event listener
      const addButton = document.getElementById('addButton');
      addButton.addEventListener('click', openAddModal);

  });

  //PENCIL BUTTON
document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    openModalButton.addEventListener('click', openModal);

    let currentName = ''; // Declare currentName as a global variable
    let currentMoney = ''; // Declare currentMoney as a global variable

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
    
    function openModal() {
        // Check if any checkboxes are checked
        const checkboxes = document.querySelectorAll('#scrollable-list input[type="checkbox"]');
        let checkedCheckbox = null;
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                checkedCheckbox = checkbox;
            }
        });
        
        if (checkedCheckbox === null) {
            alert('Kérlek válassz ki egy elemet amit módosítani kívánsz.');
            return;
        }
        
        // Get the current name and pénz of the selected element
        currentName = checkedCheckbox.parentNode.textContent.trim().split(" - ")[0];
        currentMoney = checkedCheckbox.parentNode.textContent.trim().split(" - ")[1];

        // Create modal element
        const modal = document.createElement('div');
        modal.classList.add('modal');

        // Create close button
        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = function() {
            document.body.removeChild(modal);
        };

        // Create form element
        const form = document.createElement('form');

        // Create label and text input for modifying name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'New beosztás:';
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('placeholder', currentName);

        // Create label and text input for modifying pénz
        const moneyLabel = document.createElement('label');
        moneyLabel.textContent = 'New pénz:';
        const moneyInput = document.createElement('input');
        moneyInput.setAttribute('type', 'number');
        moneyInput.setAttribute('placeholder', currentMoney);

        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Submit';

        // Append elements to form
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(moneyLabel);
        form.appendChild(moneyInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(submitButton);

        // Append form to modal
        modal.appendChild(form);

        // Append close button to modal
        modal.appendChild(closeButton);

        // Append modal to body
        document.body.appendChild(modal);

        // Submit button click event listener
        submitButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission

            // Get the new name and pénz entered in the text input fields
            let newName = nameInput.value.trim(); // Convert to uppercase
            newName = newName.toUpperCase(); // Convert to uppercase
            const newMoney = moneyInput.value.trim();
            
            // Get CSRF token from cookie
            const csrftoken = getCookie('csrftoken');

            // Update the name and pénz of the selected element
            const listItem = checkedCheckbox.closest('li');
            listItem.innerHTML = `<input type="checkbox"> ${newName} - ${newMoney}`;
            
            // Modify the data in the database
            fetch('update_position/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken  // Include CSRF token in the headers
                },
                body: JSON.stringify({
                    current_title: currentName, // Send current name to the backend
                    current_money: currentMoney, // Send current pénz to the backend
                    beosztás: newName,
                    pénz: newMoney
                })
            }).then(response => {
                if (response.ok) {
                    console.log('Adat sikeresen frissítve.');
                } else {
                    console.error('Hiba az adat frissítése során.');
                }
            }).catch(error => {
                console.error('Hiba:', error);
            });
            
            // Close the modal
            document.body.removeChild(modal);
        });
    }
});

//SEARCH BUTTON
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.overlay-content button[type="submit"]');
    searchButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        
        // Get the search input value
        const searchInput = document.querySelector('.overlay-content input[name="search"]').value.trim();
        console.log("Search input:", searchInput);
        
        if (searchInput) {
            // Find the checkbox corresponding to the searched név
            const listItems = document.querySelectorAll('#scrollable-list li');
            let found = false;
            listItems.forEach(function(item) {
                const beosztas = item.getAttribute('data-beosztás');
                if (beosztas === searchInput) {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = true;
                    found = true;
                }
            });
            
            if (!found) {
                alert("Munkakör.beosztás not found."); // Alert if munkakör.beosztás not found
            }
        } else {
            alert("Please enter a search term."); // Alert if search field is empty
        }

        // Close the search overlay
        document.getElementById("myOverlay").style.display = "none";
    });
});

//DISABLE BUTTONS
document.addEventListener("DOMContentLoaded", function() {
    fetch('check_modify_time_emp_tit/')
        .then(response => response.json())
        .then(data => {
            const modifyTime = data.felvételi_határidő;
            if (modifyTime) {
                const currentTime = new Date();
                const modifyDate = new Date(modifyTime);
                
                if (modifyDate < currentTime) {
                    document.getElementById('openModalButton').disabled = true;
                    document.getElementById('deleteButton').disabled = true;
                    document.getElementById('addButton').disabled = true;
                }
            } else {
                console.error('No modify time found');
            }
        })
        .catch(error => console.error('Error fetching modify time:', error));
});
