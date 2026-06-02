import translate from 'google-translate-api-x';

async function test() {
    try {
        const html = '<p><strong>Знищення клопів</strong> в Україні.</p>';
        const res = await translate(html, {to: 'ru'});
        console.log(res.text);
    } catch (e) {
        console.error(e);
    }
}
test();
