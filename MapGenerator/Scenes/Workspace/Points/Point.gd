extends Position2D
class_name Point

onready var mouse_area = find_node("MouseArea")
onready var mouse_collision = mouse_area.get_node("CollisionShape2D")

var color : Color = Color.red
var type

var is_hover := false

func _draw() -> void:
	var draw_color : Color
	
	if is_hover:
		draw_color = color
		color.darkened(-1)
	else:
		draw_color = color
	
	draw_circle(Vector2.ZERO, mouse_collision.shape.radius, color)

func _on_MouseArea_mouse_entered():
	is_hover = true
	update()

func _on_MouseArea_mouse_exited():
	is_hover = false
	update()
