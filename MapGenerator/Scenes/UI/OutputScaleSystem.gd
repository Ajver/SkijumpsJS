tool
extends VBoxContainer

func _on_ScaleSlider_value_changed(value):
	$ScaleValue.text = str(value)
