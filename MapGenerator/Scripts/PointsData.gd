extends Node
class_name PointsData

enum Type {
	JUMPER,
	PAD_COLLISION,
	JUMP_START,
	JUMP_END,
	PULLING_POINT,
	K_POINT,
	END_POINT
} 

var POINTS_COLORS : Dictionary = {
	Type.JUMPER : [Color.blue, Color.white],
	Type.PAD_COLLISION : [Color.black, Color.white],
	Type.JUMP_START : [Color(0, 1, 0), Color.black],
	Type.JUMP_END : [Color(0, 0.5, 0), Color.white],
	Type.PULLING_POINT : [Color.red, Color.black],
	Type.K_POINT : [Color(0, 0, 0.5), Color.white],
	Type.END_POINT : [Color(0.5, 0.5, 0.5), Color.black]
}