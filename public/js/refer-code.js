

const userPhone = sessionStorage.getItem('phoneNumber');

console.log("user phoone", userPhone);
function generateReferralURL() {
    $.ajax({
        type: "get",
        url: "/auth/referal-code-generator/"+userPhone,
        dataType: "json",
        success: function (response) {
            console.log( response);
            const inputUrl = $("#inputUrl").val();
            const generatedUrl = inputUrl + "?ref=" + response.ref;
            document.getElementById("generatedUrl").value = generatedUrl;
        }
    });
}

function copyReferralURL() {
    var generatedUrl = document.getElementById("generatedUrl");
    generatedUrl.select();
    document.execCommand("copy");
    alert("Copied to clipboard!");
  }