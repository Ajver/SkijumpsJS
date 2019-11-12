extends Node

var Point = preload("res://Scenes/Workspace/Points/Point.tscn")

onready var origin = get_parent() 

var _is_dragging_point := false

var selected_point_type = PointsData.Type.JUMPER

func new_point(mouse_position:Vector2) -> void:
	var pos = (mouse_position - origin.position) / origin.scale
	var point = Point.instance()
	
	point.position = pos
	point.set_scale(Vector2(
	1.0 / origin.scale.x, 
	1.0 / origin.scale.y))
	point.fill_color = PointsData.POINTS_COLORS[selected_point_type][0]
	point.border_color = PointsData.POINTS_COLORS[selected_point_type][1]
	
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
	refresh_points_scale()
		
func refresh_points_scale() -> void:
	var new_scale : Vector2 = Vector2(
	1.0 / origin.scale.x, 
	1.0 / origin.scale.y)
	
	for p in get_children():
		p.set_scale(new_scale)
	
func _on_point_type_changed(type):
	selected_point_type = type

func _on_ResetBtn_pressed():
	for c in get_children():
		c.queue_free()
