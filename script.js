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
  var c = document.getElementById("access").children;
  c[5].style.display = "block";
}

function hide_access() {
  var c = document.getElementById("access").children;
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
  var formData = $(this).serializeArray();
  var isValid = true;

  var missingFields = [
    "access",
    "em_pow",
    "grounded",
    "conduits",
    "AC",
    "typeAC",
    "typeRack",
    "shared",
    "howAccess"
  ];
  console.log(formData);
  for (var i = 0; i < formData.length; i++) {
    var currField = formData[i].name;
    var index = missingFields.indexOf(currField);
    if (index != -1) missingFields.splice(index, 1);
    if (currField == "numberOfRacks") {
      if (formData[i].value == "") {
        missingFields.push("numberOfRacks");
      } else if (isNaN(formData[i].value)) {
        $("#numberOfRacks-alert").html("<p>This field must be a valid number</p>");
      }
    }
  }
  // console.log(missingFields);
  if (missingFields.length != 0) {
    isValid = false;
    for (var i = 0; i < missingFields.length; i++) {
      $("#"+missingFields[i]+"-alert").html("<p>This field is required</p>");
    }
  }

  // Check if number is a number

  if (isValid) {
    $.ajax({
      type: "POST",
      url: "/submitform.php",
      data: form.serialize(),
      error: function(error) {
        if (error.responseJSON) {
          alert(error.responseJSON.error);
        }
      },
      success: function(data) {
        alert(data.success);
      }
    });
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