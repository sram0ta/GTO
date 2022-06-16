$(document).ready(function () {

    /*Убирание placeholder*/
    $('input, textarea').focus(function () {
        $(this).data('placeholder', $(this).attr('placeholder'))
        $(this).attr('placeholder', '');
    });
    $('input, textarea').blur(function () {
        $(this).attr('placeholder', $(this).data('placeholder'));
    });

    // Главный слайдер
    $('.intro-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        speed: 700,
        arrows: true,
        dots: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                }
            }
        ]
    });


    // Кастомизация селекта
    $('.packs-select').select2({
        minimumResultsForSearch: Infinity,
        dropdownCssClass: "sort-drop"
    });

    // для селекта с картинками
    function formatState(state) {
        if (!state.id) {
            return state.text;
        }
        var $state = $(
            '<span class="img-flag"><i><img src="images/mess/' + state.element.value.toLowerCase() + '.svg" /></i> ' + state.text + '</span>'
        );
        return $state;
    };

    $('.mess-select').select2({
        minimumResultsForSearch: Infinity,
        templateResult: formatState,
        templateSelection: formatState,
        dropdownCssClass: "mess-drop"
    });

    // Слайдер отзывов
    $('.reviews-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 2,
        speed: 800,
        arrows: true,
        dots: true,
        responsive: [
            {
                breakpoint: 1299,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 1059,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    /*модалки*/
    if ($('.popup-open').length) {
        $('.popup-open').magnificPopup({
            removalDelay: 300,
            fixedContentPos: true,
            callbacks: {
                beforeOpen: function () {
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            midClick: true
        });
    }


    if ($('.pack-open').length) {
        $('.pack-open').magnificPopup({
            removalDelay: 300,
            fixedContentPos: true,
            midClick: true,
            callbacks: {
                beforeOpen() {
                    // меняем название пака
                    let section_id = this.st.el.attr('data-section-id'),
                        row = $(`article[data-pack-id="${section_id}"]`),
                        mfp = $('#packsModal');

                    let title = $('.information .name', row).text(),
                        text = $('.desc', row).html(),
                        price = $('.price-block', row).html(),
                        limit = row.data('limit'),
                        stack = row.data('size'),
                        category = row.data('category'),
                        image = $('.image-block .lazyloaded', row).attr('src');


                    $('h3', mfp).text(title);
                    $('.price-block', mfp).html(price);
                    $('.pack-modal-desc', mfp).html(text);

                    $('.parameter-list [data-type="category"] .value', mfp).text(category);
                    $('.parameter-list [data-type="limit"] .value', mfp).text(limit);
                    $('.parameter-list [data-type="stack"] .value', mfp).text(stack);

                    $('.pack-form [name="title"]', mfp).val(title);
                    $('.pack-form [name="category"]', mfp).val(category);
                    $('.pack-form [name="limit"]', mfp).val(limit);
                    $('.pack-form [name="stack"]', mfp).val(stack);
                    $('.pack-form [name="price"]', mfp).val($('.price-block .price', row).text());
                    $('.pack-modal-info .image-block img', mfp).attr('src', image);

                    // h3 name
                    this.st.mainClass = this.st.el.attr('data-effect');
                },
            },
        });
    }

    // Работа выбора языков
    $(".languages-toggle").click(function () {
        $(".languages-menu").fadeToggle(300);
    });

    //Закрытие блока при клике ЗА его пределами
    $(document).mouseup(function (e) {
        var container = $(".header-languages");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(".languages-menu").fadeOut(300);
        }
    });

    // Скролл якоря
    $(".header-menu a, .footer-menu a").click(function () {
        var elementClick = $(this).attr("href")
        var destination = $(elementClick).offset().top;
        jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 900);
        return false;
    });


    // Сортировка по селекту
    $('.packs-sort-btn').click(function () {
        $(".packs-more-toggle").slideUp(0);
        $(".show-items").remove();
        $(".show-sorted-items").css("display", "inline-block");
        runAllFilters();
        if ($(window).width() < 1020) {
            $(".mobile-overlay").fadeOut(300);
            $(".packs-selects").fadeOut(300);
        }
    });

    function runAllFilters() {
        $('#noresults').remove();

        var list = $(".packs-list .packs-item");
        $(list).fadeOut(0).removeClass('sorted');

        var filtered = $(".packs-list article");

        // Get all filter values
        var discipline = $('select#sort-discipline').val();
        var size = $('select#sort-size').val();
        var limit = $('select#sort-limit').val();

        // Filter based on all of them
        filtered = filtered.filter(function () {
            return RegExp(discipline).test($(this).attr("data-category")) &&
                RegExp(limit).test($(this).attr("data-limit")) &&
                RegExp(size).test($(this).attr("data-size"));
        });

        filtered.length === 0
            ? $('.packs-list').append("<p id='noresults'>Нет результата</p>")
            : $('#noresults').remove()


        // Display Them
        filtered.each(function (i) {
            $(this).fadeIn(0).addClass('sorted');
        });

        if (filtered.length > 5) {
            $('.sorted:gt(4)').hide();
            $(".packs-more-toggle").slideDown(0);
        }
    };

    /*Вывод остальных блоков*/
    $(".show-items").click(function (e) {
        e.preventDefault();
        $(".packs-more-toggle").slideUp(300);
        $(".packs-item").slideDown(300);
    });

    $(".show-sorted-items").click(function (e) {
        e.preventDefault();
        $(".packs-more-toggle").slideUp(300);
        $(".packs-item.sorted").slideDown(300);
    });

    /*Валидация*/
    $('.simple-form').each(function () {
        $(this).validate({
            messages: {
                messenger_value: "Заполните поле",
                email: {
                    required: "Заполните поле",
                    email: "Введите в данное поле актуальный E-mail"
                }
            },
            success(label) {
                label.addClass("valid");
            },
            submitHandler: function (form, e) {
                e.preventDefault();

                console.log('Form submitted');
                console.log($(form).serialize());

                // thanksModal

                $.ajax({
                    type: 'POST',
                    url: 'm.php',
                    dataType: "json",
                    data: $(form).serialize(),
                    success(resp) {
                        if (resp.success === true) {
                            $.magnificPopup.open({
                                items: {
                                    src: '#thanksModal',
                                    type: 'inline'
                                }
                            });
                        } else {
                            alert('Запрос не отправлен. Произошла ошибка');
                        }
                    },
                    error(error) {
                        alert('Запрос не отправлен. Произошла ошибка');
                        console.log('e msg', error);
                    }
                });
                return false;
            }
        });
    });

    //Галерея отзывов
    $(".fancybox").fancybox({
        padding: 0,
    });

    //Работа мобильных фильтров
    $(".packs-filter-mobile").click(function () {
        $(".packs-selects").fadeIn(300);
        $(".mobile-overlay").fadeIn(300);
    });

    //Работа мобильного меню
    $(".header-buter").click(function () {
        $(".header-options").fadeIn(300);
        $(".mobile-overlay").fadeIn(300);
    });

    $(".header-close, .mobile-overlay, .packs-close").click(function () {
        $(".header-options").fadeOut(300);
        $(".mobile-overlay").fadeOut(300);
        $(".packs-selects").fadeOut(300);
    });

    //Скролл якоря
    $(".to-catalog").click(function () {
      var elementClick = $(this).attr("href")
      var destination = $(elementClick).offset().top;
      jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 900);
      return false;
    });

});


// Слайдер партнеров
var $carousel2 = $('.partners-slider');

function showSliderScreen2($widthScreen) {
    if ($widthScreen > "767") {
        if (!$carousel2.hasClass('slick-initialized')) {
            $carousel2.slick({
                slidesToShow: 5,
                slidesToScroll: 2,
                speed: 800,
                arrows: true,
                dots: true,
                responsive: [
                    {
                        breakpoint: 1299,
                        settings: {
                            slidesToShow: 4,
                        }
                    },
                    {
                        breakpoint: 1059,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    }
                ]
            });
        }
    } else {
        if ($carousel2.hasClass('slick-initialized')) {
            $carousel2.slick('unslick');
        }
    }
}

var widthScreen = $(window).width();
$(window).ready(showSliderScreen2(widthScreen)).resize(
    function () {
        var widthScreen = $(window).width();
        showSliderScreen2(widthScreen);
    }
);
