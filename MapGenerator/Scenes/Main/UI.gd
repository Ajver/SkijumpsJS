extends Node

onready var file_dialog = find_node("FileDialog")
onready var panel = find_node("Panel")
onready var data_panel = find_node("DataPanel")

var _is_mouse_over_panel := false
var _is_mouse_over_data_panel := false

func _ready() -> void:
	open_file_dialog()

func _input(event) -> void:
	if Input.is_action_just_pressed("open_filesystem"):
		open_file_dialog()
		
	if event is InputEventMouseMotion:
		var panel_rect = Rect2(panel.rect_global_position, panel.rect_size) 
		_is_mouse_over_panel = panel_rect.has_point(event.position)
		
		panel_rect = Rect2(data_panel.rect_global_position, data_panel.rect_size)
		_is_mouse_over_data_panel = panel_rect.has_point(event.position)
	
func _on_OpenFileBtn_pressed():
	open_file_dialog()
		
func open_file_dialog() -> void:
	file_dialog.popup()

func is_using_mouse() -> bool:
	return file_dialog.visible or _is_mouse_over_panel or _is_mouse_over_data_panel
