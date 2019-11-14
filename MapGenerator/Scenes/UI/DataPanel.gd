extends Panel

onready var points_list_container = find_node("PointsListContainer")

func _on_OpenBtn_toggled(button_pressed):
	if button_pressed:
		rect_position.x -= points_list_container.rect_size.x
	else:
		rect_position.x += points_list_container.rect_size.x
		