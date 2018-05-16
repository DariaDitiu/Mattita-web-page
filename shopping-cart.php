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
      <title>Salt and Mint | Welcome </title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
      <link rel="stylesheet" type="text/css" href="./css/style.css">
      <!--[if IE 9]>
      <link rel="stylesheet" type="text/css" href="./css/ie9specific.css" />
      <![endif]-->
   </head>
   <body onunload="clearCheckBoxes()" onbeforeunload="clearCheckBoxes()">
      <header class="text-center border-bottom margin-top-10">
         <div class="flex layout-row table padding-top-bottom-10 align-flex-end no-margin no-padding border-bottom">
            <div class="flex-80 table-cell no-margin">
               <div class="flex layout-row no-flex-wrap table no-margin">
                  <a class="icon-container" href="search-result.html">
                  <span class="glyphicon glyphicon-search icon"></span>
                  </a>	
                  <input id="search-text" type="text" name="search" placeholder="Type here to search">
               </div>
            </div>
            <div class="flex-10 table-cell">
               <div class="icon-container">
                  <span class="glyphicon glyphicon glyphicon-globe icon"></span>
               </div>
            </div>
            <div class="flex-10 table-cell">
               <div class="icon-container">
                  <a href="shopping-cart.php">
                  <span class="glyphicon glyphicon-shopping-cart icon"></span>
                  </a>
               </div>
            </div>
         </div>
         <div id = "logo-container" class="flex table layout-row padding-top-bottom-10 no-margin">
            <img id = "logo" class="width-25 align-center auto-margin" src="./images/new logo.png">
         </div>
         <nav class="margin-top-10 light-brown-bkgd">
            <label for="show-menu" class="show-menu menu-text">Show Menu</label>
            <input type="checkbox" id="show-menu" role="button">
            <ul class="no-padding no-margin-top-bottom list-style-type" id="menu">
               <li class="inline-block align-left">
                  <a class="brown-color demi-bold menu-text inline-block text-center menu-container" href="index.html">Home</a>
               </li>
               <li class="inline-block align-left">
                  <a class="menu-text gray-color inline-block text-center menu-container" href="products.html">Products</a>
               </li>
               <li class="inline-block align-left">
                  <a class="menu-text gray-color inline-block text-center menu-container" href="contact.php">Contact</a>
               </li>
            </ul>
         </nav>
      </header>
      <section id="shopping-cart">
         <div class="container border-bottom text-center">
            <h1>FollowUs on ......</h1>
         </div>
      </section>
      <div class="border-bottom">
         <div class="contact-container padding-10 width-75">
            <span class="error-text"><?= $msg ?></span>
            <form id="contact-form" method="post" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]) ?>">
               <label for="name" class= "padding-10 font-16">Name</label>
               <input type="text" id="name" name="name" placeholder="Your name.." value="<?php echo isset($_POST['name']) ? $name : ''; ?>" required>
               <label for="email" class= "padding-10 font-16">Email</label>
               <input type="text" id="email" name="email" placeholder="Your email.." class="demi-bold no-margin" value="<?php echo isset($_POST['email']) ? $visitor_email : ''; ?>" required>
               <label for="subject" class= "padding-10 font-16">Message</label>
               <textarea id="message" name="message" placeholder="Write something.." class="demi-bold no-margin message-height" required><?php echo isset($_POST['message']) ? $message : ''; ?></textarea>
               <input type="submit" name="submit" class="md-button padding-left-right-30" value="Send">
            </form>
            <span class="success"><?= $success ?></span>
         </div>
      </div>
      <section id="followUs">
         <div class="container border-bottom text-center">
            <h1>FollowUs on ......</h1>
         </div>
      </section>
      <footer>
         <p class="container text-center"> Salt and mint, Copyright &copy; 2018 </p>
      </footer>
      <script src="js/javascript.js"></script>
   </body>
</html>