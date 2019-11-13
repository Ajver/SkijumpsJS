extends Node

const FILE_PATH := "D:/Xampp/htdocs/SpaceJump/experimental/skijump-js/sj-tools/sj-PadCollisionPointsList.js"

var pad_scale = 2.0

static func save() -> void:
	var file := File.new()
	file.open(FILE_PATH, File.WRITE)
	
	var points = PointsCounter.points
	var T = PointsData.Type
	
	var jumper_pos := vec_to_s(Vector2.ZERO)
	if points[T.JUMPER]:
		jumper_pos = vec_to_s(points[T.JUMPER][0].position)
	
	var pad_collision_points = vec_arr_to_s(points[T.PAD_COLLISION]) 
	var pad_pulling_points = vec_arr_to_s(points[T.PULLING_POINT])
	
	var jump_point := 0.0
	if points[T.JUMP_START]:
		jump_point = points[T.JUMP_START][0].position.x
	
	var jump_end_point := 0.0
	if points[T.JUMP_END]:
		jump_end_point = points[T.JUMP_END][0].position.x
		
	var point_k := 0.0
	if points[T.K_POINT]:
		point_k = points[T.K_POINT][0].position.x
	
	var fall_line := 0.0
	if points[T.END_POINT]:
		fall_line = points[T.END_POINT][0].position.x
	
	var file_content := ""
	file_content += str("const PAD_SCALE=", SaveSystem.pad_scale, ";\n")
	file_content += str("const JUMPER_POSITION="+jumper_pos+";\n")
	file_content += str("const PAD_COLLISION_POINTS=", pad_collision_points, ";\n")
	file_content += str("const PAD_PULLING_POINTS=", pad_pulling_points, ";\n")
	file_content += str("const JUMP_POINT=", jump_point, ";\n")
	file_content += str("const JUMP_END_POINT=", jump_end_point, ";\n")
	file_content += str("const POINT_K=", point_k, ";\n")
	file_content += str("const FALL_LINE=", fall_line, ";")
	
	file.store_line(file_content.trim_prefix("\n"))
	
	file.close()

static func vec_arr_to_s(vecArr:Array) -> String:
	var arrStr := "[\n"
	for v in vecArr:
		arrStr += vec_to_s(v.position) + ",\n"
	
	return arrStr + "]"

static func vec_to_s(vec:Vector2) -> String:
	return str("{x:", vec.x, ",y:", vec.y, "}")
	