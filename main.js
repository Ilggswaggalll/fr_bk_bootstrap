// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модального окна
    initModal();

    // Инициализация валидации формы
    initFormValidation();

    // Инициализация маски телефона
    initPhoneMask();

    // Инициализация темы
    initTheme();

    // Инициализация анимаций при скролле
    initScrollAnimations();
});

// Функция инициализации модального окна
function initModal() {
    const modalElement = document.getElementById('contactModal');

    // Проверяем, существует ли модальное окно на странице
    if (!modalElement) {
        console.log('Модальное окно не найдено на этой странице');
        return;
    }

    const modal = new bootstrap.Modal(modalElement);
    const openButton = document.getElementById('openDialog');

    // Открытие модального окна
    if (openButton) {
        openButton.addEventListener('click', function() {
            modal.show();
        });
    }

    // Очистка формы при закрытии модального окна
    modalElement.addEventListener('hidden.bs.modal', function() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.classList.remove('was-validated');
            form.reset();
        }
    });

    // Закрытие модального окна при клике на кнопку "Закрыть"
    const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.hide();
        });
    }
}

// Функция инициализации валидации формы
function initFormValidation() {
    const form = document.getElementById('contactForm');

    if (!form) {
        console.log('Форма не найдена на этой странице');
        return;
    }

    form.addEventListener('submit', function(event) {
        // Проверяем валидность формы
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            // Показываем кастомные сообщения об ошибках
            showCustomValidationMessages(form);
        } else {
            // Если форма валидна, можно отправить данные
            handleFormSubmit(event);
        }

        form.classList.add('was-validated');
    });

    // Реальная валидация при изменении полей
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Убираем красную обводку при начале ввода
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

// Валидация отдельного поля
function validateField(field) {
    if (field.checkValidity()) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
}

// Показать кастомные сообщения об ошибках
function showCustomValidationMessages(form) {
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
        if (!field.checkValidity()) {
            let message = '';

            if (field.validity.valueMissing) {
                message = 'Это поле обязательно для заполнения';
            } else if (field.validity.typeMismatch) {
                if (field.type === 'email') {
                    message = 'Пожалуйста, введите корректный email адрес';
                }
            } else if (field.validity.patternMismatch) {
                if (field.id === 'phone') {
                    message = 'Формат телефона: +7 (900) 000-00-00';
                }
            } else if (field.validity.tooShort) {
                message = `Минимальная длина: ${field.minLength} символов`;
            }

            // Обновляем сообщение об ошибке
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = message;
            }
        }
    });
}

// Обработка отправки формы
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Здесь можно добавить отправку данных на сервер
    console.log('Данные формы:', Object.fromEntries(formData));

    // Показываем сообщение об успехе
    showSuccessMessage();

    // Закрываем модальное окно через 2 секунды
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
        if (modal) {
            modal.hide();
        }
    }, 2000);
}

// Показать сообщение об успешной отправке
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Меняем текст кнопки
    submitButton.innerHTML = '<i class="bi bi-check-circle me-2"></i>Отправлено!';
    submitButton.disabled = true;
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-success');

    // Возвращаем исходное состояние через 2 секунды
    setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('btn-success');
        submitButton.classList.add('btn-primary');
    }, 2000);
}

// Функция инициализации маски телефона
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');

    if (!phoneInput) {
        console.log('Поле телефона не найдено на этой странице');
        return;
    }

    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        // Форматируем номер
        let formattedValue = '+7';

        if (value.length > 1) {
            formattedValue += ' (' + value.substring(1, 4);
        }
        if (value.length >= 5) {
            formattedValue += ') ' + value.substring(4, 7);
        }
        if (value.length >= 8) {
            formattedValue += '-' + value.substring(7, 9);
        }
        if (value.length >= 10) {
            formattedValue += '-' + value.substring(9, 11);
        }

        e.target.value = formattedValue;

        // Валидация в реальном времени
        validateField(phoneInput);
    });

    // Валидация при загрузке страницы, если есть значение
    if (phoneInput.value) {
        validateField(phoneInput);
    }
}

// Функция инициализации темы
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    if (!themeToggle) {
        console.log('Кнопка переключения темы не найдена');
        return;
    }

    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Устанавливаем начальную тему
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkTheme(themeToggle);
    } else {
        enableLightTheme(themeToggle);
    }

    // Обработчик переключения темы
    themeToggle.addEventListener('click', function() {
        if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
            enableLightTheme(this);
        } else {
            enableDarkTheme(this);
        }
    });

    // Слушаем изменения системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkTheme(themeToggle);
            } else {
                enableLightTheme(themeToggle);
            }
        }
    });
}

// Включение темной темы
function enableDarkTheme(themeToggle) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    if (themeToggle) {
        themeToggle.innerHTML = '<i class="bi bi-sun me-2"></i>';
    }
}

// Включение светлой темы
function enableLightTheme(themeToggle) {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
    if (themeToggle) {
        themeToggle.innerHTML = '<i class="bi bi-moon me-2"></i>';
    }
}

// Функция инициализации анимаций при скролле
function initScrollAnimations() {
    // Используем Intersection Observer для лучшей производительности
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Добавляем задержку для последовательного появления
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями с анимацией
    const animatedSections = document.querySelectorAll('.anchor-section');
    animatedSections.forEach((section, index) => {
        // Добавляем задержку для последовательной анимации
        section.dataset.delay = index * 100;
        observer.observe(section);
    });

    // Также добавляем резервный метод для старых браузеров
    window.addEventListener('scroll', throttle(checkVisibility, 100));
}

// Резервная функция проверки видимости
function checkVisibility() {
    const sections = document.querySelectorAll('.anchor-section:not(.visible)');

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('visible');
        }
    });
}

// Функция для ограничения частоты вызовов (throttle)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Дополнительные утилиты
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});

// Экспортируем функции для глобального использования (если нужно)
window.App = {
    initModal,
    initFormValidation,
    initPhoneMask,
    initTheme,
    initScrollAnimations
};