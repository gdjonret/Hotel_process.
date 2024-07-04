let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

$(document).ready(function() {
    $(".owl-carousel1").owlCarousel({
        margin: 20,
        loop: true,
        nav: true,
        dots: false,
        navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });
});



$(document).ready(function() {
$('.owl-carousel2').owlCarousel({
    loop:true,
    margin:0,
    nav:true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],

    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
})
});

$(document).ready(function() {
    $('.owl-carousel3').owlCarousel({
        loop:true,
        margin:0,
        dots: true,
        responsive:{
            0:{
                items:1
            },
            768:{
                items:1
            },
            1000:{
                items:1
            }   
        }
    })
    });

