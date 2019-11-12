extends HBoxContainer

func _ready():
	for i in get_child_count():
		var child = get_child(i)
		child.text += str(" [", i+1, "]")

func _input(event):
	if event is InputEventKey and event.is_pressed():
		var nr = event.scancode - 49
		if nr >= 0 and nr < get_child_count():
			get_child(nr).toggle()