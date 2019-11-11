extends Node

onready var file_dialog = find_node("FileDialog")

var _is_mouse_over_panel := false

func _ready() -> void:
	open_file_dialog()

func _input(event) -> void:
	if Input.is_action_just_pressed("open_filesystem"):
		open_file_dialog()
		
func _on_OpenFileBtn_pressed():
	open_file_dialog()
		
func open_file_dialog() -> void:
	file_dialog.popup()

func is_using_mouse() -> bool:
	return file_dialog.visible or _is_mouse_over_panel

func _on_Panel_mouse_entered() -> void:
	_is_mouse_over_panel = true
	print(is_using_mouse())

func _on_Panel_mouse_exited() -> void:
	_is_mouse_over_panel = false
	print(is_using_mouse())
	