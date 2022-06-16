<?php
// Отправка формы на email, ответ JSON

$to = 'funpokerrr@yandex.ru'; // Кто получатель заявок (для нескольких email - через запятую)/*funpokerrr@yandex.ru*/

// Мини валидации
if (!in_array($_POST['type'], ['pack', 'help', 'referral'])) {
    echo json_encode(['success' => false, 'msg' => 'Не разрешено']);
    exit;
}

$subject = 'Запрос '.strtoupper($_POST['type']).' '.date('Y-m-d H:i:s');

$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ? $_POST['email'] : null;
$messenger = strip_tags($_POST['messenger']);
$messenger_value = strip_tags($_POST['messenger_value']);

if (!$email) {
    echo json_encode(['success' => false, 'msg' => 'Не валидный email']);
}

$append = '';
if ($_POST['type'] === 'pack') {
    $append = '<hr />'.
        '<b>Запрос на Pack:</b> '.strip_tags($_POST['title']).'<br /><br />'.
        '<b>Категория:</b> '.strip_tags($_POST['category']).'<br />'.
        '<b>Лимит:</b> '.strip_tags($_POST['limit']).'<br />'.
        '<b>Стек:</b> '.strip_tags($_POST['stack']).'<br /><br /><hr />'.
        '<b>Стоимость:</b> '.strip_tags($_POST['price']);
}

// текст письма
$message = '
<html>
<head>
  <title>'.$subject.'</title>
</head>
<body>
  <p>Данные формы</p>
    <ul>
      <li><b>Email:</b> '.$email.'</li>
      <li><b>Messenger:</b> '.$messenger.'</li> 
      <li><b>Никнейм:</b> '.$messenger_value.'</li>
    </ul>
    '.$append.'
</body>
</html>
';


$headers =
    'MIME-Version: 1.0'."\r\n".
    'Content-type: text/html; charset=utf-8'."\r\n".
    'From: webmaster@gtopacks.com'."\r\n".
    'Reply-To: '.$email."\r\n".
    'X-Mailer: PHP/'.phpversion();

// Отправляем
mail($to, $subject, $message, $headers);

echo json_encode(['success' => true]);
