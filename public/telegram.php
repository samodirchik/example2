<?php
// ==========================================
// НАСТРОЙКИ TELEGRAM БОТА
// ==========================================
$token = "8950429454:AAH7V2k6A2OKw3dPhagdfrLVtW6C-7ghed8";
$chat_id = "386472158";

// Разрешаем CORS (если форма отправляется AJAX запросом с другого домена)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// Проверяем, что запрос пришел методом POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Получаем данные из формы и очищаем их
    $phone = isset($_POST['tel']) ? htmlspecialchars(strip_tags(trim($_POST['tel']))) : '';
    $name = isset($_POST['name']) ? htmlspecialchars(strip_tags(trim($_POST['name']))) : '';

    // Проверка наличия номера телефона
    if (empty($phone)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Не передан номер телефона.']);
        exit;
    }

    // Формируем текст сообщения
    $txt = "🚀 <b>Новая заявка с сайта!</b>\n\n";
    if (!empty($name)) {
        $txt .= "👤 <b>Имя:</b> " . $name . "\n";
    }
    $txt .= "📞 <b>Телефон:</b> " . $phone . "\n";

    // Подготовка URL для API Telegram
    $url_api = "https://api.telegram.org/bot{$token}/sendMessage";

    // Параметры запроса
    $data = array(
        'chat_id' => $chat_id,
        'text' => $txt,
        'parse_mode' => 'HTML'
    );

    // Используем cURL для отправки запроса
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url_api);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $result = curl_exec($ch);
    $error = curl_error($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // Обработка ответа
    if ($http_code == 200) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Заявка отправлена']);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Ошибка отправки в Telegram',
            'telegram_error' => $error,
            'result' => $result
        ]);
    }
} else {
    // Если метод не POST
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Недопустимый метод запроса.']);
}
?>