function checkout(total) {
  const selectedAddress = $('input[name="address"]:checked').val();
  const paymentMethod = $('input[name="paymentMethod"]:checked').val();
  //console.log("dflsakdjf", JSON.parse( selectedAddress));
  let orderID;

  if (paymentMethod === "COD" || !paymentMethod) 
  {
    window.location.href = '/cart/cod/orderplaced';
    return;
  }

  $.ajax({
    url: '/cart/onlinepayment',
    method: 'POST',
    data: {
      selectedAddress,
      total: total
    },
    dataType: 'json',
    success: function (response) {
      console.log(response)
      orderID = response.id;
      const options = {
        "key": "rzp_test_uN7cMKTYFIHGa4", // Enter the Key ID generated from the Dashboard
        "amount": (total * 100) + "", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Fashion Blend ltd",
        "description": "Test Transaction",
        "image": "",
        "order_id": orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
          $.ajax({
            url: '/cart/onlinepayment/orderplaced', // The URL to which the AJAX request should be sent
            method: 'POST', // The HTTP method (e.g., GET, POST, PUT, DELETE)
            data: {
              response,
              address: selectedAddress
            },
            dataType: 'json', // The expected data type of the response from the server
            success: function (response) {
              // The function to be executed if the AJAX request is successful
              if (response.data == "done")
                window.location.href = "/cart/orderplacedonline";
            },
            error: function (xhr, status, error) {
              // The function to be executed if an error occurs during the AJAX request
              console.log('Error:', error);
            }
          });

        },
        "prefill": {
          "name": "Gaurav Kumar",
          "email": "gaurav.kumar@example.com",
          "contact": "9000090000"
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
          "color": "#3399cc"
        }
      };
      var rzp1 = new Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzp1.open();
    },
    error: function (xhr, status, error) {
      console.log('Error:', error);
    }
  });




}


//for change in quantity for cart

$(document).ready(function () {
  $(".quantityUpdate").on("input", function () {
    const id = $(this).attr('id');
    const newVal = $(this).val();
    $.ajax({
      url: '/cart/changequantity',
      method: 'GET',
      data: {
        id: id,
        newVal: newVal
      },
      success: function(response) {
        location.reload();
        console.log('Response:', response);
      },
      error: function(xhr, status, error) {
        // Handle the error
        console.log('Error:', error);
      }
    });
  });
}); 