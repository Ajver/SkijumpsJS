extends Node

var points_amount : Dictionary = {
	PointsData.Type.JUMPER : 0,
	PointsData.Type.PAD_COLLISION : 0,
	PointsData.Type.JUMP_START : 0,
	PointsData.Type.JUMP_END : 0,
	PointsData.Type.PULLING_POINT : 0,
	PointsData.Type.K_POINT : 0,
	PointsData.Type.END_POINT : 0
}

static func next_point(type) -> void:
	PointsCounter.points_amount[type] += 1