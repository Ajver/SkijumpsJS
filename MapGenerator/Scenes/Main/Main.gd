extends Node
	
onready var workspace = find_node("Workspace")

func _ready() -> void:
	var file_dialog = find_node("FileDialog")
	file_dialog.connect("file_selected", self, "_on_file_selected")
	
func _input(event) -> void:
	if Input.is_action_just_pressed("exit"):
		get_tree().quit()
		
func _on_file_selected(path) -> void:
	workspace.load_pad_sprite(path)