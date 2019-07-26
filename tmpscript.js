var formAlreadyExists = false;

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
    "room"
  ];
  for (var i in requiredFields) {
    var selector = "input[name='" + requiredFields[i] + "']";
    if (requiredFields[i] == "room") {
      if ($("#room :selected").val() == "Select Room") {
        isValid = false;
        alert("Please select a room at the beginning of the form");
      } else {
        formData[requiredFields[i]] = parseInt($("#room :selected").val(), 10);
      }
    } else if (requiredFields[i] == "numberOfRacks") {
      if ($(selector).val() == "") {
        isValid = false;
        $('#'+requiredFields[i]).find("p.question").addClass('required');
      } else if (isNaN(($(selector).val()))) {
        isValid = false;
        $('#'+requiredFields[i]).find("p.question").addClass('invalid-number');
      } else {
        formData[requiredFields[i]] = parseInt($(selector).val(), 10);
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
        } else {
          formData[requiredFields[i]] = value;
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
  var requestType = "POST";

  if (formAlreadyExists) {
    requestType = "PUT";
  }

  if (isValid) {
    $.ajax({
      type: requestType,
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
    alert('Please fill missing/invalid fields');
    window.scrollTo(0, 0);
  }
});

function selectRoom() {
  var roomToRequest = $("#room :selected").val();
  clearForm();

  $.ajax({
    type: "GET",
    url: ("/1/" + roomToRequest),
    error: function(error) {
      if (error.responseJSON) {
        formAlreadyExists = false;
      }
    },
    success: function(data) {
      formAlreadyExists = true;
      for (var field in data.form) {
        if (data.form.hasOwnProperty(field)) {
          var selector = "input[name='" + field + "']";
          var filter = "[value='"+ data.form[field] + "']";

          if (field == "em-pow") {
            if (data.form[field] != "Yes" && data.form[field] != "No") {
              show_em_pow();
              $(select).filter("[value='Other']").attr('checked', true);
              $('#em_pow_input').val(data.form[field]);
            } else {
              hide_em_pow();
              $(selector).filter(filter).attr('checked', true);
            }
          } else if (field == "numberOfRacks") {
            $("input[name='numberOfRacks']").val(data.form[field]);
          } else if (field == "shared") {
            if (Array.isArray(data.form[field])) {
              $(selector).filter("[value='Yes']").attr('checked', true);
              show_shared();
              for (var i = 0; i < data.form[field].length; i++) {
                var currValue = data.form[field][i];
                $("input[name='sharedWith']")
                  .filter("[value='"+currValue+"']")
                  .attr('checked', true);
              }
            } else {
              $(selector).filter(filter).attr('checked', true);
            }
          } else if (field == "howAccess") {
            if (data.form[field] != "Unrestricted") {
              $(selector)
                .filter("[value='Restricted']")
                .attr('checked', true);
              show_access();
              if (data.form[field] != "Electrical Form" && data.form[field] != "Mechanical Room" && data.form[field] != "Office") {
                show_extended_oth();
                $("input[name='howAccessRestricted']")
                  .filter("[value='Other']")
                  .attr('checked', true);
                $("input[name='howAccessRestrictedOther']").val(data.form[field]);
              } else {
                $("input[name='howAccessRestricted']")
                  .filter(filter)
                  .attr('checked', true);
              }
            }
          } else {
            $(selector).filter(filter).attr('checked', true);
          }
        }
      }
    }
  });
  // Make request to see if it form data already exists
  // If it does, fill in the form and have the submit update
  // If it doesn't, leave the form blank and have the submit create
}

function clearForm() {
  $("#cable-form").find("input[type='radio']").attr('checked', false);
  $("#cable-form").find("input[type='checkbox']").attr('checked', false);
  $("#cable-form").find("input[type='text']").val('');
  hide_access();
  hide_em_pow();
  hide_extended_oth();
  hide_shared();
  formAlreadyExists = false;
}




// Event Handlres
$('#room').change(selectRoom)
