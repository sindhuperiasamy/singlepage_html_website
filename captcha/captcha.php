<?php
//Continue the session
session_start();

//Make sure that the input come from a posted form. Otherwise quit immediately
if ($_SERVER["REQUEST_METHOD"] <> "POST") 
 die("You can only reach this page by posting from the html form");

//Check if the security code and the session value are not blank
//and if the input text matches the stored text
if ( ($_REQUEST["captcha"] == $_SESSION["security_code"]) && (!empty($_REQUEST["captcha"]) && !empty($_SESSION["security_code"])) ) {
  echo "1";
} else {
  echo "0";
}
?>