//Open the full screen search box
  function openSearch() {
    document.getElementById("myOverlay").style.display = "block";
  }

//Close the full screen search box
  function closeSearch() {
    document.getElementById("myOverlay").style.display = "none";
  }

//REMOVE BUTTON
document.addEventListener('DOMContentLoaded', function() {

  // Function to delete checked items
  function deleteCheckedItems() {
      const listItems = document.querySelectorAll('#scrollable-list li');

      // Function to handle deletion after confirmation
      function deleteItem(név) {
          const csrftoken = getCookie('csrftoken');

          fetch('delete_user/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrftoken
              },
              body: JSON.stringify({
                  'név': név
              })
          })
          .then(response => {
              if (response.ok) {
                  document.querySelector(`#scrollable-list li[data-név="${név}"]`).remove();
              } else {
                  console.error('Hiba az elem törlésekor.');
              }
          })
          .catch(error => {
              console.error('Hiba az elem törlése közben:', error);
          });
      }

      // Function to display confirmation dialog
      function confirmDelete(név) {
          const confirmResult = confirm('Biztos vagy benne hogy törölni akarsz?');
          if (confirmResult) {
              deleteItem(név);
          }
      }

      listItems.forEach(function(item) {
          const checkbox = item.querySelector('input[type="checkbox"]');
          if (checkbox.checked) {
              const név = item.dataset.név;

              confirmDelete(név);
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
  
//CHECKBOX TOGGLE
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

  // Function to handle mutations
  function handleMutations(mutationsList) {
      for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(function(node) {
                  if (node.tagName === 'LI') {
                      addEventListenerToItem(node);
                  }
              });
          }
      }
  }

  // Create a new MutationObserver object
  const observer = new MutationObserver(handleMutations);

  // Configure the observer to watch for changes in the list container
  const listContainer = document.getElementById('scrollable-list');
  const config = { childList: true };

  // Start observing the target node for configured mutations
  observer.observe(listContainer, config);
});

//Pencil button
// Function to retrieve the CSRF token from cookies
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

// Function to handle opening the modal and updating user beosztás
document.addEventListener('DOMContentLoaded', function() {
  const openModalButton = document.getElementById('openModalButton');
  openModalButton.addEventListener('click', openModal);
  
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

      // Fetch munkakör titles from the database
      fetch('get_positions/')
          .then(response => response.json())
          .then(positions => {
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
              
              // Create label and dropdown menu for modifying beosztás
              const titleLabel = document.createElement('label');
              titleLabel.textContent = 'Új beosztás:';
              const dropdown = document.createElement('select');
              dropdown.setAttribute('id', 'newTitleDropdown');
              
              // Populate the dropdown with options
              positions.forEach(function(beosztás) {
                  const option = document.createElement('option');
                  option.value = beosztás;
                  option.textContent = beosztás;
                  dropdown.appendChild(option);
              });
              
              // Create label and checkbox for modifying admin status
              const adminLabel = document.createElement('label');
              adminLabel.textContent = 'Admin:';
              const adminCheckbox = document.createElement('input');
              adminCheckbox.setAttribute('type', 'checkbox');
              adminCheckbox.setAttribute('id', 'isAdminCheckbox');
              adminCheckbox.checked = checkedCheckbox.dataset.isAdmin === 'true'; // Check the checkbox if isAdmin is true

              // Append elements to form
              form.appendChild(titleLabel);
              form.appendChild(dropdown);
              form.appendChild(document.createElement('br'));
              form.appendChild(adminLabel);
              form.appendChild(adminCheckbox);
              form.appendChild(document.createElement('br'));
              
              // Create submit button
              const submitButton = document.createElement('button');
              submitButton.setAttribute('type', 'submit');
              submitButton.textContent = 'Submit';
              
              // Append elements to form
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
                
                // Get the new beosztás selected from the dropdown menu
                const newTitle = dropdown.value.trim();
                
                // Get the checked checkbox
                const checkedCheckbox = document.querySelector('#scrollable-list input[type="checkbox"]:checked');
                
                // Get the corresponding név
                const név = checkedCheckbox.value;
                
                // Get the isAdmin checkbox status
                const isAdmin = adminCheckbox.checked;

                // Get the CSRF token
                const csrftoken = getCookie('csrftoken');

                // Send an AJAX request to update the user's beosztás and isAdmin status
                fetch('update_user_title/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        név: név,
                        new_title: newTitle,
                        admin_e: isAdmin
                    })
                })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                      // Refresh the page after updating user details
                      window.location.reload();
                  } else {
                      console.error('Hiba a felhasználó adatainak frissítésekor:', data.error);
                      alert('Hiba a felhasználó adatainak frissítésekor, kérlek próbálkozz később.');
                  }
              })
                .catch(error => {
                    console.error('Hiba a felhasználó adatainak frissítésekor:', error);
                    alert('Hiba a felhasználó adatainak frissítésekor, kérlek próbálkozz később.');
                });
              });
          })                              
          .catch(error => {
              console.error('Hiba a pizíció hívásakor:', error);
              alert('Hiba a pizíció hívásakor, kérlek próbálkozz később.');
          });
  }
});

//SEARCH BUTTON
document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.querySelector('.overlay-content button[type="submit"]');
  searchButton.addEventListener('click', function() {
      // Get the search input value
      const searchInput = document.querySelector('.overlay-content input[name="search"]').value;
      
      // Find the checkbox corresponding to the searched név
      const checkboxes = document.querySelectorAll('#scrollable-list input[type="checkbox"]');
      checkboxes.forEach(function(checkbox) {
          if (checkbox.value === searchInput) {
              checkbox.checked = true;
          }
      });

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
                  document.getElementById('addButton').disabled = true;
                  document.getElementById('openModalButton').disabled = true;
                  document.getElementById('deleteButton').disabled = true;
                }
            } else {
                console.error('No modify time found');
            }
        })
        .catch(error => console.error('Error fetching modify time:', error));
});

//PLUS BUTTON
document.addEventListener('DOMContentLoaded', function() {
    function addNewUser(név, admin_e) {
        // Get CSRF token from cookie
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
    
        const csrftoken = getCookie('csrftoken');

        fetch('add_user_to_database/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Include CSRF token in the headers
            },
            body: JSON.stringify({
                'név': név,
                'admin_e': admin_e
            })
        })
    }
    
    function openAddUserModal() {
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
    
        // Create label and text input for név
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Név:';
        const usernameInput = document.createElement('input');
        usernameInput.setAttribute('type', 'text');
        usernameInput.setAttribute('placeholder', 'Enter név');
    
        // Create checkbox for admin_e
        const isAdminLabel = document.createElement('label');
        isAdminLabel.textContent = 'Admin:';
        const isAdminCheckbox = document.createElement('input');
        isAdminCheckbox.setAttribute('type', 'checkbox');
    
        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Submit';
    
        // Append elements to form
        form.appendChild(usernameLabel);
        form.appendChild(usernameInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(isAdminLabel);
        form.appendChild(isAdminCheckbox);
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
    
            // Get the new név and admin_e values
            const newUsername = usernameInput.value.trim();
            const isAdmin = isAdminCheckbox.checked;
    
            // Add new user to the database
            addNewUser(newUsername, isAdmin);
    
            // Close the modal
            document.body.removeChild(modal);

            window.location.reload();
        });
    }
        
    
    // Add button click event listener
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', openAddUserModal);
});
  