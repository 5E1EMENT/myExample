// Отправка заявки 
$(document).ready(function() {
	$('#form').submit(function() { // проверка на пустоту заполненных полей. Атрибут html5 — required не подходит (не поддерживается Safari)
		if (document.form.name.value == '' || document.form.phone.value == '' ) {
			valid = false;
			return valid;
		}
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: $(this).serialize()
		}).done(function() {
			swal("Good job!", "You clicked the button!", "success");
			$(this).find('input').val('');
			$('#form').trigger('reset');
		}).fail(function(){
			swal({
  				title: "Something wrong",
  				text: "You clicked the button!",
  				icon: "error",
		});
		});
		
		return false;
	});

});


// Маска ввода номера телефона (плагин maskedinput)
$(function($){
	$('[name="phone"]').mask("+7(999) 999-9999");
});

$(document).ready(function () {
	$('.slider').slick();
});
