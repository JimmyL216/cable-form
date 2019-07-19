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
  var form = $(this);

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
