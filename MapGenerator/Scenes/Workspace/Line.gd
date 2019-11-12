extends Node2D

onready var point_2 = $Point2

export(Color) var color

const LINE_WEIGHT := 3.0
var line_scale := 1.0

func _draw() -> void:
	draw_line(Vector2.ZERO, point_2.position, color, LINE_WEIGHT * line_scale)
	draw_line(Vector2.ZERO, point_2.position, Color.black, LINE_WEIGHT * line_scale * 0.2)
	
func set_posints_position(p1:Vector2, p2:Vector2) -> void:
	global_position = p1 
	point_2.global_position = p2
	update()
	
func set_line_scale(ls:float) -> void:
	line_scale = ls