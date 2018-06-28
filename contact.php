<?php
   use PHPMailer\PHPMailer\PHPMailer;
   use PHPMailer\PHPMailer\Exception;
   require 'vendor/autoload.php';
   
   $mail            = new PHPMailer;
   $mailTo          = 'dariaboom@gmail.com';
   
   $mail->isSMTP(); 								// Set mailer to use SMTP
   $mail->Host       = 'smtp.gmail.com'; 			// Specify main and backup server
   $mail->SMTPAuth   = true; 						// Enable SMTP authentication
   $mail->Username   = $mailTo;                 	// SMTP username
   $mail->Password   = 'S_o_n_g_o_c_u-12&28&87'; 	// SMTP password
   $mail->SMTPSecure = 'ssl'; 						// Enable encryption, 'tsl' also accepted
   $mail->Port       = 465; 						//Set the SMTP port number - 587 for authenticated TLS
   
   $mail->SMTPOptions = array(
   	'ssl' => array(
   	'verify_peer' => false,
   	'verify_peer_name' => false,
   	'allow_self_signed' => true
       )
   );
   
   $msg = $success = $name = $visitor_email = $message = $email_subject = $email_body = '';
   
   if(filter_has_var(INPUT_POST, 'submit')){
   	$name          = htmlspecialchars($_POST['name']);
   	$visitor_email = htmlspecialchars($_POST ['email']);
   	$message       = htmlspecialchars($_POST ['message']);
   
   	if(empty($visitor_email) || empty($name) || empty($message)){
   		$msg =  'Please fill in all fields.';
   	}else{
   		if(filter_var($visitor_email, FILTER_VALIDATE_EMAIL) === false){
   			$msg = 'Please use a valid email.';
   		}else{
   			$email_subject = 'Contact Request Form';
   			$email_body = '<h2>Contact Request</h2>
   							<h4>Name</h4><p>'.$name.'</p>
   							<h4>Email</h4><p>'.$visitor_email.'</p>
   							<h4>Message</h4><p>'.$message.'</p>';
   			
   				$mail->setFrom($visitor_email, $name);     //Set from whom the email is received
   				$mail->addAddress($mailTo, 'Salt and Mint');  // to whom the mail will be sent (mail address of the site)
   					
   			$mail->isHTML(true);
   
   			$mail->Subject = $email_subject;
   			$mail->Body    = $email_body;
   
   			if (!$mail->send()) {
   				$msg = 'Message could not be sent.';
   			}else{
   				$success = 'Your email has been sent';
   				$name = $visitor_email = $message = $email_subject = $email_body = '';
   			}					
   		}
   	}
   }
?>
<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <meta name="description" content="Conceptul salt & mint este acela de a .....">
      <meta name="keywords" content="salt, mint">
      <meta name="author" content="Salt and mint">
      <title>Salt and Mint | Product Description </title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
      <link rel="stylesheet" type="text/css" href="./css/style.css">
      <!--[if IE 9]>
      <link rel="stylesheet" type="text/css" href="./css/ie9specific.css" />
      <![endif]-->
   </head>
   <body onunload="clearCheckBoxes()" onbeforeunload="clearCheckBoxes()">
      <header class="align-center border-bottom margin-top-10">
         <div class="flex layout-row table padding-top-bottom-10 align-flex-end no-margin no-padding border-bottom">
            <div class="flex-x max-width-80 table-cell no-margin">
               <div class="flex layout-row no-flex-wrap table no-margin">
                  <a id="search" class="icon-container" href="search-results.html">
                  <span class="glyphicon glyphicon-search icon"></span>
                  </a>  
                  <input id="searchValue" type="text" name="search" placeholder="Type here to search">
               </div>
            </div>
            <div class="flex-x max-width-10 table-cell">
               <div class="icon-container dropdown">
                  <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                  <span class="glyphicon glyphicon glyphicon-globe icon"></span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-right">
                  <li class="border-bottom">
                     <button id="ro" type = "button" class="category-button padding-10">Romana</button>
                  </li>
                  <li>
                     <button id="en" type = "button" class="category-button padding-10">English</button>
                  </li>
               </div>
            </div>
            <div class="flex-x max-width-10 table-cell">
               <div class="icon-container">
                  <a id="shoppingCart" href="shopping-cart.html">
                  <span class="glyphicon glyphicon-shopping-cart icon"></span>
                  </a>
               </div>
            </div>
         </div>
         <div id = "logo-container" class="flex table layout-row padding-top-bottom-10 no-margin">
            <img id = "logo" class="width-25 align-center auto-margin" src="./images/new_logo.png" alt="Matitta logo">
         </div>
         <nav class="margin-top-10 light-brown-bkgd">
            <label id="show-menu-label" for="show-menu" class="show-menu menu-text display-none">Show Menu</label>
            <input type="checkbox" id="show-menu" role="button">
            <ul class="no-padding no-margin-top-bottom list-style-type" id="menu">
               <li class="inline-block align-left">
                  <a id="home" class="gray-color menu-text inline-block align-center menu-container" href="index.html">Home</a>
               </li>
               <li class="inline-block align-left">
                  <a id="products" class="gray-color menu-text inline-block align-center menu-container" href="products.html">Products</a>
               </li>
               <li class="inline-block align-left">
                  <a id="contact" class="brown-color demi-bold menu-text inline-block align-center menu-container" href="contact.php">Contact</a>
               </li>
            </ul>
         </nav>
      </header>
      <section>
         <div class="border-bottom">
            <div class="contact-container padding-10 width-75">
               <span id="errorText" class="error-text"><?= $msg ?></span>
               <form id="contact-form" method="post" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]) ?>">
                  <label id="name-label" for="name" class= "padding-10 font-16">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name..." value="<?php echo isset($_POST['name']) ? $name : ''; ?>" required>
                  <label id="email-label" for="email" class= "padding-10 font-16">Email</label>
                  <input type="text" id="email" name="email" placeholder="Your email..." class="no-margin" value="<?php echo isset($_POST['email']) ? $visitor_email : ''; ?>" required>
                  <label id="mess-label" for="subject" class= "padding-10 font-16">Message</label>
                  <textarea id="message" name="message" placeholder="Write something..." class="no-margin message-height" required><?php echo isset($_POST['message']) ? $message : ''; ?></textarea>
                  <input id="submit" type="submit" name="submit" class="btn btn-primary padding-top-bottom-10 margin-top-10 margin-bottom-10" value="Send">
               </form>
               <span id="successSend" class="success-text"><?= $success ?></span>
            </div>
         </div>
      </section>
      <section class="align-center light-brown-bkgd padding-top-10">
         <h3 id="follow-us">Follow Us</h3>
         <div class="flex layout-row table align-center no-margin">
            <div class="flex-x max-width-10 table-cell">
               <div class="icon-container">
                  <a href="https://www.facebook.com/pg/MatittaKayu">
                  <img class="fa-icon" src="./images/F_icon.svg" alt="Facebook logo"/>
                  </a>
               </div>
            </div>
         </div>
      </section>
      <footer>
         <p class="align-right light-brown-bkgd padding-10"> Matitta, Copyright &copy; 2018 </p>
      </footer>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
      <script src="js/jquery.js"></script>
      <script src="js/javascript.js"></script>
   </body>
</html>