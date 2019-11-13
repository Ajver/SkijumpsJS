extends VBoxContainer

var LI = preload("res://Scenes/UI/LI.tscn")

var list_items : Dictionary

func _ready():
	PointsCounter.connect("points_amount_changed", self, "_on_points_amount_changed")
	for t in PointsData.Type:
		var type = PointsData.Type[t]
		var li = LI.instance()
		li.setup(t)
		list_items[type] = li
		add_child(li)

func _on_points_amount_changed(point_type) -> void:
	list_items[point_type].refresh_amount()
