<?php
  header('Content-Type: application/json');
  $mng = new \MongoDB\Driver\Manager();
  $request_type = $_SERVER['REQUEST_METHOD'];

  if ($request_type == 'GET' && $_GET['action'] == 'form') {
    $room = $_GET['room'];
    $filter = ['room' => $room];
    $options = ['limit' => 1];
    $query = new MongoDB\Driver\Query($filter, $options);

    try {
      $cursor = $mng->executeQuery('interns.entries', $query);
    } catch (Exception $e) {
      http_response_code(500);
      $response = (object) [
        'error' => 'We could not connect to our database. Our server might be down'
      ];
      echo json_encode($response);
      exit();
    }

    $response = [];
    foreach ($cursor as $document) {
      $response['form'] = $document;
    }

    if (empty($response)) {
      $response['error'] = "Form could not be found by that ID";
      http_response_code(400);
      echo json_encode((object)$response);
      exit();
    } else {
      echo json_encode((object)$response);
      exit();
    }
  } else if ($request_type == 'GET' && $_GET['action'] == 'rooms') {
    $query = new MongoDB\Driver\Query([]);

    try {
      $cursor = $mng->executeQuery('interns.rooms', $query);
    } catch (Exception $e) {
      http_response_code(500);
      $response = (object) [
        'error' => 'We could not connect to our database. Our server might be down'
      ];
      echo json_encode($response);
      exit();
    }

    $rooms = [];
    foreach ($cursor as $document) {
      array_push($rooms, $document);
    }
    $response = (object) [
      'rooms' => $rooms
    ];
    echo json_encode($response);
    exit();
  }
  else if ($request_type == 'POST') {
    $bulk = new \MongoDB\Driver\BulkWrite();
    $required = array(
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
    );

    foreach($required as $field) {
      if (empty($_POST[$field]) && ($field != "shared")) {
        http_response_code(400);
        $response = (object) [
          'error' => ($field . " field is required")
        ];
        echo json_encode($response);
        exit();
      }
    }
    if (empty($_POST["shared"])) {
      $_POST["shared"] = [];
    }
    $_POST['numberOfRacks'] = (int)$_POST['numberOfRacks'];
    $bulk->update(['room' => $_POST['room']], ['$set' => $_POST], ['multi' => false, 'upsert' => true]);

    try {
      $result = $mng->executeBulkWrite('interns.entries', $bulk);
    } catch (Exception $e) {
      http_response_code(500);
      $response = (object) [
        'error' => 'We could not connect to our database. Our server might be down'
      ];
      echo json_encode($response);
      exit();
    }

    if ($result->getUpsertedCount() == 1 || $result->getModifiedCount() == 1) {
      $response = (object) [
        'success' => 'Successfully saved your response.'
      ];
      echo json_encode($response);
      exit();
    } else {
      http_response_code(500);
      $response = (object) [
        'error' => 'Something went wrong, your response was not saved.'
      ];
      echo json_encode($response);
      exit();
    }
  } else if ($request_type == "PUT") {

  }
?>
