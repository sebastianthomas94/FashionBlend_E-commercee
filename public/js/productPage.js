let selectedSize = "";
//for size selection
function selectSize(size) {
    selectSize= size;
    const buttons = $('.size-button');
  
    // Remove 'active' class from all buttons
    buttons.removeClass('active');
  
    // Add 'active' class to the selected button
    const selectedButton = $(`button[data-size="${size}"]`);
    selectedButton.addClass('active');
    selectedButton.removeClass('btn-outline-dark').addClass('btn-dark');
    
  }

function addToCart(id, num) {
    const cart = {
        id: id,
        size: selectedSize,
        numbers: num ,
    }
    $.ajax({
        url: "/cart/addproduct", // Replace with your server's cart endpoint
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(cart),
        success: function (response) {
            console.log("Product added to cart!");
        },
        error: function (xhr, status, error) {
            console.error("Failed to add product to cart:", error);
        }
    });

}