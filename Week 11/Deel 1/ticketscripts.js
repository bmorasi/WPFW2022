window.onload = function() {
    var adultTickets = document.getElementById("adult-tickets");
    var childTickets = document.getElementById("child-tickets");
    var reserveButton = document.getElementById("reserve-button");
    var totalCost = document.getElementById("total-cost");
	var date = document.getElementById("date");
	var adultTicketCost = 35;
	
	var currentTemperature = document.getElementById("current-temp");
	var minTemperature = document.getElementById("min-temp");
	var maxTemperature = document.getElementById("max-temp");
	var tempDate = "";
		
    reserveButton.addEventListener("click", function(event) {
        event.preventDefault();

		var numAdultTickets = parseInt(adultTickets.value);
		var numChildTickets = parseInt(childTickets.value);
		var ticketCost = (numAdultTickets * adultTicketCost);

		// Update the total cost field
		totalCost.value = ticketCost.toFixed(2);
	});

	// Add event listeners for when the value of the tickets inputs change
	adultTickets.addEventListener("change", calculateTotalCost);
	childTickets.addEventListener("change", calculateTotalCost);
	
	date.addEventListener("change", setTicketCost);
	
	function setTicketCost() {
		var selectedDate = new Date(date.value);
		var day = selectedDate.getDay();
		if (day === 0 || day === 6) {
			// Weekend
			adultTicketCost = 38;
		} else {
			adultTicketCost = 35;
		}
		
		if(selectedDate != "Invalid Date"){
			adultTickets.disabled = false;
			tempDate = selectedDate.toISOString().slice(0, 10);
		} else {
			adultTickets.disabled = true;
			adultTickets.value = 0;
			childTickets.disabled = true;
			childTickets.value = 0;
			tempDate = "";
		}
		calculateTotalCost();
		haalweerop();
	}

	// Function to calculate total cost
	function calculateTotalCost() {
		var numAdultTickets = parseInt(adultTickets.value);
	
		if(parseInt(adultTickets.value) > 0){	
			childTickets.disabled = false;
		} else {
			childTickets.disabled = true;
			childTickets.value = 0;
		}
				
		var numChildTickets = parseInt(childTickets.value);

		var ticketCost = (numAdultTickets * adultTicketCost);
		totalCost.value = ticketCost.toFixed(2);
	}
	
	function haalweerop() {
		console.log(tempDate);
		var urlRequest = "https://api.open-meteo.com/v1/forecast?latitude=51.66&longitude=5.03&daily=temperature_2m_max,temperature_2m_min&timezone=auto&start_date="+tempDate+"&end_date="+tempDate;
		const xhr = new XMLHttpRequest();
		xhr.open('GET', urlRequest);
		xhr.send();
		xhr.onload = () => {
			const data = JSON.parse(xhr.response);
			var min = data.daily.temperature_2m_min[0];
			var max = data.daily.temperature_2m_max[0];
			
			minTemperature.innerHTML = "Min Temperature: " + min + "°C";
			maxTemperature.innerHTML = "Max Temperature: " + max + "°C";
		};
	}
};