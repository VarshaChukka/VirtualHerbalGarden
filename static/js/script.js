document.addEventListener('DOMContentLoaded', () => {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const searchToggle = document.querySelector('.searchToggle');
  const searchInput = document.querySelector('.search-input'); // Select the input field

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', () => {
      navbarToggle.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchToggle.classList.toggle('active');
      // Optional: Focus the input when search bar appears
      if (searchToggle.classList.contains('active') && searchInput) {
        searchInput.focus();
      }
    });
  }

  // Camera icon popup logic
  const cameraIcon = document.getElementById('cameraIcon');
  const cameraPopup = document.getElementById('cameraPopup');
  const cameraOverlay = document.getElementById('cameraOverlay');
  const closePopupBtn = document.getElementById('closePopupBtn');
  const takePhotoBtn = document.getElementById('takePhotoBtn');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
  const uploadInput = document.getElementById('uploadInput');

  // Custom message display (from previous suggestion)
  const messageContainer = document.getElementById('messageContainer');

    function showMessage(message, type = 'success', duration = 3000) {
        if (!messageContainer) return; // Guard against element not existing

        messageContainer.textContent = message;
        messageContainer.className = 'message-container'; // Reset classes
        messageContainer.classList.add('show');
        if (type === 'error' || type === 'danger') {
            messageContainer.classList.add('error');
        } else if (type === 'info') {
            messageContainer.classList.add('info');
        } else if (type === 'warning') {
            messageContainer.classList.add('warning');
        }

        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, duration);
    }

    // ... (rest of your camera popup logic, profile menu logic) ...


    // NEW CODE: Auto-hide Flask flash messages
    const flaskFlashMessagesContainer = document.querySelector('.flash-messages');

    if (flaskFlashMessagesContainer) {
        // Wait for a short period (e.g., 5 seconds) then hide the container
        setTimeout(() => {
            // Apply a class that hides the messages (e.g., via opacity and visibility)
            // Or just set style.display = 'none';
            flaskFlashMessagesContainer.style.opacity = '0';
            flaskFlashMessagesContainer.style.visibility = 'hidden';
            // Optionally, remove the element from the DOM entirely after transition
            flaskFlashMessagesContainer.addEventListener('transitionend', () => {
                flaskFlashMessagesContainer.remove();
            }, { once: true }); // Only run this listener once
        }, 5000); // Hide after 5 seconds (adjust as needed)
    }

  function openCameraPopup() {
    if (cameraOverlay && cameraPopup) {
      cameraOverlay.style.display = 'block';
      cameraPopup.classList.add('show');
    }
  }

  function closeCameraPopup() {
    if (cameraOverlay && cameraPopup) {
      cameraOverlay.style.display = 'none';
      cameraPopup.classList.remove('show');
    }
  }

  if (cameraIcon) {
    cameraIcon.addEventListener('click', openCameraPopup);
    cameraIcon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openCameraPopup();
      }
    });
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', closeCameraPopup);
  }

  if (cameraOverlay) {
    cameraOverlay.addEventListener('click', closeCameraPopup);
  }

  if (takePhotoBtn) {
    takePhotoBtn.addEventListener('click', () => {
      showMessage('Image capture feature coming soon!', 'info');
      closeCameraPopup();
    });
  }

  if (uploadPhotoBtn && uploadInput) {
    uploadPhotoBtn.addEventListener('click', () => {
      uploadInput.click(); // Trigger the hidden file input
    });
  }

  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        showMessage(`Selected file: ${file.name}`, 'success');
        // TODO: Handle the image upload or preview here (send to backend later)
      }
      closeCameraPopup();
      uploadInput.value = ''; // Reset the input so same file can be selected again
    });
  }

  // --- Profile menu logic REMOVED / Simplified ---
  // The profile menu is now handled directly by Jinja2 in the HTML templates
  // using `current_user.is_authenticated`.

  // No specific JS for profile menu dynamic rendering needed here anymore.
  // The event listener for toggling the dropdown is also removed from here
  // because Jinja2 renders the links directly. You might still want a JS
  // click handler for the profile icon to toggle visibility of the dropdown-menu
  // if you're not handling that purely with CSS :hover.

  // Re-add the dropdown toggle for the profile icon if it's not pure CSS
  const profileIcon = document.querySelector('.profile-icon');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (profileIcon && dropdownMenu) {
      profileIcon.addEventListener('click', () => {
          dropdownMenu.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
          // Close dropdown if clicked outside profile icon or dropdown itself
          if (!profileIcon.contains(e.target) && !dropdownMenu.contains(e.target) && dropdownMenu.classList.contains('show')) {
              dropdownMenu.classList.remove('show');
          }
      });
  }


  // Go to Plants function (used on index.html)
  // Ensure this function receives the URL from Jinja2
  // e.g., <button onclick="goToPlants('{{ url_for('main.plants') }}')">
  window.goToPlants = function(url) {
      window.location.href = url;
  };
});