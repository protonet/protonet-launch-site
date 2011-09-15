$(function() {
  function appendAndFadeIn($element) {
    $element.appendTo($form).hide().fadeIn(500);
  }
  
  var $form = $("form").submit(function(event) {
    $.ajax({
      type: $form.attr("method"),
      url:  $form.attr("action"),
      data: $form.serialize(),
      beforeSend: function() {
        $form.find("input, button").attr("disabled", "disabled");
        $form.find(".success, .error").remove();
      },
      success: function() {
        $form.find("button").removeAttr("disabled");
        appendAndFadeIn($("<p>", { text: "Thanks for subscribing. We'll keep you informed!", "class": "success" }));
      },
      error: function() {
        $form.find("input, button").removeAttr("disabled");
        appendAndFadeIn($("<p>", { text: "Please enter a valid e-mail address. Thanks!", "class": "error" }));
      }
    });
    event.preventDefault();
  });
  
  $("[data-lightbox]").click(function(event) {
    $("<section>",  { "class": "lightbox" })
      .appendTo("body")
      .click(function() { $(this).remove(); });
    
    $("<iframe>", { "frameborder": 0, src: $(this).data("lightbox") })
      .appendTo(".lightbox");
    
    $(document).unbind("keydown").keydown(function(event) {
      event.keyCode === 27 && $(".lightbox").remove();
    });
    
    event.preventDefault();
  });
});