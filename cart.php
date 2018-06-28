<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';

$mail   = new PHPMailer;
$mailTo = 'dariaboom@gmail.com';

$mail->isSMTP(); // Set mailer to use SMTP
$mail->Host       = 'smtp.gmail.com'; // Specify main and backup server
$mail->SMTPAuth   = true; // Enable SMTP authentication
$mail->Username   = $mailTo; // SMTP username
$mail->Password   = 'S_o_n_g_o_c_u-12&28&87'; // SMTP password
$mail->SMTPSecure = 'ssl'; // Enable encryption, 'tsl' also accepted
$mail->Port       = 465; //Set the SMTP port number - 587 for authenticated TLS

$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

$firstName = $lastName = $visitor_email =  $phone = $address = $city = $region = $comments = '';
$msg = $success = $email_subject = $email_body = '';
$chosenProducts = $quantity = '';

ini_set('display_errors', 'On');
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $formData = json_decode($_POST['formData']);
}
    foreach($formData as $data){
        if(strcmp($data->name, 'firstName') == 0)
        {
            $firstName = $data->value;
        }
        if(strcmp($data->name, 'lastName') == 0)
        {
            $lastName = $data->value;
        }
        if(strcmp($data->name, 'email') == 0)
        {
            $visitor_email = $data->value;
        }
        if(strcmp($data->name, 'phone') == 0)
        {
            $phone = $data->value;
        }
        if(strcmp($data->name, 'address') == 0)
        {
            $address = $data->value;
        }
        if(strcmp($data->name, 'city') == 0)
        {
            $city = $data->value;
        }
        if(strcmp($data->name, 'region') == 0)
        {
            $region = $data->value;
        }
        if(strcmp($data->name, 'comments') == 0)
        {
            $comments = $data->value;
        }
        if(strcmp($data->name, 'chosenProduct') == 0)
        {
            $formProducts = $data->value;
        }
        if(strcmp($data->name, 'quantity') == 0)
        {
            $formQuantity = $data->value;
        }
    }
    
    $products = explode(',', $formProducts);
    $quantities = explode(',', $formQuantity);

    $productsOrdered = [];
    for($x = sizeof($products)-1; $x >= 0 ; $x--) {
        $orderProd = 'Product Name : "' . $products[$x] . '" with quantity :' . $quantities[$x];
        array_push($productsOrdered, $orderProd); 
    }

    if (empty($firstName) || empty($lastName) || empty($visitor_email) || empty($phone) || empty($address) || empty($city) || empty($region) || empty($formProducts) || empty($formQuantity)) {
        $msg = 'Please fill in all fields.';
    } else {
        if (filter_var($visitor_email, FILTER_VALIDATE_EMAIL) === false) {
            $msg = 'Please use a valid email.';
        } else {
            $email_subject = 'Order Request Form';
            $order = '';
            foreach ($productsOrdered as $key => $value) {
                $order .= '<p>' .(string)$value.'</p>';
            }

            $email_body = '<h2>Order Request</h2>
                        <h4 class=flex>First Name</h4><p>' . $firstName . '</p>
                        <h4>Last Name</h4><p>' . $lastName . '</p>
                        <h4>Email</h4><p>' . $visitor_email . '</p>
                        <h4>Phone number</h4><p>' . $phone . '</p>
                        <h4>Shipping address</h4><p>' . $address . '</p>
                        <h4>City</h4><p>' . $city . '</p>
                        <h4>Region</h4><p>' . $region . '</p>
                        <h4>Comments</h4><p>' . $comments . '</p>
                        <h4>Ordered products</h4><p>'.$order. '</p>';

        
            $name = $firstName . $lastName;
            $mail->setFrom($visitor_email, $name); //Set from whom the email is received
            $mail->addAddress($mailTo, 'Matitta'); // to whom the mail will be sent (mail address of the site)
            
            $mail->isHTML(true);
            
            $mail->Subject = $email_subject;
            $mail->Body    = $email_body;
            
            if (!$mail->send()) {
                $msg = 'Message could not be sent.';
            } else {
                $success = 'Your email has been sent';
                $firstName = $lastName = $visitor_email =  $phone = $address = $city = $region = $comments = '';
                $email_subject = $email_body = '';
            }
        }
    }
    if(empty($success)){
        http_response_code(400);
        echo $msg;
    }else{
        http_response_code(200);
        echo $success;
    }
?>