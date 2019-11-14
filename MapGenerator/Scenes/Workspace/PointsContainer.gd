extends Node2D

var Point = preload("res://Scenes/Workspace/Point.tscn")

onready var origin = get_parent() 

var _is_dragging_point := false

var selected_point_type = PointsData.Type.JUMPER

const LINE_WEIGHT := 6.0
var line_scale := 1.0
export(Color) var line_color

func new_point(mouse_position:Vector2) -> void:
	var pos = (mouse_position - origin.position) / origin.scale
	var point = Point.instance()
	
	point.type = selected_point_type
	point.position = pos
	point.set_scale(Vector2(
	1.0 / origin.scale.x, 
	1.0 / origin.scale.y))
	point.fill_color = PointsData.colors[selected_point_type][0]
	point.border_color = PointsData.colors[selected_point_type][1]
	
	point.connect("started_dragging", self, "_on_Point_started_dragging")
	point.connect("stopped_dragging", self, "_on_Point_stopped_dragging")
	point.connect("dragged", self, "_on_Point_dragged")
	point.connect("removed", self, "_on_Point_removed")
	
	PointsCounter.next_point(point)
	
	call_deferred("add_child", point)
	
	_on_points_updated()
	
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
	
func _on_Point_dragged(point) -> void:
	PointsCounter.sort_points(point.type)
	_on_points_updated()
	
func _on_Point_removed(point) -> void:
	PointsCounter.remove_point(point)
	_on_points_updated()
	
func _on_Origin_rescaled() -> void:
	refresh_points_scale()
		
func refresh_points_scale() -> void:
	line_scale = 1.0 / origin.scale.x
	var p_scale : Vector2 = Vector2(line_scale, line_scale)
	
	for p in get_children():
		p.set_scale(p_scale)
		
	_on_points_updated()
	
func _on_point_type_changed(type) -> void:
	selected_point_type = type

func _on_ResetBtn_pressed() -> void:
	reset()

func reset() -> void:
	for c in get_children():
		c.queue_free()
		
	PointsCounter.reset_points()
	
	_on_points_updated()
	
func _on_points_updated() -> void:
	update()
	SaveSystem.save()
	
func _draw() -> void:
	for key in PointsCounter.points:
		var points_arr = PointsCounter.points[key]
		for i in range(points_arr.size()-1):
			var p1 = points_arr[i].position
			var p2 = points_arr[i+1].position
			draw_line(p1, p2, line_color, LINE_WEIGHT * line_scale)
			draw_line(p1, p2, Color.black, LINE_WEIGHT * line_scale * 0.1)
			
	