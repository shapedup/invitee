// === JS DOM Scripting By Example Part 3 (Challenge) === //

	// * done - Reject blank names
	// * done - Reject repeated names
	// * done - Have the "Confirmed" label read Confirm, and change to "Confirmed" once checked (may require looking into text nodes)
	// * done - Create an additional place to keep notes about each invitation, perhaps adding a text area to each list item 
	// * Additional options for if the invitee is not coming, for example. Might need select elements rather than tick boxes
	// * done - When filtering those who havent responded we can still see the confirmed checkbox, we can hide this as it is redundant information
	// * Local storage: when the page refreshes we lose all of our information. Local storage saves the state when a page is refreshed. 

document.addEventListener("DOMContentLoaded", () => {
	
	const form = document.getElementById("registrar");
	const input = form.querySelector("input");
	const mainDiv = document.querySelector(".main");
	const ul = document.getElementById("invitedList");
	
	let names = [];

	const div = document.createElement("div");
	const filterLabel = document.createElement("label");
	const filterCheckbox = document.createElement("input");
	filterLabel.textContent = "Hide those who haven't responded";
	filterCheckbox.type = "checkbox";
	div.appendChild(filterLabel);
	div.appendChild(filterCheckbox);
	mainDiv.insertBefore(div, ul);
	filterCheckbox.addEventListener("change", (e) => {
		const isChecked = e.target.checked;
		const lis = ul.children;
		
		if (isChecked) {
			// if filterCheckbox is checked then loop through all list items
			for (let i=0; i<lis.length; i++) {
				let li = lis[i];
				const confirmLabel = li.querySelector("label");
				if (li.className === "responded") {
					// if the confirmed box is ticked then display is defaulted
					li.style.display = "";
					confirmLabel.style.display = "none";
				} else {
					// otherwise hide the <li> item
					li.style.display = "none";
					
				}
			}
		} else {
			// if filterCheckbox is not checked then loop through all list items
			for (let i=0; i<lis.length; i++) {
				// display as default
				let li = lis[i];
				const confirmLabel = li.querySelector("label");
				li.style.display = "";
				confirmLabel.style.display = "";
			}
		}
	});


	function createLi(text) {
		function createAnElement(elementName, property, aValue) {
			const element = document.createElement(elementName); 
			element[property] = aValue;
			return element;
		}
		
		function appendToLi(elementName, property, aValue) {
			const element = createAnElement(elementName, property, aValue); 
			li.appendChild(element);
			return element;
		}
		
		const li = document.createElement("li");
		
		appendToLi("span", "textContent", text);
		appendToLi("label", "textContent", "Confirm")
			.appendChild(createAnElement("input", "type", "checkbox"));
		appendToLi("textarea", "placeholder", "Notes");
		appendToLi("button", "textContent", "edit");
		appendToLi("button", "textContent", "remove");
		
		return li;
	}

	form.addEventListener("submit", (e) => { 
		e.preventDefault();
		const text = input.value;
		
		// = reject blank input field =
		// condition reset
		input.placeholder = "Invite Someone";
		input.style.border = "";
		// if text is blank, error
		if (!text) {
			input.placeholder = "You forgot to enter a name!";
			input.style.border = "solid salmon 1px";
			input.style.borderRadius = "0.2em";
		// if text doesn't already exist in names =>
		// add text as array item in names and append to <ul> as <li>
		} else if (names.indexOf(text) === -1) {
			names.push(text);
			const li = createLi(text);
			ul.appendChild(li);
			input.value = "";
			const notes = li.querySelector("textarea");
			notes.style.resize = "none";
			notes.row = "1";
			notes.style.width = "95%";
			notes.style.display = "block";
			notes.style.marginTop = "0.8em";
			notes.style.border = "dotted 1px rgba(0, 0, 0, .2)";
			notes.style.color = "#707070";
			notes.style.fontFamily = "'Lato', Sans Serif";
		// if input is already in the list,
		// tell the user the name is already entered
		} else {
			input.value = "";
			input.placeholder = "You've already entered this name!"
			input.style.border = "solid salmon 1px";
			input.style.borderRadius = "0.2em";
		}
		
		
	});
	
	// Change event: checkbox.
	ul.addEventListener("change", (e) => {
		if (e.target.tagName === "INPUT") {
			const checkbox = e.target;
			const isChecked = checkbox.checked;
			const label = checkbox.parentNode;
			const listItem = checkbox.parentNode.parentNode;
			const labelContent = label.childNodes[0];
			if (isChecked) {
				listItem.className = "responded";
				labelContent.textContent = "Confirmed";
			} else {
				listItem.className = "";
				labelContent.textContent = "Confirm";
			}
		}
	});

	ul.addEventListener("click", (e) => {
		if (e.target.tagName === "BUTTON") {
			const button = e.target;
			const li = button.parentNode;
			const ul = li.parentNode;
			const action = button.textContent;
			const nameActions = {
				remove: () => {
					const name = li.firstElementChild.textContent;
					names.splice(names.indexOf(name),1);
					ul.removeChild(li);
				},
				edit: () => {
					const span = li.firstElementChild;
					const input = document.createElement("input");
					const name = li.firstElementChild.textContent;
					const label = li.querySelector("label");
					names.splice(names.indexOf(name),1);
					input.type = "text";
					input.value = span.textContent;
					li.insertBefore(input, span);
					li.removeChild(span);
					button.textContent = "save";
					input.style.paddingTop = "0";
					input.style.paddingBottom = "0";
				},
				save: () => {
					const input = li.firstElementChild;
					
					// if text doesn't already exist in names =>
					// add text as array item in names and append to <ul> as <li>
					if (names.indexOf(input.value) === -1) {
						const span = document.createElement("span");
						const label = span.getElementsByTagName("label")[0];
						names.push(input.value);
						span.textContent = input.value;
						li.insertBefore(span, input);
						li.removeChild(input);
						button.textContent = "edit";
					// if input is already in the list,
					// tell the user the name is already entered
					} else {
						input.value = "";
						input.placeholder = "You've already entered this name!"
						input.style.border = "dotted salmon 1px";
					}
				}
				
			};
			nameActions[action]();
		}
	});
});

