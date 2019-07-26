<?php
  header('Content-Type: application/json');
  $mng = new \MongoDB\Driver\Manager();

  $path_only = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $room_number = basename($path_only).PHP_EOL;

  if (!empty($room_number)) {
    $filter = ['room' => (int)$room_number];
    $options = [
       'projection' => ['room' => 0],
    ];
    $query = new MongoDB\Driver\Query($filter, $options);
    try {
      $cursor = $mng->executeQuery('interns.entries', $query);
      $form = $cursor->toArray()[0];
      if (is_null($form)) {
        http_response_code(400);
        $response = (object) [
          'error' => 'Could not find form by that room number'
        ];
        echo json_encode($response);
        exit();
      } else {
        $response = (object) [
          'form' => $form
        ];
        echo json_encode($response);
        exit();
      }
    } catch (Exception $e) {
      http_response_code(500);
      $response = (object) [
        'error' => 'We could not connect to our database. Our server might be down'
      ];
      echo json_encode($response);
      exit();
    }
  }
