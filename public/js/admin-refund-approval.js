

function initiateRefund (orderId){
    console.log(orderId);
    $.ajax({
        url: '/admin/refund-approvals/'+ orderId,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
          // Code to handle the successful response
          console.log(response);
          location.reload();
        },
        error: function(xhr, status, error) {
          // Code to handle errors
          console.error(error);
        }
      });
      
}