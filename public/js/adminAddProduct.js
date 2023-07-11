$(document).ready(function () {
    $.ajax({
        type: "Get",
        url: "/admin/category/search",
        dataType: "json",
        success: function (response) {
            const processedCat=catProcessor(response);
            dependentSelectBox(processedCat);
        }
    });
});

function catProcessor(json) {
    
  var data = {};

  function convertData(jsonData, output) {
    for (var i = 0; i < jsonData.length; i++) {
      var category = jsonData[i].name;
      var children = jsonData[i].children;

      output[category] = {};

      for (var j = 0; j < children.length; j++) {
        var subcategory = children[j].name;
        var subchildren = children[j].children;

        output[category][subcategory] = {};

        for (var k = 0; k < subchildren.length; k++) {
          var subsubcategory = subchildren[k].name;
          var subsubchildren = subchildren[k].children;

          output[category][subcategory][subsubcategory] = {};
          if (subsubchildren) {
            for (var l = 0; l < subsubchildren.length; l++) {
              var item = subsubchildren[l].name;
              output[category][subcategory][subsubcategory][item] = {};
            }
          }
        }
      }
    }
  }

  convertData(json, data);
  return data;

}


function dependentSelectBox(data){
    document.getElementById("gender-select").addEventListener("change", function () {
        var gender = this.value;
        var categorySelect = document.getElementById("category-select");
        var subcategorySelect = document.getElementById("subcategory-select");
        var itemSelect = document.getElementById("item-select");
    
        // Clear existing options
        categorySelect.innerHTML = '<option value="">Select a category</option>';
        subcategorySelect.innerHTML = '<option value="">Select a subcategory</option>';
        itemSelect.innerHTML = '<option value="">Select an item</option>';
    
        if (gender) {
          var categories = Object.keys(data[gender]);
          for (var i = 0; i < categories.length; i++) {
            var option = document.createElement("option");
            option.value = categories[i];
            option.textContent = categories[i];
            categorySelect.appendChild(option);
          }
          categorySelect.disabled = false;
        } else {
          categorySelect.disabled = true;
          subcategorySelect.disabled = true;
          itemSelect.disabled = true;
        }
      });
    
      // Populate subcategories based on selected category
      document.getElementById("category-select").addEventListener("change", function () {
        var gender = document.getElementById("gender-select").value;
        var category = this.value;
        var subcategorySelect = document.getElementById("subcategory-select");
        var itemSelect = document.getElementById("item-select");
    
        // Clear existing options
        subcategorySelect.innerHTML = '<option value="">Select a subcategory</option>';
        itemSelect.innerHTML = '<option value="">Select an item</option>';
    
        if (category) {
          var subcategories = Object.keys(data[gender][category]);
          for (var i = 0; i < subcategories.length; i++) {
            var option = document.createElement("option");
            option.value = subcategories[i];
            option.textContent = subcategories[i];
            subcategorySelect.appendChild(option);
          }
          subcategorySelect.disabled = false;
        } else {
          subcategorySelect.disabled = true;
          itemSelect.disabled = true;
        }
      });
    
      // Populate items based on selected subcategory
      document.getElementById("subcategory-select").addEventListener("change", function () {
        var gender = document.getElementById("gender-select").value;
        var category = document.getElementById("category-select").value;
        var subcategory = this.value;
        var itemSelect = document.getElementById("item-select");
    
        // Clear existing options
        itemSelect.innerHTML = '<option value="">Select an item</option>';
    
        if (subcategory) {
          var items = Object.keys(data[gender][category][subcategory]);
          for (var i = 0; i < items.length; i++) {
            var option = document.createElement("option");
            option.value = items[i];
            option.textContent = items[i];
            itemSelect.appendChild(option);
          }
          itemSelect.disabled = false;
        } else {
          itemSelect.disabled = true;
        }
      });
}


//form validation
$(document).ready(function() {
    $('form').submit(function(event) {
      event.preventDefault(); // Prevent the form from submitting
  
      // Clear any existing validation error messages
      $('.is-invalid').removeClass('is-invalid');
      $('.invalid-feedback').remove();
  
      // Perform form validation
      var isValid = true;
  
      // Validate the item name
      var itemNameInput = $('#itemName');
      var itemNameValue = itemNameInput.val().trim();
      if (!itemNameValue.match(/^[A-Za-z]+$/)) {
        itemNameInput.addClass('is-invalid');
        $('<div class="invalid-feedback">Please enter a valid item name.</div>').insertAfter(itemNameInput);
        isValid = false;
      }
  
      // Validate the price
      var priceInput = $('#price');
      var priceValue = priceInput.val().trim();
      if (!priceValue.match(/^-?\d+(?:\.\d{2})?$/) || priceValue < 1) {
        priceInput.addClass('is-invalid');
        $('<div class="invalid-feedback">Please enter a valid price (minimum 1).</div>').insertAfter(priceInput);
        isValid = false;
      }
  
      // Validate the category, subcategory, and item selects
      var categorySelect = $('#category-select');
      var subcategorySelect = $('#subcategory-select');
      var itemSelect = $('#item-select');
  
      if (categorySelect.val() === '' || subcategorySelect.val() === '' ) {
        categorySelect.addClass('is-invalid');
        subcategorySelect.addClass('is-invalid');
        itemSelect.addClass('is-invalid');
        $('<div class="invalid-feedback">Please select a category, subcategory, and item.</div>').insertAfter(itemSelect);
        isValid = false;
      }
  
      // Validate the images
      var imagesInput = $('#images');
      var selectedFiles = imagesInput.get(0).files;
      if (selectedFiles.length < 4 || selectedFiles.length > 4) {
        imagesInput.addClass('is-invalid');
        $('<div class="invalid-feedback">Please select at four images.</div>').insertAfter(imagesInput);
        isValid = false;
      }
  
      // Validate the brand
      var brandInput = $('#brand');
      var brandValue = brandInput.val().trim();
      if (brandValue !== '' && !brandValue.match(/^[A-Za-z\s\-']+$/)) {
        brandInput.addClass('is-invalid');
        $('<div class="invalid-feedback">Please enter a valid brand.</div>').insertAfter(brandInput);
        isValid = false;
      }
  
      // Validate the description
      var descriptionInput = $('#description');
      var descriptionValue = descriptionInput.val().trim();
      if (descriptionValue !== '' && !descriptionValue.match(/^[\w\s.,!?()-]+$/)) {
        descriptionInput.addClass('is-invalid');
        $('<div class="invalid-feedback">Please enter a valid description.</div>').insertAfter(descriptionInput);
        isValid = false;
      }
  
      // Validate the discount
      var discountInput = $('#discount');
      var discountValue = discountInput.val().trim();
      if (discountValue !== '' && !discountValue.match(/^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)$/)) {
        discountInput.addClass('is-invalid');
        $('<div class="invalid-feedback">Please enter a valid discount percentage.</div>').insertAfter(discountInput);
        isValid = false;
      }
  
      // Submit the form if it is valid
      if (isValid) {
        this.submit();
      } else {
        // Scroll to the first invalid field
        $('html, body').animate({
          scrollTop: $('.is-invalid').first().offset().top - 100
        }, 500);
      }
    });
  });
  
  