extends Node

var Point = preload("res://Scenes/Workspace/Points/Point.tscn")

onready var origin = get_parent() 

func new_point(screen_position:Vector2) -> void:
	var pos = screen_position - origin.position
	var point = Point.instance()
	point.position = pos
	call_deferred("add_child", point)