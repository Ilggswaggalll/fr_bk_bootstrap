const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');

// легкая маска телефона - доп задание
const phone = document.getElementById('phone');

phone?.addEventListener('input', () => {
 const digits = phone.value.replace(/\D/g,'').slice(0,11); // до 11 цифр
 const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
 const parts = [];
 if (d.length > 0) parts.push('+7');
 if (d.length > 1) parts.push(' (' + d.slice(1,4));
 if (d.length >= 4) parts[parts.length - 1] += ')';
 if (d.length >= 5) parts.push(' ' + d.slice(4,7));
 if (d.length >= 8) parts.push('-' + d.slice(7,9));
 if (d.length >= 10) parts.push('-' + d.slice(9,11));
 phone.value = parts.join('');
});

phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

let lastActive = null;
openBtn.addEventListener('click', () => {
 lastActive = document.activeElement;
 dlg.showModal(); // модальный режим +
затемнение
 dlg.querySelector('input,select,textarea,button')?.focus();
});
closeBtn.addEventListener('click', () => dlg.close('cancel'));

dlg.addEventListener('close', () => { lastActive?.focus(); });
// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>



form?.addEventListener('submit', (e) => {
     e.preventDefault();
        // Сбрасываем предыдущие ошибки
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.removeAttribute('aria-invalid'));
    
    // Проверяем валидность формы
    if (!form.checkValidity()) {
        // Помечаем невалидные поля
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.setAttribute('aria-invalid', 'true');
            }
        });
        
        form.reportValidity();
        return;
    }

 // 1) Сброс кастомных сообщений
 [...form.elements].forEach(el => el.setCustomValidity?.(''));
 // 2) Проверка встроенных ограничений
 if (!form.checkValidity()) {
 // Пример: таргетированное сообщение
 const email = form.elements.email;
 if (email?.validity.typeMismatch) {
 email.setCustomValidity('Введите корректный e-mail, например name@example.com');
 }
 form.reportValidity(); // показать браузерные подсказки
 // A11y: подсветка проблемных полей
 [...form.elements].forEach(el => {
 if (el.willValidate) el.toggleAttribute('aria-invalid',
!el.checkValidity());
 });
 return;
 }
 // 3) Успешная «отправка» (без сервера)
 e.preventDefault();
 // Если форма внутри <dialog>, закрываем окно:
 document.getElementById('contactDialog')?.close('success');
 form.reset();
});


 const KEY='theme', btn=document.querySelector('.theme-toggle');
 const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
 // Автовыбор: системная тема или сохранённый выбор пользователя
 if(localStorage.getItem(KEY)==='dark' || (!localStorage.getItem(KEY) &&
prefersDark)){
 document.body.classList.add('theme-dark');
 btn?.setAttribute('aria-pressed','true');
 }
 // Переключение по кнопке с сохранением в localStorage
 btn?.addEventListener('click', ()=>{
 const isDark=document.body.classList.toggle('theme-dark');
 btn.setAttribute('aria-pressed', String(isDark));
 localStorage.setItem(KEY, isDark ? 'dark' : 'light');
 });

