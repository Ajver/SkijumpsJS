extends Node

export(float) var point_radius setget set_points_radius

var Point = preload("res://Scenes/Workspace/Points/Point.tscn")

onready var origin = get_parent() 

var _is_dragging_point := false

func new_point(mouse_position:Vector2) -> void:
	var pos = (mouse_position - origin.position) / origin.scale
	var point = Point.instance()
	point.position = pos
	point.connect("started_dragging", self, "_on_Point_started_dragging")
	point.connect("stopped_dragging", self, "_on_Point_stopped_dragging")
	call_deferred("add_child", point)
	
func can_create_point() -> bool:
	for p in get_children():
		if p.is_hover:
			return false
			
	return true
	
func can_grab_point() -> bool:
	return !_is_dragging_point
	
func _on_Point_started_dragging(point) -> void:
	move_child(point, get_child_count())
	_is_dragging_point = true
	
func _on_Point_stopped_dragging() -> void:
	_is_dragging_point = false
	
func _on_Origin_rescaled() -> void:
	refresh_points_radius()
		
func set_points_radius(radius) -> void:
	point_radius = radius
	refresh_points_radius()
		
func refresh_points_radius() -> void:
	var new_point_radius = point_radius
	
	if origin:
		new_point_radius = point_radius / origin.scale.x
		
	for p in get_children():
		p.set_radius(new_point_radius)
	