<?php
  // error_reporting(0);
  if (isset($_POST['savedata'])) {
    if (!is_dir('userworks')) {
      mkdir('userworks');
    }
    $filename = 'userworks/' . date('YmdHis') . '_' . $_SERVER['REMOTE_ADDR'] . '.dt';
    file_put_contents($filename, $_POST['data']);
    echo $_SERVER['HTTP_ORIGIN'] . '/' . $filename;
  } else if (isset($_POST['loaddata'])) {
    if (isset($_FILES['thefile'])) {
      echo file_get_contents($_FILES['thefile']['tmp_name']);
    }
  } else {
    include "editor.html";
  }
?>