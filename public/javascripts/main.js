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
      complete: function() {
        $form.find("input, button").removeAttr("disabled");
      },
      success: function() {
        appendAndFadeIn($("<p>", { text: "Thanks for subscribing. We'll keep you informed!", "class": "success" }));
      },
      error: function() {
        appendAndFadeIn($("<p>", { text: "Please enter a valid e-mail address. Thanks!", "class": "error" }));
      }
    })
    event.preventDefault();
  });
});