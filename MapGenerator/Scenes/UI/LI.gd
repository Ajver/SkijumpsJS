extends HBoxContainer

onready var amount = find_node("Amount")

var type

func setup(type_name) -> void:
	type = PointsData.Type[type_name]
	$ColorRect.color = PointsData.colors[type][0]
	$TypeName.text = type_name
	call_deferred("refresh_amount")
	
func refresh_amount() -> void:
	amount.text = str(PointsCounter.points[type].size())
	