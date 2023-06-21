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

//cart pill updation
$(document).ready(function () {
  if ($('#cartIcon').length) {
    const phoneNumber = sessionStorage.getItem("phoneNumber");
    console.log("phone number from session", phoneNumber);
    $.ajax({
      url: "/cart/pill",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phoneNumber: phoneNumber }),
      success: function (data) {
        console.log("inside succes", data.number);
        // console.log("CART PILL DISPLAYED:", data.number);
        $('#cartPill').text(data.number);
      },
      error: function (error) {

      }
    });
  }
});

//for saving the phone number of user
function savePhoneNumber() {
  $(document).ready(function () {
    const inputValue = $('#phoneNumber').val();
    sessionStorage.setItem("phoneNumber", inputValue);
  });
}

function removeFromCart(id) {
  $.ajax({
    url: "/cart/delete",
    method: "post",
    contentType: "application/json",
    data: JSON.stringify({ id: id }),
    success: function (data) {
      location.reload();
    },
    error: function (error) {

    }
  });
};


//for select address remove and edit button

function editAddress(id){
  console.log(id);
window.location.href = "/cart/editaddress/" + id;
}

function deleteAddress(id){
  window.location.href = "/cart/deleteaddress/" + id;
}

