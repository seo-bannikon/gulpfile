let preprocessor = 'sass';                                                                  // Данная переменная помогает выбирать препроцессор 

const { src, dest, parallel, series, watch, on } = require('gulp');                         // задаём константы, которые используются для Gulp по API
const browserSync  = require('browser-sync').create();                                      // задаём  константу browserSync, которая запускает live server
const concat       = require('gulp-concat');                                                // задаём константу concat, которая отвечает за конкатенирование (объединение) файлов. В данном случае в app.min.js попадают данные из app.js и из node_modules попадает jquery
const uglify       = require('gulp-uglify-es').default;                                     // константа отвечает за сжатие js файлов
const sass         = require('gulp-sass')(require('sass'));                                 // задаём константу sass. Обрати внимание, что sass подключаются именно так после обновления!!!
const less         = require('gulp-less');                                                  // задаём константу less. Один из препроцессоров
const autoprefixer = require('gulp-autoprefixer');                                          // задаём константу autoprefixer. Устанавливает префиксы для старых версий браузеров
const cleancss     = require('gulp-clean-css');                                             // задаём константу cleancss. Сжимает css
const imagecomp    = require('compress-images');                                            // задаём константу imagecomp. Сжимает картинки
const clean        = require('gulp-clean');                                                 // Очищает папку dest

function browsersync() {                                                                    // прописываем функцию browsersync. Необходимо обратить внимание, что все буквы строчные! Сама browsersync запускает live server 
    browserSync.init({                                                                      // инициализируем (запускаем) browsersync
        server: { baseDir: 'app/' },                                                        // указываем, что live server будет запускаться из папки app
        notify: false,                                                                      // отключаем уведомления
        online: true                                                                        // указываем, что работа ведется онлайн
    })
}

function scripts() {                                                                        // прописываем функцию скрипт. Она будет отвечать за конкатенирование, сжатие js файлов 
    return src([                                                                            // возвращаем функцию
        'node_modules/jquery/dist/jquery.min.js',                                           // указываем файлы для конкатенирования
        'app/js/app.js'
    ])
    .pipe(concat('app.min.js'))                                                             // конкатенируем файлы в app.min.js
    .pipe(uglify())                                                                         // сжимаем файлы
    .pipe(dest('app/js/'))                                                                  // помещаем файлы по адресу app/js/
    .pipe(browserSync.stream())                                                             // командуем browserSync следить без перезагрузки
}

function styles() {
    return src('app/' + preprocessor + '/main.' + preprocessor + '')
    .pipe(eval(preprocessor)())
    .pipe(concat('app.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))         // подключаем autoprefixer, указывая, что префиксы будут проставлять для последних 10ти версий бразуеров. Также подключаем авторпрефиксы для вёрстки по гриду.  alt+shit+A
    .pipe(cleancss(( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))) // сжимаем css в 1у строчку. Если хотим поставить красивый формат, необходимо раскомментить format: 'beautify'
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream())
}

async function images() {
	imagecomp(
		"app/images/src/**/*",                                                              // Берём все изображения из папки источника
		"app/images/dest/",                                                                 // Выгружаем оптимизированные изображения в папку назначения
		{ compress_force: false, statistic: true, autoupdate: true }, false,                // Настраиваем основные параметры
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } },                        // Сжимаем и оптимизируем изображеня c разными форматами
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) {                                                         // Обновляем страницу по завершению
			if (completed === true) {
				browserSync.reload()
			}
		}
	)
}

function cleanimg() {
    return src('app/images/dest/**/*', {allowEmpty: true}).pipe(clean())                    // Удаляем папку "app/images/dest/"
}

function cleandist() {
    return src('dist/**/*', {allowEmpty: true}).pipe(clean())                               // Очищаем папку "dist перед новой заливкой билда"
}

function buildcopy() {                                                                      // Создаём билд в папке dist
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/images/src/**/*',
        'app/**/*.html'
    ], { base: 'app' })
    .pipe(dest('dist'))
}

function startwatch() {                                                                     // прописываем функцию для мониторинга файлов в режиме онлайн
    watch('app/**/' + preprocessor + '/**/*', styles);                                      // указываем наблюдение за всеми задачами .js, кроме тех, которые оканчиваются на .min.js. Также с помощью scripts тригеррим запуск лайвсервера
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);                                    // указываем наблюдение за всеми задачами .js, кроме тех, которые оканчиваются на .min.js. Также с помощью scripts тригеррим запуск лайвсервера
    watch('app/**/*.html').on('change', browserSync.reload)
    watch('app/images/src/**/*', images);
}

exports.browsersync = browsersync;                                                          // экспортируем функцию browsersync для её обнаружения терминалом
exports.scripts     = scripts;                                                              // экспортируем функцию scripts для её обнаружения терминалом
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.build       = series(cleandist, styles, scripts, images, buildcopy);                // Экспортируем билд последвательно

exports.default     = parallel(styles, scripts, browsersync, startwatch);                   // запускаем все задачи параллельно
