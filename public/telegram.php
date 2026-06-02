<?php
// ==========================================
// НАСТРОЙКИ TELEGRAM БОТА
// ==========================================
$token = "ВАШ_ТОКЕН_БОТА"; // Замените на токен вашего бота (например: "123456789:ABCdefGHIjklMNOpqrSTUvwxyz")
$chat_id = "ВАШ_CHAT_ID"; // Замените на ваш Chat ID (например: "-1001234567890" или "123456789")

// Разрешаем CORS (если форма отправляется AJAX запросом с другого домена)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// Проверяем, что запрос пришел методом POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Получаем данные из формы и очищаем их
    $phone = isset($_POST['tel']) ? htmlspecialchars(strip_tags(trim($_POST['tel']))) : '';
    $type = isset($_POST['type']) ? htmlspecialchars(strip_tags(trim($_POST['type']))) : '';
    $url = isset($_POST['current_url']) ? htmlspecialchars(strip_tags(trim($_POST['current_url']))) : '';
    
    // Проверка наличия номера телефона
    if (empty($phone)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Не передан номер телефона.']);
        exit;
    }
    
    // Формируем текст сообщения
    $txt = "🚀 <b>Новая заявка с сайта!</b>\n\n";
    $txt .= "📞 <b>Телефон:</b> " . $phone . "\n";
    
    if (!empty($type)) {
        $txt .= "📝 <b>Тип заявки:</b> " . $type . "\n";
    }
    
    if (!empty($url)) {
        $txt .= "🌐 <b>Страница отправки:</b> " . $url . "\n";
    }
    
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
    curl_close($ch);
    
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
