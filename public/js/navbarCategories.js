$(document).ready(function () {
  $.ajax({
    type: "get",
    url: "/categoryfetch",
    dataType: "json",
    success: function (response) {
      const categories = response;
      function generateNestedList(category) {
        var html = '<ul>';
        html += '<li><a href="#">' + category.name+ "</a>";

        if (category.children && category.children.length > 0) {
          for (var i = 0; i < category.children.length; i++) {
            html += generateNestedList(category.children[i]);

          }
        }

        html += '</li>';
        html += '</ul>';

        return html;
      }

      function catDropdown(categories) {
        var html = '';
        for (let i = 0; i < categories.length; i++) {
          html += '<div class="col">';
          html += generateNestedList(categories[i]);
          html += '</div>';
        }
        return html;
      }
      // Generate and inject the HTML structure
      // Inject the HTML into the webpage
      for (let i in categories) 
        if(categories[i].name=="Men")
          var Men = categories[i];
        else if (categories[i].name=="Women")
          var Women = categories[i];
        else if (categories[i].name=="Kids")
          var Kids = categories[i];
console.log(Men,Women, Kids);
          
      $('#men-button').html(catDropdown(Men.children)); 
      $('#women-button').html(catDropdown(Women.children)); 
      $('#kids-button').html(catDropdown(Kids.children)); 
    }
  });
});


$(document).ready(function () {
  $('.dropdown').hover(function () {
    $(this).find('.dropdown-toggle').dropdown('toggle');
  });

  $('.category-link').click(function (event) {
    event.preventDefault();
    var category = $(this).data('category');
    var subcategory = $(this).data('subcategory');
    // Perform any desired action with the clicked category and subcategory
    console.log('Category:', category);
    console.log('Subcategory:', subcategory);
  });
});