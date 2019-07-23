function show_em_pow() {
  var c = document.getElementById("em_pow").children;
  c[7].style.display = "block";
}

function hide_em_pow() {
  var c = document.getElementById("em_pow").children;
  c[7].style.display = "none";
}

function show_shared() {
  var c = document.getElementById("shared").children;
  c[5].style.display = "block";
}

function hide_shared() {
  var c = document.getElementById("shared").children;
  c[5].style.display = "none";
}

function show_access() {
  var c = document.getElementById("howAccess").children;
  c[5].style.display = "block";
}

function hide_access() {
  var c = document.getElementById("howAccess").children;
  c[5].style.display = "none";
}

function show_extended_oth() {
  var c = document.getElementById("extended_oth").children;
  c[8].style.display = "block";
}

function hide_extended_oth() {
  var c = document.getElementById("extended_oth").children;
  c[8].style.display = "none";
}


// Submiting and Validating Form
$('#cable-form').submit(function(event) {
  event.preventDefault();
  var isValid = true;
  var formData = {};

  var requiredFields = [
    "access",
    "em_pow",
    "grounded",
    "conduits",
    "AC",
    "typeAC",
    "typeRack",
    "shared",
    "howAccess",
    "numberOfRacks",
    "roomDropdown"
  ];
  for (var i in requiredFields) {
    var selector = "input[name='" + requiredFields[i] + "']";
    if (requiredFields[i] == "roomDropdown") {
      if ($("#roomDropdown :selected").val() == "Select Room") {
        isValid = false;
        alert("Please select a room at the beginning of the form");
      } else {
        formData[requiredFields[i]] = $("#roomDropdown :selected").val();
      }
    } else if (requiredFields[i] == "numberOfRacks") {
      if ($(selector).val() == "") {
        isValid = false;
        $('#'+requiredFields[i]).find("p.question").addClass('required');
      } else if (isNaN(($(selector).val()))) {
        $('#'+requiredFields[i]).find("p.question").addClass('invalid-number');
      }
    } else if (!$(selector).is(':checked')) {
      isValid = false;
      $('#'+requiredFields[i]).find("p.question").addClass('required');
    } else {
      var value = $(selector).filter(":checked").val();
      if (requiredFields[i] == "em_pow") {
        if (value == "Other" && $("#em_pow_input").val() == "") {
          isValid = false;
          $('#'+requiredFields[i]).find("p.question").addClass('required');
        } else if (value == "Other") {
          formData[requiredFields[i]] = $("#em_pow_input").val();
        }
      } else if (requiredFields[i] == "howAccess") {
        if (value == "Unrestricted") {
          formData[requiredFields[i]] = value;
        } else {
          var subSelector = "input[name='howAccessRestricted']";
          if (!$(subSelector).is(':checked')) {
            isValid = false;
            $('#'+requiredFields[i]).find("p.question").addClass('required');
          } else if ($(subSelector).filter(":checked").val() == "Other") {
            if ($("input[name='howAccessRestrictedOther']").val() == "") {
              isValid = false;
              $('#'+requiredFields[i]).find("p.question").addClass('required');
            } else {
              formData[requiredFields[i]] = $("input[name='howAccessRestrictedOther']").val();
            }
          } else {
            formData[requiredFields[i]] = $(subSelector).filter(":checked").val();
          }
        }
      } else if (requiredFields[i] == "shared") {
        if (value == "No") {
          formData[requiredFields[i]] = value;
        } else {
          var subSelector = "input[name='sharedWith']";
          if ($(subSelector).is(':checked')) {
            var radioBoxes = $(subSelector).filter(":checked");
            var value = [];
            for (var j = 0; j < radioBoxes.length; j++) {
              value.push(radioBoxes[j].value);
            }
            formData[requiredFields[i]] = value;
          } else {
            formData[requiredFields[i]] = value;
          }
        }
      } else {
        formData[requiredFields[i]] = value;
      }
    }
  }

  if (isValid) {
    $.ajax({
      type: "POST",
      url: "/submitform.php",
      data: formData,
      error: function(error) {
        if (error.responseJSON) {
          alert(error.responseJSON.error);
        }
      },
      success: function(data) {
        alert(data.success);
        for (var i in requiredFields) {
          $('#'+requiredFields[i]).find("p.question").removeClass('required');
        }
      }
    });
  } else {
    window.scrollTo(0, 0);
  }
});




// function showTextbox() {
//   var input = document.getElementById('em_pow_input')
//   if (input.style.display === "none") {
//     input.style.display = "block";
//   } else {
//     input.style.display = "none";
//   }
// }



//
// function showTextbox() {
//   document.getElementById('em_pow_input').style.display = "block";
// }
//
// function hideTextbox() {
//   document.getElementById('em_pow_input').style.display = "none";
//
// }
//
// function showTextboxA() {
//   document.getElementById('access_input').style.display = "block";
// }
//
// function hideTextboxA() {
//   document.getElementById('access_input').style.display = "none";
// }
//
//
//



// function show() {
//   // this.parentElement.querySelector(".extended").style.display = "block";
//   this.parentElement;
//   console.log(this.parentElement);
// }

// function hide() {
//   document.getelemntbyclassName("show").nextElementSibling("show").style.display = "none";
//
// }
