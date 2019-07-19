<?php
  header('Content-Type: application/json');
  $mng = new \MongoDB\Driver\Manager();
  $bulk = new \MongoDB\Driver\BulkWrite();

  $bulk->insert($_POST);
  try {
    $result = $mng->executeBulkWrite('interns.entries', $bulk);
  } catch (Exception $e) {
    http_response_code(500);
    $response = (object) [
      'error' => 'We could not connect to our database. Our server might be down'
    ];
    echo json_encode($response);
  }

  if ($result->getInsertedCount() == 1) {
    $response = (object) [
      'success' => 'Successfully saved your response.'
    ];
    echo json_encode($response);
  } else {
    http_response_code(500);
    $response = (object) [
      'error' => 'Something went wrong, your response was not saved.'
    ];
    echo json_encode($response);
  }
?>
