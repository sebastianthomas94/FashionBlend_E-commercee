$("#apply-coupon").click(function () {
  const code = $("#couponCode").val();
  $.ajax({
    type: "get",
    url: "/cart/applycoupon",
    data: {
      code: code,
    },
    dataType: "json",
    success: function (response) {
      if (!response.valid) {
        $("#errorContainer").text(response.message);
        $('#errorContainer').removeClass('d-none'); // Show the error message
        $('#successContainer').addClass('d-none'); // Hide the success message
        return;
      }
      $("#successContainer").text(response.message);
      $('#successContainer').removeClass('d-none'); // Show the error message
      $('#errorContainer').addClass('d-none'); // Hide the success message

      $('.coupon-discount').removeClass('d-none');

      $("#discount-price").text(`-₹${response.discount}`);
      $("#total").text(`₹${response.newTotal}`);
        console.log(response);
    }
  });
});


//prevent from enter key submission
$(document).ready(function () {
  $("#couponCode").keydown(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  });
});


