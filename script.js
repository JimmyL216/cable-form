function hide_extended(parent, other) {
  if (parent == "#howAccess") {
    $(parent).find(other).css("display", "none");
    $(parent).find('.extended-other').css("display", "none");
  } else {
    $(parent).find('.extended').css("display", "none");
  }
}

function show_extended(parent, other) {
  if (parent == "#howAccess") {
    $(parent).find(other).css("display", "block");
    if (other == '.extended') {
      $(parent).find('.extended-other').css("display", "none");
    } else {
      $(parent).find('.extended').css("display", "none");
    }
  } else {
    $(parent).find('.extended').css("display", "block");
  }
}

// Submiting and Validating Form
$('#cable-form').submit(function(event) {
  event.preventDefault();
  var data = {};
  var arr = $(this).serializeArray();
  for (i in arr) {
    data[arr[i].name] = arr[i].value;
  }
  var post = {};

  $(this).find('section').each(function() {
    var field = this.getAttribute("data-field");
    var expandable = this.getAttribute("data-expandable");
    var fieldData;

    if (data.hasOwnProperty(field)) {
      if (data[field] == "Other") {
        if (data[field + "_other"] != "") {
          fieldData = data[field + "_other"];
        }
      } else if (expandable != null) {
        if (data[field] == expandable) {
          var expandableType = this.getAttribute("data-expandable-type");
          if (expandableType == "radio") {
            if (data[field + '-extended'] != null && data[field + '-extended'] != "") {
              fieldData = data[field + "-extended"];
            }
          } else if (expandableType == "checkbox") {
            var values = [];
            $(this).find("input:checkbox:checked").each(function() {
              values.push($(this).val());
            });
            fieldData = values;
          }
        } else {
          fieldData = data[field];
        }
      } else {
        if (!(data[field] == null || data[field] == "")) {
          fieldData = data[field];
        }
      }
    }

    if (typeof(fieldData) === "undefined" || fieldData.length == 0) {
      $(this).addClass("required");
    } else if (field == "numberOfRacks" && isNaN(fieldData)) {
      $(this).addClass("invalid-number");
    } else {
      post[field] = fieldData;
    }
  });
  console.log("POST Data");
  console.log(post);

  var length = Object.keys(post).length;
  if (length == 10) {
    post.room = app.roomNumber;

    $.ajax({
      method: "POST",
      url: "/1/index.php",
      data: post,
      error: function(err) {
      },
      success: function(response) {
        alert(response.success);
        app.hideForm();
      }
    });
  } else {
    scrollTo(0, 0);
    alert("Please fill missing/invalid fields");
  }
});

var app = {
  url: "/1/index.php",
  roomNumber: -1,
  formAlreadyExists: false,
  call: function(obj) {
    $.ajax({
      method: obj.method,
      url: this.url,
      data: obj.data,
      error: function(err) {
        console.log("Error");
      },
      success: obj.success
    });
  },
  loadRooms: function() {
    console.log(this);
    this.call({
      method: 'GET',
      data: {
        action: "rooms"
      },
      success: function(data) {
        for (var i in data.rooms) {
          var room = data.rooms[i].room;
          var option = new Option("Room " + room, room);
          $(option).html("Room " + room);
          $("select").append(option);
        }
      }
    });
  },
  displayForm: function() {
    $("form").removeClass("hidden");
  },
  hideForm: function() {
    $("form").addClass("hidden");
  },
  clearForm: function() {
    $('form')[0].reset();
    /*
    hide_access();
    hide_em_pow();
    hide_extended_oth();
    hide_shared();
    */
  }
};

function selectRoom() {
  app.roomNumber = $(this).val();
  var params = {
    room: app.roomNumber
  }
  app.displayForm();
  // Make GET request to form.php
  /*
  $.ajax({
    method: "GET",
    url: "/1/index.php",
    data: params,
    error: function(error) {
      app.formAlredyExists = true;
      clearForm();
    },
    success: function(response) {
      fillForm(response);
      app.formAlredyExists = false;
    }
  });
  */
  // If 200, load the values into the form, set formAlreadyExists to false
  // If 400 (can't find one that already exists), set formAlredyExists to true


}

function fillForm(response) {

}

function loadRooms() {
  $.ajax({
    method: 'GET',
    url: '/1/index.php',
    data: {
      action: "rooms"
    },
    error: function(error) {

    },
    success: function(data) {
      for (var i in data.rooms) {
        var room = data.rooms[i].room;
        var option = new Option("Room " + room, room);
        $(option).html("Room " + room);
        $("select").append(option);
      }
    }
  });
}



// Event handlers

$(document).ready(app.loadRooms());

$('#room').change(selectRoom);

$('section').find('label').click(function() {
  $(this.parentElement).removeClass('required');
});

$('section').find("input[type='text']").change(function() {
  $(this.parentElement).removeClass('required');
  $(this.parentElement).removeClass('invalid-number');
});

$('.extended').find("label").click(function() {
  $(this.parentElement.parentElement).removeClass('required');
});
