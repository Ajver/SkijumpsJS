extends HBoxContainer

onready var amount = find_node("Amount")

var amount_num : int = 0

func setup(type) -> void:
	$ColorRect.color = PointsData.colors[PointsData.Type[type]][0]
	$TypeName.text = type
	call_deferred("set_amount", amount_num)
	
func set_amount(am:int) -> void:
	amount_num = am
	amount.text = str(am)
	
func increase_amount() -> void:
	set_amount(amount_num + 1)