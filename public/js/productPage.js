let selectedSize = "";
//for size selection
$(document).ready(function () {
    $('.size-button').click(function () {
        // Remove 'active' class from all buttons
        $('.size-button').removeClass('active');

        // Add 'active' class to the clicked button
        $(this).addClass('active');
        selectedSize = $(this).val();
    });
});


function addToCart(id, num) {
    
    if (selectedSize) {
        $('#addToCart').hide();
        $('#goToBag').show();
        const cart = {
            id: id,
            size: selectedSize,
            numbers: num,
        };
        console.log(cart);
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
    else {
        alert("Slect a size");

    }

}

function addToWishlist(id)
{
    window.location.href='/cart/wishlist/'+id;
}