var vehicleInfo, booking;

function updateInput() {
    // function that runs whenever and input is updated
    document.getElementById('outputDiv').innerHTML = '';

    var addItems = document.getElementsByClassName('addCheck');
    // this collects all my additional items checkboxes and stores them in an object array
    var checkedAddItems = [];
    //empty list to add the selected additional items to
    var addCost = 0
    for (var i = 0; i < addItems.length; i++) {
        if (addItems[i].checked) {
            checkedAddItems.push(' ' + addItems[i].value);
            addCost += Number(addItems[i].dataset.price);
        }
    }

    booking = {
        name: checkIfValid(document.getElementById('userFirstName')) + ' ' + checkIfValid(document.getElementById('userLastName')),
        age: checkIfValid(document.getElementById('userAge')),
        cel: checkIfValid(document.getElementById('userCel')),
        email: checkIfValid(document.getElementById('userEmail')),
        comments: checkIfValid(document.getElementById('userComments')),
        date: checkIfValid(document.getElementById('userDate')),
        duration: checkIfValid(document.getElementById('userDuration')),
        vehicle: vehicleInfo.vehicle,
        additionalItems: checkedAddItems,
        additionalItemsCost: addCost,
        vehicleCost: Number(vehicleInfo.price),
        bookingFee: 50,
        insuranceFee: 20,
        cost: 0
    }

    booking.cost = booking.duration * (booking.vehicleCost + booking.insuranceFee) + booking.bookingFee + addCost;

    var bookingsKeys = Object.keys(booking);
    var bookingsValues = Object.values(booking);
    var outputTable = document.createElement('table');
    for (i = 0; i < bookingsKeys.length; i++) {
        var row = outputTable.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = bookingsKeys[i].charAt(0).toUpperCase() + bookingsKeys[i].replace(/([A-Z])/g, ' $1').substring(1) + ':';
        var cell = row.insertCell(-1);
        cell.innerHTML = bookingsValues[i];
    }
    document.getElementById('outputDiv').appendChild(outputTable);

    var errorDivs = document.getElementsByClassName('errorMessageDiv');
    var errorDivLength = '';
    for (var i = 0; i < errorDivs.length; i++) {
        errorDivLength += String(errorDivs[i].innerHTML);
    }

    if (document.getElementById('termsAndConditions').checked && errorDivLength.length == 0) {
        document.getElementById('submitButton').disabled = false;
    } else {
        document.getElementById('submitButton').disabled = true;
    }
}

function updateVehicle() {
    vehicleInfo = {
        vehicle: this.dataset.name,
        seats: this.dataset.seats,
        body: this.dataset.body,
        luggage: this.dataset.luggage,
        engine: this.dataset.engine,
        fuelUsage: this.dataset.fuelusage,
        fuelType: this.dataset.fueltype,
        transmission: this.dataset.transmission,
        price: this.dataset.price
    }
    vehicleOutput.innerHTML = '';
    var vehicleKeys = Object.keys(vehicleInfo);
    var vehicleValues = Object.values(vehicleInfo);
    var outputTable = document.createElement('table');
    for (i = 0; i < vehicleKeys.length; i++) {
        var row = outputTable.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = vehicleKeys[i].charAt(0).toUpperCase() + vehicleKeys[i].replace(/([A-Z])/g, ' $1').substring(1) + ':';
        var cell = row.insertCell(-1);
        cell.innerHTML = vehicleValues[i];
    }
    document.getElementById('vehicleOutput').appendChild(outputTable);

    window.scrollTo(0, document.body.scrollHeight);
}

function submitBooking() {
    firebase.database().ref('bookings').push(booking);
    document.getElementById('confirmOverlay').style.height = "100%";
}

function resetBooking() {
    location.reload();
}

function checkIfValid(input) {
    if (input.checkValidity()) {
        document.getElementById('error' + input.id).innerHTML = '';
        return input.value;
    } else {
        if (input.validity.patternMismatch) {
            document.getElementById('error' + input.id).innerHTML = '* Please enter an appropriate ' + String(input.type) + ' value.';
        } else {
            document.getElementById('error' + input.id).innerHTML = '* ' + input.validationMessage;
        }
        return undefined;
    }
}

var allInputs = document.querySelectorAll('input');
// Code that 'attaches' the inputUpdate function to all inputs and creates error divs in front of each input
for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('input', updateInput);
    var newNode = document.createElement('div');
    allInputs[i].before(newNode);
    newNode.classList.add('errorMessageDiv');
    newNode.id = 'error' + allInputs[i].id;
}

// Code used by navigation buttons to show/hide the current page
nextStep('1', '1');

function nextStep(currentNum, goToNum) {
    document.getElementById('step' + currentNum).classList.remove('displayedDiv');
    document.getElementById('step' + goToNum).classList.add('displayedDiv');
    window.scrollTo(0, document.getElementById('step' + goToNum + 'title').offsetTop - 40);
}

var carInputs = document.getElementsByClassName('vehicleCard');
for (i = 0; i < carInputs.length; i++) {
    carInputs[i].addEventListener('click', updateVehicle)
    carInputs[i].addEventListener('click', updateInput)
}