extends Position2D
class_name Point

signal started_dragging(point)
signal stopped_dragging

onready var origin = get_node("/root/Main").find_node("Origin")
onready var points_container = get_parent()
onready var mouse_area = find_node("MouseArea")
onready var mouse_collision = mouse_area.get_node("CollisionShape2D")

var fill_color : Color = Color.red
var border_color : Color = Color.black

# TODO
var type

var is_hover := false
var is_dragging := true

func _ready():
	set_radius(points_container.point_radius / origin.scale.x)

func _input(event) -> void:
	if is_dragging:
		if event is InputEventMouseMotion:
			position = (event.position - origin.position) / origin.scale
		elif Input.is_action_just_released("grab_point"):
			is_dragging = false
			emit_signal("stopped_dragging")
		
		return
		
	if not is_hover:
		return
		
	if Input.is_action_just_pressed("grab_point"):
		if points_container.can_grab_point():
			is_dragging = true
			emit_signal("started_dragging", self)
	elif Input.is_action_just_pressed("remove_point"):
		queue_free()

func _draw() -> void:
	var current_fill_color : Color
	var current_border_color : Color
	
	if is_hover:
		current_fill_color = fill_color.lightened(0.4)
		current_border_color = border_color.darkened(0.3)
	else:
		current_fill_color = fill_color
		current_border_color = border_color
	
	var radius = mouse_collision.shape.radius
	
	draw_circle(Vector2.ZERO, radius, current_border_color)
	draw_circle(Vector2.ZERO, radius*0.9, current_fill_color)

func set_radius(radius) -> void:
	mouse_collision.shape.radius = radius
	update()

func _on_MouseArea_mouse_entered() -> void:
	is_hover = true
	update()

func _on_MouseArea_mouse_exited() -> void:
	is_hover = false
	update()
