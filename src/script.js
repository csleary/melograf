$(document).ready(function () {
  setInterval(function () {
    $('#pageTitle').shineText();
  }, 10000);

  $('.discog-art').slick({
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear',
    lazyLoad: 'ondemand',
  });

  $.fn.shineText = function (options) {
    const settings = $.extend(
      {
        speed: 50,
        shineClass: 'shine',
        complete: null,
      },
      options
    );

    return this.each(function () {
      const text = $(this).text();
      const doAnimate = function (el) {
        el.find('span').each(function () {
          const that = $(this);
          setTimeout(function () {
            that.toggleClass(settings.shineClass);
            that.prev().toggleClass(settings.shineClass);
          }, that.index() * settings.speed);
        });
      };

      if (!$(this).hasClass('shineApplied')) {
        $(this).addClass('shineApplied').html('');
        for (i = 0; i < text.length; i++) {
          $(this).append('<span>' + text[i] + '</span>');
        }
        $(this).append('<span></span>');
      }
      doAnimate($(this));

      if ($.isFunction(settings.complete)) {
        settings.complete.call(this);
      }
    });
  };
});

const contactForm = $('#contact-form');

contactForm.submit((e) => {
  e.preventDefault();
  const submitButton = $('.send');
  const defaultSubmitText = submitButton.val();

  $.post({
    url: '/',
    contentType: 'application/x-www-form-urlencoded',
    data: $(contactForm).serialize(),
    beforeSend: () => {
      submitButton.prop('disabled', true).val('Sending message…');
    },
    success: () => {
      contactForm.append(
        `<div class='success'>Thank you. Your message has been sent successfully.</div>`
      );
      submitButton.val('Message sent!');
      $('#contact-form')[0].reset();
      setTimeout(() => {
        $('.success').fadeOut(function () {
          $(this).remove();
        });
        submitButton.prop('disabled', false).val(defaultSubmitText);
      }, 5000);
    },
    error: () => {
      contactForm.append(`<div class='error'>Sorry, your message could not be sent.</div>`);
      submitButton.val('Sending failed!');
      setTimeout(() => {
        $('.error').fadeOut(function () {
          $(this).remove();
        });
        submitButton.prop('disabled', false).val(defaultSubmitText);
      }, 5000);
    },
  });
});

function quote() {
  const extras = document.getElementById('extras').value;
  const numTracks = document.getElementById('numTracks').value;
  const ddp = document.getElementById('ddp').checked;
  let price;

  // Work out per-track price
  if (numTracks == 1) {
    price = 45;
  } else if (numTracks > 1 && numTracks <= 4) {
    price = 45 + (numTracks - 1) * 35;
  } else if (numTracks > 4) {
    price = 150 + (numTracks - 4) * 25;
  } else {
    price = 0;
  }

  // Validation
  if (numTracks === '0') {
    if (extras !== '0' && ddp === false) {
      document.getElementById('results').innerHTML =
        'Please add at least one track before adding extras.';
      $('#results').stop(true, true).css('color', 'red');
    } else if (extras === '0' && ddp === true) {
      document.getElementById('results').innerHTML =
        'Please add at least one track before adding a DDPi/CDR.';
      $('#results').stop(true, true).css('color', 'red');
    } else {
      document.getElementById('results').innerHTML = 'Please add at least one track.';
      $('#results').stop(true, true).css('color', 'red');
    }
  } else {
    var total = price + extras * 10 + ddp * 50;

    document.getElementById('results').innerHTML = 'Total cost will be: &euro;' + total.toFixed(2);
    $('#results')
      .stop(true, true)
      .effect('highlight', { color: '#00ffff' })
      .css('color', '#00ffff')
      .animate({ color: '#fff' }, { queue: false, duration: 500 });
  }
}
