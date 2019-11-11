extends Node

export(float) var scale_speed = 1.0
export(float) var margin = 0.0

var is_dragging := false
var drag_point := Vector2.ZERO

onready var ui = get_node("/root/Main").find_node("UI")

onready var origin = find_node("Origin")
onready var pad_sprite = find_node("PadSprite")
onready var points_container = find_node("PointsContainer")

func load_pad_sprite(texture_path:String) -> void:
	pad_sprite.load_sprite(texture_path)
	origin.position = Vector2.ZERO
	origin.scale = Vector2.ONE
	
func _input(event) -> void:
	if ui.is_using_mouse():
		return
		
	if Input.is_action_just_pressed("grab_image"):
		drag_point = event.position
		is_dragging = true
		
	elif Input.is_action_just_released("grab_image"):
		is_dragging = false
		
	elif Input.is_action_just_released("zoom_in"):
		origin.scale *= scale_speed
#		var diff = origin.position - event.position
#		diff *= origin.scale
#		origin.translate(diff)
#		origin.position = diff - event.position
		
	elif Input.is_action_just_released("zoom_out"):
		origin.scale /= scale_speed
		
	elif event is InputEventMouseMotion:
		if is_dragging:
			move_origin(event.position)
			
	if Input.is_action_just_released("new_point"):
		if not is_dragging:
			
			points_container.new_point(event.position)
			
func move_origin(mouse_position:Vector2) -> void:
	var diff = mouse_position - drag_point
	drag_point = mouse_position
	origin.translate(diff)
	#clamp_origin()
	
func clamp_origin() -> void:
	# NOT WORKING
	
	var screen_size = get_viewport().get_visible_rect().size
	var texture_size = pad_sprite.texture.get_size()
	
	if texture_size.x > screen_size.x:
		origin.position.x = clamp(origin.position.x, - texture_size.x + screen_size.x - margin, margin)
	
	origin.position.y = max(origin.position.y, margin)
	if texture_size.y > screen_size.y:
		origin.position.y = clamp(origin.position.y, - texture_size.y + screen_size.y - margin - 60, margin)
	else:
		origin.position.y = min(origin.position.y, screen_size.y - texture_size.y - margin - 60)