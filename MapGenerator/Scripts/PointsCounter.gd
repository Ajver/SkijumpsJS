extends Node

signal points_amount_changed(point_type)

var points : Dictionary = {
	PointsData.Type.JUMPER : [],
	PointsData.Type.PAD_COLLISION : [],
	PointsData.Type.JUMP_START : [],
	PointsData.Type.JUMP_END : [],
	PointsData.Type.PULLING_POINT : [],
	PointsData.Type.K_POINT : [],
	PointsData.Type.END_POINT : []
}

static func reset_points() -> void:
	for key in PointsCounter.points:
		PointsCounter.points[key].clear()
		PointsCounter.emit_signal("points_amount_changed", key)
		

static func remove_point(point) -> void:
	var arr : Array = PointsCounter.points[point.type]
	arr.erase(point)
	PointsCounter.emit_signal("points_amount_changed", point.type)

static func next_point(point) -> void:
	var arr : Array = PointsCounter.points[point.type]
	arr.append(point)
	PointsCounter.emit_signal("points_amount_changed", point.type)
	PointsCounter._sort_array(arr)
	
static func sort_points(type) -> void:
	var arr : Array = PointsCounter.points[type]
	PointsCounter._sort_array(arr)
	
static func _sort_array(arr:Array) -> void:
	arr.sort_custom(PointsCounter, "_should_replace")
	
static func _should_replace(p1, p2) -> bool:
	return p1.position.x < p2.position.x