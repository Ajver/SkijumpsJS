extends Node

signal scale_changed

export(float) var scale_speed = 1.0
export(float) var margin = 0.0

var has_texture := false
var is_dragging := false
var drag_point := Vector2.ZERO

onready var ui = get_node("/root/Main").find_node("UI")

onready var origin = find_node("Origin")
onready var pad_sprite = find_node("PadSprite")
onready var points_container = find_node("PointsContainer")

func _ready():
	connect("scale_changed", points_container, "_on_Origin_rescaled")

func load_pad_sprite(texture_path:String) -> void:
	has_texture = true
	pad_sprite.load_sprite(texture_path)
	origin.position = Vector2.ZERO
	origin.scale = Vector2.ONE
	emit_signal("scale_changed")
	
func _input(event) -> void:
	if not has_texture:
		return
		
	if ui.is_using_mouse():
		return
		
	if Input.is_action_just_pressed("grab_image"):
		drag_point = event.position
		is_dragging = true
		
	elif Input.is_action_just_released("grab_image"):
		is_dragging = false
		
	elif Input.is_action_just_pressed("zoom_in"):
		_mult_scale(scale_speed, event.position)
		
	elif Input.is_action_just_pressed("zoom_out"):
		_mult_scale(1.0 / scale_speed, event.position)
		
	elif event is InputEventMouseMotion:
		if is_dragging:
			move_origin(event.position)
			
	elif Input.is_action_just_pressed("new_point"):
		if not is_dragging:
			if points_container.can_create_point():
				points_container.new_point(event.position)
			
func _mult_scale(scale_mod:float, mouse_position:Vector2) -> void:
	origin.scale *= scale_mod
	var diff = origin.position - mouse_position
	diff *= scale_mod
	origin.position = diff + mouse_position
	emit_signal("scale_changed")
	
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