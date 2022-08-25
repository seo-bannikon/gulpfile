# gulpfile
Я через боль и страдания разработал работающий gulpfile.js. 

Порядок работы:
1. Установить Node.js 
2. Установить Microsoft Powershell, если у вас Windows. Для других ОС пропустить.
3. Открыть редактор
4. Открыть терминал
5. Создать проект (dist, app и тп) или скопировать текущий репозиторий.
6. Ввести перечень команд:

npm init.                                                                       // Ввести имя проекта, версия, описание (можно скипнуть)

npm i --global gulp-cli                                                         // Для глобальной (первичной) настройки!!!

npm i --save-dev gulp-cli

npm i --save-dev browser-sync

npm i --save-dev gulp-concat

npm i --save-dev gulp-uglify-es

npm i --save-dev gulp-sass

npm i -D sass                                                                   // сейчас устанавливается 2 пакета sass для корректной работы

npm i --save-dev gulp-autoprefixer

npm i --save-dev gulp-clean-css

npm i --save-dev gulp-less

npm i --save-dev compress-images gifsicle@5.3.0 pngquant-bin@6.0.0 gulp-clean

npm i --save-dev gulp-newer

7. Создать gulpfile.js и скопипастить мой файл=)
8. В дальнейшем для копирования установленных настроек необходимо скопировать 2 файла: package.json и gulpfile.js, поместить их в папку с новым проектом, открыть в редакторе новый проект, открыть терминал и ввести команду npm i

Внимание!!! Данный файл написан для 4й версии галпа (самой последней). Обязательно скачивайте весь репозиторий для корректных тестов галпфайла. 

В нём отсутствует работа с api gulp.task(). Вместо этого прописывается function server(), где server - название таска (задачи). 

Также вывод задачи происходит не через gulp.task('default', gulp.parallel('watch', 'server', 'styles')), а через exports.server  = server, где server - название таска (задачи). Подробнее в комментариях кода;

Помимо этого, используется последняя версия sass с правильным применением для корректного запуска.

Так было сделано исходя из официальной документации Gulp 4. gulp.task также крайне не рекомендую использовать из-за множества ошибок и головной боли.

Функциональность галпа:
1. Работает с js: jquery + app.js, конкатинирует и сжимает их в один файл app.min.js,
2. Работает с любыми препроцессорами. Переменная задаётся в 1й строке. В данном файле выбран sass. Также дальше css сжимаются и дополняются префиксами.
3. Сжатие изображений
4. Запуск билда в папку dist

Обязательно читайте комментарии в коде и тогда всё получится!