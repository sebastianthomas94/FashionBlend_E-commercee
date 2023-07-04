$(document).ready(function () {
    $('#category').on('change', function() {
        const selectedCategory = $(this).val();
        console.log(selectedCategory);
        $.ajax({
            type: "Get",
            url: "/admin/category/search",
            data: {
                category:selectedCategory
            },
            dataType: "json",
            success: function (response) {
                let selectBox= ''
                console.log(response);
            }
        });
    });
});