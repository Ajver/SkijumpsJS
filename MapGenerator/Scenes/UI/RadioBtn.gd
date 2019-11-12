extends CheckBox

func toggle() -> void:
	_on_RadioBtn_toggled(!pressed)
	
func _on_RadioBtn_toggled(button_pressed:bool):
	if button_pressed:
		for child in get_parent().get_children():
			if child.has_method("is_radio"):
				child.pressed = false
				pressed = true
	else:
		pressed = true

func is_radio():
	pass
