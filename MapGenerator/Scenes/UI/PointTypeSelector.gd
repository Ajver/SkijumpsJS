extends HBoxContainer

signal point_type_changed(type)

func _ready() -> void:
	for i in get_child_count():
		var child = get_child(i)
		child.text += str(" [", i+1, "]")
		child.connect("checked", self, "_on_RadioButton_checked") 

func _input(event) -> void:
	if event is InputEventKey and event.is_pressed():
		var nr = event.scancode - 49
		if nr >= 0 and nr < get_child_count():
			get_child(nr).toggle()
			
func _on_RadioButton_checked(type) -> void:
	emit_signal("point_type_changed", type)