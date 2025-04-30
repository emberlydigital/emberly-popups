document.addEventListener('DOMContentLoaded', () => {
	const focusableElements = 'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])';
	let lastFocusedElement; // To store the last focused element before popup opens

	const allAutoOpenPopups = document.querySelectorAll('.em-auto-open');

	function isDebugMode(popupOverlay) {
		return popupOverlay?.getAttribute('data-em-popup-debug') === 'true';
	}

	function forceLabelClicksInsidePopup(popupOverlay) {
		if (!popupOverlay) return;
	
		popupOverlay.addEventListener('click', function(e) {
			const label = e.target.closest('label[for]');
			if (label) {
				const inputId = label.getAttribute('for');
				const input = document.getElementById(inputId);
				if (input) {
					input.focus();   // Focus first
					input.click();   // Then trigger click manually

					// If debug mode is enabled, log the event.
					if (isDebugMode(popupOverlay)) {
						console.log(`[Emberly Popups] Label clicked: ${label.textContent}`);
						console.log(`[Emberly Popups] Input focused: ${inputId}`);
					}
				}
			}
		});
	}	

	// Function to set a cookie with a default expiration of 24 hours
	function setCookie(name, value, hours = 24) {
		const date = new Date();
		date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); // Convert hours to milliseconds
		const expires = "expires=" + date.toUTCString();
		document.cookie = `${name}=${value}; ${expires}; path=/`;
		
		// Log information about the current UTC, and when the cookie will expire.
		console.log(`[Emberly Popups] UTC: ${date.toUTCString()}`);
		console.log(`[Emberly Popups] Emberly Popup Cookie expires in ${hours} hours`);

		// If debug mode is enabled, log the event.
		const popupOverlay = document.querySelector('.em-popup-overlay.em-active');
		if (isDebugMode(popupOverlay)) {
			console.log(`[Emberly Popups] Cookie set: ${name}=${value}`);
		}
	}

	// Function to get a cookie
	function getCookie(name) {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.startsWith(name + '=')) {
				return cookie.substring(name.length + 1);
			}
		}
		return null;
	}

	// Function to keep focus inside the popup
	function trapFocus(event) {
		const dialog = document.querySelector('.em-popup-overlay.em-active > .em-popup');
		const isTabPressed = event.key === 'Tab';

		if (!isTabPressed) return;

		const focusableContent = dialog.querySelectorAll(focusableElements);
		const firstFocusableElement = focusableContent[0];
		const lastFocusableElement = focusableContent[focusableContent.length - 1];

		if (event.shiftKey) {
			// If Shift + Tab
			if (document.activeElement === firstFocusableElement) {
				event.preventDefault();
				lastFocusableElement.focus();
			}
		} else {
			// If Tab
			if (document.activeElement === lastFocusableElement) {
				event.preventDefault();
				firstFocusableElement.focus();
			}
		}
	}

	function unfocus(event) {
		const dialog = document.querySelector('.em-popup-overlay.em-active > .em-popup');
		// Get the list of focusable elements
		const focusableContent = Array.from(dialog.querySelectorAll(focusableElements));

		if(!focusableContent.includes(event.target)) {
			event.preventDefault();
			// Focus the first focusable element inside the popup
			const firstFocusableElement = dialog.querySelector(focusableElements);
			if(firstFocusableElement) {
				firstFocusableElement.focus();
			}
		}
	}

	function lockScroll(popupOverlay) {
		const scrollY = window.scrollY || document.documentElement.scrollTop;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.left = '0';
		document.body.style.right = '0';
		document.body.style.width = '100%';
		document.body.dataset.scrollY = scrollY;
	
		if (isDebugMode(popupOverlay)) {
			console.log(`[Emberly Popups] Scroll locked at: ${scrollY}px`);
		}
	}
	
	function unlockScroll(popupOverlay) {
		const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.left = '';
		document.body.style.right = '';
		document.body.style.width = '';
		delete document.body.dataset.scrollY;
		window.scrollTo(0, scrollY);
	
		if (isDebugMode(popupOverlay)) {
			console.log(`[Emberly Popups] Scroll unlocked, returned to: ${scrollY}px`);
		}
	}	

	// Function to handle the popup open
	function openPopup(trigger) {
		lastFocusedElement = document.activeElement; // Save the last focused element
		const popupId = trigger.getAttribute('em-popup-trigger-id');

		const popupOverlay = document.querySelector('.em-popup-overlay[data-em-popup-id="' + popupId + '"]');
		handleOpenPopup(popupOverlay);	
		
		// If debug mode is enabled, log the event.
		if (isDebugMode(popupOverlay)) {
			console.log(`[Emberly Popups] Popup opened: ${popupId}`);
		}
	}

	function openPopupByID(popupId) {
		const popupOverlay = document.querySelector('.em-popup-overlay[data-em-popup-id="' + popupId + '"]');
		handleOpenPopup(popupOverlay);

		// If debug mode is enabled, log the event.
		if (isDebugMode(popupOverlay)) {
			console.log(`[Emberly Popups] Popup opened: ${popupId}`);
		}
	}

	// Function to handle the popup open
	function handleOpenPopup(popupOverlay) {
		if (!popupOverlay) return;
	
		// Check for a delay attribute
		let delayTime = popupOverlay.getAttribute('data-em-delay');
		delayTime = delayTime ? parseInt(delayTime) : 0;
	
		const delay = () => {
			popupOverlay.style.display = 'flex';
			setTimeout(() => {
				popupOverlay.classList.add('em-active');
			}, 10); // give browser a tick to apply display change

			// Manual label-to-input binding fix
			forceLabelClicksInsidePopup(popupOverlay);
	
			// Turn on scroll lock.
			lockScroll(popupOverlay);
	
			// Make divs surrounding cross-origin iframes focusable
			const iframeContainers = popupOverlay.querySelectorAll('div:has(> iframe)');
			iframeContainers.forEach((iframe) => {
				iframe.setAttribute('tabindex', "0");
			});
	
			// Focus the first focusable element inside the popup
			const firstFocusableElement = popupOverlay.querySelector(focusableElements);
			if (firstFocusableElement) {
				firstFocusableElement.focus();
				// Prevent being able to focus on the whole overlay
				popupOverlay.addEventListener('click', unfocus);
			}
	
			// Add event listener to handle trap focus
			document.addEventListener('keydown', trapFocus);
		};
	
		// If there is a delay, wait before opening
		if (delayTime > 0) {
			setTimeout(delay, delayTime);
		} else {
			delay();
		}

		// If debug mode is enabled, log the event.
		if (isDebugMode(popupOverlay)) {
			console.log(`[Emberly Popups] Popup opened with delay: ${delayTime}ms`);
		}
	}

	// Function to handle the popup close and stop the video
	function closePopup(popupId) {
		console.log(popupId);
		const popupOverlay = document.querySelector(`.em-popup-overlay[data-em-popup-id="${popupId}"]`);
		if (popupOverlay) {
			popupOverlay.classList.remove('em-active');
			setTimeout(() => {
				popupOverlay.style.display = 'none';
			}, 400); // 400ms = match the CSS opacity transition
			
			popupOverlay.removeEventListener('click', unfocus);
			if (lastFocusedElement) {
				lastFocusedElement.focus(); // Return focus to the last focused element
			}
		}
		// Remove scroll lock from the body and html.
		unlockScroll(popupOverlay);

		// Remove event listener to handle trap focus
		document.removeEventListener('keydown', trapFocus);

		// If debug mode is enabled, log the event.
		if (isDebugMode(popupOverlay)) {
			console.log(`[Emberly Popups] Popup closed: ${popupId}`);
		}
	}

	// Open the popup when the trigger is clicked.
	const triggers = document.querySelectorAll('[em-popup-trigger-id]');
	triggers.forEach(trigger => {
		trigger.addEventListener('click', (event) => {
			event.preventDefault();
	
			const popupId = trigger.getAttribute('em-popup-trigger-id');
			const popupOverlay = document.querySelector(`.em-popup-overlay[data-em-popup-id="${popupId}"]`);
	
			// Always log something for verification
			console.log(`[Emberly Popup] Trigger clicked for popup ID: "${popupId}"`);
			
			if (!popupOverlay) {
				console.warn(`[Emberly Popup] No popup overlay found for ID: "${popupId}"`);
			} else {
				console.log(`[Emberly Popup] Found popup overlay for ID: "${popupId}"`);
			}
	
			if (popupOverlay?.getAttribute('data-em-popup-debug') === 'true') {
				console.log('%c[Emberly Popup Debug]', 'color: orange; font-weight: bold;');
				console.log('Trigger element:', trigger);
				console.log('Popup overlay element:', popupOverlay);
			}
	
			openPopup(trigger);
		});
	});

	// Add event listeners to the close buttons
	const closeButtons = document.querySelectorAll('.em-popup-close');
	closeButtons.forEach(closeButton => {
		closeButton.addEventListener('click', () => {
			const popupId = closeButton.closest('.em-popup').getAttribute('data-em-popup-id');
			closePopup(popupId);
		});
	});

	// Close popup when clicking outside the popup content
	const popups = document.querySelectorAll('.em-popup-overlay');
	popups.forEach(popup => {
		popup.addEventListener('click', (e) => {
			const popupContent = popup.querySelector('.em-popup');
			if (!popupContent.contains(e.target)) {
				const popupId = popup.getAttribute('data-em-popup-id');
				closePopup(popupId);
			}
		});
	});

	// look for all elements with the class em-show-once
	allAutoOpenPopups.forEach(element => {
		const id = element.getAttribute('data-em-popup-id');
		const shouldOpenOnce = element.classList.contains('em-show-once');
		
		let displayOnceMethod = 'cookie'; // default
		if (element.classList.contains('em-persistence-method-session')) {
			displayOnceMethod = 'session';
		}

		const displayEvery = element.getAttribute('data-em-show-interval-ms');
		const displayEveryMilliseconds = displayEvery ? parseInt(displayEvery) : 0;

		let alreadyDisplayed = false;
		const now = Date.now();

		if (shouldOpenOnce) {
			if (displayOnceMethod === 'cookie') {
				alreadyDisplayed = getCookie(id);
			} else if (displayOnceMethod === 'session') {
				alreadyDisplayed = sessionStorage.getItem(id);
			}
		} else if (displayEveryMilliseconds > 0) {
			let lastShown = null;
			if (displayOnceMethod === 'cookie') {
				lastShown = getCookie(id + '_timestamp');
			} else if (displayOnceMethod === 'session') {
				lastShown = sessionStorage.getItem(id + '_timestamp');
			}
			if (lastShown) {
				const lastShownTime = parseInt(lastShown, 10);
				if (now - lastShownTime < displayEveryMilliseconds) {
					alreadyDisplayed = true; // too soon, don't show
				}
			}
		}

		if (alreadyDisplayed) return;

		// Open popup
		openPopupByID(id);

		// After opening, store either:
		if (shouldOpenOnce) {
			if (displayOnceMethod === 'cookie') {
				setCookie(id, 'true', 365 * 24); // expires in 1 year (effectively forever)
			} else {
				sessionStorage.setItem(id, 'true');
			}
		} else if (displayEveryMilliseconds > 0) {
			if (displayOnceMethod === 'cookie') {
				// Convert milliseconds to hours for cookie expiration
				const hours = displayEveryMilliseconds / (1000 * 60 * 60);
				setCookie(id + '_timestamp', now.toString(), hours);
			} else {
				sessionStorage.setItem(id + '_timestamp', now.toString());
			}
		}
	});

	// Log debug info when popups are initialized (on load)
	document.querySelectorAll('.em-popup-overlay').forEach(popup => {
		if (isDebugMode(popup)) {
			const id = popup.getAttribute('data-em-popup-id');
			const delay = popup.getAttribute('data-em-delay') || '0';
			const interval = popup.getAttribute('data-em-show-interval-ms') || '0';
			const showOnce = popup.classList.contains('em-show-once');
			const persistence = popup.classList.contains('em-persistence-method-session') ? 'session' : 'cookie';

			console.groupCollapsed(`[Emberly Popups] Popup Loaded: "${id}"`);
			console.table({
				'Popup ID': id,
				'Delay (ms)': delay,
				'Show Once': showOnce,
				'Persistence': persistence,
				'Interval (ms)': interval
			});
			console.log('Popup Element:', popup);
			console.groupEnd();
		}
	});

	// Add escape key support to close the popup
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			const activePopup = document.querySelector('.em-popup-overlay.em-active');
			if (activePopup) {
				const popupId = activePopup.getAttribute('id');
				closePopup(popupId);
			}
		}
	});
});