/* // Assuming you have a form with the ID "phoneNumberForm" for the first modal
console.log("phone numsdfgds");
$("#OTPform").submit(function(event) {console.log(" numsdfgds");
    event.preventDefault(); // Prevent form submission
    var phoneNumber = $("#phoneNumber").val();
    console.log("phone num",phoneNumber);
  
    // Send AJAX request to the server
    $.ajax({
      url: "/auth/verify",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phoneNumber: phoneNumber }),
      success: function(data) {console.log("insucsdhfsdhkfhksdjfh");
        if (data.success) {
          // Successful response, switch to the OTP modal
          $("#OTPform").modal("hide"); // Hide the current modal
          $("#NewUser").modal("show"); // Show the OTP modal
        } else {
          // Handle the error response
          // Display an error message or take any other necessary action
        }
      },
      error: function(error) {
        // Handle any error that occurred during the request
        console.error(error);
      }
    });
  });
   */
