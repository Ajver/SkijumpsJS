tool
extends CheckBox

signal checked(type)

export(PointsData.Type) var type

func _ready() -> void:
	$ColorRect.color = PointsData.colors[type][0]

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
		
	if pressed:
		emit_signal("checked", type)

func is_radio():
	pass
