 // Get the modal
 var modal = document.getElementById("addEmployeeModal");

 // Get the button that opens the modal
 var btn = document.getElementById("addEmployeeBtn");

 // Get the <span> element that closes the modal
 var span = document.getElementsByClassName("close")[0];

 // When the user clicks the button, open the modal 
 btn.onclick = function() {
     modal.style.display = "block";
 }

 // When the user clicks on <span> (x), close the modal
 span.onclick = function() {
     modal.style.display = "none";
 }

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    let employee = {
        name: document.getElementById('employeeName').value,
        role: document.getElementById('role').value,
        schedule: [
            {
                day: document.getElementById('day1').value,
                startTime: document.getElementById('startTime1').value,
                endTime: document.getElementById('endTime1').value
            }
        ],
        contact: document.getElementById('contact').value,
        salary: document.getElementById('salary').value,
        joinDate: document.getElementById('joinDate').value
    };

    console.log("Captured Employee Data:", employee); // For debugging

    fetch('http://localhost:8080/api/employees/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = "/staff"; // Reloads the page to reflect changes
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
