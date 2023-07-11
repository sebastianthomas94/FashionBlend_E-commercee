
//for edit address in user profile info
var ID;
function getAddressID(id) {
    ID = id;
    console.log("inside func" + ID);
}
$('#address-form').submit(function (event) {console.log("inside form")
    event.preventDefault(); // Prevent the default form submission
    const formData = $(this).serialize();
    $.ajax({
        type: "Post",
        url: "/cart/editaddress/" + ID+"?profile=true",
        data: formData,
        dataType: "json",
        success: function (response) {
            console.log("sdkjjbfkjsdhf");
            location.reload();
        }
    });
});






